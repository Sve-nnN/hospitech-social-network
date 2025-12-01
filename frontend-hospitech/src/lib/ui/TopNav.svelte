
<script>
  import { page } from '$app/stores';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let active = $derived($page.url.pathname);
  let user = $derived($authStore.user);
  let showDropdown = writable(false);

  const navItems = $derived([
    { href: '/feed', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/hotels', label: 'Hotels', icon: 'M16 8v8m-4-8v8m-4-8v8m-4-8v8M4 8h16' },
    { href: user ? `/profile/${user.username}` : '/auth', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  ]);

  function toggleDropdown() {
    showDropdown.update(value => !value);
  }

  function handleLogout() {
    authStore.logout();
    showDropdown.set(false);
  }

  onMount(() => {
    function handleClickOutside(event) {
      if (!$showDropdown) return;
      const dropdownElement = document.getElementById('user-dropdown');
      const userButtonElement = document.getElementById('user-button');
      if (dropdownElement && !dropdownElement.contains(event.target) && userButtonElement && !userButtonElement.contains(event.target)) {
        showDropdown.set(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
</script>

<header class="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="flex-shrink-0">
        <a href="/feed" class="text-2xl font-bold text-primary-600">HotelStay</a>
      </div>

      <div class="hidden md:flex justify-center flex-1">
        <nav class="flex space-x-4">
          {#each navItems as item}
            <a
              href={item.href}
              class="flex items-center justify-center w-24 h-12 rounded-lg transition-colors {active === item.href ? 'text-primary-600 bg-primary-50' : 'text-gray-600 hover:bg-gray-100'}"
              title={item.label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
              </svg>
            </a>
          {/each}
        </nav>
      </div>

      <div class="flex items-center">
        {#if user}
          <div class="relative">
            <button id="user-button" on:click={toggleDropdown} class="flex items-center gap-2 cursor-pointer">
              {#if user.imagen_perfil_url}
                <img src={user.imagen_perfil_url} alt={user.username} class="w-9 h-9 rounded-full object-cover" />
              {:else}
                <div class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              {/if}
              <span class="hidden md:block font-medium text-sm text-gray-700">{user.username}</span>
            </button>

            {#if $showDropdown}
              <div id="user-dropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <a href={`/profile/${user.username}`} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                <button on:click={handleLogout} class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            {/if}
          </div>
        {:else}
          <a href="/auth" class="text-sm font-medium text-primary-600 hover:text-primary-500">
            Log in / Sign up
          </a>
        {/if}
      </div>
    </div>
  </div>
</header>
