import jwt from 'jsonwebtoken';
import { clearAllAuthCookies, getAuthCookie, getUserCookie } from '#lib/utils/auth.ts';
import { redirect, type Handle } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'supersecret';

function hasValidJwt(token: string | undefined): boolean {
	if (!token) return false;
	try {
		const decoded: any = jwt.verify(token, JWT_SECRET);
		return Boolean(decoded?.id);
	} catch {
		return false;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const user = getUserCookie(event.cookies) || null;

	// Backwards compatibility: redirect legacy /bits routes to /ceo
	if (event.url.pathname.startsWith('/bits')) {
		const newPath = event.url.pathname.replace(/^\/bits(\/admin(\/dashboard)?)?/, '/ceo');
		throw redirect(301, newPath || '/ceo');
	}

	// CEO route protection
	const isCeoAuthRoute =
		event.url.pathname === '/ceo/login' ||
		event.url.pathname === '/ceo/forgotpassword' ||
		event.url.pathname === '/ceo/reset-password';

	if (event.url.pathname === '/ceo' || event.url.pathname.startsWith('/ceo/')) {
		const token = getAuthCookie(event.cookies);
		const isAuthenticated = Boolean(user) && hasValidJwt(token);

		if (!isCeoAuthRoute && !isAuthenticated) {
			if (token || user) clearAllAuthCookies(event.cookies);
			throw redirect(303, '/ceo/login');
		}
		if (isCeoAuthRoute && isAuthenticated) {
			throw redirect(303, '/ceo');
		}
	}

	if (event.url.pathname.startsWith('/uploads/')) {
		const filePath = path.join(process.cwd(), event.url.pathname);

		if (fs.existsSync(filePath)) {
			const file = await fs.promises.readFile(filePath);
			const ext = path.extname(filePath).toLowerCase();

			// Set basic content-type headers (you can extend this)
			const contentType =
				ext === '.jpg' || ext === '.jpeg'
					? 'image/jpeg'
					: ext === '.png'
					? 'image/png'
					: ext === '.webp'
					? 'image/webp'
					: 'application/octet-stream';

			return new Response(file, {
				headers: {
					'Content-Type': contentType
				}
			});
		}
	}

	event.locals.user = user;

	return resolve(event);
};
