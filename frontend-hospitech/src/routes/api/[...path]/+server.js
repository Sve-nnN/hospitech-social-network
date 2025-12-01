/**
 * @fileoverview API proxy server for forwarding requests to backend
 * @author Juan Carlos Angulo
 * @module api.server
 */

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3000';

/**
 * Handles all API requests and forwards them to the backend
 * @param {Object} params - Request parameters
 * @param {Object} params.params - Route parameters
 * @param {Request} params.request - The incoming request
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Promise<Response>} The proxied response
 */
export async function GET({ params, request, locals }) {
    return proxyRequest(params, request, locals);
}

/**
 * @param {Object} params - Request parameters
 * @param {Object} params.params - Route parameters
 * @param {Request} params.request - The incoming request
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Promise<Response>} The proxied response
 */
export async function POST({ params, request, locals }) {
    return proxyRequest(params, request, locals);
}

/**
 * @param {Object} params - Request parameters
 * @param {Object} params.params - Route parameters
 * @param {Request} params.request - The incoming request
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Promise<Response>} The proxied response
 */
export async function PUT({ params, request, locals }) {
    return proxyRequest(params, request, locals);
}

/**
 * @param {Object} params - Request parameters
 * @param {Object} params.params - Route parameters
 * @param {Request} params.request - The incoming request
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Promise<Response>} The proxied response
 */
export async function DELETE({ params, request, locals }) {
    return proxyRequest(params, request, locals);
}

/**
 * @param {Object} params - Request parameters
 * @param {Object} params.params - Route parameters
 * @param {Request} params.request - The incoming request
 * @param {Object} params.locals - SvelteKit locals object
 * @returns {Promise<Response>} The proxied response
 */
export async function PATCH({ params, request, locals }) {
    return proxyRequest(params, request, locals);
}

/**
 * Proxies the request to the backend server
 * @param {Object} params - Route parameters containing the path
 * @param {Request} request - The incoming request
 * @param {Object} locals - SvelteKit locals object with user data
 * @returns {Promise<Response>} The backend response
 */
async function proxyRequest(params, request, locals) {
    const path = params.path || '';
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');

    if (locals.user?.token) {
        headers.set('Authorization', `Bearer ${locals.user.token}`);
    }

    try {
        const body = request.method !== 'GET' && request.method !== 'HEAD' 
            ? await request.text() 
            : undefined;

        const response = await fetch(backendUrl, {
            method: request.method,
            headers,
            body
        });

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('transfer-encoding');

        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders
        });
    } catch (error) {
        console.error('Proxy error:', error);
        return new Response(
            JSON.stringify({ message: 'User not found' }),
            {
                status: 502,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
