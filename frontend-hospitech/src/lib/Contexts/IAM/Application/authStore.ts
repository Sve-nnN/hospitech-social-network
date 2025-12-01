// Store de autenticación (ejemplo base)
import { writable } from 'svelte/store';
import type { IUser } from '../Domain/User';

const STORAGE_KEY = 'hospitech_auth';

function getInitialAuth() {
	if (typeof localStorage !== 'undefined') {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) {
			try {
				return JSON.parse(raw);
			} catch {}
		}
	}
	return { user: null, token: null };
}

export const authStore = writable<{ user: IUser | null; token: string | null }>(getInitialAuth());

authStore.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
	}
});

export function logout() {
	authStore.set({ user: null, token: null });
	if (typeof localStorage !== 'undefined') {
		localStorage.removeItem(STORAGE_KEY);
	}
}
