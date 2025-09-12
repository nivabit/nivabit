import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { validateEmail } from "$lib/server/emailValidator";

export const POST: RequestHandler = async ({ request }) => {
  const { email } = await request.json();

  const { valid, error } = await validateEmail(email);
  if (!valid) return json({ error }, { status: 400 });

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (!subscriber) {
      return json({ success: false, message: "Email not found in our list" }, { status: 404 });
    }

    await prisma.newsletterSubscriber.delete({ where: { email } });

    return json({ success: true, message: "Successfully unsubscribed" });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
