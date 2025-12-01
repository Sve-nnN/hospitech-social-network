<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';
  import { PostService } from '$lib/Contexts/Content/Application/postService';
  // import type { IPost } from '$lib/Contexts/Content/Domain/Post';

  export let postId = null;
  let isNew = !postId;
  let post = { title: '', content: '' };
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

<section class="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">{isNew ? $t('post.create') : $t('post.detail')}</h1>
  <form on:submit|preventDefault={savePost} class="space-y-4">
    <div>
      <label class="block text-sm font-medium" for="title">{$t('post.title')}</label>
      <input id="title" class="w-full border rounded-md px-3 py-2 mt-1" bind:value={post.title} required />
    </div>
    <div>
      <label class="block text-sm font-medium" for="content">{$t('post.content')}</label>
      <textarea id="content" class="w-full border rounded-md px-3 py-2 mt-1" rows="5" bind:value={post.content} required></textarea>
    </div>
  <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" type="submit" disabled={loading}>{loading ? 'Guardando...' : isNew ? 'Crear' : $t('post.save')}</button>
    <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition ml-2" type="button" on:click={() => goto('/feed')}>{$t('post.cancel')}</button>
  </form>
</section>
