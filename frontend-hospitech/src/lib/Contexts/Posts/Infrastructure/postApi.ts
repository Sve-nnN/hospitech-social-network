export interface PostApiResult {
    ok: boolean;
    status: number;
    data: any;
}

export class PostApi {
    static async toggleLike(postId: string, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST',
            headers
        });

        if (res.status === 401) {
            if (typeof window !== 'undefined') window.location.href = '/auth';
            return { ok: false, status: 401, data: null };
        }

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async addComment(postId: string, contenido: string, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/posts/${postId}/comment`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ contenido })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async sharePost(postId: string, contenido: string, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/posts/${postId}/share`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ contenido })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async createPost(postData: { contenido: string, rating: number, hotel_id: string, imagenes_url?: string[] }, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers,
            body: JSON.stringify(postData)
        });
        
        if (res.status === 401) {
            window.location.href = '/auth';
            return { ok: false, status: 401, data: null };
        }

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }
    static async getUserPosts(userId: string, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        
        const res = await fetch(`/api/posts/user/${userId}`, { headers });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async getHotelPosts(hotelId: string, fetch: typeof globalThis.fetch, token?: string): Promise<PostApiResult> {
        const headers: HeadersInit = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`/api/hotels/${hotelId}/posts`, { headers });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }
}
