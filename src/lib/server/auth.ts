import { eq } from 'drizzle-orm';
import { db, admins } from '#lib/server/db/index.ts';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import {
	AUTH_COOKIE_NAME,
	REFRESH_COOKIE_NAME,
	clearAllAuthCookies,
	isSessionIdleExpired,
	setAuthCookie,
	setLastActiveCookie,
	setUserCookie
} from '#lib/utils/auth.ts';
import {
	generateAccessToken,
	verifyAccessToken,
	verifyRefreshToken
} from '#lib/auth.ts';

async function loadAdminById(id: string) {
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
		.where(eq(admins.id, id))
		.limit(1);

	return user || null;
}

export async function authorize(event: RequestEvent) {
	const accessToken = event.cookies.get(AUTH_COOKIE_NAME);
	const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);

	if (!accessToken && !refreshToken) return null;

	// Enforce 5-minute server-side inactivity timeout
	if (isSessionIdleExpired(event.cookies)) {
		clearAllAuthCookies(event.cookies);
		return null;
	}

	// 1. Try current access token
	if (accessToken) {
		try {
			const decoded: any = verifyAccessToken(accessToken);
			if (decoded?.id) {
				const user = await loadAdminById(decoded.id);
				if (user) {
					setLastActiveCookie(event.cookies);
					return user;
				}
			}
		} catch {
			// Access token expired or invalid — fall through to refresh token
		}
	}

	// 2. Silently renew access token from refresh_token while user is active
	if (refreshToken) {
		try {
			const decoded: any = verifyRefreshToken(refreshToken);
			if (decoded?.id) {
				const user = await loadAdminById(decoded.id);
				if (user) {
					const newAccessToken = generateAccessToken(user);
					setAuthCookie(event.cookies, newAccessToken);
					setUserCookie(event.cookies, {
						id: user.id,
						name: user.name,
						role: user.role,
						email: user.email,
						phone: user.phone
					});
					setLastActiveCookie(event.cookies);
					return user;
				}
			}
		} catch {
			clearAllAuthCookies(event.cookies);
			return null;
		}
	}

	return null;
}

/**
 * Strict version: throws 401 if no user
 */
export async function requireUser(event: RequestEvent) {
	const user = await authorize(event);
	if (!user) throw error(401, 'Unauthorized');
	return user;
}
