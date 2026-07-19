import "server-only";
import { timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";

const HASH_ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hash(password, HASH_ROUNDS);
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
  if (passwordHash) {
    return {
      isValid: await bcrypt.compare(candidate, passwordHash),
      needsMigration: false,
    };
  }

  if (
    legacyPassword &&
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