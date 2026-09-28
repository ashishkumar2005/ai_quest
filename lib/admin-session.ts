const COOKIE_NAME = "aq_admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET must be configured with at least 32 characters.");
  return crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function matchesAdminPassword(candidate: string) {
  const password = process.env.ADMIN_PORTAL_PASSWORD;
  if (!password) return false;
  const encoder = new TextEncoder();
  const [actual, expected] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(password)),
  ]);
  const a = new Uint8Array(actual);
  const b = new Uint8Array(expected);
  let mismatch = 0;
  for (let index = 0; index < a.length; index += 1) mismatch |= a[index] ^ b[index];
  return mismatch === 0;
}

export async function createAdminSession() {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = String(expiresAt);
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), new TextEncoder().encode(payload));
  return { cookieName: COOKIE_NAME, token: `${payload}.${encodeBase64Url(new Uint8Array(signature))}`, maxAge: SESSION_SECONDS };
}

export async function hasValidAdminSession(token?: string) {
  if (!token) return false;
  const [expiresAtText, signatureText, extra] = token.split(".");
  if (!expiresAtText || !signatureText || extra !== undefined || !/^\d+$/.test(expiresAtText)) return false;
  if (Number(expiresAtText) <= Math.floor(Date.now() / 1000)) return false;
  try {
    return await crypto.subtle.verify("HMAC", await signingKey(), decodeBase64Url(signatureText), new TextEncoder().encode(expiresAtText));
  } catch {
    return false;
  }
}

export const adminSessionCookieName = COOKIE_NAME;
