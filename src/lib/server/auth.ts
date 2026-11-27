
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db, admins } from '#lib/server/db/index.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '#lib/utils/auth.ts';
import { error } from '@sveltejs/kit';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'supersecret';

export async function authorize(event: RequestEvent) {	
	const token = event.cookies.get(AUTH_COOKIE_NAME);
	if (!token) return null;

	try {
		const decoded: any = jwt.verify(token, JWT_SECRET);

		if (!decoded?.id) return null;

		const [user] = await db
			.select({
				id: admins.id,
				name: admins.name,
				email: admins.email,
				role: admins.role,
				phone: admins.phone,
				passwordHash: admins.passwordHash
			})
			.from(admins)
			.where(eq(admins.id, decoded.id))
			.limit(1);

		return user || null;
	} catch {
		return null;
	}
}

/**
 * Strict version: throws 401 if no user
 */
export async function requireUser(event: RequestEvent) {
	const user = await authorize(event);
	if (!user) throw error(401, 'Unauthorized');
	return user;
}
