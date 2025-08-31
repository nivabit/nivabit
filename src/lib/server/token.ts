import { jwtDecode } from 'jwt-decode';
import { redirect, type Cookies } from '@sveltejs/kit';


interface TokenPayload {
	exp: number;
	[key: string]: unknown;
}


export async function refreshToken(cookies: Cookies, apiUrl: string): Promise<string | null> {
	// const refreshTokenValue = getRefreshCookie(cookies);

	// if (!refreshTokenValue) return null;

	// // check if refresh token is expired
	// if (refreshTokenValue && isTokenExpired(refreshTokenValue)) {
	// 	return null;
	// }
	
	// const token = getAuthCookie(cookies);

	// if (!token) return null;

	// const { data, error } = await trycatch(
	// 	fetch(`${apiUrl}/auth/refresh`, {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			'Authorization': `Bearer ${token}`
	// 		},
	// 		body: JSON.stringify({ token: refreshTokenValue })
	// 	})
	// );
	

	// if(error){
	// 	removeAuthCookie(cookies)
	// 	removeRefreshCookie(cookies)
	// 	removeUserCookie(cookies)
	// 	redirect(303, '/auth/sign-in');
	// }
	// const response = (await data?.json()) as RefreshResponse;

	// if(response?.statusCode == 401){
	// 	removeAuthCookie(cookies)
	// 	removeRefreshCookie(cookies)
	// 	removeUserCookie(cookies)
	// 	redirect(303, '/auth/sign-in');
	// }
	
	// let accessToken = response?.data?.accessToken;
	// let refreshToken = response?.data?.refreshToken;

	// if (accessToken && refreshToken) {
	// 	setAuthCookie(accessToken, cookies);
	// 	setRefreshCookie(refreshToken, cookies);
	// 	return accessToken;
	// }

	return null;
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