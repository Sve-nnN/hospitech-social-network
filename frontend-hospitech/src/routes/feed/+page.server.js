import { redirect } from '@sveltejs/kit';

export function load({ locals }) {
    if (!locals.user) {
        throw redirect(303, '/auth');
    }
    return {
        user: locals.user
    };
}
