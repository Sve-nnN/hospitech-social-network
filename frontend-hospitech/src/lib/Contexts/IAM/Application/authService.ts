import type { Cookies } from '@sveltejs/kit';
import { AuthApi } from '../Infrastructure/authApi';

export interface AuthResult {
	success: boolean;
	token?: string;
	message?: string;
	user?: any;
}

export class AuthService {
	static async login({
		username,
		email,
		password,
		fetch,
		cookies
	}: {
		username?: string;
		email?: string;
		password: string;
		fetch: typeof globalThis.fetch;
		cookies: Cookies;
	}): Promise<AuthResult> {
		const apiResult = await AuthApi.login({ username, email, password, fetch });
		if (!apiResult.ok) {
			let message = apiResult.data.message || 'Error de autenticación';
			if (apiResult.data.errors && Array.isArray(apiResult.data.errors)) {
				message = apiResult.data.errors.map((e: any) => `${e.path || e.field || 'Error'}: ${e.msg || e.message}`).join(', ');
			}
			return { success: false, message };
		}
		cookies.set('jwt', apiResult.data.accessToken, { path: '/', httpOnly: true, secure: false }); // secure: false for localhost
		console.log('AuthApi.login data:', JSON.stringify(apiResult.data, null, 2));
		return { success: true, token: apiResult.data.accessToken, user: apiResult.data.user };
	}

	static async register({
		username,
		password,
		email,
		nombre,
		apellido,
		fetch,
		cookies
	}: {
		username: string;
		password: string;
		email?: string;
		nombre?: string;
		apellido?: string;
		fetch: typeof globalThis.fetch;
		cookies: Cookies;
	}): Promise<AuthResult> {
		const apiResult = await AuthApi.register({
			username,
			password,
			email,
			nombre,
			apellido,
			fetch
		});
		if (!apiResult.ok) {
			let message = apiResult.data.message || 'Error de registro';
			if (apiResult.data.errors && Array.isArray(apiResult.data.errors)) {
				message = apiResult.data.errors.map((e: any) => `${e.path || e.field || 'Error'}: ${e.msg || e.message}`).join(', ');
			}
			return { success: false, message };
		}
		if (apiResult.data.accessToken) {
            cookies.set('jwt', apiResult.data.accessToken, { path: '/', httpOnly: true, secure: false });
            return { success: true, token: apiResult.data.accessToken, user: apiResult.data.user };
        }
		return { success: true, user: apiResult.data.user || apiResult.data };
	}
}
