import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import { env } from '$env/dynamic/private';

const host = env.SMTP_HOST || process.env.SMTP_HOST || 'localhost';
const port = Number(env.SMTP_PORT || process.env.SMTP_PORT || 587);
const user = env.SMTP_USERNAME || process.env.SMTP_USERNAME;
const pass = env.SMTP_PASSWORD || process.env.SMTP_PASSWORD;

const transportOptions: SMTPTransport.Options = {
	host,
	port,
	...(user && pass ? { auth: { user, pass } } : {})
};

export const transporter = nodemailer.createTransport(transportOptions);

export const mailOptions = {
	get from() {
		return env.SMTP_USERNAME || process.env.SMTP_USERNAME || 'noreply@nivabit.com';
	},
	get to() {
		return (
			env.CONTACT_EMAIL ||
			process.env.CONTACT_EMAIL ||
			env.SMTP_USERNAME ||
			process.env.SMTP_USERNAME ||
			'contact@nivabit.com'
		);
	}
};

export type contactType = {
	name: string;
	services?: string;
	email: string;
	subject: string;
	message?: string;
};

