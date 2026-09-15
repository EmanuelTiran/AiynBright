import "server-only";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  createSessionToken,
  sessionCookieOptions,
  verifySessionToken,
} from "./session";

export async function setSessionCookie(user) {
  const token = await createSessionToken(user);
  (await cookies()).set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
}

export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE_NAME, "", sessionCookieOptions(0));
}

export async function getSession() {
  return verifySessionToken((await cookies()).get(SESSION_COOKIE_NAME)?.value);
}
