/**
 * @fileoverview Server-side hooks for authentication and request handling
 * @author Juan Carlos Angulo
 * @module hooks.server
 */

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_fixed_2025_secure';
console.log('[hooks] JWT_SECRET prefix:', JWT_SECRET.substring(0, 3));

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
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // Fetch fresh user data from backend with timeout
            // We assume backend is accessible at http://backend:3000 inside Docker network
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout for fast fail

                const res = await fetch('http://backend:3000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    const user = await res.json();
                    event.locals.user = user;
                    event.locals.token = token;
                } else {
                    // If backend explicitly rejects token (e.g. 401), clear it
                    if (res.status === 401) {
                        console.log('[hooks] Backend rejected token (401)');
                        event.cookies.delete('jwt', { path: '/' });
                        if (!event.url.pathname.startsWith('/auth')) {
                            return Response.redirect(`${event.url.origin}/auth`, 303);
                        }
                    } else {
                        // For other errors (500, etc), fall back to decoded token
                        console.warn('[hooks] Backend error:', res.status);
                        event.locals.user = decoded;
                        event.locals.token = token;
                    }
                }
            } catch (fetchError) {
                console.error('[hooks] Backend unreachable or timeout:', fetchError.message);
                // Fallback to decoded token if backend is unreachable
                event.locals.user = decoded;
                event.locals.token = token;
            }

        } catch (err) {
            console.log('[hooks] JWT verification failed:', err.message);
            event.cookies.delete('jwt', { path: '/' });
            if (!event.url.pathname.startsWith('/auth')) {
                return Response.redirect(`${event.url.origin}/auth`, 303);
            }
        }
    } else {
        if (!event.url.pathname.startsWith('/auth')) {
            return Response.redirect(`${event.url.origin}/auth`, 303);
        }
    }

    return resolve(event);
}
