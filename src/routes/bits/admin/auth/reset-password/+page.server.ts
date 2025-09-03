import type { Actions, PageServerLoad } from "./$types";
import { fail } from "@sveltejs/kit";
import { z } from "zod";
import { ApiService } from "$lib/services/ApiService";

const resetSchema = z
  .object({
    token: z.string().min(10, "Invalid token"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  resetPassword: async ({ request, fetch, cookies }) => {
    const formData = Object.fromEntries(await request.formData());
    const parsed = resetSchema.safeParse(formData);

    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        errors[err.path.join(".")] = err.message;
      });
      return fail(400, { success: false, errors });
    }

    try {
      const api = new ApiService(fetch, cookies, "/api");

      const res: any = await api.post("/auth/reset-password", {
        body: {
          token: parsed.data.token,
          newPassword: parsed.data.password,
        },
      });

      if (!res?.success) {
        return fail(400, {
          success: false,
          errors: res?.message || "Failed to reset password",
        });
      }

      return { success: true };
    } catch (err: any) {
      return fail(500, {
        success: false,
        errors: err.message || "Server error",
      });
    }
  },
};
