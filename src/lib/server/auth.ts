
import jwt from 'jsonwebtoken';
import { prisma } from '$lib/server/prisma';
import type { RequestEvent } from '@sveltejs/kit';
import { AUTH_COOKIE_NAME } from '$lib/utils/auth';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'supersecret';

export async function authorize(event: RequestEvent) {
  const token = event.cookies.get(AUTH_COOKIE_NAME);
  
  if (!token) {
    return null;
  }
  
  try {
    // 1️⃣ Decode the token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    // 2️⃣ Check if user exists in DB
    const user = await prisma.admin.findUnique({
      where: { id: decoded?.id }
    });

    if (!user) {
      return null;
    }

    return user; 
  } catch (err) {
    return null;
  }
}
