/**
 * @fileoverview Reusable Card container component
 * @author Juan Carlos Angulo
 * @component Card
 */

<script>
  let { 
    class: className = '',
    children
  } = $props();
</script>

<div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 {className}">
  {@render children()}
</div>
