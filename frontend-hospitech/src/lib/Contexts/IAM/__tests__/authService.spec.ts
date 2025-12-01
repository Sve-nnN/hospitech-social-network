import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../Application/authService';

describe('AuthService', () => {
	const cookies = {
		set: vi.fn()
	};
	const fetchOk = vi.fn(async () => ({
		ok: true,
		status: 200,
		json: async () => ({ token: 'abc123' })
	}));
	const fetchFail = vi.fn(async () => ({
		ok: false,
		status: 401,
		json: async () => ({ message: 'Credenciales inválidas' })
	}));

	it('login exitoso retorna success y token', async () => {
		const result = await AuthService.login({
			username: 'user',
			password: 'pass',
			fetch: fetchOk,
			cookies
		});
		expect(result.success).toBe(true);
		expect(result.token).toBe('abc123');
	});

	it('login fallido retorna success false y mensaje', async () => {
		const result = await AuthService.login({
			username: 'user',
			password: 'wrong',
			fetch: fetchFail,
			cookies
		});
		expect(result.success).toBe(false);
		expect(result.message).toBe('Credenciales inválidas');
	});

	it('register exitoso retorna success y token', async () => {
		const result = await AuthService.register({
			username: 'new',
			password: 'pass',
			fetch: fetchOk,
			cookies
		});
		expect(result.success).toBe(true);
		expect(result.token).toBe('abc123');
	});

	it('register fallido retorna success false y mensaje', async () => {
		const result = await AuthService.register({
			username: 'new',
			password: 'bad',
			fetch: fetchFail,
			cookies
		});
		expect(result.success).toBe(false);
		expect(result.message).toBe('Credenciales inválidas');
	});
});
