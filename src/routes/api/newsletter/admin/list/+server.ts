import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";
import { requireUser } from "$lib/server/auth";

export const GET: RequestHandler = async (event) => {
  try {
    const admin = await requireUser(event);
      
    if (!admin) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" }
    });

    return json({ success: true, subscribers });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
