<script>
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { derived } from 'svelte/store';
  import { goto } from '$app/navigation';

  const user = derived(authStore, ($auth) => $auth && $auth.user);

  const suggestedHotels = [
    { name: 'The Coastal Lodge', location: 'Bali, Indonesia' },
    { name: 'Mountain View Resort', location: 'Swiss Alps' },
    { name: 'Urban Boutique Hotel', location: 'Tokyo, Japan' },
  ];

  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    authStore.logout();
    window.location.href = '/auth';
  }
</script>

<div class="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
  <div>
    <h3 class="font-semibold text-gray-600 text-sm mb-3">Suggested Hotels</h3>
    
    <div class="space-y-2">
      {#each suggestedHotels as hotel}
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div class="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
            {hotel.name[0]}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm text-gray-900 truncate">{hotel.name}</h4>
            <p class="text-xs text-gray-500 truncate">{hotel.location}</p>
          </div>
          <button class="text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-md text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
      {/each}
    </div>
    </div>
  </div>

  {#if $user}
    <div class="mt-6 pt-6 border-t border-gray-200">
      <button
        onclick={handleLogout}
        class="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign Out
      </button>
    </div>
  {/if}
</div>
