import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "santiscian_admin";
const SESSION_MAX_AGE = 60 * 60 * 24;

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD no está configurada.");
  }

  return password;
}

function getSessionToken() {
  return createHmac("sha256", getAdminPassword())
    .update("santiscian-admin-session-v1")
    .digest("base64url");
}

export function isAdminPasswordValid(password: string) {
  const expected = Buffer.from(getAdminPassword());
  const received = Buffer.from(password);

  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function hasAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const expected = getSessionToken();
  const received = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

export async function setAdminSession() {
  (await cookies()).set(ADMIN_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
