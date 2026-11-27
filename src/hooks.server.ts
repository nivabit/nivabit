import { clearAllAuthCookies, getAuthCookie, getUserCookie } from '#lib/utils/auth.ts';
import { authorize } from '#lib/server/auth.ts';
import { redirect, type Handle } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const handle: Handle = async ({ event, resolve }) => {
	let user = getUserCookie(event.cookies) || null;

	// Backwards compatibility: redirect legacy /bits routes to /ceo
	if (event.url.pathname.startsWith('/bits')) {
		const newPath = event.url.pathname.replace(/^\/bits(\/admin(\/dashboard)?)?/, '/ceo');
		throw redirect(301, newPath || '/ceo');
	}

	// CEO route protection with silent token refresh & 5-min idle timeout
	const isCeoAuthRoute =
		event.url.pathname === '/ceo/login' ||
		event.url.pathname === '/ceo/forgotpassword' ||
		event.url.pathname === '/ceo/reset-password';

	if (event.url.pathname === '/ceo' || event.url.pathname.startsWith('/ceo/')) {
		const authedUser = await authorize(event);
		const isAuthenticated = Boolean(authedUser);

		if (authedUser) {
			user = {
				id: authedUser.id,
				name: authedUser.name,
				role: authedUser.role,
				email: authedUser.email,
				phone: authedUser.phone
			};
		}

		if (!isCeoAuthRoute && !isAuthenticated) {
			if (getAuthCookie(event.cookies) || user) clearAllAuthCookies(event.cookies);
			throw redirect(303, '/ceo/login');
		}
		if (isCeoAuthRoute && isAuthenticated) {
			throw redirect(303, '/ceo');
		}
	}

	if (event.url.pathname.startsWith('/uploads/')) {
		let decodedPath: string;
		try {
			decodedPath = decodeURIComponent(event.url.pathname);
		} catch {
			decodedPath = event.url.pathname;
		}

		const uploadsRoot = path.resolve(process.cwd(), 'uploads');
		const filePath = path.resolve(process.cwd(), decodedPath.replace(/^\/+/, ''));

		if (filePath.startsWith(uploadsRoot + path.sep) && fs.existsSync(filePath)) {
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
					: ext === '.gif'
					? 'image/gif'
					: ext === '.svg'
					? 'image/svg+xml'
					: 'application/octet-stream';

			return new Response(file, {
				headers: {
					'Content-Type': contentType,
					'Cache-Control': 'public, max-age=31536000, immutable'
				}
			});
		}
	}

	event.locals.user = user;

	return resolve(event);
};
