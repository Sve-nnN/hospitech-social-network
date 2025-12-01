<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { Button } from "$lib/components/ui/button";

  onMount(() => {
    return authStore.subscribe(($auth) => {
      if ($auth && $auth.token) {
        goto('/feed', { replaceState: true });
      }
    });
  });
</script>

<div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-8 bg-background">
  <h1 class="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
    Discover and Share Amazing Hotel Experiences
  </h1>
  <p class="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
    Connect with fellow travelers, explore stunning hotels, and share your unforgettable stays.
  </p>
  <div class="flex flex-col sm:flex-row gap-4">
    <Button href="/auth?type=signup" size="lg" class="shadow-lg">
      Join HotelStay
    </Button>
    <Button href="/auth?type=login" variant="outline" size="lg" class="shadow-lg">
      Log In
    </Button>
  </div>
</div>
