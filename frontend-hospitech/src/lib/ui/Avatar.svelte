/**
 * @fileoverview Reusable Avatar component with size variants
 * @author Juan Carlos Angulo
 * @component Avatar
 */

<script>
  /**
   * @typedef {'sm' | 'md' | 'lg' | 'xl'} AvatarSize
   */

  let { 
    src = '',
    alt = 'User avatar',
    size = 'md',
    class: className = ''
  } = $props();

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  };

  const fallbackLetter = $derived(alt[0]?.toUpperCase() || 'U');
</script>

{#if src}
  <img 
    {src} 
    {alt} 
    class="rounded-full object-cover {sizeClasses[size]} {className}"
  />
{:else}
  <div class="rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold {sizeClasses[size]} {className}">
    {fallbackLetter}
  </div>
{/if}
