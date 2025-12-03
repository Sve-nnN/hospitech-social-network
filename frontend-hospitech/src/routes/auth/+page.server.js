import { fail, redirect } from '@sveltejs/kit';
import { AuthService } from '$lib/Contexts/IAM/Application/authService';

export const load = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, '/feed');
	}
};

export const actions = {
	default: async ({ request, cookies, fetch }) => {
		try {
			// Support both form-encoded submissions and JSON API calls
			let username = '';
			let password = '';
			let email = '';
			let nombre = '';
			let apellido = '';
			let mode = null;

			const contentType = request.headers.get('content-type') || '';
			if (contentType.includes('application/json')) {
				const body = await request.json().catch(() => ({}));
				username = body.username || '';
				password = body.password || '';
				email = body.email || '';
				nombre = body.nombre || '';
				apellido = body.apellido || '';
				mode = body.mode || (body.type === 'register' ? 'register' : null);
			} else {
				const formData = await request.formData();
				username = formData.get('username')?.toString() || '';
				password = formData.get('password')?.toString() || '';
				email = formData.get('email')?.toString() || '';
				nombre = formData.get('nombre')?.toString() || '';
				apellido = formData.get('apellido')?.toString() || '';
				mode = formData.get('mode');
			}
			const isRegister = mode === 'register';
			console.log(`[Auth Page] Processing ${isRegister ? 'register' : 'login'} for user: ${username || email}`);

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
					console.error('[Auth Page] Register failed:', result.message);
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
				console.log('[Auth Page] AuthService.login result:', JSON.stringify(result, null, 2));
				if (!result.success) {
					return fail(401, { message: result.message });
				}
			}

			// If the request expects JSON (API/fetch), return JSON payload so client-side fetch can process it.
			const accept = request.headers.get('accept') || '';
			const reqContentType = request.headers.get('content-type') || '';
			if (accept.includes('application/json') || reqContentType.includes('application/json')) {
				return {
					type: 'success',
					user: result.user,
					token: result.token
				};
			}

			// Default: redirect for normal form submissions
			throw redirect(302, '/feed');
		} catch (err) {
			console.error('[Auth Page] Unhandled error in action:', err);
			// If it's a redirect, rethrow it as it's a control flow mechanism in SvelteKit
			if (err?.status === 302 || err?.status === 303 || err?.status === 307 || err?.status === 308) {
				throw err;
			}
			return fail(500, { message: 'Internal Server Error' });
		}
	}
};
