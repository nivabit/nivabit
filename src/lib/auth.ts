import jwt from "jsonwebtoken";
import type { AdminPayload } from "./types/admin.type";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "supersecret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refreshsecret";

export function generateAccessToken(admin: AdminPayload) {
  return jwt.sign(
    { id: admin.id, role: admin.role, email: admin.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

export function generateRefreshToken(admin: AdminPayload) {
  return jwt.sign(
    { id: admin.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
