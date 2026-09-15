import "server-only";
import { connectToMongo } from "@/server/connectToMongo";
import { readUserByIdService } from "@/server/BL/services/user.service";
import { verifySessionToken } from "./session";

export async function getAuthenticatedUser(session) {
  if (!session) return null;
  await connectToMongo();
  return readUserByIdService(session.userId);
}

export async function getUserFromToken(token) {
  return getAuthenticatedUser(await verifySessionToken(token));
}
