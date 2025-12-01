/**
 * @fileoverview Post creation component with hotel selection and rating
 * @author Juan Carlos Angulo
 * @component CreatePost
 */

<script>
  import { onMount } from 'svelte';
  import { authStore } from '$lib/Contexts/IAM/Application/authStore';
  import { PostApi } from '$lib/Contexts/Posts/Infrastructure/postApi';
  import { showError } from '$lib/ui/globalFeedback';
  import Avatar from '$lib/ui/Avatar.svelte';
  import Button from '$lib/ui/Button.svelte';
  
  let user = $derived($authStore.user);
  let content = $state('');
  let hotels = $state([]);
  let selectedHotel = $state(null);
  let rating = $state(5);
  let isSubmitting = $state(false);
  let imageUrl = $state('');
  let showHotelDropdown = $state(false);
  let hotelSearch = $state('');

  const filteredHotels = $derived(
    hotels.filter(h => 
      h.nombre.toLowerCase().includes(hotelSearch.toLowerCase()) ||
      h.direccion?.ciudad.toLowerCase().includes(hotelSearch.toLowerCase())
    )
  );

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

  /**
   * Handles post submission
   * @returns {Promise<void>}
   */
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

          const res = await PostApi.createPost(postData, fetch);

          if (res.ok) {
              content = '';
              imageUrl = '';
              rating = 5;
              selectedHotel = null;
              hotelSearch = '';
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

  /**
   * Selects a hotel from the dropdown
   * @param {Object} hotel - The selected hotel object
   * @returns {void}
   */
  function selectHotel(hotel) {
    selectedHotel = hotel;
    hotelSearch = hotel.nombre;
    showHotelDropdown = false;
  }
</script>

<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
  {#if user}
    <div class="flex gap-3 mb-3">
      <Avatar 
        src={user.imagen_perfil_url}
        alt={user.username}
        size="md"
      />
      <textarea 
        class="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500 transition-all"
        placeholder="What's on your mind?"
        bind:value={content}
        disabled={isSubmitting}
        rows="1"
        onfocus={(e) => e.target.rows = 3}
        onblur={(e) => { if (!content) e.target.rows = 1 }}
      ></textarea>
    </div>
  {/if}

  {#if content}
    <div class="space-y-3 pt-3 border-t border-gray-200">
      <div class="relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">Hotel</label>
        <input
          type="text"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Search hotels..."
          bind:value={hotelSearch}
          onfocus={() => showHotelDropdown = true}
        />
        {#if showHotelDropdown && filteredHotels.length > 0}
          <div class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
            {#each filteredHotels as hotel (hotel._id)}
              <button
                type="button"
                onclick={() => selectHotel(hotel)}
                class="w-full px-4 py-2 hover:bg-gray-50 text-left transition-colors"
              >
                <div class="font-medium text-gray-900">{hotel.nombre}</div>
                <div class="text-sm text-gray-500">{hotel.direccion?.ciudad}</div>
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <div>
        <div class="flex items-center justify-between mb-1">
          <label class="text-sm font-medium text-gray-700">Rating</label>
          <div class="flex items-center gap-1">
            {#each Array(5) as _, i}
              <button
                type="button"
                onclick={() => rating = i + 1}
                class="focus:outline-none"
              >
                <svg 
                  class="w-6 h-6 {i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} transition-colors"
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
        <input 
          type="url" 
          placeholder="https://example.com/image.jpg"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          bind:value={imageUrl}
          disabled={isSubmitting}
        />
      </div>

      <Button 
        variant="primary"
        size="md"
        onclick={handlePost}
        disabled={isSubmitting || !content.trim() || !selectedHotel}
        loading={isSubmitting}
        class="w-full"
      >
        Post
      </Button>
    </div>
  {/if}
</div>
