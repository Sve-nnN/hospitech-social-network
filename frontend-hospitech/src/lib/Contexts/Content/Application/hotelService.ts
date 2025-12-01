// Application service para Hotel
import type { IHotel } from '../Domain/Hotel';
import { HotelApi } from '../Infrastructure/hotelApi';

export class HotelService {
	static async getHotels({ fetch }: { fetch: typeof globalThis.fetch }): Promise<IHotel[]> {
		return await HotelApi.getHotels({ fetch });
	}

	static async getHotel({
		hotelId,
		fetch
	}: {
		hotelId: string;
		fetch: typeof globalThis.fetch;
	}): Promise<IHotel | null> {
		return await HotelApi.getHotel({ hotelId, fetch });
	}
}
