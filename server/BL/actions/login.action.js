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
  isConfiguredAdminEmail,
  resolveUserRole,
  setSessionCookie,
} from "@/server/security/session";

import {
  firstValidationError,
  loginSchema,
  registrationSchema,
} from "@/server/validation/auth";

const INVALID_LOGIN_MESSAGE =
  "The email address or password is incorrect.";

function formDataToObject(formData) {
  return Object.fromEntries(formData.entries());
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

    const role = resolveUserRole(user);

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Login failed:", error);

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
      role: "user",
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

    console.error("Registration failed:", error);

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
  const session = await getSession();

  if (!session) {
    return false;
  }

  return {
    isUser: true,
    isManager: session.role === "admin",

    userToken: {
      id: session.userId,
      email: session.email,
      role: session.role,
    },
  };
}