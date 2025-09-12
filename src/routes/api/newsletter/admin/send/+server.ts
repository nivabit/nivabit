import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { sendMail } from "$lib/server/mailer";

export const POST: RequestHandler = async ({ request }) => {
  const { subject, message } = await request.json();

  if (!subject || !message) {
    return json({ error: "Subject and message are required" }, { status: 400 });
  }

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany();
    if (subscribers.length === 0) {
      return json({ success: false, message: "No subscribers found" });
    }

    // send mails in parallel
    await Promise.all(
      subscribers.map((sub) =>
        sendMail({
          to: sub.email,
          subject,
          text: message,
          html: `<div style="font-family:sans-serif;line-height:1.5;">${message}</div>`
        })
      )
    );

    return json({ success: true, message: "Promotional email sent to all subscribers" });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
