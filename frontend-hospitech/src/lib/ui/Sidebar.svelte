/**
 * @fileoverview Left sidebar navigation component
 * @author Juan Carlos Angulo
 * @component Sidebar
 */

<script>
  import { page } from '$app/stores';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';

  let active = $derived($page.url.pathname);
  let user = $derived($authStore.user);
  
  const navItems = $derived([
    { 
      href: '/feed', 
      label: 'Home', 
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    { 
      href: user ? `/profile/${user.username}` : '/auth', 
      label: 'Profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },
  ]);
</script>

<div class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-3 flex flex-col z-50 overflow-y-auto">
  <div class="mb-4 px-2 py-2">
    <h1 class="font-bold text-2xl text-primary-600">HotelStay</h1>
  </div>

  <nav class="flex-1 space-y-1">
    {#each navItems as item}
      <a 
        href={item.href} 
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors {active === item.href ? 'bg-gray-100 text-primary-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d={item.icon}/>
        </svg>
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  {#if user}
    <div class="pt-3 border-t border-gray-200">
      <a href={`/profile/${user.username}`} class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors" aria-label="View your profile">
        <div class="relative">
          {#if user.imagen_perfil_url}
            <img src={user.imagen_perfil_url} alt={user.username} class="w-9 h-9 rounded-full object-cover" />
          {:else}
            <div class="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
          {/if}
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-medium text-sm text-gray-900 truncate">{user.username}</p>
        </div>
      </a>
    </div>
  {/if}
</div>
