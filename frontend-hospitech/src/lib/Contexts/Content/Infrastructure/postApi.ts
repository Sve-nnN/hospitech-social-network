// Adaptador de infraestructura para Post
import type { IPost } from '../Domain/Post';

export class PostApi {
	static async getPost({
		postId,
		fetch
	}: {
		postId: string;
		fetch: typeof globalThis.fetch;
	}): Promise<IPost | null> {
		const res = await fetch(`/api/posts/${postId}`);
		if (!res.ok) return null;
		return await res.json();
	}

	static async savePost({
		post,
		fetch
	}: {
		post: Partial<IPost>;
		fetch: typeof globalThis.fetch;
	}): Promise<IPost | null> {
		const res = await fetch('/api/posts', {
			method: post.id ? 'PUT' : 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(post)
		});
		if (!res.ok) return null;
		return await res.json();
	}
}
