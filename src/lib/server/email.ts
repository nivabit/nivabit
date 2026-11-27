import 'dotenv/config';
import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

const host = process.env.SMTP_HOST || 'localhost';
const port = Number(process.env.SMTP_PORT || 587);
const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASSWORD;

const transportOptions: SMTPTransport.Options = {
	host,
	port,
	...(user && pass ? { auth: { user, pass } } : {})
};

export const transporter = nodemailer.createTransport(transportOptions);

export const mailOptions = {
	get from() {
		return process.env.SMTP_USERNAME || 'noreply@nivabit.com';
	},
	get to() {
		return process.env.CONTACT_EMAIL || process.env.SMTP_USERNAME || 'contact@nivabit.com';
	}
};

export type contactType = {
	name: string;
	services?: string;
	email: string;
	subject: string;
	message?: string;
};

