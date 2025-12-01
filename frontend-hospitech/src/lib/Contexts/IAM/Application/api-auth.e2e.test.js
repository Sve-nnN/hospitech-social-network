import { describe, it, expect } from 'vitest';
import fetch from 'node-fetch';

const API = 'http://localhost:3000/api/auth';

const testUser = {
	username: 'testuser_curl',
	email: 'testuser_curl@example.com',
	password: 'testpass123',
	nombre: 'Test',
	apellido: 'Curl'
};

describe('API Auth E2E', () => {
	let createdUserId = null;

	it('debe registrar un usuario nuevo', async () => {
		const res = await fetch(`${API}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(testUser)
		});
		const data = await res.json();
		// Puede fallar si ya existe, pero debe ser 201 o 400 por duplicado
		expect([201, 400]).toContain(res.status);
		if (res.status === 201) {
			expect(data).toHaveProperty('username', testUser.username);
			createdUserId = data._id;
		} else {
			expect(data).toHaveProperty('errors');
		}
	});

	it('no debe permitir registro duplicado', async () => {
		const res = await fetch(`${API}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(testUser)
		});
		const data = await res.json();
		expect(res.status).toBe(400);
		expect(data).toHaveProperty('errors');
	});

	it('debe permitir login con usuario y password correctos', async () => {
		const res = await fetch(`${API}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: testUser.username, password: testUser.password })
		});
		const data = await res.json();
		expect(res.status).toBe(200);
		expect(data).toHaveProperty('accessToken');
		expect(data).toHaveProperty('user');
	});

	it('no debe permitir login con password incorrecto', async () => {
		const res = await fetch(`${API}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: testUser.username, password: 'wrongpass' })
		});
		const data = await res.json();
		expect(res.status).toBe(401);
		expect(data).toHaveProperty('msg');
	});

	it('elimina el usuario de prueba', async () => {
		if (!createdUserId) return;
		// Elimina el usuario directamente de la base de datos (requiere endpoint o acceso directo)
		// Aquí solo se documenta, pero en un entorno real deberías tener un endpoint de test o limpiar manualmente
		// Por ahora, solo verifica que el usuario existe
		const res = await fetch(`http://localhost:3000/api/users/${testUser.username}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' }
		});
		expect([200, 404]).toContain(res.status);
	});
});
