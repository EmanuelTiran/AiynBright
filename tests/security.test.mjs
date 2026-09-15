import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { randomBytes } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { decodeJwt, SignJWT } from "jose";
import { User } from "../server/DL/models/user.model.js";
import { connectToMongo } from "../server/connectToMongo.js";
import { authenticateUserService, createUserService } from "../server/BL/services/user.service.js";
import { createUser, readUserById } from "../server/DL/controllers/user.controller.js";
import { hashPassword, verifyStoredPassword } from "../server/security/password.js";
import { createSessionToken, getSessionSecret, SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS, verifySessionToken } from "../server/security/session.js";
import { clearSessionCookie, setSessionCookie } from "../server/security/session-cookie.js";
import { authAction, loginAction, registerAction, logoutAction } from "../server/BL/actions/login.action.js";
import { getAdminSession, getCurrentUserDTO } from "../server/data/current-user.js";
import { toSafeUserDTO } from "../server/data/user-dto.js";
import { validateResultsUpdate } from "../server/validation/results.js";
import updateHandler from "../pages/api/updateUser.js";
import deleteHandler from "../pages/api/deleteWeakness.js";
import { cookieJar } from "./request-context.mjs";

const actorId = "111111111111111111111111";
const otherId = "222222222222222222222222";
const initialEnv = { ...process.env };
let records, writes, migrations, saved;

function query(record) {
  const document = record ? User.hydrate(record) : null;
  return {
    select() { return this; },
    async lean() { return document?.toObject() ?? null; },
    then(resolve, reject) { return Promise.resolve(document).then(resolve, reject); },
  };
}

beforeEach(() => {
  process.env.JWT_SECRET = randomBytes(32).toString("hex");
  process.env.MONGO_URI = "mongodb://localhost/security-tests-never-connected";
  process.env.ADMIN_EMAILS = "admin@example.com";
  records = [
    { _id: actorId, username: "Actor", email: "actor@example.com", role: "user", password: "Legacy123", colorWeaknesses: [{ background_color: "red", font_color: "blue" }] },
    { _id: otherId, username: "Other", email: "other@example.com", role: "user", colorWeaknesses: [{ background_color: "red", font_color: "blue" }] },
  ];
  writes = []; migrations = []; saved = [];
  cookieJar.clear();
  globalThis.__mongooseCache.connection = null;
  globalThis.__mongooseCache.promise = null;
  mock.method(mongoose, "connect", async () => {
    mongoose.connection.readyState = 1;
    return mongoose;
  });
  mock.method(User, "findOne", (filter) => query(records.find((record) => record.email === filter.email)));
  mock.method(User, "findById", (id) => query(records.find((record) => record._id === String(id))));
  mock.method(User, "exists", async (filter) => records.some((record) => record._id === String(filter._id) && record.passwordHash === filter.passwordHash) ? { _id: filter._id } : null);
  mock.method(User, "create", async (data) => {
    const document = new User(data);
    await document.validate();
    writes.push(data);
    return document;
  });
  mock.method(User, "updateOne", async (filter, update) => {
    migrations.push({ filter, update });
    const record = records.find((item) => item._id === String(filter._id) && item.password === filter.password && !item.passwordHash);
    if (!record) return { matchedCount: 0 };
    record.passwordHash = update.$set.passwordHash;
    delete record.password;
    return { matchedCount: 1 };
  });
  mock.method(User, "findByIdAndUpdate", (id, update) => {
    writes.push({ id: String(id), update });
    return query(records.find((record) => record._id === String(id)));
  });
  mock.method(User.prototype, "save", async function () { saved.push(this.toJSON()); return this; });
});

afterEach(() => {
  mock.restoreAll();
  for (const name of ["JWT_SECRET", "MONGO_URI", "ADMIN_EMAILS", "NODE_ENV"]) {
    if (initialEnv[name] === undefined) delete process.env[name];
    else process.env[name] = initialEnv[name];
  }
});

