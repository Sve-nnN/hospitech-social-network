<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { HotelService } from '$lib/Contexts/Content/Application/hotelService';
  import type { IHotel } from '$lib/Contexts/Content/Domain/Hotel';
  export let params;

  let hotel: IHotel | null = null;
  let user = null;

  onMount(async () => {
    const auth = get(authStore);
    if (!auth.user) {
      goto('/auth');
      return;
    }
    user = auth.user;
    showLoading();
    try {
      hotel = await HotelService.getHotel({ hotelId: params?.id, fetch });
      if (!hotel) throw new Error('No encontrado');
    } catch (e) {
      showError('Hotel no encontrado');
    } finally {
      hideLoading();
    }
  });
</script>

<section class="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Detalle del Hotel</h1>
  {#if hotel}
    <div class="mb-2"><span class="font-semibold">Nombre:</span> {hotel.nombre}</div>
    <div class="mb-2"><span class="font-semibold">Ciudad:</span> {hotel.ciudad}</div>
    <div class="mb-2"><span class="font-semibold">Estrellas:</span> {hotel.estrellas}</div>
    <div class="mb-2"><span class="font-semibold">Descripción:</span> {hotel.descripcion}</div>
    <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition mt-4" on:click={() => goto('/hotels')}>Volver</button>
  {:else}
    <div>Hotel no encontrado</div>
  {/if}
</section>
