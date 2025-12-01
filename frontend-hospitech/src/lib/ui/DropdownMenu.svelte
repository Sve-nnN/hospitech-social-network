<script>
  import { createDropdownMenu, melt } from '@melt-ui/svelte';
  import { fade, scale } from 'svelte/transition';

  let {
    items = [],
    trigger,
    align = 'end',
  } = $props();

  const {
    elements: { menu, item, trigger: triggerEl },
    states: { open }
  } = createDropdownMenu({
    forceVisible: true,
    positioning: { placement: align === 'start' ? 'bottom-start' : 'bottom-end' }
  });
</script>

<button use:melt={$triggerEl}>
  {@render trigger?.()}
</button>

{#if $open}
  <div
    use:melt={$menu}
    class="z-50 min-w-[200px] rounded-lg bg-white shadow-large border border-gray-100 py-1"
    transition:scale={{ duration: 150, start: 0.95 }}
  >
    {#each items as menuItem}
      {#if menuItem.divider}
        <div class="my-1 h-px bg-gray-200"></div>
      {:else}
        <button
          use:melt={$item}
          onclick={menuItem.onClick}
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 {menuItem.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}"
        >
          {#if menuItem.icon}
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d={menuItem.icon}/>
            </svg>
          {/if}
          {menuItem.label}
        </button>
      {/if}
    {/each}
  </div>
{/if}
