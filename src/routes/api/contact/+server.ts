
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
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data),
      subject: data.subject,
    });

    return json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error('Email send error:', err);
    return json({ message: err.message }, { status: 400 });
  }
};
