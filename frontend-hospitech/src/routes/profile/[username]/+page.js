import { error } from '@sveltejs/kit';

export const load = async ({ params, fetch }) => {
    const { username } = params;
    
    try {
        // Fetch user by username
        const userRes = await fetch(`/api/users/username/${username}`);
        
        if (!userRes.ok) {
            throw error(userRes.status, 'User not found');
        }

        const user = await userRes.json();
        
        // Fetch user's posts
        const postsRes = await fetch(`/api/posts/user/${user._id}`);
        
        if (!postsRes.ok) {
            throw error(postsRes.status, 'Could not load posts');
        }

        const postsData = await postsRes.json();

        return {
            user,
            posts: postsData.posts || []
        };
    } catch (e) {
        console.error(e);
        throw error(500, 'Error loading profile');
    }
};
