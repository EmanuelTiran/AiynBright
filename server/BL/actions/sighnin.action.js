"use server";

import { registerAction } from "./login.action";

export async function signAction(formData) {
  return registerAction(formData);
}