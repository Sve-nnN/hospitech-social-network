import { describe, it, expect, vi } from 'vitest';
import { HotelService } from '../Application/hotelService';
import type { IHotel } from '../Domain/Hotel';

describe('HotelService', () => {
	function createMockResponse(ok: boolean, data: any) {
		return {
			ok,
			status: ok ? 200 : 400,
			json: async () => data,
			headers: new Headers(),
			redirected: false,
			statusText: ok ? 'OK' : 'Bad Request',
			type: 'basic',
			url: '',
			clone() {
				return this;
			},
			body: null,
			bodyUsed: false,
			arrayBuffer: async () => new ArrayBuffer(0),
			blob: async () => new Blob(),
			formData: async () => new FormData(),
			text: async () => JSON.stringify(data)
		} as Response;
	}
	const fetchOk = vi.fn(async () =>
		createMockResponse(true, [
			{ id: '1', name: 'Hotel Demo', address: 'Calle 1', avgRating: 4.5, reviewCount: 10 }
		])
	);
	const fetchOneOk = vi.fn(async () =>
		createMockResponse(true, {
			id: '1',
			name: 'Hotel Demo',
			address: 'Calle 1',
			avgRating: 4.5,
			reviewCount: 10
		})
	);
	const fetchFail = vi.fn(async () => createMockResponse(false, {}));

	it('getHotels retorna lista si ok', async () => {
		const hotels = await HotelService.getHotels({ fetch: fetchOk });
		expect(hotels).toBeTruthy();
		expect(hotels.length).toBe(1);
		expect(hotels[0].id).toBe('1');
	});

	it('getHotels retorna [] si error', async () => {
		const hotels = await HotelService.getHotels({ fetch: fetchFail });
		expect(hotels).toEqual([]);
	});

	it('getHotel retorna hotel si ok', async () => {
		const hotel = await HotelService.getHotel({ hotelId: '1', fetch: fetchOneOk });
		expect(hotel).toBeTruthy();
		expect(hotel?.id).toBe('1');
	});

	it('getHotel retorna null si error', async () => {
		const hotel = await HotelService.getHotel({ hotelId: 'fail', fetch: fetchFail });
		expect(hotel).toBeNull();
	});
});
