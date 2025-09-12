import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "$lib/server/prisma";

export const GET: RequestHandler = async () => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: "desc" }
    });

    return json({ success: true, subscribers });
  } catch (err) {
    console.error(err);
    return json({ error: "Something went wrong" }, { status: 500 });
  }
};
