import "server-only";
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "ayinbright_session";

export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export function getSessionSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must contain at least 32 characters.",
    );
  }

  return new TextEncoder().encode(secret);
}

export function isConfiguredAdminEmail(email) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return adminEmails.includes(email.trim().toLowerCase());
}

export function resolveUserRole(user) {
  // Email reservation does not prove that an existing account belongs to an admin.
  return user.role === "admin" ? "admin" : "user";
}

export async function createSessionToken({
  userId,
  email,
}) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(userId))
    .setIssuer("ayinbright")
    .setAudience("ayinbright")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionSecret());
}

export async function verifySessionToken(token) {
  if (!token) {
    return null;
  }

  const secret = getSessionSecret();

  try {
    const { payload } = await jwtVerify(
      token,
      secret,
      {
        algorithms: ["HS256"],
        issuer: "ayinbright",
        audience: "ayinbright",
        requiredClaims: ["sub", "email", "iat", "exp"],
      },
    );

    if (
      typeof payload.sub !== "string" ||
      !/^[a-f0-9]{24}$/i.test(payload.sub) ||
      typeof payload.email !== "string" ||
      "password" in payload || "passwordHash" in payload || "credentials" in payload
    ) {
      return null;
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = SESSION_DURATION_SECONDS) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  };
}
