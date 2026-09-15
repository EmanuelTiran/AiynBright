"use server";

import { redirect } from "next/navigation";
import { connectToMongo } from "@/server/connectToMongo";

import {
  authenticateUserService,
  createUserService,
  readUserByFieldService,
} from "@/server/BL/services/user.service";

import {
  clearSessionCookie,
  getSession,
  setSessionCookie,
} from "@/server/security/session-cookie";
import { getAuthenticatedUser } from "@/server/security/authenticated-user";
import {
  getSessionSecret,
  isConfiguredAdminEmail,
  resolveUserRole,
} from "@/server/security/session";

import {
  firstValidationError,
  loginSchema,
  registrationSchema,
} from "@/server/validation/auth";

const INVALID_LOGIN_MESSAGE =
  "The email address or password is incorrect.";

function formDataToObject(formData) {
  return formData instanceof FormData ? Object.fromEntries(formData.entries()) : {};
}

export async function loginAction(formData) {
  const validation = loginSchema.safeParse(
    formDataToObject(formData),
  );

  if (!validation.success) {
    return {
      success: false,
      message: firstValidationError(validation),
    };
  }

  try {
    getSessionSecret();
    await connectToMongo();

    const user = await authenticateUserService(
      validation.data.email,
      validation.data.password,
    );

    if (!user) {
      return {
        success: false,
        message: INVALID_LOGIN_MESSAGE,
      };
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
    };
  } catch {
    console.error("Login failed. Check database and JWT_SECRET configuration.");

    return {
      success: false,
      message:
        "Login is temporarily unavailable. Please try again.",
    };
  }
}

export async function registerAction(formData) {
  const validation =
    registrationSchema.safeParse(
      formDataToObject(formData),
    );

  if (!validation.success) {
    return {
      success: false,
      message: firstValidationError(validation),
    };
  }

  if (
    isConfiguredAdminEmail(
      validation.data.email,
    )
  ) {
    return {
      success: false,
      message:
        "This email address cannot be registered here.",
    };
  }

  try {
    getSessionSecret();
    await connectToMongo();

    const existingUser =
      await readUserByFieldService({
        email: validation.data.email,
      });

    if (existingUser) {
      return {
        success: false,
        message:
          "An account with this email address already exists.",
      };
    }

    const user = await createUserService(
      validation.data,
    );

    await setSessionCookie({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      success: true,
    };
  } catch (error) {
    if (error?.code === 11000) {
      return {
        success: false,
        message:
          "An account with this email address already exists.",
      };
    }

    console.error("Registration failed. Check database and JWT_SECRET configuration.");

    return {
      success: false,
      message:
        "Registration is temporarily unavailable. Please try again.",
    };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}

export async function authAction() {
  const user = await getAuthenticatedUser(await getSession());

  if (!user) {
    return false;
  }

  return {
    isUser: true,
    isManager: resolveUserRole(user) === "admin",

    userToken: {
      id: user._id.toString(),
      email: user.email,
      role: resolveUserRole(user),
    },
  };
}
