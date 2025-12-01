// Adaptador de infraestructura para Hotel
import type { IHotel } from '../Domain/Hotel';

export class HotelApi {
	static async getHotels({ fetch }: { fetch: typeof globalThis.fetch }): Promise<IHotel[]> {
		const res = await fetch('/api/hotels');
		if (!res.ok) return [];
		return await res.json();
	}

	static async getHotel({
		hotelId,
		fetch
	}: {
		hotelId: string;
		fetch: typeof globalThis.fetch;
	}): Promise<IHotel | null> {
		const res = await fetch(`/api/hotels/${hotelId}`);
		if (!res.ok) return null;
		return await res.json();
	}
}
