import { hashPassword } from "./password-core.mjs";

// Hash-looking legacy fields are intentionally excluded for separate account review.
export const LEGACY_PLAINTEXT_FILTER = {
  password: { $type: "string", $not: /^(?:\$2|bcrypt-sha256:)/ },
  passwordHash: { $in: [null, ""] },
};

export function migrationCounts() {
  return { scanned: 0, eligible: 0, wouldMigrate: 0, migrated: 0, conflicts: 0, skipped: 0, failed: 0, remaining: 0 };
}

// The caller supplies a deliberately selected Mongo collection; no connection or
// environment loading happens here. Never include rows/errors in the report.
export async function migrateLegacyPasswords(collection, { apply = false } = {}) {
  const counts = migrationCounts();
  let cursor;
  try {
    cursor = collection.find(LEGACY_PLAINTEXT_FILTER, {
      projection: { _id: 1, password: 1 },
      batchSize: 50,
    });
    for await (const user of cursor) {
      counts.scanned++;
      const password = user.password;
      if (typeof password !== "string" || !password.trim() || password.length > 128 || /^(?:\$2|bcrypt-sha256:)/.test(password)) {
        counts.skipped++;
        continue;
      }
      counts.eligible++;
      if (!apply) {
        counts.wouldMigrate++;
        continue;
      }
      const passwordHash = await hashPassword(password);
      const result = await collection.updateOne({
        _id: user._id,
        password,
        passwordHash: { $in: [null, ""] },
      }, {
        $set: { passwordHash },
        $unset: { password: 1 },
      }, { writeConcern: { w: "majority" } });
      if (!result.acknowledged) throw new Error("Migration write was not acknowledged.");
      if (result.matchedCount === 0) counts.conflicts++;
      else if (result.modifiedCount === 1) counts.migrated++;
      else throw new Error("Migration write did not modify the record.");
    }
    counts.remaining = await collection.countDocuments(LEGACY_PLAINTEXT_FILTER);
  } catch {
    counts.failed++;
  } finally {
    try { await cursor?.close(); } catch { counts.failed++; }
  }
  return counts;
}
