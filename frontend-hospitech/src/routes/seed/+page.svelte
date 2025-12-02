<script>
	import { onMount } from 'svelte';

	let loading = false;
	let result = null;
	let error = null;

	const runSeed = async () => {
		loading = true;
		result = null;
		error = null;

		try {
			const response = await fetch('http://localhost:3000/api/seed', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const data = await response.json();

			if (response.ok) {
				result = data;
			} else {
				error = data.message || 'Error executing seed';
			}
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	};
</script>

<div class="container mx-auto p-8 max-w-2xl">
	<h1 class="text-3xl font-bold mb-6 text-gray-800">Database Seeder</h1>

	<div class="bg-white p-6 rounded-lg shadow-md">
		<p class="mb-4 text-gray-600">
			This tool will populate the database with mock data.
			<span class="font-bold text-red-500">Warning: All existing data will be deleted!</span>
		</p>

		<button
			on:click={runSeed}
			disabled={loading}
			class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg transition duration-200 flex justify-center items-center"
		>
			{#if loading}
				<svg
					class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
					></circle>
					<path
						class="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
				Seeding Database...
			{:else}
				Run Seed Script
			{/if}
		</button>

		{#if result}
			<div class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
				<h3 class="text-lg font-semibold text-green-800 mb-2">Success!</h3>
				<p class="text-green-700">{result.message}</p>
				<div class="mt-2 text-sm text-green-600">
					<p>Users created: {result.stats.users}</p>
					<p>Hotels created: {result.stats.hotels}</p>
					<p>Posts created: {result.stats.posts}</p>
				</div>
				<div class="mt-4 pt-4 border-t border-green-200">
					<p class="font-semibold text-green-800">Test Credentials:</p>
					<p class="text-green-700">Username: sofia_travel</p>
					<p class="text-green-700">Password: password123</p>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
				<h3 class="text-lg font-semibold text-red-800 mb-2">Error</h3>
				<p class="text-red-700">{error}</p>
			</div>
		{/if}
	</div>
</div>
