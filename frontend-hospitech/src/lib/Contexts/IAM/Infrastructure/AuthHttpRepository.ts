// Repositorio HTTP de autenticación (ejemplo base)
export class AuthHttpRepository {
	async login(email: string, password: string): Promise<any> {
		// Llamada HTTP a /api/v1/auth/login
	}
	async refresh(): Promise<any> {
		// Llamada HTTP a /api/v1/auth/refresh
	}
}
