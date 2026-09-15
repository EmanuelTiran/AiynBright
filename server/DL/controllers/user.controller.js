import "server-only";
import { User } from "../models/user.model";
import { validateResultsUpdate } from "@/server/validation/results";

const SAFE_USER_FIELDS =
  "_id username email role colorWeaknesses sizeWeaknesses fieldWeaknesses createdAt updatedAt";

export function readUsers(filter = {}) {
  return User.find(filter)
    .select(SAFE_USER_FIELDS)
    .lean();
}

export function readUserById(id) {
  return User.findById(id)
    .select(SAFE_USER_FIELDS)
    .lean();
}

export function readUser(filter) {
  return User.findOne(filter)
    .select(SAFE_USER_FIELDS)
    .lean();
}

export function readUserForAuthentication(email) {
  return User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordHash +password");
}

export function createUser(data) {
  if (Object.hasOwn(data, "password")) throw new Error("Writing legacy passwords is prohibited.");
  const { username, email, passwordHash } = data;
  return User.create({ username, email, passwordHash });
}

export async function isCurrentPasswordHash(userId, passwordHash) {
  return Boolean(await User.exists({ _id: userId, passwordHash }));
}

export async function replaceLegacyPassword(
  userId,
  passwordHash,
  legacyPassword,
) {
  const result = await User.updateOne(
    {
      _id: userId,
      password: legacyPassword,
      passwordHash: { $in: [null, ""] },
    },
    {
      $set: {
        passwordHash,
      },
      $unset: {
        password: 1,
      },
    },
    {
      runValidators: true,
    },
  );
  return result.matchedCount === 1;
}

export async function updateUserById(
  userId,
  updateData,
) {
  const validation = validateResultsUpdate(updateData);
  if (!validation.success) throw new Error("Invalid vision-test result.");
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: validation.data,
    },
    {
      new: true,
      runValidators: true,
    },
  ).select(SAFE_USER_FIELDS);

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}

export async function deleteResultAtIndex(
  userId,
  field,
  index,
) {
  const fieldMap = {
    color: "colorWeaknesses",
    size: "sizeWeaknesses",
    field: "fieldWeaknesses",
  };

  const collectionName = fieldMap[field];

  if (!collectionName) {
    throw new Error("Invalid result type.");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= user[collectionName].length
  ) {
    throw new Error("Invalid result index.");
  }

  user[collectionName].splice(index, 1);
  await user.save();

  return user.toJSON();
}
