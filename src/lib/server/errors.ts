import { json } from '@sveltejs/kit';
import * as v from 'valibot';

export function formatValibotIssues(issues: [v.BaseIssue<unknown>, ...v.BaseIssue<unknown>[]]) {
	const flat = v.flatten(issues);
	return Object.entries(flat.nested ?? {}).map(([field, messages]) => ({
		field,
		message: messages?.[0] ?? 'Invalid value'
	}));
}

export function errorResponse(message: string, status = 400, details: unknown[] = []) {
	return json({ success: false, error: message, details }, { status });
}
