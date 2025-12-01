<script lang="ts">
	import { type BadgeVariant, badgeVariants } from "./index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		variant = "default",
		children,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		variant?: BadgeVariant;
		children?: import("svelte").Snippet;
		[key: string]: any;
	} = $props();
</script>

<div bind:this={ref} class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</div>
