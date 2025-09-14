import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
	const admin = await requireUser(event);

	try {
		return json({
			id: admin.id,
			name: admin.name,
			role: admin.role,
			email: admin.email,
			phone: admin.phone
		});
	} catch {
		return json({ error: 'Invalid or expired token' }, { status: 403 });
	}
};
