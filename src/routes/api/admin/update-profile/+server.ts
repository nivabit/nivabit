import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireUser } from '$lib/server/auth';

export const PATCH: RequestHandler = async (event) => {
	const user = await requireUser(event);
	const { name, phone } = await event.request.json();

	if (!name && !phone) {
		return json({ error: 'Provide at least one field (name or phone)' }, { status: 400 });
	}

	try {
		// 🔎 Check phone uniqueness
		if (phone) {
			const existing = await prisma.admin.findUnique({
				where: { phone }
			});
			if (existing && existing.id !== user.id) {
				return json({ error: 'Phone number already in use' }, { status: 400 });
			}
		}


		const updated = await prisma.admin.update({
			where: { id: user.id },
			data: {
				...(name ? { name } : {}),
				...(phone ? { phone } : {})
			},
			select: { id: true, name: true, phone: true, email: true }
		});

		return json({ message: 'Profile updated successfully', user: updated });
	} catch (err: any) {
		return json({ error: err.message }, { status: 400 });
	}
};
