
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '$lib/utils/auth';
import { error } from '@sveltejs/kit';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'supersecret';

export async function authorize(event: RequestEvent) {	
	const token = event.cookies.get(AUTH_COOKIE_NAME);
	if (!token) return null;

	try {
		const decoded: any = jwt.verify(token, JWT_SECRET);

		if (!decoded?.id) return null;

		const user = await prisma.admin.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				phone: true,
				passwordHash: true // ✅ add this line
			}
		});

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
	if (!user) throw error(401, { message: 'Unauthorized' });
	return user;
}
