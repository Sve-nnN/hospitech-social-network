import { get } from 'svelte/store';
import { describe, it, expect, beforeEach } from 'vitest';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import HotelDetail from '../../routes/hotel/[id]/+page.svelte';
import { render } from '@testing-library/svelte';
import { vi } from 'vitest';
import { HotelService } from '$lib/Contexts/Content/Application/hotelService';

function setUser(user) {
	authStore.set({ user, token: 'mock' });
}

describe('Pantalla de detalle de hotel', () => {
	beforeEach(() => {
		setUser({
			id: '1',
			email: 'test@demo.com',
			fullName: 'Test User',
			emailVerified: true,
			status: 'Active',
			mfaEnabled: false
		});
		vi.spyOn(HotelService, 'getHotel').mockImplementation(async ({ hotelId }) => {
			if (hotelId === '1') {
				return {
					id: '1',
					nombre: 'Hotel Demo',
					ciudad: 'Madrid',
					estrellas: 4,
					descripcion: 'Hotel céntrico'
				};
			}
			return null;
		});
	});

	it('muestra los datos del hotel', async () => {
		const { findByText } = render(HotelDetail, { params: { id: '1' } });
		expect(await findByText('Detalle del Hotel')).toBeTruthy();
		expect(await findByText('Hotel Demo')).toBeTruthy();
		expect(await findByText('Madrid')).toBeTruthy();
		expect(await findByText('4')).toBeTruthy();
		expect(await findByText('Hotel céntrico')).toBeTruthy();
	});

	it('muestra error si el hotel no existe', async () => {
		const { findByText } = render(HotelDetail, { params: { id: '999' } });
		expect(await findByText('Hotel no encontrado')).toBeTruthy();
	});
});
