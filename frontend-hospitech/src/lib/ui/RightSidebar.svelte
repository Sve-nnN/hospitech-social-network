/**
 * @fileoverview Right sidebar with suggested hotels
 * @author Juan Carlos Angulo
 * @component RightSidebar
 */

<script>
  const suggestedHotels = [
    { name: 'The Coastal Lodge', location: 'Bali, Indonesia' },
    { name: 'Mountain View Resort', location: 'Swiss Alps' },
    { name: 'Urban Boutique Hotel', location: 'Tokyo, Japan' },
  ];
</script>

<div class="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto hidden lg:block">
  <div>
    <h3 class="font-semibold text-gray-600 text-sm mb-3">Suggested Hotels</h3>
    
    <div class="space-y-2">
      {#each suggestedHotels as hotel}
        <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
          <div class="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-semibold text-sm flex-shrink-0">
            {hotel.name[0]}
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="font-medium text-sm text-gray-900 truncate">{hotel.name}</h4>
            <p class="text-xs text-gray-500 truncate">{hotel.location}</p>
          </div>
          <button class="text-primary-600 hover:bg-primary-50 px-3 py-1 rounded-md text-sm font-medium transition-colors">
            Follow
          </button>
        </div>
      {/each}
    </div>
  </div>
</div>
