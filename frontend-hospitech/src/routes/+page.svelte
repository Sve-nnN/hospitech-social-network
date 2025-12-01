<script lang="ts">
import { onMount } from 'svelte';
import { goto } from '$app/navigation';
import { authStore } from '$lib/Contexts/IAM/Application/authStore';

onMount(() => {
	const unsubscribe = authStore.subscribe(($auth) => {
		if ($auth && $auth.token) {
			goto('/feed', { replaceState: true });
		} else {
			goto('/auth', { replaceState: true });
		}
	});
	return unsubscribe;
});
</script>

<div style="display:none"></div>
