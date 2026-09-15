import assert from "node:assert/strict";
import { test, mock } from "node:test";
import mongoose from "mongoose";
import { migrateLegacyPasswords, LEGACY_PLAINTEXT_FILTER } from "../server/security/legacy-password-migration.mjs";
import { verifyStoredPassword } from "../server/security/password-core.mjs";
import { parseMigrationArguments, runMigrationCLI } from "../scripts/migrate-legacy-passwords.mjs";

function fakeCollection(records, beforeWrite) {
  const eligible = (record) => typeof record.password === "string" && !/^(?:\$2|bcrypt-sha256:)/.test(record.password) && [undefined, null, ""].includes(record.passwordHash);
  return {
    writes: [],
    closed: 0,
    find(filter, options) {
      assert.deepEqual(filter, LEGACY_PLAINTEXT_FILTER);
      assert.deepEqual(options.projection, { _id: 1, password: 1 });
      const snapshot = records.filter(eligible).map((record) => ({ ...record }));
      return {
        async *[Symbol.asyncIterator]() { yield* snapshot; },
        close: async () => { this.closed++; },
      };
    },
    async countDocuments(filter) {
      assert.deepEqual(filter, LEGACY_PLAINTEXT_FILTER);
      return records.filter(eligible).length;
    },
    async updateOne(filter, update, options) {
      this.writes.push({ filter, update, options });
      assert.deepEqual(filter.passwordHash, { $in: [null, ""] });
      assert.equal(options.writeConcern.w, "majority");
      await beforeWrite?.(records);
      const record = records.find((entry) => entry._id === filter._id && entry.password === filter.password && eligible(entry));
      if (!record) return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
      Object.assign(record, update.$set);
      delete record.password;
      return { acknowledged: true, matchedCount: 1, modifiedCount: 1 };
    },
  };
}

test("migration defaults to dry-run, projects credentials only internally, and reports counts only", async () => {
  const records = [{ _id: 1, password: "Legacy123" }, { _id: 2, password: "Another123" }];
  const collection = fakeCollection(records);
  const report = await migrateLegacyPasswords(collection);
  assert.equal(report.wouldMigrate, 2);
  assert.equal(report.remaining, 2);
  assert.equal(collection.writes.length, 0);
  assert.ok(Object.values(report).every(Number.isInteger));
  assert.doesNotMatch(JSON.stringify(report), /Legacy123|Another123/);
  assert.equal(collection.closed, 1);
});

test("migration atomically hashes plaintext, supports Unicode and is idempotent", async () => {
  const long = "\u05d0".repeat(50) + "123";
  const records = [{ _id: 1, password: "Legacy123" }, { _id: 2, password: long, passwordHash: null }, { _id: 3, password: "Retained123", passwordHash: "existing-hash" }, { _id: 4, password: "$2b$malformed" }];
  const collection = fakeCollection(records);
  const report = await migrateLegacyPasswords(collection, { apply: true });
  assert.equal(report.migrated, 2);
  assert.equal(report.remaining, 0);
  assert.equal(report.failed, 0);
  for (let index = 0; index < 2; index++) {
    assert.equal(records[index].password, undefined);
    assert.equal((await verifyStoredPassword({ candidate: index ? long : "Legacy123", passwordHash: records[index].passwordHash })).isValid, true);
    assert.deepEqual(Object.keys(collection.writes[index].update).sort(), ["$set", "$unset"]);
    assert.deepEqual(Object.keys(collection.writes[index].update.$set), ["passwordHash"]);
    assert.deepEqual(collection.writes[index].update.$unset, { password: 1 });
  }
  const rerun = await migrateLegacyPasswords(collection, { apply: true });
  assert.equal(rerun.scanned, 0);
  assert.equal(collection.writes.length, 2);
  assert.equal(records[2].passwordHash, "existing-hash");
});

test("migration cannot overwrite concurrent password changes or a concurrent new hash", async () => {
  for (const change of [(record) => { record.password = "New123"; }, (record) => { record.passwordHash = "another-hash"; }]) {
    const records = [{ _id: 1, password: "Legacy123" }];
    const collection = fakeCollection(records, ([record]) => change(record));
    const report = await migrateLegacyPasswords(collection, { apply: true });
    assert.equal(report.migrated, 0);
    assert.equal(report.conflicts, 1);
    assert.notEqual(records[0].password, undefined);
  }
});

test("migration stops on failure without echoing driver errors or passwords", async () => {
  const records = [{ _id: 1, password: "Legacy123" }, { _id: 2, password: "Another123" }];
  const collection = fakeCollection(records, () => { throw new Error("driver error contains Legacy123"); });
  const report = await migrateLegacyPasswords(collection, { apply: true });
  assert.equal(report.failed, 1);
  assert.equal(report.migrated, 0);
  assert.equal(collection.writes.length, 1);
  assert.equal(collection.closed, 1);
  assert.doesNotMatch(JSON.stringify(report), /Legacy123|driver error/);
});

test("migration reports unusable plaintext rather than changing credentials", async () => {
  const records = [{ _id: 1, password: "" }, { _id: 2, password: " " }, { _id: 3, password: "x".repeat(129) }];
  const collection = fakeCollection(records);
  const report = await migrateLegacyPasswords(collection, { apply: true });
  assert.equal(report.skipped, 3);
  assert.equal(report.remaining, 3);
  assert.equal(collection.writes.length, 0);
});

test("CLI requires explicit database, defaults dry-run, never loads .env and never logs secrets", async (t) => {
  assert.deepEqual(parseMigrationArguments(["--database", "staging"]), { database: "staging", apply: false });
  assert.deepEqual(parseMigrationArguments(["--database", "staging", "--apply"]), { database: "staging", apply: true });
  for (const args of [[], ["--apply"], ["--database", "--apply"], ["--database", "staging", "--apply", "--dry-run"], ["--database", "staging", "--typo"]]) assert.throws(() => parseMigrationArguments(args));
  const connect = t.mock.method(mongoose, "createConnection", () => { throw new Error("Unexpected real connection"); });
  const report = await runMigrationCLI(["--database", "staging"], {});
  assert.equal(report.exitCode, 1);
  assert.equal(connect.mock.callCount(), 0);
  mock.restoreAll();
});

test("CLI selects the exact database and closes connections in dry-run and failure", async (t) => {
  const collection = fakeCollection([{ _id: 1, password: "Legacy123" }]);
  let closed = 0;
  t.mock.method(mongoose, "createConnection", (_uri, options) => {
    assert.equal(options.dbName, "verified_database");
    assert.equal(options.autoCreate, false);
    return { asPromise: async () => {}, collection: (name) => { assert.equal(name, "users"); return collection; }, close: async () => { closed++; } };
  });
  const result = await runMigrationCLI(["--database", "verified_database"], { MONGO_URI: "test-only-uri" });
  assert.equal(result.exitCode, 0);
  assert.equal(result.counts.wouldMigrate, 1);
  assert.equal(collection.writes.length, 0);
  assert.equal(closed, 1);
});
