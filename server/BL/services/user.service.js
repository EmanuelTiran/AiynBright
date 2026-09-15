import "server-only";

import {
  createUser,
  isCurrentPasswordHash,
  deleteResultAtIndex,
  readUser,
  readUserById,
  readUserForAuthentication,
  readUsers,
  replaceLegacyPassword,
  updateUserById,
} from "@/server/DL/controllers/user.controller";

import {
  hashPassword,
  verifyStoredPassword,
} from "@/server/security/password";
import { registrationSchema } from "@/server/validation/auth";
import { isConfiguredAdminEmail } from "@/server/security/session";

export async function createUserService({
  username,
  email,
  password,
}) {
  const validation = registrationSchema.safeParse({ username, email, password });
  if (!validation.success || isConfiguredAdminEmail(validation.data.email)) {
    throw new Error("Invalid registration.");
  }
  const passwordHash = await hashPassword(validation.data.password);

  return createUser({
    username: validation.data.username,
    email: validation.data.email,
    passwordHash,
  });
}

export const readUsersService = (filter = {}) =>
  readUsers(filter);

export const readUserByIdService = (id) =>
  readUserById(id);

export const readUserByFieldService = (filter) =>
  readUser(filter);

export const updateUserByIdService = (
  id,
  updateData,
) => updateUserById(id, updateData);

export const deleteUserResultService = (
  userId,
  field,
  index,
) => deleteResultAtIndex(userId, field, index);

export async function authenticateUserService(
  email,
  candidatePassword,
) {
  const user =
    await readUserForAuthentication(email);

  if (!user) {
    return null;
  }

  const verification =
    await verifyStoredPassword({
      candidate: candidatePassword,
      passwordHash: user.passwordHash,
      legacyPassword: user.password,
    });

  if (!verification.isValid) {
    return null;
  }

  if (verification.needsMigration) {
    const passwordHash =
      await hashPassword(candidatePassword);

    const migrated = await replaceLegacyPassword(
      user._id,
      passwordHash,
      user.password,
    );
    // Do not overwrite a concurrent password change or authenticate a stale credential.
    if (!migrated) return null;
  } else if (!await isCurrentPasswordHash(user._id, user.passwordHash)) {
    // bcrypt yields to the event loop: recheck deletion/password changes after comparison.
    return null;
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
