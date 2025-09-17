import { getAuthCookie, getUserCookie } from '$lib/utils/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const handle: Handle = async ({ event, resolve }) => {
	const user = getUserCookie(event.cookies) || null;

	if (event.url.pathname.startsWith('/bits/admin/dashboard')) {
		const token = getAuthCookie(event.cookies);
		if (!token && !user) {
			throw redirect(303, '/');
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
