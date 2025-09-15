// import { getAuthCookie, removeAuthCookie, removeRefreshCookie, removeUserCookie } from '';
import { isTokenExpired, refreshToken } from '$lib/server/token';
import {
	clearAuthCookie,
	clearRefreshCookie,
	clearUserCookie,
	getAuthCookie
} from '$lib/utils/auth';
import { redirect, type Cookies } from '@sveltejs/kit';

interface RequestOptions {
	method?: string;
	body?: Record<string, unknown> | FormData;
	headers?: Record<string, string>;
	queryParams?: Record<string, any>;
	auth?: boolean; // ✅ only if true → attach token from cookies
}

export class ApiService {
	private baseUrl: string;
	private cookies?: Cookies;
	private fetch: typeof globalThis.fetch;

	constructor(
		fetchFn: typeof globalThis.fetch = fetch,
		cookies?: Cookies,
		baseUrl: string = '/api'
	) {
		this.baseUrl = baseUrl;
		this.cookies = cookies;
		this.fetch = fetchFn;
	}

	private async getValidToken(): Promise<string | undefined | null> {
		if (!this.cookies) return null;

		let token = getAuthCookie(this.cookies);
		if (!token) return null;

		if (isTokenExpired(token)) {
			
			await refreshToken(this.cookies, this.baseUrl);
			token = getAuthCookie(this.cookies);
		}

		return token;
	}

	private async getAuthHeaders(auth: boolean = false): Promise<Record<string, string>> {
		if (!auth) return {};

		const token = await this.getValidToken();
		if (!token) {
			clearAuthCookie(this.cookies!);
			clearRefreshCookie(this.cookies!);
			clearUserCookie(this.cookies!);
			redirect(303, '/bits/admin/auth/login');
		}

		return { Authorization: `Bearer ${token}` };
	}

	private async prepareRequest(options: RequestOptions) {
		let headers: Record<string, string> = {};

		const isFormData = options.body instanceof FormData;
		if (!isFormData && options.method !== 'DELETE') {
			headers['Content-Type'] = 'application/json';
		}

		// ✅ add auth headers only if requested
		if (options.auth) {
			const authHeaders = await this.getAuthHeaders(options.auth);
			headers = { ...headers, ...authHeaders };
		}

		return {
			headers: { ...headers, ...(options.headers || {}) },
			body: isFormData ? options.body : options.body ? JSON.stringify(options.body) : undefined
		};
	}

	private buildUrl(endpoint: string, queryParams?: Record<string, any>): string {
		if (!queryParams) return `${this.baseUrl}${endpoint}`;

		const filtered = Object.fromEntries(
			Object.entries(queryParams)
				.filter(([_, v]) => v !== undefined && v !== null)
				.map(([k, v]) => [k, String(v)])
		);

		const qs = new URLSearchParams(filtered).toString();
		return qs ? `${this.baseUrl}${endpoint}?${qs}` : `${this.baseUrl}${endpoint}`;
	}

	private async handleResponse<T>(res: Response): Promise<T> {
		if (!res.ok) {
			console.log("hhhhhhhhhhhhhhhhhhhhhhh", res);
			
			const text = await res.text();
			let error;
			try {
				error = JSON.parse(text);
			} catch {
				error = { message: text };
			}
			throw new Error(JSON.stringify(error));
		}

		const ct = res.headers.get('content-type');
		if (ct && ct.includes('application/json')) return (await res.json()) as T;

		return { message: await res.text(), success: true } as unknown as T;
	}

	async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
		const req = await this.prepareRequest({ ...options, method: 'GET' });
		const res = await this.fetch(this.buildUrl(url, options.queryParams), {
			method: 'GET',
			headers: req.headers
		});
		return this.handleResponse<T>(res);
	}

	async post<T>(url: string, options: RequestOptions = {}): Promise<T> {
		const req = await this.prepareRequest({ ...options, method: 'POST' });
		const res = await this.fetch(this.buildUrl(url, options.queryParams), {
			method: 'POST',
			headers: req.headers,
			body: req.body as BodyInit
		});
		return this.handleResponse<T>(res);
	}

	async put<T>(url: string, options: RequestOptions = {}): Promise<T> {
		const req = await this.prepareRequest({ ...options, method: 'PUT' });
		const res = await this.fetch(this.buildUrl(url, options.queryParams), {
			method: 'PUT',
			headers: req.headers,
			body: req.body as BodyInit
		});
		return this.handleResponse<T>(res);
	}

	async patch<T>(url: string, options: RequestOptions = {}): Promise<T> {
		const req = await this.prepareRequest({ ...options, method: 'PATCH' });
		const res = await this.fetch(this.buildUrl(url, options.queryParams), {
			method: 'PATCH',
			headers: req.headers,
			body: req.body as BodyInit
		});
		return this.handleResponse<T>(res);
	}

	async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
		const req = await this.prepareRequest({ ...options, method: 'DELETE' });
		const res = await this.fetch(this.buildUrl(url, options.queryParams), {
			method: 'DELETE',
			headers: req.headers,
			body: req.body as BodyInit
		});
		return this.handleResponse<T>(res);
	}
}

// ✅ Singleton you can import everywhere
export const apiService = new ApiService();
