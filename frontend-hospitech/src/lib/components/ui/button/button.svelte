<script lang="ts">
	import { Button as ButtonPrimitive } from "bits-ui";
	import { buttonVariants } from "./index.js";
	import { cn } from "$lib/utils.js";
	import { Loader2 } from "lucide-svelte";

	type $$Props = ButtonPrimitive.Props & {
		variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
		size?: "default" | "sm" | "lg" | "icon";
		href?: string;
		loading?: boolean;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let variant: $$Props["variant"] = "default";
	export let size: $$Props["size"] = "default";
	export let builders: $$Props["builders"] = [];
	export let href: $$Props["href"] = undefined;
	export let loading: boolean = false;
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size, className }))} {...$$restProps}>
		{#if loading}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		<slot />
	</a>
{:else}
	<ButtonPrimitive.Root
		{builders}
		class={cn(buttonVariants({ variant, size, className }))}
		type="button"
		disabled={loading || $$restProps.disabled}
		{...$$restProps}
		on:click
		on:keydown
	>
		{#if loading}
			<Loader2 class="mr-2 h-4 w-4 animate-spin" />
		{/if}
		<slot />
	</ButtonPrimitive.Root>
{/if}
