import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { sendMail } from "$lib/server/mailer";
import { requireUser } from "$lib/server/auth";
import mjml2html from "mjml";

export const POST: RequestHandler = async (event) => {
  const admin = await requireUser(event);
        
  if (!admin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await event.request.formData();
  const subject = formData.get('subject')?.toString() ?? '';
  const message = formData.get('message')?.toString() ?? '';

  if (!subject || !message) {
    return json({ error: "Subject and message are required" }, { status: 400 });
  }

  try {
    // compile MJML -> HTML
    const { html, errors } = mjml2html(message, { validationLevel: "soft" });
    if (errors && errors.length) {
      console.warn("MJML validation warnings:", errors);
    }

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
          text: "This email requires an HTML viewer",
          html
        })
      )
    );

    return json({ success: true, message: "Promotional email sent to all subscribers" });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
