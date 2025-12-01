<script>
  import { onMount } from 'svelte';
  import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';
  import { showError, showSuccess } from '$lib/ui/globalFeedback';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { derived } from 'svelte/store';
  import { Button } from "$lib/components/ui/button";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import { Image, MapPin, Star, X } from "lucide-svelte";
  import { cn } from "$lib/utils";

  // Reactive current user from auth store
  let user = derived(authStore, (s) => s?.user);

  // Local state
  let content = '';
  let hotels = [];
  let selectedHotel = null;
  let rating = 5;
  let isSubmitting = false;
  let imageUrl = '';
  let showHotelDropdown = false;
  let hotelSearch = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/hotels');
      if (res.ok) {
        const data = await res.json();
        hotels = Array.isArray(data) ? data : (data.hotels || []);
      }
    } catch (e) {
      console.error('Error loading hotels', e);
    }
  });

  async function handlePost() {
      if (!content.trim()) return showError('Please write something');
      if (!selectedHotel) return showError('Please select a hotel');
      
      isSubmitting = true;
      try {
          const postData = {
              contenido: content,
              rating,
              hotel_id: selectedHotel._id,
              imagenes_url: imageUrl ? [imageUrl] : []
          };

          const res = await PostApi.createPost(postData, fetch, $authStore.token);

          if (res.ok) {
              content = '';
              imageUrl = '';
              rating = 5;
              selectedHotel = null;
              hotelSearch = '';
              showSuccess('Post created successfully!');
              window.location.reload(); 
          } else {
              const error = await res.json();
              showError(error.msg || 'Error creating post');
          }
      } catch (e) {
          showError('Error creating post');
      } finally {
          isSubmitting = false;
      }
  }

  function selectHotel(hotel) {
    selectedHotel = hotel;
    hotelSearch = hotel.nombre;
    showHotelDropdown = false;
  }
</script>

{#if $user}
  <Card.Root class="mb-6 border-border/50 bg-card/50 backdrop-blur-sm">
    <Card.Content class="p-4 space-y-4">
      <div class="flex gap-4">
        <Avatar.Root>
          <Avatar.Image src={$user.imagen_perfil_url} alt={$user.username} />
          <Avatar.Fallback>{$user.username?.[0]?.toUpperCase() || 'U'}</Avatar.Fallback>
        </Avatar.Root>
        <div class="flex-1 space-y-2">
          <Textarea 
            placeholder="Share your experience..." 
            bind:value={content}
            class="min-h-[80px] bg-transparent border-none resize-none focus-visible:ring-0 p-0 text-lg placeholder:text-muted-foreground/50"
          />
          
          {#if imageUrl}
            <div class="relative w-full h-48 rounded-md overflow-hidden group">
              <img src={imageUrl} alt="Preview" class="w-full h-full object-cover" />
              <button 
                class="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                onclick={() => imageUrl = ''}
              >
                <X class="h-4 w-4" />
              </button>
            </div>
          {/if}
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 pt-2 border-t border-border/50">
        <!-- Hotel Selector -->
        <div class="relative flex-1">
          <div class="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border border-transparent focus-within:border-primary/50 transition-colors">
            <MapPin class="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              class="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-muted-foreground"
              placeholder="Select Hotel..."
              bind:value={hotelSearch}
              onfocus={() => showHotelDropdown = true}
            />
          </div>
          
          {#if showHotelDropdown && hotels.length > 0}
            <div class="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto p-1">
              {#each hotels.filter(h => h.nombre.toLowerCase().includes(hotelSearch.toLowerCase())) as hotel}
                <button
                  class="w-full text-left px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  onclick={() => selectHotel(hotel)}
                >
                  <div class="font-medium">{hotel.nombre}</div>
                  <div class="text-xs text-muted-foreground">{hotel.direccion?.ciudad}</div>
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Rating -->
        <div class="flex items-center gap-1 px-3 py-2 bg-muted/50 rounded-md">
          {#each Array(5) as _, i}
            <button onclick={() => rating = i + 1} class="focus:outline-none hover:scale-110 transition-transform">
              <Star class={cn("h-4 w-4", i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground")} />
            </button>
          {/each}
        </div>

        <!-- Image Input Toggle (Simplified) -->
        <div class="relative">
           <Input 
             placeholder="Image URL..." 
             bind:value={imageUrl} 
             class="h-full bg-muted/50 border-transparent focus-visible:border-primary/50"
           />
        </div>

        <Button onclick={handlePost} disabled={isSubmitting || !content.trim() || !selectedHotel} class="ml-auto">
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </Card.Content>
  </Card.Root>
{/if}
