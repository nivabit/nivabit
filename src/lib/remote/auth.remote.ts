import { form, command, getRequestEvent } from '$app/server';
import { invalid, redirect } from '@sveltejs/kit';
import argon2 from 'argon2';
import crypto from 'node:crypto';
import { prisma } from '#lib/server/prisma.ts';
import { generateAccessToken, generateRefreshToken } from '#lib/auth.ts';
import { sendMail } from '#lib/server/mailer.ts';
import {
	clearAuthCookie,
	clearRefreshCookie,
	clearUserCookie,
	setAuthCookie,
	setUserCookie
} from '#lib/utils/auth.ts';
import {
	loginSchema,
	forgotPasswordSchema,
	resetPasswordSchema
} from '#lib/validation/validation.ts';

export const loginAdmin = form(loginSchema, async ({ email, _password }) => {
	const { cookies } = getRequestEvent();

	const admin = await prisma.admin.findUnique({ where: { email } });
	if (!admin || !(await argon2.verify(admin.passwordHash, _password))) {
		return invalid('Invalid email or password.');
	}

	const accessToken = generateAccessToken(admin);
	const refreshToken = generateRefreshToken(admin);

	cookies.set('refresh_token', refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
		maxAge: 60 * 60 * 24 * 7
	});

	setAuthCookie(cookies, accessToken);
	setUserCookie(cookies, {
		id: admin.id,
		name: admin.name,
		role: admin.role,
		email: admin.email,
		phone: admin.phone
	});

	throw redirect(303, '/ceo');
});

export const logoutAdmin = command(async () => {
	const { cookies } = getRequestEvent();
	clearAuthCookie(cookies);
	clearUserCookie(cookies);
	clearRefreshCookie(cookies);
	return { success: true, redirectTo: '/ceo/login' };
});

export const forgotPassword = form(forgotPasswordSchema, async ({ email }) => {
	const { url } = getRequestEvent();
	const admin = await prisma.admin.findUnique({ where: { email } });

	if (!admin) {
		return {
			success: true,
			message: 'If this email exists, a reset link has been sent.'
		};
	}

	const token = crypto.randomBytes(32).toString('hex');
	const expiration = new Date(Date.now() + 1000 * 60 * 60);

	await prisma.admin.update({
		where: { email },
		data: { resetToken: token, resetTokenExp: expiration }
	});

	const resetLink = `${url.origin}/bits/admin/auth/reset-password?token=${token}&email=${encodeURIComponent(
		email
	)}`;

	const html = `
		<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;line-height:1.5;color:#111;">
			<h2>Password Reset Request</h2>
			<p>Click the button below to reset your administrator password (expires in 1 hour):</p>
			<p style="text-align:center;margin:28px 0;">
				<a href="${resetLink}" target="_blank" style="background:#2563EB;color:#FFFFFF;padding:12px 24px;text-decoration:none;border-radius:999px;font-weight:bold;">
					Reset Password
				</a>
			</p>
			<p style="word-break:break-all;font-size:13px;color:#52524e;">${resetLink}</p>
		</div>
	`;

	await sendMail({
		to: email,
		subject: 'Password Reset Instructions',
		text: `Use this link within 1 hour to reset your password:\n\n${resetLink}`,
		html
	});

	return {
		success: true,
		message: 'If this email exists, a reset link has been sent.'
	};
});

export const resetPassword = form(resetPasswordSchema, async ({ token, _password }) => {
	const admin = await prisma.admin.findFirst({
		where: { resetToken: token }
	});

	if (!admin || !admin.resetTokenExp) {
		return invalid('Invalid or expired reset token.');
	}

	if (admin.resetTokenExp < new Date()) {
		return invalid('Reset token has expired.');
	}

	const passwordHash = await argon2.hash(_password);
	await prisma.admin.update({
		where: { id: admin.id },
		data: {
			passwordHash,
			resetToken: null,
			resetTokenExp: null
		}
	});

	return { success: true, message: 'Password reset successful.' };
});
