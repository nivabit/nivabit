import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { validateEmail } from "$lib/server/emailValidator";
import { sendMail } from "$lib/server/mailer";

function subscriptionTemplate(email: string) {
  return `
    <div style="max-width:600px;margin:auto;font-family:sans-serif;line-height:1.5;">
      <h2 style="color:#2c3e50;">🎉 Welcome to Our Newsletter!</h2>
      <p>Hi there,</p>
      <p>Thank you for subscribing with <strong>${email}</strong>. You’ll now receive our latest updates, articles, and promotions directly in your inbox.</p>
      <p>If this wasn’t you, you can safely ignore this email.</p>
      <br/>
      <p style="font-size:12px;color:gray;">&copy; ${new Date().getFullYear()} My App</p>
    </div>
  `;
}

export const POST: RequestHandler = async ({ request }) => {
  const { email } = await request.json();

  const { valid, error } = await validateEmail(email);
  if (!valid) return json({ error }, { status: 400 });

  try {
    // check if already exists
    const exists = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (exists) {
      return json({ success: false, message: "Email already subscribed" }, { status: 409 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email }
    });

    await sendMail({
      to: subscriber.email,
      subject: "Welcome to Our Newsletter",
      text: `Thank you for subscribing to our newsletter!`,
      html: subscriptionTemplate(subscriber.email)
    });

    return json({ success: true, message: "Successfully subscribed" });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
