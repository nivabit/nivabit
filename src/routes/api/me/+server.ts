import { json, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { verifyAccessToken } from '$lib/auth';

const prisma = new PrismaClient();

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	if (!authHeader) return json({ error: 'Missing token' }, { status: 401 });

	const token = authHeader.split(' ')[1];
	try {
		const payload: any = verifyAccessToken(token);
		const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
		if (!admin) return json({ error: 'Admin not found' }, { status: 404 });

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
