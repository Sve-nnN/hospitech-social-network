<script>
	import { goto } from '$app/navigation';
	import { HotelService } from '$lib/Contexts/Content/Application/hotelService';
	import { authStore } from '$lib/Contexts/IAM/Application/authStore';
	import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { get } from 'svelte/store';

	let nombre = '';
	let ciudad = '';
	let pais = '';
	let direccion = '';
	let descripcion = '';
	let estrellas = 3;
	let loading = false;

	async function handleSubmit() {
		const auth = get(authStore);
		if (!auth.token) {
			goto('/auth');
			return;
		}

		if (!nombre || !ciudad || !pais) {
			showError('Please fill in all required fields');
			return;
		}

		loading = true;
		showLoading();
		try {
			const hotelData = {
				nombre,
				direccion: {
					calle: direccion,
					ciudad,
					pais
				},
				descripcion,
				estrellas: parseInt(estrellas),
				imagenes_url: [
					'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'
				]
			};

			console.log('[CreateHotel] Sending hotel data:', hotelData);
			console.log('[CreateHotel] Auth token:', auth.token ? 'present' : 'missing');

			const res = await HotelService.createHotel(hotelData, fetch, auth.token);
			console.log('[CreateHotel] Response:', res);

			if (res) {
				goto('/hotels');
			} else {
				showError('Error creating hotel');
			}
		} catch (e) {
			console.error('[CreateHotel] Exception:', e);
			showError('Error creating hotel');
		} finally {
			hideLoading();
			loading = false;
		}
	}
</script>

<div class="container max-w-2xl mx-auto py-8 px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Add New Hotel</Card.Title>
			<Card.Description>Share a new hotel with the community</Card.Description>
		</Card.Header>
		<Card.Content>
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<div class="grid w-full items-center gap-1.5">
					<Label for="nombre">Hotel Name *</Label>
					<Input id="nombre" bind:value={nombre} required placeholder="e.g. Grand Hotel" />
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div class="grid w-full items-center gap-1.5">
						<Label for="ciudad">City *</Label>
						<Input id="ciudad" bind:value={ciudad} required placeholder="e.g. New York" />
					</div>
					<div class="grid w-full items-center gap-1.5">
						<Label for="pais">Country *</Label>
						<Input id="pais" bind:value={pais} required placeholder="e.g. USA" />
					</div>
				</div>

				<div class="grid w-full items-center gap-1.5">
					<Label for="direccion">Address</Label>
					<Input id="direccion" bind:value={direccion} placeholder="Street address" />
				</div>

				<div class="grid w-full items-center gap-1.5">
					<Label for="estrellas">Stars (1-5)</Label>
					<Input id="estrellas" type="number" min="1" max="5" bind:value={estrellas} required />
				</div>

				<div class="grid w-full items-center gap-1.5">
					<Label for="descripcion">Description</Label>
					<textarea
						id="descripcion"
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						bind:value={descripcion}
						placeholder="Tell us about this hotel..."
					></textarea>
				</div>

				<div class="flex justify-end gap-2 pt-4">
					<Button variant="outline" href="/hotels">Cancel</Button>
					<Button type="submit" disabled={loading} {loading}>Create Hotel</Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
