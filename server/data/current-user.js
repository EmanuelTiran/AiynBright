import "server-only";

import { connectToMongo } from "@/server/connectToMongo";
import { readUserByIdService } from "@/server/BL/services/user.service";
import {
  getSession,
  resolveUserRole,
} from "@/server/security/session";

function serializeResult(result) {
  return {
    ...result,
    _id: result._id?.toString(),
    date:
      result.date instanceof Date
        ? result.date.toISOString()
        : result.date,
  };
}

export function toSafeUserDTO(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,

    colorWeaknesses: (
      user.colorWeaknesses || []
    ).map(serializeResult),

    sizeWeaknesses: (
      user.sizeWeaknesses || []
    ).map(serializeResult),

    fieldWeaknesses: (
      user.fieldWeaknesses || []
    ).map(serializeResult),
  };
}

export async function getCurrentUserDTO() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  await connectToMongo();

  const user = await readUserByIdService(
    session.userId,
  );

  return user ? toSafeUserDTO(user) : null;
}

export async function getAdminSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  await connectToMongo();

  const user = await readUserByIdService(
    session.userId,
  );

  if (
    !user ||
    resolveUserRole(user) !== "admin"
  ) {
    return null;
  }

  return session;
}