const form = (data) => { const result = new FormData(); for (const [key, value] of Object.entries(data)) result.set(key, value); return result; };
const tokenFor = (id = actorId) => createSessionToken({ userId: id, email: records.find((record) => record._id === id)?.email || "deleted@example.com" });
async function request(handler, body, token, method = "POST", headers = {}) {
  const response = { statusCode: 200, setHeader() {}, status(code) { this.statusCode = code; return this; }, json(payload) { this.payload = payload; return this; } };
  await handler({ method, body, cookies: { [SESSION_COOKIE_NAME]: token }, headers: { "content-type": "application/json", ...headers } }, response);
  return response;
}

test("registration hashes passwords and rejects missing credentials and reserved admin identities", async () => {
  const input = { username: "New User", email: "NEW@example.com", password: "Secure123" };
  assert.equal((await registerAction(form(input))).success, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].email, "new@example.com");
  assert.equal(writes[0].password, undefined);
  assert.equal(await bcrypt.compare(input.password, writes[0].passwordHash), true);
  assert.equal(bcrypt.getRounds(writes[0].passwordHash), 12);
  assert.equal(writes[0].role, undefined);
  await assert.rejects(createUserService({ ...input, password: "" }));
  await assert.rejects(createUserService({ ...input, email: " ADMIN@example.com " }));
  assert.equal((await registerAction(form({ ...input, email: "admin@example.com" }))).success, false);
  assert.equal((await registerAction(null)).success, false);
  assert.equal((await loginAction(form({ email: "bad", password: "" }))).success, false);
  await assert.rejects(new User({ username: "No Password", email: "no@example.com" }).validate());
});

test("legacy plaintext login migrates atomically and subsequent hash login succeeds", async () => {
  assert.equal((await loginAction(form({ email: records[0].email, password: "Legacy123" }))).success, true);
  assert.equal(records[0].password, undefined);
  assert.equal(await bcrypt.compare("Legacy123", records[0].passwordHash), true);
  assert.equal(migrations[0].filter.password, "Legacy123");
  assert.deepEqual(migrations[0].filter.passwordHash, { $in: [null, ""] });
  assert.equal(migrations[0].update.$unset.password, 1);
  assert.ok(await authenticateUserService(records[0].email, "Legacy123"));
  assert.equal(migrations.length, 1);
});

test("wrong passwords fail without migration; bcrypt in legacy field compares instead of comparing hash text", async () => {
  assert.equal(await authenticateUserService(records[0].email, "wrong"), null);
  assert.equal(migrations.length, 0);
  const hash = await bcrypt.hash("Already123", 4);
  records[0].password = hash;
  assert.equal(await authenticateUserService(records[0].email, hash), null);
  assert.ok(await authenticateUserService(records[0].email, "Already123"));
  assert.equal(await authenticateUserService(records[0].email, "wrong"), null);
  assert.equal(records[0].password, undefined);
});

test("long legacy passwords migrate without truncation and malformed hash values fail closed", async () => {
  const password = "א".repeat(50) + "123";
  const hash = await hashPassword(password);
  assert.equal((await verifyStoredPassword({ candidate: password, passwordHash: hash })).isValid, true);
  assert.equal((await verifyStoredPassword({ candidate: password + "x", passwordHash: hash })).isValid, false);
  assert.equal((await verifyStoredPassword({ candidate: "$2b$broken", legacyPassword: "$2b$broken" })).isValid, false);
  records[0].password = password;
  assert.ok(await authenticateUserService(records[0].email, password));
});

test("migration refuses concurrent credential changes and database failures", async () => {
  mock.method(User, "updateOne", async () => ({ matchedCount: 0 }));
  assert.equal(await authenticateUserService(records[0].email, "Legacy123"), null);
  mock.method(User, "updateOne", async () => { throw new Error("unavailable"); });
  assert.equal((await loginAction(form({ email: records[0].email, password: "Legacy123" }))).success, false);
  assert.equal(cookieJar.size, 0);
});

