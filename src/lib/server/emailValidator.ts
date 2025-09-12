import { z } from "zod";
import dns from "dns/promises";

// Zod schema for email format
const emailSchema = z.string().email({ message: "Invalid email format" });

// Regex for stricter check (no weird chars, must have TLD of 2+ chars)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate email using Zod + Regex + MX DNS check
 */
export async function validateEmail(email: string): Promise<{ valid: boolean; error?: string }> {
  // Step 1: Zod validation
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { valid: false, error: "Invalid email format" };
  }

  // Step 2: Regex check
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Invalid email address structure" };
  }

  // Step 3: MX DNS validation
  const domain = email.split("@")[1];
  try {
    const records = await dns.resolveMx(domain);
    if (!records || records.length === 0) {
      return { valid: false, error: "Email domain cannot receive mail" };
    }
  } catch {
    return { valid: false, error: "Invalid email domain" };
  }

  return { valid: true };
}
