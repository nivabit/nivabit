
import { json } from '@sveltejs/kit';
import { transporter, mailOptions, type contactType } from '$lib/server/email';
import { generateEmailContent } from '$lib/server/emailContent'; // or wherever you put it
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  const data = (await request.json()) as contactType;

  // Basic validation
  if (!data || !data.name || !data.email || !data.subject || !data.message) {
    return json({ message: 'Bad request' }, { status: 400 });
  }

  try {
    // 1. Send to admin
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data),
      subject: data.subject,
    });

    // 2. Send confirmation to user
    await transporter.sendMail({
      from: mailOptions.from,
      to: data.email, // send to user
      subject: "We've received your message",
      text: `Hello ${data.name},\n\nThank you for reaching out to us. Your message has been received and our team will get back to you as soon as possible.\n\nBest regards,\nThe Nivabit Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color:#333;">Hello ${data.name},</h2>
          <p>Thank you for contacting <strong>Nivabit</strong>. We’ve received your message and our team will review it shortly.</p>
          <p>Here’s a summary of your submission:</p>
          <ul>
            <li><strong>Subject:</strong> ${data.subject}</li>
            <li><strong>Message:</strong> ${data.message}</li>
          </ul>
          <p>We’ll be in touch soon. If this is urgent, feel free to reply directly to this email.</p>
          <br/>
          <p>Best regards,<br/>The Nivabit Team</p>
        </div>
      `,
    });

    return json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Email send error:', err);
    return json({ message: err.message }, { status: 400 });
  }
};
