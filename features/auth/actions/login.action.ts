"use server";

import { loginSchema } from "../schemas/login-schema";

export async function loginAction(input: unknown) {
  const parsed = await loginSchema.safeParseAsync(input);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  return { success: true };
}
