/**
 * @fileoverview Hotel page data loader
 * @author Juan Carlos Angulo
 * @module hotels.page
 */

import { error } from '@sveltejs/kit';

/**
 * Loads hotel data and associated posts
 * @param {Object} params - Load parameters
 * @param {Object} params.params - Route parameters
 * @param {Function} params.fetch - SvelteKit fetch function
 * @returns {Promise<Object>} Hotel and posts data
 * @throws {Error} If hotel is not found
 */
export const load = async ({ params, fetch }) => {
    const { slug } = params;
    
    try {
        const hotelRes = await fetch(`/api/hotels/${slug}`);
        
        if (!hotelRes.ok) throw error(hotelRes.status, 'Hotel not found');

        const hotel = await hotelRes.json();
        
        const postsRes = await fetch(`/api/hotels/${hotel._id}/posts`);
        const postsData = postsRes.ok ? await postsRes.json() : { posts: [] };

        return {
            hotel,
            posts: postsData.posts || []
        };
    } catch (e) {
        console.error(e);
        throw error(500, 'Error loading hotel');
    }
};
