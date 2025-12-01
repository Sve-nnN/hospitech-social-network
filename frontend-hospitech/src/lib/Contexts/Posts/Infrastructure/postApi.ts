export interface PostApiResult {
    ok: boolean;
    status: number;
    data: any;
}

export class PostApi {
    static async toggleLike(postId: string, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch(`/api/posts/${postId}/like`, {
            method: 'POST'
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async addComment(postId: string, contenido: string, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch(`/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenido })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async sharePost(postId: string, contenido: string, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch(`/api/posts/${postId}/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contenido })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async createPost(postData: { contenido: string, rating: number, hotel_id: string, imagenes_url?: string[] }, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        
        if (res.status === 401) {
            window.location.href = '/auth';
            return { ok: false, status: 401, data: null };
        }

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }
    static async getUserPosts(userId: string, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch(`/api/posts/user/${userId}`);
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async getHotelPosts(hotelId: string, fetch: typeof globalThis.fetch): Promise<PostApiResult> {
        const res = await fetch(`/api/hotels/${hotelId}/posts`);
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }
}
