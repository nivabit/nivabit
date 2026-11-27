import { form, query, getRequestEvent } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { desc } from 'drizzle-orm';
import { db, contacts } from '#lib/server/db/index.ts';
import { requireUser } from '#lib/server/auth.ts';
import { transporter, mailOptions } from '#lib/server/email.ts';
import { generateEmailContent } from '#lib/server/emailContent.ts';
import { contactSchema } from '#lib/validation/validation.ts';

export const submitContact = form(contactSchema, async (data) => {
	const payload = {
		name: data.name,
		email: data.email,
		services: data.services || '',
		subject: data.subject || 'Lead from contact',
		message: data.message
	};

	try {
		await db.insert(contacts).values(payload);

		// 1. Notify admin
		await transporter.sendMail({
			...mailOptions,
			...generateEmailContent(payload),
			subject: payload.subject
		});

		// 2. Send confirmation to user
		await transporter.sendMail({
			from: mailOptions.from,
			to: payload.email,
			subject: "We've received your message",
			text: `Hello ${payload.name},\n\nThank you for reaching out to Nivabit. Your message has been received and our team will get back to you within 24 hours.\n\nBest regards,\nThe Nivabit Team`,
			html: `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="UTF-8"><title>Message Received - Nivabit</title></head>
  <body style="margin:0;padding:0;background-color:#f8f8f6;font-family:Arial,sans-serif;color:#111;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f8f6;padding:40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e5e0;">
            <tr>
              <td style="background:#0B0F1A;padding:24px 40px;" align="center">
                <span style="color:#60A5FA;font-size:20px;font-weight:800;letter-spacing:-0.02em;">Nivabit</span>
              </td>
            </tr>
            <tr>
              <td style="padding:36px 40px;">
                <h2 style="margin:0 0 16px;color:#111;">Hello ${payload.name},</h2>
                <p style="font-size:15px;line-height:1.6;color:#52524e;">
                  Thank you for reaching out to <strong>Nivabit</strong>. We've received your validation sprint inquiry and our research team will get back to you within 24 hours.
                </p>
                <table cellpadding="0" cellspacing="0" style="width:100%;margin-top:24px;border:1px solid #e5e5e0;border-radius:8px;">
                  <tr>
                    <td style="padding:12px;background:#f8f8f6;font-weight:bold;width:120px;">Modules</td>
                    <td style="padding:12px;background:#fff;">${payload.services || 'General Validation Inquiry'}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px;background:#f8f8f6;font-weight:bold;">Message</td>
                    <td style="padding:12px;background:#fff;">${payload.message}</td>
                  </tr>
                </table>
                <p style="margin-top:32px;font-size:15px;color:#111;">Best regards,<br/><strong>The Nivabit Team</strong></p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px;background:#f8f8f6;text-align:center;font-size:12px;color:#787872;">
                &copy; ${new Date().getFullYear()} Nivabit. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
		});

		return { success: true, message: 'Message sent successfully.' };
	} catch (err: any) {
		console.error('submitContact error:', err);
		return invalid(err?.message || 'Unable to send message right now. Please try again.');
	}
});

export const getContacts = query(async () => {
	const event = getRequestEvent();
	await requireUser(event);

	return db.select().from(contacts).orderBy(desc(contacts.createdAt));
});
