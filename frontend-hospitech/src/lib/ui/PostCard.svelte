/**
 * @fileoverview Post card component displaying user posts with interactions
 * @author Juan Carlos Angulo
 * @component PostCard
 */

<script>
  import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { showError } from '$lib/ui/globalFeedback';

  let { post } = $props();
  let user = $derived($authStore.user);

  let isLiked = $state(false);
  let likeCount = $state(0);
  let showComments = $state(false);
  let comments = $state([]);
  let newComment = $state('');
  let isSubmittingComment = $state(false);

  $effect(() => {
    if (post) {
        likeCount = post.likes?.length || 0;
        isLiked = user && post.likes?.includes(user.id);
        comments = post.comments || [];
    }
  });

  /**
   * Toggles like status for the post
   * @returns {Promise<void>}
   */
  async function handleLike() {
    if (!user) return;
    
    const originalLiked = isLiked;
    const originalCount = likeCount;
    
    isLiked = !isLiked;
    likeCount += isLiked ? 1 : -1;

    try {
        const res = await PostApi.toggleLike(post._id, fetch);
        if (!res.ok) throw new Error('Failed to like');
    } catch (e) {
        isLiked = originalLiked;
        likeCount = originalCount;
        showError('Error al dar like');
    }
  }

  /**
   * Submits a new comment on the post
   * @returns {Promise<void>}
   */
  async function handleComment() {
      if (!newComment.trim()) return;
      if (!user) return;

      isSubmittingComment = true;
      try {
          const res = await PostApi.addComment(post._id, { contenido: newComment }, fetch);
          if (res.ok) {
              const updatedPost = await res.json();
              comments = updatedPost.comments || [];
              newComment = '';
          } else {
              showError('Error al comentar');
          }
      } catch (e) {
          showError('Error al comentar');
      } finally {
          isSubmittingComment = false;
      }
  }
</script>

<div class="bg-white rounded-lg border border-gray-200 shadow-sm mb-4">
  <div class="p-4">
    <div class="flex items-center gap-3 mb-3">
      <a href={`/profile/${post.user_info?.username}`}>
        {#if post.user_info?.imagen_perfil_url}
          <img src={post.user_info.imagen_perfil_url} alt={post.user_info.username} class="w-10 h-10 rounded-full object-cover" />
        {:else}
          <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
            {post.user_info?.username?.[0]?.toUpperCase() || 'U'}
          </div>
        {/if}
      </a>
      <div class="flex-1">
        <a href={`/profile/${post.user_info?.username}`} class="font-semibold text-gray-900 hover:underline">
          {post.user_info?.username || 'Unknown'}
        </a>
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>{new Date(post.fecha_creacion).toLocaleDateString()}</span>
          {#if post.hotel_info}
            <span>·</span>
            <a href={`/hotels/${post.hotel_id}`} class="hover:underline">
              {post.hotel_info.nombre}
            </a>
          {/if}
          {#if post.rating}
            <span>·</span>
            <span class="flex items-center gap-0.5">
              <svg class="w-3 h-3 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              {post.rating}/5
            </span>
          {/if}
        </div>
      </div>
    </div>

    <p class="text-gray-900 mb-3">{post.contenido}</p>
  </div>

  {#if post.imagenes_url && post.imagenes_url.length > 0}
    <div class="w-full">
      <img src={post.imagenes_url[0]} alt="Post" class="w-full max-h-[500px] object-cover" />
    </div>
  {/if}

  <div class="px-4 py-2 flex items-center justify-between text-sm text-gray-500 border-t border-gray-200">
    <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
    <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
  </div>

  <div class="px-4 py-2 flex items-center gap-1 border-t border-gray-200">
    <button 
      onclick={handleLike}
      class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium {isLiked ? 'text-primary-600' : 'text-gray-600'}"
      aria-label="Like post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" stroke-width="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      Like
    </button>

    <button 
      onclick={() => showComments = !showComments}
      class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-600"
      aria-label="Comment on post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      Comment
    </button>

    <button 
      class="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-600"
      aria-label="Share post"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      Share
    </button>
  </div>

  {#if showComments}
    <div class="px-4 py-3 border-t border-gray-200 space-y-3">
      {#each comments as comment}
        <div class="flex gap-2">
          {#if comment.user_info?.imagen_perfil_url}
            <img src={comment.user_info.imagen_perfil_url} alt={comment.user_info.username} class="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          {:else}
            <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              {comment.user_info?.username?.[0]?.toUpperCase() || 'U'}
            </div>
          {/if}
          <div class="flex-1 bg-gray-100 rounded-lg p-2">
            <p class="text-sm font-semibold text-gray-900">{comment.user_info?.username || 'Unknown'}</p>
            <p class="text-sm text-gray-700">{comment.contenido}</p>
          </div>
        </div>
      {/each}

      <div class="flex gap-2 pt-2">
        <input 
          type="text" 
          bind:value={newComment}
          placeholder="Write a comment..."
          class="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 text-sm"
          disabled={isSubmittingComment}
          onkeydown={(e) => e.key === 'Enter' && handleComment()}
        />
        <button
          onclick={handleComment}
          disabled={isSubmittingComment || !newComment.trim()}
          class="text-primary-600 hover:text-primary-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmittingComment ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  {/if}
</div>
