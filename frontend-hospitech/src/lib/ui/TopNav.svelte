<script>
  import { page } from '$app/stores';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { derived } from 'svelte/store';
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Avatar from "$lib/components/ui/avatar";

  const active = derived(page, ($page) => $page.url.pathname);
  const user = derived(authStore, ($auth) => $auth && $auth.user);

  const navItems = derived([page, authStore], ([$page, $auth]) => {
    const u = $auth && $auth.user;
    return [
      { href: '/feed', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { href: '/hotels', label: 'Hotels', icon: 'M16 8v8m-4-8v8m-4-8v8m-4-8v8M4 8h16' },
      { href: u && u.username ? `/profile/${u.username}` : '/auth', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' }
    ];
  });

  function handleLogout() {
    authStore.logout();
  }
</script>

<header class="bg-background shadow-md fixed top-0 left-0 right-0 z-50 border-b">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <div class="flex-shrink-0">
        <a href="/feed" class="text-2xl font-bold text-primary">HotelStay</a>
      </div>

      <div class="hidden md:flex justify-center flex-1">
        <nav class="flex space-x-4">
          {#each $navItems as item}
            <Button
              href={item.href}
              variant={$active === item.href ? "secondary" : "ghost"}
              class="w-24 h-12"
              title={item.label}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d={item.icon} />
              </svg>
            </Button>
          {/each}
        </nav>
      </div>

      <div class="flex items-center">
        {#if $user}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger class="flex items-center gap-2 cursor-pointer outline-none">
              <Avatar.Root class="h-9 w-9">
                <Avatar.Image src={$user.imagen_perfil_url} alt={$user.username} />
                <Avatar.Fallback>{$user.username?.[0]?.toUpperCase() || 'U'}</Avatar.Fallback>
              </Avatar.Root>
              <span class="hidden md:block font-medium text-sm text-foreground">{$user.username}</span>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
              <DropdownMenu.Label>My Account</DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item href={`/profile/${$user.username}`}>My Profile</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item on:click={handleLogout} class="cursor-pointer">Logout</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {:else}
          <Button href="/auth" variant="link">Log in / Sign up</Button>
        {/if}
      </div>
    </div>
  </div>
</header>
