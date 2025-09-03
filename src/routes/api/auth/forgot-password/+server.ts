import { json, type RequestHandler } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { errorResponse } from "$lib/server/errors";
import { sendMail } from "$lib/server/mailer";

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, url }) => {
  try {
    const { email } = await request.json();

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      // 👌 don't reveal if email exists (for security)
      return json({ success: true, message: "If this email exists, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Save token
    await prisma.admin.update({
      where: { email },
      data: { resetToken: token, resetTokenExp: expiration }
    });

    // Send reset email
    const resetLink = `${url.origin}/reset-password?token=${token}&email=${email}`;
    await sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p>
             <p><a href="${resetLink}">Click here to reset your password</a></p>
             <p>This link will expire in 1 hour.</p>`
    });

    return json({ success: true, message: "If this email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
};
