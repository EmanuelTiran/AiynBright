import "server-only";
import { User } from "../models/user.model";

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
  return User.create(data);
}

export async function replaceLegacyPassword(
  userId,
  passwordHash,
) {
  await User.updateOne(
    {
      _id: userId,
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
}

export async function updateUserById(
  userId,
  updateData,
) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
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
  email,
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

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

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