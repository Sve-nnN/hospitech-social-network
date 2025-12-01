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
		baseUrl = 'http://backend:3000'
	}: {
		username?: string;
		email?: string;
		password: string;
		fetch: typeof globalThis.fetch;
		baseUrl?: string;
	}): Promise<AuthApiResult> {
		const res = await fetch(`${baseUrl}/api/auth/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password })
		});
		const data = await res.json();
		return { ok: res.ok, status: res.status, data };
	}

	static async register({
		username,
		password,
		email,
		nombre,
		apellido,
		fetch,
		baseUrl = 'http://backend:3000'
	}: {
		username: string;
		password: string;
		email?: string;
		nombre?: string;
		apellido?: string;
		fetch: typeof globalThis.fetch;
		baseUrl?: string;
	}): Promise<AuthApiResult> {
		const res = await fetch(`${baseUrl}/api/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password, email, nombre, apellido })
		});
		const data = await res.json();
		return { ok: res.ok, status: res.status, data };
	}
}
