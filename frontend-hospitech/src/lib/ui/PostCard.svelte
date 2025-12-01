<script>
/**
 * @fileoverview Post card component displaying user posts with interactions
 */
import { showError } from '$lib/ui/globalFeedback';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';
import { derived } from 'svelte/store';
import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';
import { Button } from "$lib/components/ui/button";
import { Input } from "$lib/components/ui/input";
import * as Avatar from "$lib/components/ui/avatar";
import * as Card from "$lib/components/ui/card";
import { Heart, MessageCircle, Share2, Send } from "lucide-svelte";
import { cn } from "$lib/utils";

let { post } = $props();
let user = derived(authStore, (s) => s?.user);

// Reactive state derived from props
let likeCount = $state(post.likes?.length || 0);
let isLiked = $state($user && post.likes?.includes($user._id));
let comments = $state(post.comments || []);

// Local state
let showComments = $state(false);
let newComment = $state('');
let isSubmittingComment = $state(false);

// Update state when post prop changes (if needed, though keying the component is better)
$effect(() => {
    likeCount = post.likes?.length || 0;
    isLiked = $user && post.likes?.includes($user._id);
    comments = post.comments || [];
});

  /**
   * Toggles like status for the post
   * @returns {Promise<void>}
   */
  async function handleLike() {
    if (!$user) return;
    
    const originalLiked = isLiked;
    const originalCount = likeCount;
    
    isLiked = !isLiked;
    likeCount += isLiked ? 1 : -1;

    try {
        const res = await PostApi.toggleLike(post._id, fetch, $authStore.token);
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
      if (!$user) return;

      isSubmittingComment = true;
      try {
          const res = await PostApi.addComment(post._id, { contenido: newComment }, fetch, $authStore.token);
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

  function handleShare() {
      // Placeholder for share functionality
      // In a real app, this might open a modal or copy a link
      console.log('Share button clicked');
      // You might want to use a toast here if available
  }
</script>

<Card.Root class="mb-4">
  <Card.Header class="p-4 pb-0">
    <div class="flex items-center gap-3">
      <a href={`/profile/${post.user_info?.username}`}>
        <Avatar.Root>
          <Avatar.Image src={post.user_info?.imagen_perfil_url} alt={post.user_info?.username} />
          <Avatar.Fallback>{post.user_info?.username?.[0]?.toUpperCase() || 'U'}</Avatar.Fallback>
        </Avatar.Root>
      </a>
      <div class="flex-1">
        <a href={`/profile/${post.user_info?.username}`} class="font-semibold text-foreground hover:underline">
          {post.user_info?.username || 'Unknown'}
        </a>
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{new Date(post.fecha_creacion).toLocaleDateString()}</span>
          {#if post.hotel_info}
            <span>·</span>
            <a href={`/hotel/${post.hotel_id}`} class="hover:underline">
              {post.hotel_info.nombre}
            </a>
          {/if}
          {#if post.rating}
            <span>·</span>
            <span class="flex items-center gap-0.5">
              <svg class="w-3 h-3 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {post.rating}/5
            </span>
          {/if}
        </div>
      </div>
    </div>
  </Card.Header>

  <Card.Content class="p-4">
    <p class="text-foreground mb-3">{post.contenido}</p>
    {#if post.imagenes_url && post.imagenes_url.length > 0}
      <div class="w-full">
        <img src={post.imagenes_url[0]} alt="Post" class="w-full max-h-[500px] object-cover rounded-md" />
      </div>
    {/if}
  </Card.Content>

  <Card.Footer class="flex flex-col p-0">
    <div class="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t w-full">
      <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
      <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
    </div>

    <div class="flex items-center border-t w-full">
      <Button variant="ghost" class="flex-1 rounded-none" onclick={handleLike}>
        <Heart class={cn("mr-2 h-4 w-4", isLiked && "fill-current text-red-500")} />
        Like
      </Button>
      <Button variant="ghost" class="flex-1 rounded-none" onclick={() => (showComments = !showComments)}>
        <MessageCircle class="mr-2 h-4 w-4" />
        Comment
      </Button>
      <Button variant="ghost" class="flex-1 rounded-none" onclick={handleShare}>
        <Share2 class="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>

    {#if showComments}
      <div class="px-4 py-3 border-t w-full space-y-3 bg-muted/50">
        {#each comments as comment}
          <div class="flex gap-2">
            <Avatar.Root class="h-8 w-8">
              <Avatar.Image src={comment.user_info?.imagen_perfil_url} />
              <Avatar.Fallback>{comment.user_info?.username?.[0]?.toUpperCase() || 'U'}</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex-1 bg-background rounded-lg p-2 text-sm border">
              <p class="font-semibold">{comment.user_info?.username || 'Unknown'}</p>
              <p>{comment.contenido}</p>
            </div>
          </div>
        {/each}

        <div class="flex gap-2 pt-2">
          <Input
            placeholder="Write a comment..."
            bind:value={newComment}
            disabled={isSubmittingComment}
            onkeydown={(e) => e.key === 'Enter' && handleComment()}
          />
          <Button size="icon" onclick={handleComment} disabled={isSubmittingComment || !newComment.trim()}>
            <Send class="h-4 w-4" />
          </Button>
        </div>
      </div>
    {/if}
  </Card.Footer>
</Card.Root>
