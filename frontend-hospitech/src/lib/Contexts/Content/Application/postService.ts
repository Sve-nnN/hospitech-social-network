// Application service para Post
import type { IPost } from '../Domain/Post';
import { PostApi } from '../Infrastructure/postApi';

export class PostService {
	static async getPost({
		postId,
		fetch
	}: {
		postId: string;
		fetch: typeof globalThis.fetch;
	}): Promise<IPost | null> {
		return await PostApi.getPost({ postId, fetch });
	}

	static async savePost({
		post,
		fetch
	}: {
		post: Partial<IPost>;
		fetch: typeof globalThis.fetch;
	}): Promise<IPost | null> {
		return await PostApi.savePost({ post, fetch });
	}
}
