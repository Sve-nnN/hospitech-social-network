// Store de autenticación (ejemplo base)
import { writable } from 'svelte/store';
import type { IUser } from '../Domain/User';

export const authStore = writable<{ user: IUser | null; token: string | null }>({
	user: null,
	token: null
});
