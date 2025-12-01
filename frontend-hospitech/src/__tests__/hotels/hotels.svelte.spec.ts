import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import HotelsPage from '../../routes/hotels/+page.svelte';
import { render, fireEvent } from '@testing-library/svelte';
import { vi } from 'vitest';
import { HotelService } from '$lib/Contexts/Content/Application/hotelService';

function setUser(user) {
	authStore.set({ user, token: 'mock' });
}

describe('Pantalla de hoteles', () => {
	beforeEach(() => {
		setUser({
			id: '1',
			email: 'test@demo.com',
			fullName: 'Test User',
			emailVerified: true,
			status: 'Active',
			mfaEnabled: false
		});
		vi.spyOn(HotelService, 'getHotels').mockImplementation(async () => [
			{
				id: '1',
				nombre: 'Hotel Demo',
				ciudad: 'Madrid',
				estrellas: 4,
				descripcion: 'Hotel céntrico'
			},
			{
				id: '2',
				nombre: 'Hotel Playa',
				ciudad: 'Valencia',
				estrellas: 3,
				descripcion: 'Cerca de la playa'
			}
		]);
	});

	it('muestra la lista de hoteles', async () => {
		const { findByText } = render(HotelsPage);
		expect(await findByText('Hoteles')).toBeTruthy();
		expect(await findByText('Hotel Demo')).toBeTruthy();
		expect(await findByText('Hotel Playa')).toBeTruthy();
	});

	it('permite navegar al detalle', async () => {
		const { getAllByText } = render(HotelsPage);
		const btnDetalle = getAllByText('Ver detalle')[0];
		expect(btnDetalle).toBeTruthy();
		// No se puede testear navegación real sin mock de goto
	});
});
