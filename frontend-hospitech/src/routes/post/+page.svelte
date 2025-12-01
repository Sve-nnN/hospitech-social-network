<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';
  import { PostService } from '$lib/Contexts/Content/Application/postService';
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { Textarea } from "$lib/components/ui/textarea";
  import * as Card from "$lib/components/ui/card";

  export let postId = null;
  let isNew = !postId;
  /** @type {any} */
  let post = { title: '', content: '' };
  /** @type {any} */
  let user = null;
  let loading = false;

  onMount(async () => {
    const auth = get(authStore);
    if (!auth.user) {
      goto('/auth');
      return;
    }
    user = auth.user;
    if (!isNew && postId) {
  const fetched = await PostService.getPost({ postId, fetch });
  post = fetched || { title: '', content: '' };
    }
  });

  async function savePost() {
    loading = true;
    showLoading();
    try {
      const saved = await PostService.savePost({ post, fetch });
      if (!saved) throw new Error('Error');
      goto('/feed');
    } catch (e) {
      showError($t('post.error'));
    } finally {
      loading = false;
      hideLoading();
    }
  }
</script>

<div class="container max-w-xl mx-auto mt-8 p-4">
  <Card.Root>
    <Card.Header>
      <Card.Title>{isNew ? $t('post.create') : $t('post.detail')}</Card.Title>
    </Card.Header>
    <Card.Content>
      <form on:submit|preventDefault={savePost} class="space-y-4">
        <div class="grid w-full items-center gap-1.5">
          <Label for="title">{$t('post.title')}</Label>
          <Input id="title" bind:value={post.title} required />
        </div>
        <div class="grid w-full items-center gap-1.5">
          <Label for="content">{$t('post.content')}</Label>
          <Textarea id="content" rows={5} bind:value={post.content} required />
        </div>
        <div class="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : isNew ? 'Crear' : $t('post.save')}</Button>
          <Button variant="outline" type="button" on:click={() => goto('/feed')}>{$t('post.cancel')}</Button>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
