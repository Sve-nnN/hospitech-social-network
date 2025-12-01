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
import User from './lib/Contexts/IAM/Domain/User'; // We need the mongoose model. Wait, the path is backend/src/models/User.js. But this is frontend code running in SvelteKit server.
// SvelteKit server cannot directly access backend models if they are in a separate folder outside src unless configured.
// The user has a monorepo structure: backend and frontend-hospitech.
// Accessing backend/src/models/User.js from frontend-hospitech/src/hooks.server.js might be tricky if not built together or if imports are restricted.
// However, the user said "The USER's OS version is windows. The user has 1 active workspaces... x:\Web\hospitech-social-network".
// If I import from `../../../backend/src/models/User.js`, it might work if Node can resolve it.
// BUT, `hooks.server.js` runs in the SvelteKit server (Vite).
// If I cannot import the Mongoose model directly (because of different environments/dependencies), I should use an API call to the backend to get the current user.
// The backend is running on port 3000.
// So `hooks.server.js` should make a fetch request to `http://backend:3000/api/auth/me` or similar, or just use the token to fetch the user.
// Actually, `hooks.server.js` runs on the server, so it can make HTTP requests to the backend container.

export async function handle({ event, resolve }) {
    const token = event.cookies.get('jwt');
    
    if (token) {
        // console.log('[hooks] Cookie jwt: Found');
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Fetch fresh user data from backend
            // We assume backend is accessible at http://backend:3000 inside Docker network
            // Or localhost:3000 if running locally. The user is using Docker Compose.
            // Service name is 'backend'.
            
            try {
                const res = await fetch('http://backend:3000/api/users/me', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const user = await res.json();
                    event.locals.user = user;
                    event.locals.token = token;
                    // console.log('[hooks] User refreshed from backend:', user.email);
                } else {
                    // If backend rejects token (e.g. user deleted), clear cookie
                     console.log('[hooks] Backend rejected token');
                     event.cookies.delete('jwt', { path: '/' });
                }
            } catch (fetchError) {
                console.error('[hooks] Error fetching user from backend:', fetchError.message);
                // Fallback to decoded token if backend is unreachable, but warn
                event.locals.user = decoded;
                event.locals.token = token;
            }

        } catch (err) {
            console.log('[hooks] JWT verification failed:', err.message);
            event.cookies.delete('jwt', { path: '/' });
        }
    } else {
        // console.log('[hooks] Cookie jwt: Missing');
        if (!event.url.pathname.startsWith('/auth')) {
             return Response.redirect(`${event.url.origin}/auth`, 303);
        }
    }

    return resolve(event);
}
