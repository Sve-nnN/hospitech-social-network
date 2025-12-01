/**
 * @fileoverview Server-side hooks for authentication and request handling
 * @author Juan Carlos Angulo
 * @module hooks.server
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Handles incoming requests and sets up authentication context
 * @param {Object} params - Hook parameters
 * @param {Object} params.event - SvelteKit request event
 * @param {Function} params.resolve - Function to resolve the request
 * @returns {Promise<Response>} The response object
 */
export async function handle({ event, resolve }) {
    const token = event.cookies.get('jwt');
    
    if (token) {
        console.log('[hooks] Cookie jwt: Found');
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            event.locals.user = decoded;
            console.log('[hooks] User set in locals:', decoded.email);
        } catch (err) {
            console.log('[hooks] JWT verification failed:', err.message);
            event.cookies.delete('jwt', { path: '/' });
        }
    } else {
        console.log('[hooks] Cookie jwt: Missing');
    }

    return resolve(event);
}
