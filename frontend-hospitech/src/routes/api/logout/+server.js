import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    cookies.delete('jwt', { path: '/' });
    return json({ success: true });
}
