import { randomBytes } from "crypto";
import { z } from "zod";

const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function generateTempPassword(length = 12): string {
  const out: string[] = [];
  const max = 256 - (256 % ALPHABET.length);
  while (out.length < length) {
    const buf = randomBytes(length * 2);
    for (let i = 0; i < buf.length && out.length < length; i++) {
      const b = buf[i];
      if (b < max) {
        out.push(ALPHABET[b % ALPHABET.length]);
      }
    }
  }
  return out.join("");
}

export const passwordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(72, "Password must be at most 72 characters");
