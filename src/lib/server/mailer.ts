import nodemailer from 'nodemailer';
import { renderEmailTemplate, type EmailTemplateName } from './email/renderer.ts';

const fromAddress = process.env.SMTP_USERNAME || 'contact@nivabit.com';

function createTransporter() {
	return nodemailer.createTransport({
		host: process.env.SMTP_HOST || 'localhost',
		port: Number(process.env.SMTP_PORT || 587),
		secure: Number(process.env.SMTP_PORT) === 465,
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD
		},
		logger: false,
		debug: false
	});
}

export async function sendMail({
	to,
	subject,
	text,
	html
}: {
	to: string;
	subject: string;
	text: string;
	html: string;
}) {
	try {
		const transporter = createTransporter();
		await transporter.sendMail({
			from: `"Nivabit Studio" <${fromAddress}>`,
			to,
			subject,
			text,
			html
		});
	} catch (err) {
		console.error('[sendMail error]:', err);
	}
}

export async function sendTemplatedMail({
	to,
	subject,
	template,
	context,
	text
}: {
	to: string;
	subject: string;
	template: EmailTemplateName;
	context: Record<string, any>;
	text?: string;
}) {
	const html = renderEmailTemplate(template, context);
	const plainText = text || subject;

	await sendMail({
		to,
		subject,
		text: plainText,
		html
	});
}

/**
 * Sends a broadcast to many recipients over a single pooled & rate-limited SMTP connection.
 */
export async function sendBulkMail({
	recipients,
	subject,
	text,
	html,
	batchSize = 10,
	onBatchProgress
}: {
	recipients: string[];
	subject: string;
	text: string;
	html: string;
	batchSize?: number;
	onBatchProgress?: (sent: number, failed: number) => Promise<void> | void;
}): Promise<{ sent: number; failed: number }> {
	const siteUrl = process.env.PUBLIC_SITE_URL || 'https://nivabit.com';
	const transporter = nodemailer.createTransport({
		pool: true,
		maxConnections: 5,
		maxMessages: 100,
		rateDelta: 1000,
		rateLimit: 5,
		host: process.env.SMTP_HOST || 'localhost',
		port: Number(process.env.SMTP_PORT || 587),
		secure: Number(process.env.SMTP_PORT) === 465,
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD
		},
		logger: false,
		debug: false
	});

	let sent = 0;
	let failed = 0;

	try {
		for (let i = 0; i < recipients.length; i += batchSize) {
			const batch = recipients.slice(i, i + batchSize);
			const results = await Promise.allSettled(
				batch.map((to) =>
					transporter.sendMail({
						from: `"Nivabit Studio" <${fromAddress}>`,
						to,
						subject,
						text,
						html,
						headers: {
							'List-Unsubscribe': `<${siteUrl}/#newsletter>`
						}
					})
				)
			);

			for (const res of results) {
				if (res.status === 'fulfilled') sent++;
				else {
					failed++;
					console.error('[sendBulkMail recipient error]:', res.reason);
				}
			}

			if (onBatchProgress) {
				await onBatchProgress(sent, failed);
			}
		}
	} finally {
		transporter.close();
	}

	return { sent, failed };
}
