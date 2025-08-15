// src/lib/auth.ts
import crypto from "crypto";

export const HASH_ITERATIONS = 120000;
export const KEYLEN = 64;
export const DIGEST = "sha512";
export const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export function genSalt(len = 16) {
  return crypto.randomBytes(len).toString("hex");
}

export function hashPassword(password: string, salt: string) {
  const derived = crypto.pbkdf2Sync(
    password,
    salt,
    HASH_ITERATIONS,
    KEYLEN,
    DIGEST
  );
  return derived.toString("hex");
}

export function verifyPassword(
  password: string,
  salt: string,
  expectedHash: string
) {
  const h = hashPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(h, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

export function generateSessionToken(userId: string, secret: string) {
  const ts = Math.floor(Date.now() / 1000);
  const payload = `${userId}|${ts}`;
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}|${hmac}`).toString("base64");
}

export function verifySessionToken(tokenB64: string, secret: string) {
  try {
    const decoded = Buffer.from(tokenB64, "base64").toString("utf8");
    const [userId, tsStr, hmac] = decoded.split("|");
    const payload = `${userId}|${tsStr}`;
    const expected = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(hmac)))
      return null;
    const ts = parseInt(tsStr, 10);
    if (Math.floor(Date.now() / 1000) - ts > SESSION_TTL) return null;
    return { userId, ts };
  } catch (e) {
    return null;
  }
}
