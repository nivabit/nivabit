import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const email = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_PASSWORD;
const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;

export const transporter = nodemailer.createTransport({
  host: host,
  port: port,
  auth: {
    user: email,
    pass: pass,
  },
} as SMTPTransport.Options);

export const mailOptions = {
  from: email,
  to: email,
};

export type contactType = { name: string; services?: string[]; email: string; subject: string; message?: string; company?: string };
