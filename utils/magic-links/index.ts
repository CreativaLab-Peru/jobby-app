import crypto from "crypto";

export function generateMagicLinkToken(length = 48) {
  return crypto.randomBytes(length).toString("base64url");
}

export function hashMagicLinkToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
