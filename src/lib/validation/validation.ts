import { z } from 'zod';

// 🔐 Login schema
export const loginSchema = z.object({
	email: z.string().email('Invalid email format'),
	password: z.string().min(8, 'Password must be at least 8 characters')
});

// 📱 Forgot password
export const forgotPasswordSchema = z.object({
	email: z.string().email('Invalid email format')
});

// 🔑 Reset password
export const resetPasswordSchema = z.object({
	token: z.string().min(1, 'Token is required'),
	newPassword: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(/[0-9]/, 'Password must contain at least one number')
		.regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
		.regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
});
