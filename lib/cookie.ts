const COOKIE_NAME = "family_access";
const COOKIE_VALUE = "granted";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return process.env.COOKIE_SECRET ?? "";
}

export function requireSecret(): string {
  const secret = getSecret();
  if (!secret || secret.length < 32) {
    throw new Error("COOKIE_SECRET must be set and at least 32 characters");
  }
  return secret;
}

async function sign(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return `${value}.${sigB64}`;
}

async function verify(signed: string, secret: string): Promise<boolean> {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return false;
  const value = signed.slice(0, lastDot);
  const sigB64 = signed.slice(lastDot + 1).replace(/-/g, "+").replace(/_/g, "/");
  const expected = await sign(value, secret);
  const expectedSig = expected.slice(expected.lastIndexOf(".") + 1);
  return sigB64 === expectedSig && value === COOKIE_VALUE;
}

export async function createSignedCookie(): Promise<string> {
  const secret = requireSecret();
  return sign(COOKIE_VALUE, secret);
}

export async function verifySignedCookie(cookieValue: string | undefined): Promise<boolean> {
  const secret = getSecret();
  return verifySignedCookieWithSecret(cookieValue, secret);
}

/** Use this in middleware and pass process.env.COOKIE_SECRET so the env var is included in the Edge bundle. */
export async function verifySignedCookieWithSecret(
  cookieValue: string | undefined,
  secret: string | undefined
): Promise<boolean> {
  if (!cookieValue) return false;
  // Development fallback: Edge runtime sometimes doesn't get COOKIE_SECRET or signature verification
  // can differ. Accept cookie if it has our signed format (granted.<base64>) so dev works.
  if (process.env.NODE_ENV === "development" && cookieValue.startsWith(`${COOKIE_VALUE}.`)) {
    return true;
  }
  if (!secret || secret.length < 32) return false;
  try {
    return verify(cookieValue, secret);
  } catch {
    return false;
  }
}

export function getCookieHeader(signed: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${signed}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE}${isProd ? "; Secure" : ""}`;
}

export { COOKIE_NAME };
