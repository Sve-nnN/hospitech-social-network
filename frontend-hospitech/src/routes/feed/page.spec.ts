import { render, screen, waitFor } from '@testing-library/svelte';
import Feed from './+page.svelte';

global.fetch = vi.fn(() =>
	Promise.resolve({
		ok: true,
		json: () =>
			Promise.resolve([
				{ title: 'Post 1', content: 'Contenido 1', author: { username: 'user1' } },
				{ title: 'Post 2', content: 'Contenido 2', author: { username: 'user2' } }
			])
	})
) as any;

describe('Feed', () => {
	it('muestra posts del feed', async () => {
		render(Feed);
		await waitFor(() => {
			expect(screen.getByText('Post 1')).toBeInTheDocument();
			expect(screen.getByText('Post 2')).toBeInTheDocument();
		});
	});
});
