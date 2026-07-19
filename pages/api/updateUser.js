import { connectToMongo } from "@/server/connectToMongo";
import { updateUserByIdService } from "@/server/BL/services/user.service";

import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/server/security/session";

import { validateResultsUpdate } from "@/server/validation/results";

export default async function handler(
  request,
  response,
) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");

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

  const validation = validateResultsUpdate(
    request.body?.updateData,
  );

  if (!validation.success) {
    return response.status(400).json({
      message: "Invalid vision-test result.",
    });
  }

  try {
    await connectToMongo();

    await updateUserByIdService(
      session.userId,
      validation.data,
    );

    return response.status(200).json({
      message: "Results updated successfully.",
    });
  } catch (error) {
    console.error(
      "Failed to update results:",
      error,
    );

    return response.status(500).json({
      message: "Failed to update results.",
    });
  }
}