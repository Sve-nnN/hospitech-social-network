
<script>
export let className = '';
</script>

<div class={"bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 " + (className || ($$restProps && $$restProps.class) || '')}>
  <slot />
</div>
