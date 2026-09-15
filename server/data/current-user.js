import "server-only";

import { getSession } from "@/server/security/session-cookie";
import { resolveUserRole } from "@/server/security/session";
import { getAuthenticatedUser } from "@/server/security/authenticated-user";

import { toSafeUserDTO } from "./user-dto";
export { toSafeUserDTO } from "./user-dto";

export async function getCurrentUserDTO() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await getAuthenticatedUser(session);

  return user ? toSafeUserDTO(user) : null;
}

export async function getAdminSession() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await getAuthenticatedUser(session);

  if (
    !user ||
    resolveUserRole(user) !== "admin"
  ) {
    return null;
  }

  return session;
}
