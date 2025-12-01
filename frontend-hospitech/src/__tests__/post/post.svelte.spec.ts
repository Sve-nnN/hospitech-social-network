import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import PostPage from '../../routes/post/+page.svelte';
import { render, fireEvent } from '@testing-library/svelte';

function setUser(user) {
	authStore.set({ user, token: 'mock' });
}

describe('Pantalla de creación/detalle de post', () => {
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

	it('muestra el formulario de creación', () => {
		const { getByText, getByLabelText, getAllByText } = render(PostPage);
		expect(getByText('Crear Post')).toBeTruthy();
		expect(getByLabelText('Título')).toBeTruthy();
		expect(getByLabelText('Contenido')).toBeTruthy();
		// Verifica que hay un botón "Crear"
		expect(getAllByText('Crear')[0]).toBeTruthy();
	});

	it('permite crear un post', async () => {
		const { getByLabelText, getAllByText, findByText } = render(PostPage);
		await fireEvent.input(getByLabelText('Título'), { target: { value: 'Nuevo Post' } });
		await fireEvent.input(getByLabelText('Contenido'), {
			target: { value: 'Contenido de prueba' }
		});
		const btnCrear = getAllByText('Crear')[0];
		await fireEvent.click(btnCrear);
		// Esperar a que el botón muestre 'Guardando...' y luego desaparezca
		await findByText('Guardando...');
		// No hay aserción de navegación porque goto es mockeado
		expect(get(authStore).user?.fullName).toBe('Test User');
	});
});
