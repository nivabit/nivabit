import { redirect, type Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) =>{
  if (event.url.pathname.startsWith("/bits/admin/dashboard")) {
    const token = event.cookies.get("refresh_token");
    if (!token) {
      throw redirect(303, "/");
    }
  }
  return resolve(event);
}
