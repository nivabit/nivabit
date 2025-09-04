import { getAuthCookie, getUserCookie } from '$lib/utils/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = ({ event, resolve }) => {
	const user = getUserCookie(event.cookies) || null;

	if (event.url.pathname.startsWith('/bits/admin/dashboard')) {
		const token = getAuthCookie(event.cookies);
		if (!token && !user) {
			throw redirect(303, '/');
		}
	}

	event.locals.user = user;

	return resolve(event);
};
