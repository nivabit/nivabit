import { jwtDecode } from 'jwt-decode';
import { redirect, type Cookies } from '@sveltejs/kit';
import {
	AUTH_COOKIE_NAME,
	clearAllAuthCookies,
	REFRESH_COOKIE_NAME,
	setAuthCookie
} from '$lib/utils/auth';

interface TokenPayload {
	exp: number;
	[key: string]: unknown;
}

export async function refreshToken(cookies: Cookies, apiUrl: string): Promise<string | null> {
	const accessToken = cookies.get(AUTH_COOKIE_NAME);
	const refreshTokenValue = cookies.get(REFRESH_COOKIE_NAME);

	if (!refreshTokenValue) {
		clearAllAuthCookies(cookies);
		redirect(303, '/bits/admin/auth/login');
	}

	// Check if refresh token is expired
	if (isTokenExpired(refreshTokenValue)) {
		clearAllAuthCookies(cookies);
		redirect(303, '/bits/admin/auth/login');
	}

	try {
		const res = await fetch(`${apiUrl}/auth/refresh`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`
			},
			body: JSON.stringify({ token: refreshTokenValue })
		});

		if (!res.ok) {
			clearAllAuthCookies(cookies);
			redirect(303, '/bits/admin/auth/login');
		}

		const response = (await res.json()) as any;

		const newAccessToken = response?.data?.accessToken;
		const newRefreshToken = response?.data?.refreshToken;

		if (newAccessToken && newRefreshToken) {
			// Update cookies
			setAuthCookie(cookies, newAccessToken);
			return newAccessToken;
		} else {
			clearAllAuthCookies(cookies);
			redirect(303, '/bits/admin/auth/login');
		}
	} catch (err) {
		clearAllAuthCookies(cookies);
		redirect(303, '/bits/admin/auth/login');
	}
}

export function isTokenExpired(token: string): boolean {
	try {
		const decoded = jwtDecode<TokenPayload>(token);
		const currentTime = Math.floor(Date.now() / 1000);
		return decoded.exp < currentTime;
	} catch {
		return true;
	}
}
