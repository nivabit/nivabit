import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { requireUser } from "$lib/server/auth";

export const DELETE: RequestHandler = async (event) => {
  const admin = await requireUser(event);

  if (!admin) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = event.params;

  if (!id || typeof id !== 'string') {
    return json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { id } });
    if (!subscriber) {
      return json({ success: false, message: "User not found in our list" }, { status: 404 });
    }

    await prisma.newsletterSubscriber.delete({ where: { id } });

    return json({ success: true, message: "Successfully unsubscribed" });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
