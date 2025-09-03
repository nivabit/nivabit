import { json, type RequestHandler } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { errorResponse } from "$lib/server/errors";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email, token, newPassword } = await request.json();

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || admin.resetToken !== token || !admin.resetTokenExp) {
      return errorResponse("Invalid or expired token", 400);
    }

    if (admin.resetTokenExp < new Date()) {
      return errorResponse("Token has expired", 400);
    }

    // Hash new password
    const passwordHash = await argon2.hash(newPassword);

    await prisma.admin.update({
      where: { email },
      data: {
        passwordHash,
        resetToken: null,
        resetTokenExp: null
      }
    });

    return json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
};
