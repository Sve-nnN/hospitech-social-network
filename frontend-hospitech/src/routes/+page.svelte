<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';

  onMount(() => {
    const unsubscribe = authStore.subscribe(($auth) => {
      if ($auth && $auth.token) {
        goto('/feed', { replaceState: true });
      }
    });
    return unsubscribe;
  });
</script>

<div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center px-4 py-8 bg-gray-50">
  <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
    Discover and Share Amazing Hotel Experiences
  </h1>
  <p class="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
    Connect with fellow travelers, explore stunning hotels, and share your unforgettable stays.
  </p>
  <div class="flex flex-col sm:flex-row gap-4">
    <a
      href="/auth?type=signup"
      class="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
    >
      Join HotelStay
    </a>
    <a
      href="/auth?type=login"
      class="bg-white border-2 border-primary-600 text-primary-600 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg hover:bg-primary-50"
    >
      Log In
    </a>
  </div>
</div>
