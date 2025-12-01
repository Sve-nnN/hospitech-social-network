/**
 * @fileoverview Main application layout with sidebars and global feedback
 * @author Juan Carlos Angulo
 * @layout RootLayout
 */

<script>
	import '../app.css';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { globalLoading, globalError } from '$lib/ui/globalFeedback';
	import { onDestroy } from 'svelte';
	import { authStore, logout } from '$lib/Contexts/IAM/Application/authStore';
	import { goto } from '$app/navigation';
	import { lang, availableLangs } from '$lib/i18n';
	import TopNav from '$lib/ui/TopNav.svelte';
	import RightSidebar from '$lib/ui/RightSidebar.svelte';
	import { writable } from 'svelte/store';
	
	let { data, children } = $props();
	let unsubLoading, unsubError, unsubAuth;
	
	const loading = writable(false);
	const error = writable('');
	const user = writable(null);
	
	unsubLoading = globalLoading.subscribe(v => loading.set(v));
	unsubError = globalError.subscribe(v => error.set(v));
	unsubAuth = authStore.subscribe(v => user.set(v.user));
    
    if (data?.user) {
        authStore.set({ user: data.user, token: null, loading: false, error: null });
    }

	onDestroy(() => { unsubLoading(); unsubError(); unsubAuth(); });

	async function handleLogout() {
		await logout();
		goto('/auth');
	}

	let selectedLang = $state($lang);
	function changeLang(newLang) {
		lang.set(newLang);
		selectedLang = newLang;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>HotelStay - Share Your Travel Experiences</title>
	<meta name="description" content="Share and discover amazing hotel experiences" />
</svelte:head>

<div class="min-h-screen bg-gray-100 flex flex-col">
	<TopNav />

	<div class="flex flex-1 pt-16">
		<main class="flex-1 max-w-2xl mx-auto px-4 py-4 w-full">
			{@render children()}
		</main>
		<RightSidebar />
	</div>

	{#if $loading}
		<div class="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
			<div class="bg-white rounded-lg p-6 shadow-lg">
				<div class="flex items-center gap-3">
					<svg class="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
						<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
					<span class="font-medium text-gray-700">Loading...</span>
				</div>
			</div>
		</div>
	{/if}

	{#if $error}
		<div class="fixed top-4 right-4 z-50">
			<div class="bg-white border border-red-200 rounded-lg shadow-lg p-4 max-w-md">
				<div class="flex items-start gap-3">
					<svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
					</svg>
					<div class="flex-1">
						<h3 class="font-semibold text-gray-900 text-sm">Error</h3>
						<p class="text-sm text-gray-600 mt-1">{$error}</p>
					</div>
					<button 
						onclick={() => error.set('')}
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Close error message"
					>
						<svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>