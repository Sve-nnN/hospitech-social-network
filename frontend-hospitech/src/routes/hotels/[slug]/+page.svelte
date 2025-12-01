<script>
    import PostCard from '$lib/ui/PostCard.svelte';
    import Card from '$lib/ui/Card.svelte';
    import Badge from '$lib/ui/Badge.svelte';
    import Button from '$lib/ui/Button.svelte';

    let { data } = $props();
    let hotel = $derived(data.hotel);
    let posts = $derived(data.posts);
</script>

<div class="max-w-2xl mx-auto py-8 px-4 animate-fade-in">
    {#if hotel}
        <Card class="mb-8 overflow-hidden">
            <!-- Hero Image -->
            {#if hotel.imagenes_url && hotel.imagenes_url.length > 0}
                <div class="h-64 relative overflow-hidden">
                    <img src={hotel.imagenes_url[0]} alt={hotel.nombre} class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h1 class="font-display font-bold text-3xl mb-2">{hotel.nombre}</h1>
                        <div class="flex items-center gap-2 text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                            </svg>
                            <span>{hotel.direccion?.ciudad}, {hotel.direccion?.pais}</span>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="h-64 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                </div>
            {/if}
            
            <div class="p-6">
                <!-- Stats -->
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="text-center p-4 bg-primary-50 rounded-lg">
                        <div class="text-3xl font-bold text-primary-600">{hotel.num_reviews || 0}</div>
                        <div class="text-sm text-gray-600">Reviews</div>
                    </div>
                    <div class="text-center p-4 bg-amber-50 rounded-lg">
                        <div class="flex items-center justify-center gap-1 mb-1">
                            <svg class="w-6 h-6 text-amber-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            <span class="text-3xl font-bold text-amber-600">{hotel.avg_rating ? hotel.avg_rating.toFixed(1) : 'N/A'}</span>
                        </div>
                        <div class="text-sm text-gray-600">Average Rating</div>
                    </div>
                </div>

                {#if hotel.direccion?.calle}
                    <p class="text-sm text-gray-600 mb-4">{hotel.direccion.calle}</p>
                {/if}

                <Button variant="primary" size="lg" class="w-full gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Book Now
                </Button>
            </div>
        </Card>
    {/if}

    <h2 class="font-display font-bold text-2xl text-gray-900 mb-6">Guest Reviews</h2>
    
    {#if posts.length === 0}
        <Card>
            <div class="p-12 text-center">
                <div class="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-primary-600">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <p class="text-gray-600 font-medium mb-2">No reviews yet</p>
                <p class="text-sm text-gray-500">Be the first to review this hotel!</p>
            </div>
        </Card>
    {:else}
        <div class="space-y-4">
            {#each posts as post (post._id)}
                <PostCard {post} />
            {/each}
        </div>
    {/if}
</div>
