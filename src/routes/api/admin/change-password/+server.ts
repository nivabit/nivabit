import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { requireUser } from '$lib/server/auth';
import argon2 from 'argon2';

export const PATCH: RequestHandler = async (event) => {
	const user = await requireUser(event);
	const { oldPassword, newPassword } = await event.request.json();

	if (!oldPassword || !newPassword) {
		return json({ error: 'Old and new password are required' }, { status: 400 });
	}

	// Verify old password
	const valid = await argon2.verify(user.passwordHash, oldPassword);
	if (!valid) {
		return json({ error: 'Invalid current password' }, { status: 401 });
	}

	// Hash new password
	const newHash = await argon2.hash(newPassword);

	await prisma.admin.update({
		where: { id: user.id },
		data: { passwordHash: newHash }
	});

	return json({ message: 'Password updated successfully' });
};
