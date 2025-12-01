<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  let unsubscribe;
  let isAuth = false;
  onMount(() => {
    unsubscribe = authStore.subscribe(({ token }) => {
      isAuth = !!token;
      if (!isAuth) goto('/auth');
    });
    return () => unsubscribe();
  });
</script>
<slot />
