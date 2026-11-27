import jwt from 'jsonwebtoken';
import type { Cookies } from '@sveltejs/kit';

export const USER_COOKIE_NAME = 'userAuthData';
export const AUTH_COOKIE_NAME = 'auth_token';
export const REFRESH_COOKIE_NAME = 'refresh_token';
export const LAST_ACTIVE_COOKIE_NAME = 'ceo_last_active';
export const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function verifyAuthToken(token: string) {
	try {
		// If you issue JWTs in your backend
		const payload = jwt.decode(token);
		return payload; // { id, name, role, ... }
	} catch (err) {
		return null;
	}
}

export function setAuthCookie(cookies: Cookies, token: string) {
	cookies.set(AUTH_COOKIE_NAME, token, {
		path: '/', // cookie is available everywhere
		httpOnly: true, // can’t be accessed by JS
		sameSite: 'lax', // CSRF protection
		secure: process.env.NODE_ENV === 'production', // only https in prod
		maxAge: 60 * 60 * 24 // 1 day
	});
}

export function setUserCookie(cookies: Cookies, user: any) {
	cookies.set(USER_COOKIE_NAME, JSON.stringify(user), {
		httpOnly: false, // can be read on client if needed
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	});
}

export function setLastActiveCookie(cookies: Cookies, timestamp = Date.now()) {
	cookies.set(LAST_ACTIVE_COOKIE_NAME, String(timestamp), {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	});
}

export function getLastActive(cookies: Cookies): number | null {
	const raw = cookies.get(LAST_ACTIVE_COOKIE_NAME);
	if (!raw) return null;
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : null;
}

export function isSessionIdleExpired(cookies: Cookies): boolean {
	const lastActive = getLastActive(cookies);
	if (!lastActive) return false;
	return Date.now() - lastActive > IDLE_TIMEOUT_MS;
}

export function clearAuthCookie(cookies: Cookies) {
	cookies.delete(AUTH_COOKIE_NAME, { path: '/' });
}

export function clearUserCookie(cookies: Cookies) {
	cookies.delete(USER_COOKIE_NAME, { path: '/' });
}

export function clearRefreshCookie(cookies: Cookies) {
	cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
}

export function clearLastActiveCookie(cookies: Cookies) {
	cookies.delete(LAST_ACTIVE_COOKIE_NAME, { path: '/' });
}

export function clearAllAuthCookies(cookies: Cookies) {
	clearRefreshCookie(cookies);
	clearAuthCookie(cookies);
	clearUserCookie(cookies);
	clearLastActiveCookie(cookies);
}

export function getUserCookie(cookies: Cookies): App.Locals['user'] | undefined {
	const user = cookies.get(USER_COOKIE_NAME);
	return user ? JSON.parse(user) : undefined;
}

export function getAuthCookie(cookies: Cookies): string | undefined {
	return cookies.get(AUTH_COOKIE_NAME);
}
