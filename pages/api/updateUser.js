import { updateUserByIdService } from "@/server/BL/services/user.service";
import { SESSION_COOKIE_NAME } from "@/server/security/session";
import { getUserFromToken } from "@/server/security/authenticated-user";
import { isJsonMutation } from "@/server/security/api-request";
import { updateRequestSchema } from "@/server/validation/results";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ message: "Method not allowed." });
  }
  if (!isJsonMutation(request)) {
    return response.status(403).json({ message: "A same-site JSON request is required." });
  }
  try {
    const user = await getUserFromToken(request.cookies?.[SESSION_COOKIE_NAME]);
    if (!user) {
      return response.status(401).json({ message: "Authentication required." });
    }
    const validation = updateRequestSchema.safeParse(request.body);
    if (!validation.success) {
      return response.status(400).json({ message: "Invalid vision-test result." });
    }
    await updateUserByIdService(user._id, validation.data.updateData);
    return response.status(200).json({ message: "Results updated successfully." });
  } catch {
    console.error("Failed to update results. Check database and JWT_SECRET configuration.");
    return response.status(500).json({ message: "Failed to update results." });
  }
}
