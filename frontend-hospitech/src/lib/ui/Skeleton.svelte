<script>
  // Loading skeleton component with variants
  export let variant = 'card';
  export let count = 1;
</script>

{#each Array(count) as _, i}
  {#if variant === 'card'}
    <div class="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div class="space-y-2">
        <div class="h-4 bg-gray-200 rounded"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div class="mt-4 h-48 bg-gray-200 rounded"></div>
    </div>
  {:else if variant === 'list'}
    <div class="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 bg-gray-200 rounded"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  {:else}
    <div class="space-y-2 animate-pulse">
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      <div class="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  {/if}
{/each}
