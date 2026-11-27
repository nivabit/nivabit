import { eq } from 'drizzle-orm';
import { db, platformMetrics } from '#lib/server/db/index.ts';

export const PLATFORM_EMAIL_KEY = 'platform_email';

export function getDefaultPlatformEmail(): string {
	return process.env.CONTACT_EMAIL || process.env.SMTP_USERNAME || 'contact@nivabit.com';
}

export async function getPlatformEmailValue(): Promise<string> {
	try {
		const [row] = await db
			.select({ value: platformMetrics.value })
			.from(platformMetrics)
			.where(eq(platformMetrics.key, PLATFORM_EMAIL_KEY))
			.limit(1);

		if (row?.value && row.value.includes('@')) {
			return row.value.trim();
		}
	} catch (err) {
		console.error('[getPlatformEmailValue error]:', err);
	}
	return getDefaultPlatformEmail();
}
