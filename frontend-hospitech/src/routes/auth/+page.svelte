<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n';
	import { authStore } from '$lib/Contexts/IAM/Application/authStore';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	let username = '';
	let password = '';
	let email = '';
	let nombre = '';
	let apellido = '';
	let error = '';
	let fieldErrors: { [key: string]: string } = {};
	let mode: 'login' | 'register' = 'login';
	let loading = false;

	export let form: any;

	onMount(() => {
		// Check URL for mode query parameter
		const urlParams = new URLSearchParams(window.location.search);
		const urlMode = urlParams.get('type');
		if (urlMode === 'signup') {
			mode = 'register';
		}

		// Handle server-side form submissions
		if (form) {
			error = form.message || '';
			fieldErrors = {};
			if (form.errors) {
				for (const err of form.errors) {
					if (err.param) fieldErrors[err.param] = err.msg;
				}
			}
			if (form.type === 'success') {
				goto('/feed');
			}
		}
	});

	function validate() {
		const errors: { [key: string]: string } = {};
		if (mode === 'register') {
			if (!username || username.length < 3) errors.username = $t('auth.validation.usernameMin');
			if (!email || !/^\S+@\S+\.\S+$/.test(email))
				errors.email = $t('auth.validation.invalidEmail');
			if (!password || password.length < 6) errors.password = $t('auth.validation.passwordMin');
			if (!nombre || nombre.length < 2) errors.nombre = $t('auth.validation.firstNameRequired');
			if (!apellido || apellido.length < 2)
				errors.apellido = $t('auth.validation.lastNameRequired');
		} else {
			if (!username) errors.username = $t('auth.validation.usernameRequired');
			if (!password) errors.password = $t('auth.validation.passwordRequired');
		}
		return errors;
	}

	async function handleSubmit() {
		error = '';
		fieldErrors = {};
		const errors = validate();
		if (Object.keys(errors).length > 0) {
			fieldErrors = { ...errors };
			return;
		}

		loading = true;
		let formData: any = { username, password };
		if (mode === 'register') {
			formData = { ...formData, email, nombre, apellido };
		}

		try {
			// Use FormData so SvelteKit form actions (request.formData()) work
			const fd = new FormData();
			fd.append('username', username);
			fd.append('password', password);
			fd.append('mode', mode);
			if (mode === 'register') {
				fd.append('email', email);
				fd.append('nombre', nombre);
				fd.append('apellido', apellido);
			}

			// Use manual redirect handling so we can detect server-side redirects reliably
			const res = await fetch('/auth', {
				method: 'POST',
				body: fd,
				headers: {
					Accept: 'application/json'
				},
				redirect: 'manual'
			});

			// If server responded with a redirect (303/302), follow it client-side
			if (res.status >= 300 && res.status < 400) {
				const location = res.headers.get('location');
				if (location) {
					// absolute or relative URL let SvelteKit navigate
					await goto(location);
					return;
				}
			}

			// Otherwise try to parse a JSON body (for API-style responses)
			const contentType = res.headers.get('content-type') || '';
			const data = contentType.includes('application/json')
				? await res.json().catch(() => ({}))
				: {};

			if (!res.ok) {
				if (data.errors) {
					for (const err of data.errors) {
						if (err.param) fieldErrors[err.param] = err.msg;
					}
					error = $t('auth.validation.formErrors');
				} else {
					error = data.msg || data.message || $t('auth.validation.unknownError');
				}
			} else {
				if (data.user && data.token) {
					authStore.set({ user: data.user, token: data.token, loading: false, error: null });
					goto('/feed');
				} else {
					// No JSON user/token; if server didn't redirect, show unexpected response
					error = $t('auth.validation.unexpectedResponse');
				}
			}
		} catch (e) {
			console.error('Auth error:', e);
			error = $t('auth.validation.networkError');
		} finally {
			loading = false;
		}
	}

	function toggleMode() {
		mode = mode === 'login' ? 'register' : 'login';
		error = '';
		fieldErrors = {};
	}
