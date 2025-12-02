import { AuthApi } from './authApi';

export class AuthHttpRepository {
	async login(email: string, password: string): Promise<any> {
		return await AuthApi.login({
			email: email.includes('@') ? email : undefined,
			username: email.includes('@') ? undefined : email,
			password,
			fetch: window.fetch.bind(window)
		});
	}

	async refresh(): Promise<any> {
		// Implement refresh logic if needed, or leave as placeholder
		return { ok: false, message: 'Not implemented' };
	}
}
