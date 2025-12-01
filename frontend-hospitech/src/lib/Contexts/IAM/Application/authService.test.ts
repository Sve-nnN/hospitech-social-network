import { describe, it, expect, vi } from 'vitest';
import { AuthService } from './authService';

function makeMockFetch({ ok, data }: { ok: boolean; data: any }) {
	return vi.fn().mockResolvedValue({
		ok,
		status: ok ? 200 : 400,
		json: async () => data
	});
}
const mockCookies = {
	set: vi.fn(),
	get: vi.fn(),
	getAll: vi.fn(),
	delete: vi.fn(),
	serialize: vi.fn()
};

describe('AuthService', () => {
	it('debe fallar login con credenciales vacías', async () => {
		const mockFetch = makeMockFetch({ ok: false, data: { message: 'Credenciales inválidas' } });
		const result = await AuthService.login({
			username: '',
			password: '',
			fetch: mockFetch,
			cookies: mockCookies
		});
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/credenciales/i);
	});

	it('debe fallar registro con password débil', async () => {
		const mockFetch = makeMockFetch({
			ok: false,
			data: { message: 'La contraseña debe tener al menos 6 caracteres' }
		});
		const result = await AuthService.register({
			username: 'test',
			password: '123',
			fetch: mockFetch,
			cookies: mockCookies
		});
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/contraseña/i);
	});

	it('debe fallar si el username ya existe', async () => {
		const mockFetch = makeMockFetch({ ok: false, data: { message: 'username ya existe' } });
		const result = await AuthService.register({
			username: 'existente',
			password: '123456',
			fetch: mockFetch,
			cookies: mockCookies
		});
		expect(result.success).toBe(false);
		expect(result.message).toMatch(/existe/i);
	});

	it('debe registrar correctamente con datos válidos', async () => {
		const mockFetch = makeMockFetch({ ok: true, data: { token: 'abc' } });
		const result = await AuthService.register({
			username: 'nuevo',
			password: '123456',
			fetch: mockFetch,
			cookies: mockCookies
		});
		expect(result.success).toBe(true);
		expect(result.token).toBe('abc');
	});

	it('debe loguear correctamente con datos válidos', async () => {
		const mockFetch = makeMockFetch({ ok: true, data: { token: 'xyz' } });
		const result = await AuthService.login({
			username: 'nuevo',
			password: '123456',
			fetch: mockFetch,
			cookies: mockCookies
		});
		expect(result.success).toBe(true);
		expect(result.token).toBe('xyz');
	});
});
