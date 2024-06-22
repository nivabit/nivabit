import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;
export const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
                user: email,
                pass,
        },
});

export const mailOptions = {
        from: email,
        to: email,
};

export type contactType = { name: string, services?: string[], email: string, subject: string, message?: string, company?: string }

