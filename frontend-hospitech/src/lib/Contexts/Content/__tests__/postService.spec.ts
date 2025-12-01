import { describe, it, expect, vi } from 'vitest';
import { PostService } from '../Application/postService';
import type { IPost } from '../Domain/Post';

describe('PostService', () => {
	function createMockResponse(ok: boolean, data: any) {
		return {
			ok,
			status: ok ? 200 : 400,
			json: async () => data,
			headers: new Headers(),
			redirected: false,
			statusText: ok ? 'OK' : 'Bad Request',
			type: 'basic',
			url: '',
			clone() {
				return this;
			},
			body: null,
			bodyUsed: false,
			arrayBuffer: async () => new ArrayBuffer(0),
			blob: async () => new Blob(),
			formData: async () => new FormData(),
			text: async () => JSON.stringify(data)
		} as Response;
	}
	const fetchOk = vi.fn(async () =>
		createMockResponse(true, {
			id: '1',
			content: 'Test',
			rating: 5,
			hotelId: 'h1',
			userId: 'u1',
			createdAt: '2025-11-30'
		})
	);
	const fetchFail = vi.fn(async () => createMockResponse(false, {}));

	it('getPost retorna un post si ok', async () => {
		const post = await PostService.getPost({ postId: '1', fetch: fetchOk });
		expect(post).toBeTruthy();
		expect(post?.id).toBe('1');
	});

	it('getPost retorna null si error', async () => {
		const post = await PostService.getPost({ postId: 'fail', fetch: fetchFail });
		expect(post).toBeNull();
	});

	it('savePost retorna el post guardado si ok', async () => {
		const post: Partial<IPost> = { content: 'Nuevo', rating: 4 };
		const saved = await PostService.savePost({ post, fetch: fetchOk });
		expect(saved).toBeTruthy();
		expect(saved?.content).toBe('Test');
	});

	it('savePost retorna null si error', async () => {
		const post: Partial<IPost> = { content: 'Error', rating: 1 };
		const saved = await PostService.savePost({ post, fetch: fetchFail });
		expect(saved).toBeNull();
	});
});
