import {
  deleteUserResultService,
  readUserByFieldService,
} from "@/server/BL/services/user.service";
import { SESSION_COOKIE_NAME, resolveUserRole } from "@/server/security/session";
import { getUserFromToken } from "@/server/security/authenticated-user";
import { isJsonMutation } from "@/server/security/api-request";
import { deleteRequestSchema } from "@/server/validation/results";
import { toSafeUserDTO } from "@/server/data/user-dto";

export default async function handler(request, response) {
  if (!["DELETE", "POST"].includes(request.method)) {
    response.setHeader("Allow", "DELETE, POST");
    return response.status(405).json({ message: "Method not allowed." });
  }
  if (!isJsonMutation(request)) {
    return response.status(403).json({ message: "A same-site JSON request is required." });
  }
  try {
    const actor = await getUserFromToken(request.cookies?.[SESSION_COOKIE_NAME]);
    if (!actor) {
      return response.status(401).json({ message: "Authentication required." });
    }
    const validation = deleteRequestSchema.safeParse(request.body);
    if (!validation.success) {
      return response.status(400).json({ message: "Invalid deletion request." });
    }
    const { email, field, index } = validation.data;
    let target = actor;
    if (email && email !== actor.email.trim().toLowerCase()) {
      if (resolveUserRole(actor) !== "admin") {
        return response.status(403).json({ message: "Administrator access required." });
      }
      target = await readUserByFieldService({ email });
      if (!target) {
        return response.status(404).json({ message: "User not found." });
      }
    }
    // Authorization selects a database ID; a client email never grants permission.
    const user = await deleteUserResultService(target._id, field, index);
    return response.status(200).json({ message: "Result deleted successfully.", user: toSafeUserDTO(user) });
  } catch (error) {
    const status = error.message === "User not found." ? 404
      : error.message === "Invalid result index." ? 400 : 500;
    if (status === 500) console.error("Failed to delete result. Check database and JWT_SECRET configuration.");
    return response.status(status).json({ message: status === 500 ? "Failed to delete result." : error.message });
  }
}
