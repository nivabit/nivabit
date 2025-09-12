import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export function formatZodError(error: ZodError) {
	return error.errors.map((e) => ({
		field: e.path.join('.'),
		message: e.message
	}));
}


export function errorResponse(message: string, status = 400, details: any[] = []) {
	return json({ success: false, error: message, details }, { status });
}
