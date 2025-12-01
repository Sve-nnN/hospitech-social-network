<script>
  import PostCard from '$lib/ui/PostCard.svelte';
  import Card from '$lib/ui/Card.svelte';
  import Avatar from '$lib/ui/Avatar.svelte';
  import Badge from '$lib/ui/Badge.svelte';
  import Button from '$lib/ui/Button.svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';

  let { data } = $props();
  let user = $derived(data.user);
  let posts = $derived(data.posts);
  let currentUser = $derived($authStore.user);
  
  let isFollowing = $state(false);
  let isSubmitting = $state(false);

  $effect(() => {
      if (currentUser && user) {
          isFollowing = currentUser.following_users?.includes(user._id) || false;
      }
  });

  async function toggleFollow() {
      if (!currentUser) {
          window.location.href = '/auth';
          return;
      }

      isSubmitting = true;
      try {
          const res = await fetch('/api/users/follow-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ targetId: user._id })
          });

          if (res.ok) {
              isFollowing = !isFollowing;
          }
      } catch (e) {
          console.error('Error following user:', e);
      } finally {
          isSubmitting = false;
      }
  }
</script>

<div class="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
    {#if user}
        <Card class="mb-8">
            <div class="p-8 text-center">
                <Avatar 
                  src={user.imagen_perfil_url}
                  alt={user.username}
                  size="2xl"
                  class="mx-auto mb-4 ring-4 ring-primary-100 shadow-large"
                />
                <h1 class="font-display font-bold text-3xl text-gray-900 mb-1">{user.nombre || user.username} {user.apellido || ''}</h1>
                <p class="text-gray-500 mb-6">@{user.username}</p>
                
                {#if currentUser && currentUser.id !== user._id}
                    <Button 
                        variant={isFollowing ? 'outline' : 'primary'}
                        size="md"
                        onclick={toggleFollow}
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                {/if}
                
                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary-600">{posts.length}</div>
                        <div class="text-sm text-gray-500">Posts</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-secondary-600">{user.followers_count || 0}</div>
                        <div class="text-sm text-gray-500">Followers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-gray-900">{user.following_users_count || 0}</div>
                        <div class="text-sm text-gray-500">Following</div>
                    </div>
                </div>
            </div>
        </Card>
    {/if}

    <h2 class="font-display font-bold text-2xl text-gray-900 mb-6">Posts</h2>
    
    {#if posts.length === 0}
        <Card>
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <p class="text-gray-500">No posts yet.</p>
            </div>
        </Card>
    {:else}
        <div class="space-y-4">
            {#each posts as post (post._id)}
                <PostCard {post} />
            {/each}
        </div>
    {/if}
</div>
