<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError } from '$lib/ui/globalFeedback';
  import { t } from '$lib/i18n';
  import { HotelService } from '$lib/Contexts/Content/Application/hotelService';
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { MapPin, Star, Plus } from "lucide-svelte";

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

  function verDetalle(idOrSlug) {
    if (!idOrSlug) return;
    const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
    if (isId) {
        goto(`/hotel/${idOrSlug}`);
    } else {
        goto(`/hotels/${idOrSlug}`);
    }
  }
</script>

<div class="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
  <div class="flex justify-between items-center mb-8">
    <div>
      <h1 class="font-display font-bold text-3xl mb-1">{$t('hotels.title')}</h1>
      <p class="text-muted-foreground">Discover and share your favorite stays.</p>
    </div>
    <Button href="/hotels/new" class="gap-2">
      <Plus class="h-4 w-4" />
      Add Hotel
    </Button>
  </div>

  {#if hoteles.length === 0}
    <Card.Root class="border-dashed">
      <div class="p-12 text-center">
        <p class="text-muted-foreground">{$t('hotels.noHotels')}</p>
      </div>
    </Card.Root>
  {:else}
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each hoteles as hotel}
        <Card.Root class="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
          {#if hotel.imagenes_url && hotel.imagenes_url.length > 0}
            <div class="h-48 w-full overflow-hidden">
              <img src={hotel.imagenes_url[0]} alt={hotel.nombre} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          {/if}
          <Card.Header>
            <Card.Title class="flex justify-between items-start gap-2">
              <span class="truncate">{hotel.nombre}</span>
              {#if hotel.estrellas}
                <Badge variant="secondary" class="shrink-0 gap-1">
                  {hotel.estrellas} <Star class="h-3 w-3 fill-current" />
                </Badge>
              {/if}
            </Card.Title>
            <Card.Description class="flex items-center gap-1">
              <MapPin class="h-3 w-3" />
              {hotel.direccion?.ciudad || hotel.ciudad || 'Unknown City'}
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <p class="text-sm text-muted-foreground line-clamp-3">
              {hotel.descripcion || 'No description available.'}
            </p>
          </Card.Content>
          <Card.Footer>
            <Button variant="secondary" class="w-full" onclick={() => verDetalle(hotel.slug || hotel._id || hotel.id)}>
              {$t('hotels.detail')}
            </Button>
          </Card.Footer>
        </Card.Root>
      {/each}
    </div>
  {/if}
</div>
