import { json } from '@sveltejs/kit';
import { transporter, mailOptions, type contactType } from '$lib/server/email';
import { generateEmailContent } from '$lib/server/emailContent'; // or wherever you put it
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const data = (await request.json()) as contactType;

	// Basic validation
	if (!data || !data.name || !data.email || !data.subject || !data.message) {
		return json({ message: 'Bad request' }, { status: 400 });
	}

	try {
		await prisma.contact.create({
			data: {
				name: data.name,
				services: data.services,
				email: data.email,
				subject: data.subject,
				message: data.message
			}
		});

		// 1. Send to admin
		await transporter.sendMail({
			...mailOptions,
			...generateEmailContent(data),
			subject: data.subject
		});


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
      html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Message Received - Nivabit</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: Arial, sans-serif; color: #333;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: #00042b; padding: 20px 40px;" align="center">
                      <img src="https://nivabit.com/images/nivabit.png" alt="Nivabit Logo" width="120" style="display: block;" />
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px;">
                      <h2 style="color: #333333;">Hello ${data.name},</h2>
                      <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        Thank you for contacting <strong>Nivabit</strong>. We’ve received your message and our team will get back to you as soon as possible.
                      </p>

                      <p style="font-size: 16px; margin-top: 30px;">Here’s a quick summary of your submission:</p>

                      <table cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 10px; border: 1px solid #eaeaea; border-radius: 5px;">
                        <tr>
                          <td style="padding: 12px; background-color: #fafafa; font-weight: bold;">Subject</td>
                          <td style="padding: 12px; background-color: #fff;">${data.subject}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px; background-color: #fafafa; font-weight: bold;">Message</td>
                          <td style="padding: 12px; background-color: #fff;">${data.message}</td>
                        </tr>
                      </table>

                      <p style="font-size: 16px; margin-top: 30px;">
                        We’ll be in touch soon. If your inquiry is urgent, feel free to reply directly to this email.
                      </p>

                      <p style="margin-top: 40px; font-size: 16px;">Best regards,</p>
                      <p style="font-size: 16px; font-weight: bold;">The Nivabit Team</p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 20px; background-color: #f0f0f0; text-align: center; font-size: 12px; color: #888;">
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

		return json({ success: true }, { status: 200 });
	} catch (err: any) {
		console.error('Email send error:', err);
		return json({ message: err.message }, { status: 400 });
	}
};

export const GET: RequestHandler = async () => {
	const contacts = await prisma.contact.findMany({
		orderBy: { createdAt: 'desc' }
	});
	return json(contacts);
};
