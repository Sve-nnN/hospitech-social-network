<script>
  import { createDialog, melt } from '@melt-ui/svelte';
  import { fade, scale } from 'svelte/transition';

  let {
    open = $bindable(false),
    title = '',
    children,
    onClose = () => {},
    size = 'md',
  } = $props();

  const {
    elements: { trigger, overlay, content, title: titleEl, description, close, portalled },
    states: { open: openState }
  } = createDialog({
    forceVisible: true,
    open,
    onOpenChange: ({ next }) => {
      open = next;
      if (!next) onClose();
      return next;
    }
  });

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };
</script>

{#if $openState}
  <div use:melt={$portalled}>
    <div
      use:melt={$overlay}
      class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      transition:fade={{ duration: 150 }}
    />
    <div
      use:melt={$content}
      class="fixed left-1/2 top-1/2 z-50 w-full {sizes[size]} -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-large p-6"
      transition:scale={{ duration: 200, start: 0.95 }}
    >
      <div class="flex items-start justify-between mb-4">
        <h2 use:melt={$titleEl} class="font-display font-bold text-xl text-gray-900">
          {title}
        </h2>
        <button
          use:melt={$close}
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div use:melt={$description}>
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}
