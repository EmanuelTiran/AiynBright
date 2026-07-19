import "server-only";

import {
  createUser,
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

export async function createUserService({
  username,
  email,
  password,
}) {
  const passwordHash = await hashPassword(password);

  return createUser({
    username,
    email: email.trim().toLowerCase(),
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
  email,
  field,
  index,
) => deleteResultAtIndex(email, field, index);

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

    await replaceLegacyPassword(
      user._id,
      passwordHash,
    );
  }

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}