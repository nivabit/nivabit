import type { RequestEvent } from '@sveltejs/kit';

const BLOCKED_DOMAINS = new Set([
	'jmailservice.com',
	'dominatingkeywords.com',
	'dominatebanners.com',
	'aeroleads.com',
	'mailinator.com',
	'guerrillamail.com',
	'tempmail.com',
	'10minutemail.com',
	'yopmail.com',
	'sharklasers.com',
	'trashmail.com',
	'throwawaymail.com',
	'fakeinbox.com',
	'getnada.com',
	'dispostable.com',
	'maildrop.cc',
	'temp-mail.org'
]);

const SPAM_PHRASES = [
	/\b(buy|cheap)\s+(backlinks|traffic|followers|reviews)\b/i,
	/\brank\s+#?1\s+on\s+google\b/i,
	/\b(seo|link[- ]building)\s+(agency|package|service|expert)s?\b/i,
	/\bdominat(e|ing)\s+(keywords|banners|google)\b/i,
	/\bcasino\b|\bcrypto\s+recovery\b|\bwhatsapp\s+hack\b/i
];

// Sliding-window in-memory IP rate limiter: key -> array of timestamps (ms)
const rateBuckets = new Map<string, number[]>();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 3;

export function getClientIp(event: RequestEvent): string {
	const cfIp = event.request.headers.get('cf-connecting-ip');
	if (cfIp) return cfIp.trim();

	const forwarded = event.request.headers.get('x-forwarded-for');
	if (forwarded) return forwarded.split(',')[0].trim();

	try {
		return event.getClientAddress();
	} catch {
		return 'unknown';
	}
}

export function isRateLimited(event: RequestEvent, scope: string): boolean {
	const ip = getClientIp(event);
	const key = `${scope}:${ip}`;
	const now = Date.now();
	const recent = (rateBuckets.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS);

	if (recent.length >= MAX_SUBMISSIONS_PER_WINDOW) {
		rateBuckets.set(key, recent);
		return true;
	}

	recent.push(now);
	rateBuckets.set(key, recent);

	// Prevent unbounded map growth
	if (rateBuckets.size > 5000) {
		for (const [k, list] of rateBuckets) {
			const filtered = list.filter((ts) => now - ts < WINDOW_MS);
			if (filtered.length === 0) rateBuckets.delete(k);
			else rateBuckets.set(k, filtered);
		}
	}

	return false;
}

/**
 * Detects automated gibberish names like "qwBTMSSIeJfRiNrsRgYz" or "dymCdZViWXZlYdwvE"
 * while allowing real names like "ImisiOluwa", "Owonikoko", "McDonald", "De La Cruz".
 */
export function isGibberishName(name: string): boolean {
	const trimmed = name.trim();
	if (!trimmed) return false;

	// Check each whitespace-separated token
	for (const token of trimmed.split(/\s+/)) {
		if (token.length < 10) continue;

		// Count case transitions (e.g. aB or Ba) inside the token
		let caseSwitches = 0;
		for (let i = 1; i < token.length; i++) {
			const prev = token[i - 1];
			const curr = token[i];
			const prevUpper = prev >= 'A' && prev <= 'Z';
			const currUpper = curr >= 'A' && curr <= 'Z';
			const prevLower = prev >= 'a' && prev <= 'z';
			const currLower = curr >= 'a' && curr <= 'z';
			if ((prevUpper && currLower) || (prevLower && currUpper)) {
				caseSwitches++;
			}
		}

		// Real camelCase names like "ImisiOluwa" have 2-3 transitions; bot strings have 5+
		if (caseSwitches >= 5) return true;

		// 6+ consecutive English consonants in a single long token
		if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(token)) return true;
	}

	return false;
}

export function isSpamEmail(email: string): boolean {
	const normalized = email.trim().toLowerCase();
	const parts = normalized.split('@');
	if (parts.length !== 2) return true;

	const [local, domain] = parts;
	if (BLOCKED_DOMAINS.has(domain)) return true;

	// Dot-stuffed Gmail/Googlemail bot aliases like "o.si.d.e.da.w.i170@gmail.com"
	if ((domain === 'gmail.com' || domain === 'googlemail.com') && (local.match(/\./g)?.length ?? 0) >= 4) {
		return true;
	}

	return false;
}

export function isSpamMessage(message?: string): boolean {
	if (!message) return false;

	const urls = message.match(/https?:\/\/|www\./gi);
	if (urls && urls.length >= 3) return true;

	return SPAM_PHRASES.some((pattern) => pattern.test(message));
}

export type SpamCheckResult = {
	blocked: boolean;
	silentDrop: boolean;
	reason?: string;
};

export function checkSubmissionSpam(
	event: RequestEvent,
	options: {
		scope: 'contact' | 'booking' | 'newsletter';
		name?: string;
		email: string;
		message?: string;
		honeypot?: string;
		startedAt?: string | number;
	}
): SpamCheckResult {
	// 1. Honeypot filled -> definite bot (silent drop)
	if (options.honeypot && options.honeypot.trim().length > 0) {
		console.warn(`[antiSpam:${options.scope}] Blocked honeypot from ${getClientIp(event)}`);
		return { blocked: true, silentDrop: true, reason: 'honeypot' };
	}

	// 2. Submitted impossibly fast (< 2.5s after page mount) -> bot (silent drop)
	if (options.startedAt) {
		const started = Number(options.startedAt);
		if (Number.isFinite(started) && started > 0 && Date.now() - started < 2500) {
			console.warn(`[antiSpam:${options.scope}] Blocked fast submit from ${getClientIp(event)}`);
			return { blocked: true, silentDrop: true, reason: 'too_fast' };
		}
	}

	// 3. Gibberish name, blocked domain, dot-stuffed Gmail, or link-spam message -> silent drop
	if (options.name && isGibberishName(options.name)) {
		console.warn(`[antiSpam:${options.scope}] Blocked gibberish name "${options.name}"`);
		return { blocked: true, silentDrop: true, reason: 'gibberish_name' };
	}

	if (isSpamEmail(options.email)) {
		console.warn(`[antiSpam:${options.scope}] Blocked spam email "${options.email}"`);
		return { blocked: true, silentDrop: true, reason: 'spam_email' };
	}

	if (isSpamMessage(options.message)) {
		console.warn(`[antiSpam:${options.scope}] Blocked spam message from "${options.email}"`);
		return { blocked: true, silentDrop: true, reason: 'spam_message' };
	}

	// 4. Rate limit per IP (visible error for real users who double-submit repeatedly)
	if (isRateLimited(event, options.scope)) {
		console.warn(`[antiSpam:${options.scope}] Rate limited IP ${getClientIp(event)}`);
		return {
			blocked: true,
			silentDrop: false,
			reason: 'Too many submissions. Please wait a few minutes and try again.'
		};
	}

	return { blocked: false, silentDrop: false };
}
