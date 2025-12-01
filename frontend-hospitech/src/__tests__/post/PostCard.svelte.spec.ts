import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PostCard from '../../lib/ui/PostCard.svelte';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';

// Mock PostApi
vi.mock('$lib/Contexts/Posts/Infrastructure/postApi', () => ({
    PostApi: {
        toggleLike: vi.fn(),
        addComment: vi.fn()
    }
}));

// Mock globalFeedback
vi.mock('$lib/ui/globalFeedback', () => ({
    showError: vi.fn()
}));

describe('PostCard Component', () => {
    const mockPost = {
        _id: 'post-123',
        contenido: 'Test content',
        fecha_creacion: new Date().toISOString(),
        user_info: {
            username: 'testuser',
            imagen_perfil_url: 'http://example.com/avatar.jpg'
        },
        likes: [],
        comments: []
    };

    const mockUser = {
        id: 'user-123',
        username: 'currentuser',
        email: 'test@example.com'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        authStore.set({ user: mockUser, token: 'mock-token' });
    });

    it('renders post content correctly', () => {
        const { getByText } = render(PostCard, { post: mockPost });
        expect(getByText('Test content')).toBeTruthy();
        expect(getByText('testuser')).toBeTruthy();
    });

    it('handles like button click', async () => {
        (PostApi.toggleLike as any).mockResolvedValue({ ok: true });
        const { getAllByText } = render(PostCard, { post: mockPost });
        
        const likeButtons = getAllByText('Like');
        const likeButton = likeButtons[0];
        await fireEvent.click(likeButton);

        expect(PostApi.toggleLike).toHaveBeenCalledWith('post-123', expect.any(Function), 'mock-token');
    });

    it('toggles comment section', async () => {
        const { getAllByText, queryByPlaceholderText } = render(PostCard, { post: mockPost });
        
        const commentButtons = getAllByText('Comment');
        const commentButton = commentButtons[0];
        
        // Initially comment input should not be visible
        expect(queryByPlaceholderText('Write a comment...')).toBeFalsy();
        
        await fireEvent.click(commentButton);
        
        // After click, it should be visible
        expect(queryByPlaceholderText('Write a comment...')).toBeTruthy();
    });

});
