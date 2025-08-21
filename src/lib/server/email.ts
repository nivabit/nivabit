import nodemailer from 'nodemailer';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

// IMPORTANT: Only use "$env/static/private" or "$env/dynamic/private" for secrets
import { SMTP_USERNAME, SMTP_PASSWORD, SMTP_HOST, SMTP_PORT } from '$env/static/private';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
} as SMTPTransport.Options);

export const mailOptions = {
  from: SMTP_USERNAME,
  to: SMTP_USERNAME,
};

export type contactType = {
  name: string;
  services?: string;
  email: string;
  subject: string;
  message?: string;
};
