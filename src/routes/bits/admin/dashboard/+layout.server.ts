// src/routes/bits/admin/auth/+layout.server.ts
import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {

	// if (token) {
	// 	// ✅ already signed in → send to dashboard
	// 	throw redirect(302, "/admin/dashboard");
	// }

	// ❌ no token → allow auth pages (login, forgot password, etc.)
	return {
		user: locals?.user
	};
};
