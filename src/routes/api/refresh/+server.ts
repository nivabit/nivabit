import { json, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { verifyRefreshToken, generateAccessToken } from '$lib/auth';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('refresh_token');
	if (!token) return json({ error: 'No refresh token' }, { status: 401 });

	try {
		const payload: any = verifyRefreshToken(token);
		const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
		if (!admin) return json({ error: 'Invalid refresh token' }, { status: 403 });

		const newAccessToken = generateAccessToken(admin);
		return json({ accessToken: newAccessToken });
	} catch {
		return json({ error: 'Invalid or expired refresh token' }, { status: 403 });
	}
};
