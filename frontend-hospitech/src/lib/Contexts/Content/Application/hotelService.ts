// Application service para Hotel
import type { IHotel } from '../Domain/Hotel';
import { HotelApi } from '../Infrastructure/hotelApi';
import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';

export class HotelService {
	static async getHotels({ fetch }: { fetch: typeof globalThis.fetch }): Promise<IHotel[]> {
        const hotels = await HotelApi.getHotels({ fetch });
        console.log('[HotelService] getHotels result:', hotels);
		return hotels;
	}

	static async getHotel({
		hotelId,
		fetch
	}: {
		hotelId: string;
		fetch: typeof globalThis.fetch;
	}): Promise<IHotel | null> {
        console.log('[HotelService] getHotel requesting:', hotelId);
		return await HotelApi.getHotel({ hotelId, fetch });
	}

    static async createHotel(hotelData: any, fetch: typeof globalThis.fetch, token?: string): Promise<IHotel | null> {
        return await HotelApi.createHotel(hotelData, fetch, token);
    }

    static async getHotelPosts(hotelId: string, fetch: typeof globalThis.fetch, token?: string): Promise<any[]> {
        const res = await PostApi.getHotelPosts(hotelId, fetch, token);
        return res.ok ? res.data.posts : [];
    }
}
