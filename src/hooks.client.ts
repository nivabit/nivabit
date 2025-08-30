import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const accessToken = writable<string | null>(null);
export const adminUser = writable<any>(null);

// Load from sessionStorage on app start
if (browser) {
  const stored = sessionStorage.getItem("accessToken");
  if (stored) accessToken.set(stored);
}
