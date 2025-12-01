<script>
  import { createToaster, melt } from '@melt-ui/svelte';
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';

  const {
    elements: { content, title, description, close },
    helpers,
    states: { toasts },
    actions: { portal }
  } = createToaster();

  export const addToast = helpers.addToast;
</script>

<div use:portal class="fixed top-4 right-4 z-50 flex flex-col gap-2">
  {#each $toasts as { id, data } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={{ duration: 300 }}
      in:fly={{ duration: 200, x: 100 }}
      out:fly={{ duration: 200, x: 100 }}
      class="rounded-lg shadow-large overflow-hidden min-w-[300px] max-w-md animate-scale-in"
    >
      <div class="p-4 {data.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : data.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' : data.type === 'warning' ? 'bg-amber-50 border-l-4 border-amber-500' : 'bg-blue-50 border-l-4 border-blue-500'}">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0">
            {#if data.type === 'success'}
              <svg class="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            {:else if data.type === 'error'}
              <svg class="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            {:else if data.type === 'warning'}
              <svg class="w-5 h-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            {:else}
              <svg class="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            {/if}
          </div>
          <div class="flex-1">
            <h3 use:melt={$title(id)} class="font-semibold text-sm {data.type === 'success' ? 'text-green-900' : data.type === 'error' ? 'text-red-900' : data.type === 'warning' ? 'text-amber-900' : 'text-blue-900'}">
              {data.title}
            </h3>
            {#if data.description}
              <p use:melt={$description(id)} class="text-sm mt-1 {data.type === 'success' ? 'text-green-700' : data.type === 'error' ? 'text-red-700' : data.type === 'warning' ? 'text-amber-700' : 'text-blue-700'}">
                {data.description}
              </p>
            {/if}
          </div>
          <button
            use:melt={$close(id)}
            class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  {/each}
</div>
