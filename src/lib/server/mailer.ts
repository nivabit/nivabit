import nodemailer from 'nodemailer';

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
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT) || 587,
		secure: false,
		auth: {
			user: process.env.SMTP_USERNAME,
			pass: process.env.SMTP_PASSWORD
		}
	});

	await transporter.sendMail({
		from: `"My App" <${process.env.SMTP_USERNAME}>`,
		to,
		subject,
		text,
		html
	});
}
