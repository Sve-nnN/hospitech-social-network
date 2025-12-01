<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { showLoading, hideLoading, showError, showSuccess } from '$lib/ui/globalFeedback';
  import { HotelService } from '$lib/Contexts/Content/Application/hotelService';
  import { UserApi } from '$lib/Contexts/IAM/Infrastructure/userApi';
  import type { IHotel } from '$lib/Contexts/Content/Domain/Hotel';
  import PostCard from '$lib/ui/PostCard.svelte';
  import { Button } from "$lib/components/ui/button";
  import * as Card from "$lib/components/ui/card";
  import { Badge } from "$lib/components/ui/badge";
  import { Separator } from "$lib/components/ui/separator";
  import { MapPin, Star, Hotel as HotelIcon, Users } from "lucide-svelte";

  export let data; // SvelteKit load data if used, but we are using params from page store usually or export let params
  export let params; // SvelteKit params

  let hotel: IHotel | null = null;
  let posts: any[] = [];
  let user = null;
  let isFollowing = false;
  let loading = true;

  onMount(async () => {
    const auth = get(authStore);
    if (!auth.user) {
      goto('/auth');
      return;
    }
    user = auth.user;
    
    try {
      showLoading();
      const [hotelData, hotelPosts] = await Promise.all([
        HotelService.getHotel({ hotelId: params.id, fetch }),
        HotelService.getHotelPosts(params.id, fetch, auth.token)
      ]);

      if (!hotelData) throw new Error('No encontrado');
      hotel = hotelData;
      posts = hotelPosts || [];

      // Check if following
      if (user.following_hotels && user.following_hotels.includes(hotel._id)) {
        isFollowing = true;
      }
    } catch (e) {
      showError('Hotel no encontrado o error al cargar datos');
    } finally {
      hideLoading();
      loading = false;
    }
  });

  async function toggleFollow() {
    if (!hotel || !user) return;
    try {
      const res = await UserApi.followHotel(hotel._id, fetch, get(authStore).token);
      if (res.ok) {
        isFollowing = !isFollowing; // Optimistic update, though API usually returns status
        showSuccess(isFollowing ? 'Siguiendo hotel' : 'Dejaste de seguir al hotel'); // Logic might need adjustment based on API toggle behavior
        // Ideally reload user profile to sync state
      } else {
        showError('Error al seguir hotel');
      }
    } catch (e) {
      showError('Error de conexión');
    }
  }
</script>

<div class="container max-w-4xl mx-auto py-8 px-4">
  {#if loading}
    <div class="flex justify-center p-8">Cargando...</div>
  {:else if hotel}
    <Card.Root class="mb-8">
      <div class="relative h-64 w-full bg-muted overflow-hidden rounded-t-lg">
        {#if hotel.imagenes_url && hotel.imagenes_url.length > 0}
          <img src={hotel.imagenes_url[0]} alt={hotel.nombre} class="w-full h-full object-cover" />
        {:else}
          <div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <HotelIcon class="h-24 w-24" />
          </div>
        {/if}
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
          <h1 class="text-4xl font-bold text-white mb-2">{hotel.nombre}</h1>
          <div class="flex items-center text-white/90 gap-4">
            <div class="flex items-center gap-1">
              <MapPin class="h-4 w-4" />
              <span>{hotel.direccion?.ciudad}, {hotel.direccion?.pais}</span>
            </div>
            {#if hotel.estrellas}
              <div class="flex items-center gap-1">
                <Star class="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{hotel.estrellas} Estrellas</span>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <Card.Content class="p-6">
        <div class="flex justify-between items-start gap-4 mb-6">
          <div class="space-y-4 flex-1">
            <div>
              <h3 class="font-semibold text-lg mb-2">Sobre este hotel</h3>
              <p class="text-muted-foreground leading-relaxed">
                {hotel.descripcion || 'Sin descripción disponible.'}
              </p>
            </div>
            
            <div class="flex gap-4">
              <div class="flex flex-col items-center p-3 bg-muted rounded-lg min-w-[100px]">
                <span class="text-2xl font-bold">{hotel.avg_rating?.toFixed(1) || '0.0'}</span>
                <span class="text-xs text-muted-foreground">Rating Promedio</span>
              </div>
              <div class="flex flex-col items-center p-3 bg-muted rounded-lg min-w-[100px]">
                <span class="text-2xl font-bold">{hotel.num_reviews || 0}</span>
                <span class="text-xs text-muted-foreground">Reseñas</span>
              </div>
            </div>
          </div>

          <Button 
            variant={isFollowing ? "secondary" : "default"} 
            class="min-w-[120px]"
            onclick={toggleFollow}
          >
            {isFollowing ? 'Siguiendo' : 'Seguir'}
          </Button>
        </div>
      </Card.Content>
    </Card.Root>

    <div class="space-y-6">
      <h2 class="text-2xl font-bold flex items-center gap-2">
        <Users class="h-6 w-6" />
        Experiencias de usuarios
      </h2>
      <Separator />
      
      {#if posts.length > 0}
        <div class="grid gap-6">
          {#each posts as post (post._id)}
            <PostCard {post} />
          {/each}
        </div>
      {:else}
        <div class="text-center py-12 text-muted-foreground bg-muted/30 rounded-lg">
          <p>Aún no hay publicaciones sobre este hotel.</p>
        </div>
      {/if}
    </div>

  {:else}
    <div class="text-center py-12">
      <h2 class="text-xl font-semibold mb-2">Hotel no encontrado</h2>
      <Button variant="outline" href="/hotels">Volver a la lista</Button>
    </div>
  {/if}
</div>
