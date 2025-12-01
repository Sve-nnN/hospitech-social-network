/**
 * @fileoverview Feed page displaying user posts
 * @author Juan Carlos Angulo
 * @page Feed
 */

<script>
  import { onMount } from 'svelte';
  import { showError } from '$lib/ui/globalFeedback';
  import CreatePost from '$lib/ui/CreatePost.svelte';
  import PostCard from '$lib/ui/PostCard.svelte';
  import Skeleton from '$lib/ui/Skeleton.svelte';

  let posts = $state([]);
  let loading = $state(true);

  onMount(async () => {
    try {
      const res = await fetch('/api/posts');
      if (!res.ok) throw new Error('Error al cargar el feed');
      const data = await res.json();
      posts = data.posts || [];
    } catch (e) {
      showError(e.message);
    } finally {
      loading = false;
    }
  });
</script>

<div class="space-y-4">
  <CreatePost />

  {#if loading}
    <Skeleton variant="card" count={3} />
  {:else if posts.length === 0}
    <div class="bg-white rounded-lg border border-gray-200 p-8 text-center">
      <p class="text-gray-500">No posts yet. Be the first to share!</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each posts as post (post._id)}
        <PostCard {post} />
      {/each}
    </div>
  {/if}
</div>
