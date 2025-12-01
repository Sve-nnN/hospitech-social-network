import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import Profile from '../../routes/profile/+page.svelte';
import { render, fireEvent } from '@testing-library/svelte';

function setUser(user) {
	authStore.set({ user, token: 'mock' });
}

describe('Pantalla de perfil de usuario', () => {
	beforeEach(() => {
		setUser({
			id: '1',
			email: 'test@demo.com',
			fullName: 'Test User',
			emailVerified: true,
			status: 'Active',
			mfaEnabled: false
		});
	});

	it('muestra los datos del usuario', () => {
		const { getByText } = render(Profile);
		expect(getByText('Perfil de Usuario')).toBeTruthy();
		expect(getByText('Test User')).toBeTruthy();
		expect(getByText('test@demo.com')).toBeTruthy();
		expect(getByText('Activo')).toBeTruthy();
		expect(getByText('Sí')).toBeTruthy(); // Verificado
		expect(getByText('No')).toBeTruthy(); // MFA
	});

	it('permite editar y guardar el perfil', async () => {
		const { getAllByText, getByLabelText, getByText, findByText } = render(Profile);
		// Click en el primer botón 'Editar perfil'
		await fireEvent.click(getAllByText('Editar perfil')[0]);
		const inputNombre = getByLabelText('Nombre completo');
		await fireEvent.input(inputNombre, { target: { value: 'Nuevo Nombre' } });
		const btnGuardar = getByText('Guardar');
		await fireEvent.click(btnGuardar);
		// Esperar a que el nombre actualizado aparezca en el DOM
		await findByText('Nuevo Nombre');
		expect(get(authStore).user?.fullName).toBe('Nuevo Nombre');
	});
});
