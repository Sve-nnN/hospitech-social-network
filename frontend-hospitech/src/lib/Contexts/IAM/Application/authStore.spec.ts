import { get } from 'svelte/store';
import { authStore } from './authStore';
import { describe, it, expect } from 'vitest';

describe('authStore', () => {
	it('debe iniciar con user y token en null', () => {
		const value = get(authStore);
		expect(value.user).toBeNull();
		expect(value.token).toBeNull();
	});

	it('debe actualizar user y token', () => {
		authStore.set({
			user: {
				id: '1',
				email: 'a@a.com',
				fullName: 'A',
				emailVerified: true,
				status: 'Active',
				mfaEnabled: false
			},
			token: 'abc'
		});
		const value = get(authStore);
		expect(value.user?.id).toBe('1');
		expect(value.token).toBe('abc');
	});

	it('debe limpiar user y token', () => {
		authStore.set({ user: null, token: null });
		const value = get(authStore);
		expect(value.user).toBeNull();
		expect(value.token).toBeNull();
	});
});
