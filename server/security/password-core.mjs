// Canonical Node-only implementation shared by the app wrapper and the offline CLI.
// node:crypto intentionally makes this module unsuitable for a browser bundle.
import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const HASH_ROUNDS = 12;
const LONG_PASSWORD_PREFIX = "bcrypt-sha256:v1:";
const OLD_LONG_PASSWORD_PREFIX = "bcrypt-sha256:";
const BCRYPT_HASH = /^\$2[aby]\$(?:0[4-9]|[12][0-9]|3[01])\$[./A-Za-z0-9]{53}$/;

function longHashBody(value) {
  for (const prefix of [LONG_PASSWORD_PREFIX, OLD_LONG_PASSWORD_PREFIX]) {
    if (value.startsWith(prefix)) return value.slice(prefix.length);
  }
  return null;
}

export function isPasswordHash(value) {
  return typeof value === "string" && (
    BCRYPT_HASH.test(value) ||
    BCRYPT_HASH.test(longHashBody(value) || "")
  );
}

function digest(password) {
  return createHash("sha256").update(password, "utf8").digest("base64");
}

export async function hashPassword(password) {
  if (typeof password !== "string" || !password.trim() || password.length > 128) {
    throw new Error("A non-empty password of at most 128 characters is required.");
  }
  // Preserve long legacy passwords without bcrypt's silent 72-byte truncation.
  if (bcrypt.truncates(password)) {
    return LONG_PASSWORD_PREFIX + await bcrypt.hash(digest(password), HASH_ROUNDS);
  }
  return bcrypt.hash(password, HASH_ROUNDS);
}

async function compareHash(candidate, stored) {
  if (!isPasswordHash(stored)) return false;
  const longHash = longHashBody(stored);
  if (longHash) {
    return bcrypt.compare(digest(candidate), longHash);
  }
  // A standard bcrypt hash cannot distinguish any suffix beyond 72 UTF-8 bytes.
  // Such historical credentials require reset; never silently accept a prefix match.
  if (bcrypt.truncates(candidate)) return false;
  return bcrypt.compare(candidate, stored);
}

function safeLegacyCompare(candidate, storedPassword) {
  const candidateBuffer = Buffer.from(candidate);
  const storedBuffer = Buffer.from(storedPassword);

  if (candidateBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, storedBuffer);
}

export async function verifyStoredPassword({
  candidate,
  passwordHash,
  legacyPassword,
}) {
  if (typeof candidate !== "string" || !candidate.trim() || candidate.length > 128) {
    return { isValid: false, needsMigration: false };
  }
  if (passwordHash) {
    return {
      isValid: await compareHash(candidate, passwordHash),
      needsMigration: false,
    };
  }

  if (isPasswordHash(legacyPassword)) {
    return { isValid: await compareHash(candidate, legacyPassword), needsMigration: true };
  }

  if (
    typeof legacyPassword === "string" &&
    !legacyPassword.startsWith("$2") &&
    !legacyPassword.startsWith(OLD_LONG_PASSWORD_PREFIX) &&
    safeLegacyCompare(candidate, legacyPassword)
  ) {
    return {
      isValid: true,
      needsMigration: true,
    };
  }

  return {
    isValid: false,
    needsMigration: false,
  };
}
