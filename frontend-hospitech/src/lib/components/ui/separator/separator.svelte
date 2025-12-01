<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		orientation = "horizontal",
		decorative = true,
		...restProps
	}: {
		ref?: HTMLElement | null;
		class?: string;
		orientation?: "horizontal" | "vertical";
		decorative?: boolean;
		[key: string]: any;
	} = $props();
</script>

<SeparatorPrimitive.Root
	bind:ref
	{orientation}
	{decorative}
	class={cn(
		"shrink-0 bg-border",
		orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
		className
	)}
	{...restProps}
/>
