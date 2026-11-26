import nodemailer from 'nodemailer';
import { renderEmailTemplate } from './email/renderer.ts';

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
	template: 'booking-confirmation' | 'booking-admin-notification' | 'newsletter-welcome';
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
