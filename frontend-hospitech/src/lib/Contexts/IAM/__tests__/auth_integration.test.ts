import { describe, it, expect } from 'vitest';
import { AuthApi } from '../Infrastructure/authApi';
import fetch from 'node-fetch';

describe('Auth Integration', () => {
    const timestamp = Date.now();
    const testUser = {
        username: `testuser_${timestamp}`,
        email: `testuser_${timestamp}@example.com`,
        password: 'password123',
        nombre: 'Test',
        apellido: 'User'
    };

    it('should register a new user successfully', async () => {
        const result = await AuthApi.register({
            ...testUser,
            fetch: fetch as any,
            baseUrl: 'http://localhost:3000'
        });
        console.log('Register result:', result);
        expect(result.ok).toBe(true);
        expect(result.status).toBe(201);
        expect(result.data).toHaveProperty('username', testUser.username);
    });

    it('should login with username', async () => {
        const result = await AuthApi.login({
            username: testUser.username,
            password: testUser.password,
            fetch: fetch as any,
            baseUrl: 'http://localhost:3000'
        });
        expect(result.ok).toBe(true);
        expect(result.data).toHaveProperty('accessToken');
    });

    it('should login with email', async () => {
        const result = await AuthApi.login({
            email: testUser.email,
            password: testUser.password,
            fetch: fetch as any,
            baseUrl: 'http://localhost:3000'
        });
        expect(result.ok).toBe(true);
        expect(result.data).toHaveProperty('accessToken');
    });

    it('should fail registration with empty optional fields if sent as empty strings', async () => {
        const result = await AuthApi.register({
            username: `fail_${timestamp}`,
            email: `fail_${timestamp}@example.com`,
            password: 'password123',
            nombre: '',
            apellido: '',
            fetch: fetch as any,
            baseUrl: 'http://localhost:3000'
        });
        expect(result.status).toBe(400);
    });

    it('should register successfully with undefined optional fields', async () => {
        const result = await AuthApi.register({
            username: `opt_${timestamp}`,
            email: `opt_${timestamp}@example.com`,
            password: 'password123',
            nombre: undefined,
            apellido: undefined,
            fetch: fetch as any,
            baseUrl: 'http://localhost:3000'
        });
        expect(result.status).toBe(201);
    });
});