</script>

<div class="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-background p-4 sm:p-6">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<Card.Title class="text-3xl font-bold">
				{mode === 'login' ? $t('auth.login') : $t('auth.register')}
			</Card.Title>
			<Card.Description>
				{mode === 'login' ? $t('auth.subtitle.login') : $t('auth.subtitle.register')}
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<form class="space-y-5" on:submit|preventDefault={handleSubmit}>
				<div class="grid w-full items-center gap-1.5">
					<Label for="username">{$t('auth.username')}</Label>
					<Input
						id="username"
						name="username"
						type="text"
						placeholder={$t('auth.placeholder.username')}
						bind:value={username}
						aria-invalid={!!fieldErrors.username}
					/>
					{#if fieldErrors.username}
						<p class="text-sm text-destructive">{fieldErrors.username}</p>
					{/if}
				</div>

				{#if mode === 'register'}
					<div class="grid w-full items-center gap-1.5">
						<Label for="email">{$t('auth.email')}</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder={$t('auth.placeholder.email')}
							bind:value={email}
							aria-invalid={!!fieldErrors.email}
						/>
						{#if fieldErrors.email}
							<p class="text-sm text-destructive">{fieldErrors.email}</p>
						{/if}
					</div>
					<div class="grid w-full items-center gap-1.5">
						<Label for="nombre">{$t('auth.nombre') || 'First Name'}</Label>
						<Input
							id="nombre"
							name="nombre"
							type="text"
							placeholder={$t('auth.placeholder.nombre') || 'John'}
							bind:value={nombre}
							aria-invalid={!!fieldErrors.nombre}
						/>
						{#if fieldErrors.nombre}
							<p class="text-sm text-destructive">{fieldErrors.nombre}</p>
						{/if}
					</div>
					<div class="grid w-full items-center gap-1.5">
						<Label for="apellido">{$t('auth.apellido') || 'Last Name'}</Label>
						<Input
							id="apellido"
							name="apellido"
							type="text"
							placeholder={$t('auth.placeholder.apellido') || 'Doe'}
							bind:value={apellido}
							aria-invalid={!!fieldErrors.apellido}
						/>
						{#if fieldErrors.apellido}
							<p class="text-sm text-destructive">{fieldErrors.apellido}</p>
						{/if}
					</div>
				{/if}

				<div class="grid w-full items-center gap-1.5">
					<Label for="password">{$t('auth.password')}</Label>
					<Input
						id="password"
						name="password"
						type="password"
						placeholder={$t('auth.placeholder.password')}
						bind:value={password}
						aria-invalid={!!fieldErrors.password}
					/>
					{#if fieldErrors.password}
						<p class="text-sm text-destructive">{fieldErrors.password}</p>
					{/if}
				</div>

				{#if error}
					<div class="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm" role="alert">
						<strong class="font-bold">Error!</strong>
						{error}
					</div>
				{/if}

				<Button type="submit" class="w-full" {loading}>
					{mode === 'login' ? $t('auth.login') : $t('auth.register')}
				</Button>
			</form>
		</Card.Content>

		<Card.Footer class="justify-center">
			<p class="text-sm text-muted-foreground flex items-center gap-1">
				{#if mode === 'login'}
					{$t('auth.noAccount')}
					<button
						type="button"
						on:click={toggleMode}
						class="text-primary underline-offset-4 hover:underline p-0 h-auto font-normal inline-flex items-center"
					>
						{$t('auth.registerNow')}
					</button>
				{:else}
					{$t('auth.hasAccount')}
					<button
						type="button"
						on:click={toggleMode}
						class="text-primary underline-offset-4 hover:underline p-0 h-auto font-normal inline-flex items-center"
					>
						{$t('auth.loginNow')}
					</button>
				{/if}
			</p>
		</Card.Footer>
	</Card.Root>
</div>
