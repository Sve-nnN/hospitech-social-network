// Servicio de autenticación (ejemplo base)
import { authStore } from './authStore';
import type { IUser } from '../Domain/User';

export class AuthService {
	async login(email: string, password: string): Promise<void> {
		// Lógica de login (llamada a API, etc.)
		// authStore.set({ user, token })
	}
	async logout(): Promise<void> {
		// Lógica de logout
		// authStore.set({ user: null, token: null })
	}
}
