import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/Contexts/IAM/Application/authService';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/feed');
	}
};

export const actions = {
	default: async ({ request, cookies, fetch }) => {
		const formData = await request.formData();
		const username = formData.get('username')?.toString() || '';
		const password = formData.get('password')?.toString() || '';
		const email = formData.get('email')?.toString() || '';
		const nombre = formData.get('nombre')?.toString() || '';
		const apellido = formData.get('apellido')?.toString() || '';
		const mode = formData.get('mode');
		const isRegister = mode === 'register';
		let result;
		if (isRegister) {
			result = await AuthService.register({
				username,
				password,
				email,
				nombre: nombre || undefined,
				apellido: apellido || undefined,
				fetch,
				cookies
			});
			if (!result.success) {
				console.error('Register failed:', result.message);
				return fail(400, { message: result.message });
			}
		} else {
			const isEmail = username.includes('@');
			result = await AuthService.login({
				username: isEmail ? undefined : username,
				email: isEmail ? username : undefined,
				password,
				fetch,
				cookies
			});
			if (!result.success) {
				return fail(401, { message: result.message });
			}
		}
		throw redirect(302, '/feed');
	}
};
