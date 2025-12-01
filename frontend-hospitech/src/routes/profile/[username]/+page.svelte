<script>
  import PostCard from '$lib/ui/PostCard.svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { derived } from 'svelte/store';
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Badge } from "$lib/components/ui/badge";
  import { ImageOff } from "lucide-svelte";

    let { data: pageData } = $props();
    let user = $derived(pageData.user || null);
    let posts = $derived(pageData.posts || []);
    let currentUser = derived(authStore, (s) => s?.user);
  
  let isFollowing = $state(false);
  let isSubmitting = $state(false);

  $effect(() => {
      if ($currentUser && user) {
          isFollowing = $currentUser.following_users?.includes(user._id) || false;
      }
  });

  async function toggleFollow() {
      if (!$currentUser) {
          window.location.href = '/auth';
          return;
      }

      isSubmitting = true;
      try {
      const res = await fetch('/api/users/follow-user', {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${$authStore.token}`
              },
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

<div class="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
    {#if user}
        <Card.Root class="mb-8 border-border/50 bg-card/50 backdrop-blur-sm">
            <Card.Content class="p-8 text-center">
                <Avatar.Root class="h-32 w-32 mx-auto mb-4 ring-4 ring-primary/20 shadow-xl">
                  <Avatar.Image src={user.imagen_perfil_url} alt={user.username} />
                  <Avatar.Fallback class="text-4xl">{user.username?.[0]?.toUpperCase() || 'U'}</Avatar.Fallback>
                </Avatar.Root>
                
                <h1 class="font-display font-bold text-3xl mb-1">{user.nombre || user.username} {user.apellido || ''}</h1>
                <p class="text-muted-foreground mb-6">@{user.username}</p>
                
                {#if currentUser && currentUser.id !== user._id}
                    <Button 
                        variant={isFollowing ? 'secondary' : 'default'}
                        size="lg"
                        onclick={toggleFollow}
                        disabled={isSubmitting}
                        class="min-w-[120px]"
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                {/if}
                
                <!-- Stats -->
                <div class="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-border/50">
                    <div class="text-center">
                        <div class="text-2xl font-bold text-primary">{posts.length}</div>
                        <div class="text-sm text-muted-foreground">Posts</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-foreground">{user.followers_count || 0}</div>
                        <div class="text-sm text-muted-foreground">Followers</div>
                    </div>
                    <div class="text-center">
                        <div class="text-2xl font-bold text-foreground">{user.following_users_count || 0}</div>
                        <div class="text-sm text-muted-foreground">Following</div>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    {/if}

    <h2 class="font-display font-bold text-2xl mb-6 flex items-center gap-2">
      Posts
      <Badge variant="secondary" class="rounded-full">{posts.length}</Badge>
    </h2>
    
    {#if posts.length === 0}
        <Card.Root class="border-dashed">
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ImageOff class="h-8 w-8 text-muted-foreground" />
                </div>
                <p class="text-muted-foreground">No posts yet.</p>
            </div>
        </Card.Root>
    {:else}
        <div class="space-y-6">
            {#each posts as post (post._id)}
                <PostCard {post} />
            {/each}
        </div>
    {/if}
</div>
