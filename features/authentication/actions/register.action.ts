"use server";

import { authClient } from "@/lib/auth-client";
import {registerSchema} from "@/features/authentication/schemas/register-schema";
import {newUserConfiguration} from "@/features/authentication/actions/new-user-configuration";

export async function registerAction(formData: unknown) {
  const parsed = await registerSchema.safeParseAsync(formData);

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, name } = parsed.data;

  const response = await authClient.signUp.email({
    email,
    password,
    name,
  });

  if (response.error) {
    return {
      success: false,
      formError: response.error.message,
    };
  }

  const userId = response.data?.user?.id;
  if (userId) {
    await newUserConfiguration(userId);
  }

  return { success: true };
}
