import { json, type RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { errorResponse } from '$lib/server/errors';
import { sendMail } from '$lib/server/mailer';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, url }) => {
	try {
		const { email } = await request.json();

		if (!email || typeof email !== 'string') {
			return errorResponse('A valid email is required', 400);
		}

		const admin = await prisma.admin.findUnique({ where: { email } });

		// ✅ Always return same response, even if admin not found
		if (!admin) {
			return json({
				success: true,
				message: 'If this email exists, a reset link has been sent.'
			});
		}

		// Generate token + expiration
		const token = crypto.randomBytes(32).toString('hex');
		const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

		// Save token
		await prisma.admin.update({
			where: { email },
			data: { resetToken: token, resetTokenExp: expiration }
		});

		// Reset link
		const resetLink = `${url.origin}/bits/admin/auth/reset-password?token=${token}&email=${encodeURIComponent(
			email
		)}`;

		// ✅ Professional mail template
		const html = `
			<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;line-height:1.5;color:#333;">
				<h2 style="color:#2c3e50;">Password Reset Request</h2>
				<p>Hello,</p>
				<p>We received a request to reset your administrator account password. If you made this request, click the button below:</p>
				<p style="text-align:center;margin:30px 0;">
					<a href="${resetLink}" target="_blank" style="background:#2563eb;color:#fff;padding:12px 20px;text-decoration:none;border-radius:6px;font-weight:bold;">
						Reset Password
					</a>
				</p>
				<p>If the button above doesn’t work, copy and paste this link into your browser:</p>
				<p style="word-break:break-all;color:#2563eb;">${resetLink}</p>
				<p><strong>Note:</strong> This link will expire in 1 hour for your security.</p>
				<hr style="margin:30px 0;border:none;border-top:1px solid #ddd;" />
				<p style="font-size:12px;color:#777;">If you didn’t request a password reset, you can safely ignore this email.</p>
			</div>
		`;

		// Send email
		await sendMail({
			to: email,
			subject: 'Password Reset Instructions',
			text: `You requested a password reset. Use the link below within 1 hour:\n\n${resetLink}`,
			html
		});

		return json({
			success: true,
			message: 'If this email exists, a reset link has been sent.'
		});
	} catch (err) {
		console.error('Password reset error:', err);
		return errorResponse('Internal server error', 500);
	}
};
