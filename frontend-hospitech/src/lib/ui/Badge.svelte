/**
 * Badge component for labels and tags
 */
<script>
export let variant = 'primary';
export let className = '';

const variantClasses = {
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700'
};

function getClasses() {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const v = variantClasses[variant] ?? variantClasses.primary;
  const extra = ($$restProps && $$restProps.class) ? $$restProps.class : className;
  return [base, v, extra].filter(Boolean).join(' ');
}
</script>

<span class={getClasses()}>
  <slot />
</span>
