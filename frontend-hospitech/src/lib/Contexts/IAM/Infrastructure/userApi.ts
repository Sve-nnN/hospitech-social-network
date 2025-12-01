export interface UserApiResult {
    ok: boolean;
    status: number;
    data: any;
}

export class UserApi {
    static async followUser(targetId: string, fetch: typeof globalThis.fetch, token?: string): Promise<UserApiResult> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/users/follow-user', {
            method: 'POST',
            headers,
            body: JSON.stringify({ targetId })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    static async followHotel(hotelId: string, fetch: typeof globalThis.fetch, token?: string): Promise<UserApiResult> {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/users/follow-hotel', {
            method: 'POST',
            headers,
            body: JSON.stringify({ hotelId })
        });
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }
}
