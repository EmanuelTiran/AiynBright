import { connectToMongo } from "@/server/connectToMongo";
import { deleteUserResultService } from "@/server/BL/services/user.service";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/server/security/session";

const ALLOWED_RESULT_TYPES = new Set([
  "color",
  "size",
  "field",
]);

export default async function handler(
  request,
  response,
) {
  if (
    request.method !== "DELETE" &&
    request.method !== "POST"
  ) {
    response.setHeader("Allow", "DELETE");

    return response.status(405).json({
      message: "Method not allowed.",
    });
  }

  const session = await verifySessionToken(
    request.cookies?.[SESSION_COOKIE_NAME],
  );

  if (!session) {
    return response.status(401).json({
      message: "Authentication required.",
    });
  }

  if (session.role !== "admin") {
    return response.status(403).json({
      message:
        "Administrator access required.",
    });
  }

  const {
    email,
    field,
    index,
  } = request.body || {};

  const numericIndex = Number(index);

  if (
    typeof email !== "string" ||
    !ALLOWED_RESULT_TYPES.has(field) ||
    !Number.isInteger(numericIndex) ||
    numericIndex < 0
  ) {
    return response.status(400).json({
      message: "Invalid deletion request.",
    });
  }

  try {
    await connectToMongo();

    const user = await deleteUserResultService(
      email,
      field,
      numericIndex,
    );

    return response.status(200).json({
      message:
        "Result deleted successfully.",
      user,
    });
  } catch (error) {
    const notFound =
      error.message === "User not found.";

    return response
      .status(notFound ? 404 : 400)
      .json({
        message:
          error.message ||
          "Failed to delete result.",
      });
  }
}