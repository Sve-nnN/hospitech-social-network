// Adaptador de infraestructura para Hotel
import type { IHotel } from '../Domain/Hotel';

export class HotelApi {
	static async getHotels({ fetch }: { fetch: typeof globalThis.fetch }): Promise<IHotel[]> {
		const res = await fetch('/api/hotels');
		if (!res.ok) return [];
		const data = await res.json();
		return data.hotels || [];
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

    static async createHotel(hotelData: any, fetch: typeof globalThis.fetch, token?: string): Promise<IHotel | null> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/hotels', {
            method: 'POST',
            headers,
            body: JSON.stringify(hotelData)
        });

        if (res.status === 401) {
            if (typeof window !== 'undefined') window.location.href = '/auth';
            return null;
        }

        if (!res.ok) return null;
        return await res.json();
    }
}