test("JWT contains identity only, expires, and rejects tampering, legacy tokens and credential claims", async () => {
  const token = await createSessionToken({ userId: actorId, email: records[0].email, password: "secret", passwordHash: "hash", role: "admin" });
  const payload = decodeJwt(token);
  assert.deepEqual(Object.keys(payload).sort(), ["aud", "email", "exp", "iat", "iss", "sub"]);
  assert.equal(payload.exp - payload.iat, SESSION_DURATION_SECONDS);
  assert.equal((await verifySessionToken(token)).userId, actorId);
  assert.equal(await verifySessionToken(token + "x"), null);
  for (const extra of [{ password: "secret" }, { passwordHash: "hash" }, { credentials: {} }]) {
    const unsafe = await new SignJWT({ email: records[0].email, ...extra }).setProtectedHeader({ alg: "HS256" }).setSubject(actorId).setIssuer("ayinbright").setAudience("ayinbright").setIssuedAt().setExpirationTime("1h").sign(getSessionSecret());
    assert.equal(await verifySessionToken(unsafe), null);
  }
  const expired = await new SignJWT({ email: records[0].email }).setProtectedHeader({ alg: "HS256" }).setSubject(actorId).setIssuer("ayinbright").setAudience("ayinbright").setIssuedAt().setExpirationTime(1).sign(getSessionSecret());
  assert.equal(await verifySessionToken(expired), null);
  const old = await new SignJWT({ email: records[0].email, role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject(actorId).setExpirationTime("1h").sign(getSessionSecret());
  assert.equal(await verifySessionToken(old), null);
  delete process.env.JWT_SECRET;
  assert.throws(getSessionSecret, /JWT_SECRET/);
  await assert.rejects(verifySessionToken(token), /JWT_SECRET/);
});

test("cookie flags match JWT duration and logout expires the cookie", async () => {
  process.env.NODE_ENV = "production";
  await setSessionCookie({ userId: actorId, email: records[0].email });
  assert.deepEqual(cookieJar.get(SESSION_COOKIE_NAME).options, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: SESSION_DURATION_SECONDS });
  await assert.rejects(logoutAction(), /Redirect: \//);
  assert.equal(cookieJar.get(SESSION_COOKIE_NAME).options.maxAge, 0);
  assert.equal(cookieJar.get(SESSION_COOKIE_NAME).value, "");
  process.env.NODE_ENV = "development";
  await clearSessionCookie();
  assert.equal(cookieJar.get(SESSION_COOKIE_NAME).options.secure, false);
});

test("update API uses session ID; rejects target emails, operators and unsupported fields", async () => {
  const token = await tokenFor();
  const updateData = { colorWeaknesses: [{ background_color: "red", font_color: "blue" }] };
  assert.equal((await request(updateHandler, { updateData }, token)).statusCode, 200);
  assert.equal(writes[0].id, actorId);
  for (const body of [{ email: records[1].email, updateData }, { updateData: { role: "admin" } }, { updateData: { password: "x" } }, { updateData: { $set: { role: "admin" } } }, { updateData: { "role.admin": true } }, { updateData: { colorWeaknesses: [{ ...updateData.colorWeaknesses[0], password: "x" }] } }, null, []]) {
    assert.equal((await request(updateHandler, body, token)).statusCode, 400);
  }
  assert.equal(writes.length, 1);
  assert.equal((await request(updateHandler, { updateData })).statusCode, 401);
  assert.equal((await request(updateHandler, { updateData }, await tokenFor("333333333333333333333333"))).statusCode, 401);
  assert.equal((await request(updateHandler, { updateData }, token, "GET")).statusCode, 405);
  assert.equal((await request(updateHandler, { updateData }, token, "POST", { "content-type": "text/plain" })).statusCode, 403);
  assert.equal((await request(updateHandler, { updateData }, token, "POST", { "sec-fetch-site": "cross-site" })).statusCode, 403);
});

test("vision validation preserves all three flows and rejects malformed values", () => {
  for (const update of [
    { colorWeaknesses: [{ _id: actorId, background_color: "rgb(255, 0, 0)", font_color: "#ffffff", date: new Date().toISOString() }] },
    { sizeWeaknesses: [{ eye: "right", fontSize: "5", distance: 1 }] },
    { fieldWeaknesses: [{ side: "left", distance: -5 }] },
  ]) assert.equal(validateResultsUpdate(update).success, true);
  for (const update of [{}, { colorWeaknesses: [], sizeWeaknesses: [] }, { fieldWeaknesses: [{ side: "left", distance: null }] }, { fieldWeaknesses: [{ side: "left", distance: false }] }, { colorWeaknesses: Array(501).fill({ background_color: "red", font_color: "blue" }) }]) {
    assert.equal(validateResultsUpdate(update).success, false);
  }
});

test("users delete only their own results; admin privileges come from current DB role", async () => {
  const token = await tokenFor();
  const body = { email: records[1].email, field: "color", index: 0 };
  assert.equal((await request(deleteHandler, body, token, "DELETE")).statusCode, 403);
  assert.equal(saved.length, 0);
  assert.equal((await request(deleteHandler, { field: "color", index: 0 }, token, "DELETE")).statusCode, 200);
  assert.equal(saved[0]._id.toString(), actorId);
  records[0].email = "admin@example.com";
  assert.equal((await request(deleteHandler, body, token, "DELETE")).statusCode, 403);
  records[0].role = "admin";
  const result = await request(deleteHandler, body, token, "DELETE");
  assert.equal(result.statusCode, 200);
  assert.equal(result.payload.user.id, otherId);
  assert.equal(JSON.stringify(result.payload).includes("password"), false);
  records[0].role = "user";
  assert.equal((await request(deleteHandler, body, token, "DELETE")).statusCode, 403);
  for (const invalid of [{ ...body, email: { $ne: null } }, { ...body, index: null }, { ...body, index: "0" }, { ...body, field: "password" }]) {
    assert.equal((await request(deleteHandler, invalid, token, "DELETE")).statusCode, 400);
  }
});

test("profile and admin checks use current identity; all DTOs omit credential fields", async () => {
  await setSessionCookie({ userId: actorId, email: records[0].email });
  assert.equal((await authAction()).isManager, false);
  assert.equal(await getAdminSession(), null);
  records[0].role = "admin";
  assert.ok(await getAdminSession());
  assert.equal((await authAction()).isManager, true);
  const profile = await getCurrentUserDTO();
  assert.equal(profile.id, actorId);
  assert.equal(JSON.stringify(profile).includes("password"), false);
  const dto = toSafeUserDTO({ ...records[0], passwordHash: "hash", colorWeaknesses: [{ password: "secret", passwordHash: "hash", background_color: "red", font_color: "blue" }] });
  assert.equal(JSON.stringify(dto).includes("password"), false);
  records.splice(0, 1);
  assert.equal(await getCurrentUserDTO(), null);
  assert.equal(await authAction(), false);
  assert.equal(await getAdminSession(), null);
});

test("Mongo configuration fails clearly, shares connections, and retries failed attempts", async () => {
  delete process.env.MONGO_URI;
  await assert.rejects(connectToMongo(), /MONGO_URI/);
  process.env.MONGO_URI = "mongodb://localhost/security-tests-never-connected";
  const connect = mock.method(mongoose, "connect", async () => { throw new Error("test failure"); });
  await assert.rejects(connectToMongo(), /test failure/);
  assert.equal(globalThis.__mongooseCache.promise, null);
  connect.mock.mockImplementation(async () => { mongoose.connection.readyState = 1; return mongoose; });
  await Promise.all([connectToMongo(), connectToMongo()]);
  await connectToMongo();
  assert.equal(connect.mock.callCount(), 2);
});

test("server components contain no password props or obsolete client JWT libraries", async () => {
  async function inspect(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      if (entry.isDirectory()) await inspect(path);
      else if (/\.[jt]sx?$/.test(entry.name)) {
        const source = await readFile(path, "utf8");
        assert.doesNotMatch(source, /\.password(?:Hash)?\b|\bpassword(?:Hash)?\s*:|jsonwebtoken|js-cookie/);
      }
    }
  }
  await inspect(new URL("../app/", import.meta.url));
  await inspect(new URL("../components/", import.meta.url));
});

test("model and creation boundary reject plaintext even when a valid hash is supplied", async () => {
  const passwordHash = await hashPassword("ReviewPassword123");
  const input = { username: "Review", email: "review@example.com", passwordHash, password: "ReviewPassword123" };
  await assert.rejects(new User(input).validate(), /legacy passwords/);
  assert.throws(() => createUser(input), /legacy passwords/);
  const legacy = User.hydrate({ ...input, _id: actorId });
  await legacy.validate();
  legacy.password = "Replacement123";
  await assert.rejects(legacy.validate(), /legacy passwords/);
  const created = await createUser({ username: "Review", email: "review@example.com", passwordHash, role: "admin" });
  assert.equal(created.role, "user");
  assert.equal(created.password, undefined);
});

test("registration never accepts attacker roles, IDs or password hashes", async () => {
  const result = await registerAction(form({ username: "Attacker", email: "attacker@example.com", password: "ValidPass123", role: "admin", _id: otherId, passwordHash: "attacker-hash" }));
  assert.equal(result.success, true);
  assert.equal(writes[0].role, undefined);
  assert.equal(writes[0]._id, undefined);
  assert.notEqual(writes[0].passwordHash, "attacker-hash");
});

test("standard bcrypt rejects overlong prefix matches; versioned hashes preserve all bytes", async () => {
  const boundary = "a".repeat(72);
  const standardHash = await hashPassword(boundary);
  assert.equal((await verifyStoredPassword({ candidate: boundary, passwordHash: standardHash })).isValid, true);
  assert.equal((await verifyStoredPassword({ candidate: boundary + "x", passwordHash: standardHash })).isValid, false);
  const longPassword = boundary + "X";
  const versioned = await hashPassword(longPassword);
  assert.match(versioned, /^bcrypt-sha256:v1:\$2b\$12\$/);
  for (const candidate of [boundary, boundary + "Y", longPassword + "Y"]) {
    assert.equal((await verifyStoredPassword({ candidate, passwordHash: versioned })).isValid, false);
  }
  assert.equal((await verifyStoredPassword({ candidate: longPassword, passwordHash: versioned })).isValid, true);
  const oldFormat = versioned.replace("bcrypt-sha256:v1:", "bcrypt-sha256:");
  assert.equal((await verifyStoredPassword({ candidate: longPassword, passwordHash: oldFormat })).isValid, true);
  assert.equal((await verifyStoredPassword({ candidate: longPassword, passwordHash: versioned.replace(":v1:", ":v2:") })).isValid, false);
  assert.equal((await verifyStoredPassword({ candidate: "wrong", passwordHash: "invalid", legacyPassword: "wrong" })).isValid, false);
});

test("hashed login detects a credential change or deletion during bcrypt comparison", async () => {
  records[0].passwordHash = await hashPassword("Current123");
  delete records[0].password;
  const originalCompare = bcrypt.compare;
  mock.method(bcrypt, "compare", async (...args) => {
    const result = await originalCompare(...args);
    records[0].passwordHash = "changed-concurrently";
    return result;
  });
  assert.equal(await authenticateUserService(records[0].email, "Current123"), null);
  records[0].passwordHash = await hashPassword("Current123");
  mock.method(bcrypt, "compare", async (...args) => {
    const result = await originalCompare(...args);
    records.splice(0, 1);
    return result;
  });
  assert.equal((await loginAction(form({ email: "actor@example.com", password: "Current123" }))).success, false);
  assert.equal(cookieJar.size, 0);
});

test("all API object boundaries reject prototype keys, operators and mixed unsupported fields", async () => {
  const token = await tokenFor();
  for (const key of ["email", "_id", "role", "username", "password", "passwordHash", "$set", "$unset", "$where", "__proto__", "constructor", "prototype"]) {
    const extra = JSON.parse(`{"${key}":{"role":"admin"}}`);
    const nested = { background_color: "red", font_color: "blue", ...extra };
    for (const body of [
      { updateData: { colorWeaknesses: [] }, ...extra },
      { updateData: { colorWeaknesses: [], ...extra } },
      { updateData: { colorWeaknesses: [nested] } },
    ]) assert.equal((await request(updateHandler, body, token)).statusCode, 400, key);
    const deletion = { field: "color", index: 0, ...extra };
    assert.equal((await request(deleteHandler, deletion, token, "DELETE")).statusCode, 400, key);
  }
  assert.equal(writes.length, 0);
  assert.equal(saved.length, 0);
  assert.equal({}.role, undefined);
});

test("stale signed admin/email claims cannot cross accounts after demotion, email change or deletion", async () => {
  const stale = await new SignJWT({ email: records[1].email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" }).setSubject(actorId).setIssuer("ayinbright").setAudience("ayinbright").setIssuedAt().setExpirationTime("1h").sign(getSessionSecret());
  cookieJar.set(SESSION_COOKIE_NAME, { value: stale });
  records[0].email = "changed@example.com";
  assert.equal((await authAction()).isManager, false);
  assert.equal((await authAction()).userToken.email, "changed@example.com");
  assert.equal(await getAdminSession(), null);
  assert.equal((await request(updateHandler, { updateData: { fieldWeaknesses: [] } }, stale)).statusCode, 200);
  assert.equal(writes[0].id, actorId);
  const body = { email: records[1].email, field: "color", index: 0 };
  assert.equal((await request(deleteHandler, body, stale, "DELETE")).statusCode, 403);
  records[0].role = "admin";
  assert.equal((await request(deleteHandler, body, stale, "DELETE")).statusCode, 200);
  records[0].role = "user";
  assert.equal((await request(deleteHandler, body, stale, "DELETE")).statusCode, 403);
  records.splice(0, 1);
  assert.equal((await request(deleteHandler, body, stale, "DELETE")).statusCode, 401);
  assert.equal((await request(updateHandler, { updateData: { fieldWeaknesses: [] } }, stale)).statusCode, 401);
});

test("invalid JWT algorithms, subjects and signatures cannot authorize writes", async () => {
  const token = await tokenFor();
  const claims = { ...decodeJwt(token), role: "admin" };
  const forged = token.split(".");
  forged[1] = Buffer.from(JSON.stringify(claims)).toString("base64url");
  const unsigned = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url") + "." + forged[1] + ".";
  const wrongAlgorithm = await new SignJWT(claims).setProtectedHeader({ alg: "HS384" }).sign(getSessionSecret());
  const badSubject = await new SignJWT({ ...claims, sub: "not-an-object-id" }).setProtectedHeader({ alg: "HS256" }).sign(getSessionSecret());
  for (const invalid of [forged.join("."), unsigned, wrongAlgorithm, badSubject, "malformed", { token }]) {
    assert.equal(await verifySessionToken(invalid), null);
    assert.equal((await request(updateHandler, { updateData: { fieldWeaknesses: [] } }, invalid)).statusCode, 401);
  }
});

test("ordinary queries explicitly exclude both credentials before lean serialization", async () => {
  User.findOne.mock.restore();
  User.findById.mock.restore();
  const projections = [];
  mock.method(User.collection, "findOne", async (_filter, options) => { projections.push(options.projection); return null; });
  await User.findOne({ email: "actor@example.com" });
  assert.equal(projections[0].password, 0);
  assert.equal(projections[0].passwordHash, 0);
  await readUserById(actorId);
  assert.equal(projections[1].username, 1);
  assert.equal(projections[1].password, undefined);
  assert.equal(projections[1].passwordHash, undefined);
  const document = User.hydrate({ ...records[0], passwordHash: "secret-hash" });
  assert.equal(JSON.stringify(document.toJSON()).includes("password"), false);
  assert.equal(JSON.stringify(document.toObject()).includes("password"), false);
});

test("deletion validates against actual array length for historical collections over 500 entries", async () => {
  records[0].colorWeaknesses = Array.from({ length: 501 }, () => ({ background_color: "red", font_color: "blue" }));
  const token = await tokenFor();
  assert.equal((await request(deleteHandler, { field: "color", index: 500 }, token, "DELETE")).statusCode, 200);
  assert.equal(saved[0].colorWeaknesses.length, 500);
  for (const index of [-1, 0.5, Number.MAX_SAFE_INTEGER + 1, 501]) {
    assert.equal((await request(deleteHandler, { field: "color", index }, token, "DELETE")).statusCode, 400);
  }
});
