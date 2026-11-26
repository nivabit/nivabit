import * as v from 'valibot';
import dns from 'node:dns/promises';

const emailSchema = v.pipe(v.string(), v.trim(), v.email('Invalid email format'));
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Validate email using Valibot + Regex + MX DNS check
 */
export async function validateEmail(email: string): Promise<{ valid: boolean; error?: string }> {
	const parsed = v.safeParse(emailSchema, email);
	if (!parsed.success) {
		return { valid: false, error: 'Invalid email format' };
	}

	if (!emailRegex.test(parsed.output)) {
		return { valid: false, error: 'Invalid email address structure' };
	}

	const domain = parsed.output.split('@')[1];
	try {
		const records = await dns.resolveMx(domain);
		if (!records || records.length === 0) {
			return { valid: false, error: 'Email domain cannot receive mail' };
		}
	} catch {
		return { valid: false, error: 'Invalid email domain' };
	}

	return { valid: true };
}
