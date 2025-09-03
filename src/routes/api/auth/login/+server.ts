import { json, type RequestHandler } from "@sveltejs/kit";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import { generateAccessToken, generateRefreshToken } from "$lib/auth";
import { loginSchema } from "$lib/validation/validation";
import { formatZodError, errorResponse } from "$lib/server/errors";

const prisma = new PrismaClient();

export const POST: RequestHandler = async({ request, cookies }) => {
  try {
    const body = await request.json();

    // ✅ Validate
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation failed", 422, formatZodError(parsed.error));
    }

    const { email, password } = parsed.data;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await argon2.verify(admin.passwordHash, password))) {
      return errorResponse("Invalid credentials", 401);
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return json({
      success: true,
      accessToken,
      admin: {
        id: admin.id,
        name: admin.name,
        role: admin.role,
        email: admin.email,
        phone: admin.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
