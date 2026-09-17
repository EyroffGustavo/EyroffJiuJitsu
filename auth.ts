import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "eyroff_admin";
const SESSION_DURATION_SECONDS = 60 * 60 * 12;

function runtimeValue(key: "ADMIN_USER" | "ADMIN_PASSWORD" | "ADMIN_SESSION_SECRET") {
  return process.env[key] ?? "";
}

async function hmac(value: string) {
  const secret = runtimeValue("ADMIN_SESSION_SECRET");
  if (!secret) return "";
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function sameValue(left: string, right: string) {
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(left)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(right)),
  ]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let different = x.length ^ y.length;
  for (let i = 0; i < Math.min(x.length, y.length); i++) different |= x[i] ^ y[i];
  return different === 0;
}

export async function credentialsAreValid(username: string, password: string) {
  const expectedUser = runtimeValue("ADMIN_USER");
  const expectedPassword = runtimeValue("ADMIN_PASSWORD");
  if (!expectedUser || !expectedPassword) return false;
  const [validUser, validPassword] = await Promise.all([
    sameValue(username, expectedUser),
    sameValue(password, expectedPassword),
  ]);
  return validUser && validPassword;
}

export async function createSessionCookie() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS;
  const payload = String(expires);
  return { name: COOKIE_NAME, value: payload + "." + await hmac(payload), maxAge: SESSION_DURATION_SECONDS };
}

export async function isAdminAuthenticated() {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  return sameValue(signature, await hmac(expires));
}

export { COOKIE_NAME };
