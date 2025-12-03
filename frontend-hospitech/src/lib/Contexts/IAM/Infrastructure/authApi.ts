// Adaptador de infraestructura para autenticación
import type { Cookies } from '@sveltejs/kit';

export interface AuthApiResult {
	ok: boolean;
	status: number;
	data: any;
}

export class AuthApi {
	static async login({
		username,
		email,
		password,
		fetch,
		baseUrl
	}: {
		username?: string;
		email?: string;
		password: string;
		fetch: typeof globalThis.fetch;
		baseUrl?: string;
	}): Promise<AuthApiResult> {
		const API_URL = baseUrl || process.env.VITE_API_URL || 'http://backend:3000';
		console.log(`[AuthApi] Login request to: ${API_URL}/api/auth/login`);
		try {
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			});
			console.log(`[AuthApi] Login response status: ${res.status}`);
			const data = await res.json();
			return { ok: res.ok, status: res.status, data };
		} catch (error: any) {
			console.error('[AuthApi] Login error:', error);
			return { ok: false, status: 500, data: { message: error.message || 'Network error' } };
		}
	}

	static async register({
		username,
		password,
		email,
		nombre,
		apellido,
		fetch,
		baseUrl
	}: {
		username: string;
		password: string;
		email?: string;
		nombre?: string;
		apellido?: string;
		fetch: typeof globalThis.fetch;
		baseUrl?: string;
	}): Promise<AuthApiResult> {
		const API_URL = baseUrl || process.env.VITE_API_URL || 'http://backend:3000';
		console.log(`[AuthApi] Register request to: ${API_URL}/api/auth/register`);
		try {
			const res = await fetch(`${API_URL}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password, email, nombre, apellido })
			});
			console.log(`[AuthApi] Register response status: ${res.status}`);
			const data = await res.json();
			return { ok: res.ok, status: res.status, data };
		} catch (error: any) {
			console.error('[AuthApi] Register error:', error);
			return { ok: false, status: 500, data: { message: error.message || 'Network error' } };
		}
	}
}
