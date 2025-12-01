import { describe, it, expect, vi } from 'vitest';
import { httpClient } from '../Infrastructure/HttpClient';

describe('httpClient', () => {
	global.fetch = vi.fn(async (url, opts) => {
		if (opts && opts.method === 'POST') {
			return {
				ok: true,
				json: async () => ({ result: 'posted', body: JSON.parse(opts.body) })
			} as Response;
		}
		return {
			ok: true,
			json: async () => ({ result: 'fetched', url })
		} as Response;
	});

	it('get realiza un fetch y retorna datos', async () => {
		const data = await httpClient.get('/api/test');
		expect(data.result).toBe('fetched');
		expect(data.url).toBe('/api/test');
	});

	it('post realiza un fetch y retorna datos', async () => {
		const data = await httpClient.post('/api/test', { foo: 'bar' });
		expect(data.result).toBe('posted');
		expect(data.body.foo).toBe('bar');
	});
});
