/**
 * @fileoverview Server-side data loader for root layout
 * @author Juan Carlos Angulo
 * @module layout.server
 */

/**
 * Loads user data from server locals
 * @param {Object} params - Load parameters
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Object} User data object
 */
export function load({ locals }) {
    console.log('[Layout Server] Load running');
    return {
        user: locals.user || null,
        token: locals.token || null
    };
}
