<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';
  import { HotelService } from '$lib/Contexts/Content/Application/hotelService';

  let hoteles = [];
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
      hoteles = await HotelService.getHotels({ fetch });
    } catch (e) {
      showError($t('hotels.loading'));
    } finally {
      hideLoading();
    }
  });

  function verDetalle(id) {
    goto(`/hotel/${id}`);
  }
</script>

<section class="max-w-2xl mx-auto mt-8 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">{$t('hotels.title')}</h1>
  {#if hoteles.length === 0}
    <div>{$t('hotels.noHotels')}</div>
  {:else}
    <ul class="divide-y divide-gray-200">
      {#each hoteles as hotel}
        <li class="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div class="font-semibold text-lg">{hotel.nombre}</div>
            <div class="text-gray-600">{hotel.ciudad} &bull; {hotel.estrellas} {$t('hotel.stars')}</div>
            <div class="text-gray-500 text-sm">{hotel.descripcion}</div>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition mt-2 md:mt-0" on:click={() => verDetalle(hotel.id)}>{$t('hotels.detail')}</button>
        </li>
      {/each}
    </ul>
  {/if}
</section>
