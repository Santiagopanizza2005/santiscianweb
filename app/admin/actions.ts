"use server";

import { redirect } from "next/navigation";
import { isAdminPasswordValid, setAdminSession } from "../../lib/admin-auth";

export type AdminLoginState = {
  error: string;
};

export async function signInAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = formData.get("password");

  if (typeof password !== "string" || !isAdminPasswordValid(password)) {
    return { error: "Contraseña incorrecta." };
  }

  await setAdminSession();
  redirect("/admin");
}
