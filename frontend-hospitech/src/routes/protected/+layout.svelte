<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  onMount(() => {
    return authStore.subscribe(({ token }) => {
      if (!token) goto('/auth');
    });
  });
</script>
<slot />
