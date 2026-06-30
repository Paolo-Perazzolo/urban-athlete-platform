<script>
  import { onDestroy, onMount, tick } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import 'leaflet/dist/leaflet.css';

  let spots = [];
  let filteredSpots = [];
  let loading = true;
  let error = '';
  let selectedCity = 'all';
  let selectedEquipment = [];
  let currentView = 'list';
  let availableEquipment = [];
  let galleryIndexes = {};
  let lightboxSpot = null;
  let lightboxIndex = 0;
  let selectedSpot = null;
  let mapContainer;
  let mapInstance = null;
  let markerLayer = null;
  let L = null;

  const DEFAULT_CENTER = [45.65, 13.77];
  const DEFAULT_ZOOM = 8;

  async function scheduleMapInvalidate() {
    await tick();
    mapInstance?.invalidateSize();
  }

  onMount(async () => {
    const leafletModule = await import('leaflet');
    L = leafletModule.default;

    const { data, error: loadError } = await supabase
      .from('spots')
      .select('*')
      .order('avg_rating', { ascending: false });

    if (loadError) {
      error = loadError.message;
    } else {
      spots = data || [];
      availableEquipment = [...new Set(spots.flatMap((spot) => spot.equipment || []))].sort();
    }

    loading = false;
  });

  function toggleEquipment(equipment) {
    if (selectedEquipment.includes(equipment)) {
      selectedEquipment = selectedEquipment.filter((item) => item !== equipment);
      return;
    }
    selectedEquipment = [...selectedEquipment, equipment];
  }

  function formatEquipmentLabel(value) {
    return String(value || '')
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function getSpotLatLng(spot) {
    const lat = Number(spot.latitude);
    const lng = Number(spot.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return [lat, lng];
  }

  function ensureMapReady() {
    if (mapInstance || !mapContainer || currentView !== 'map' || !L) return;

    mapInstance = L.map(mapContainer, { zoomControl: true }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(mapInstance);

    markerLayer = L.layerGroup().addTo(mapInstance);
    refreshMarkers();

    setTimeout(() => {
      mapInstance?.invalidateSize();
    }, 0);
  }

  function refreshMarkers() {
    if (!mapInstance || !markerLayer || !L) return;

    markerLayer.clearLayers();
    const bounds = [];

    filteredSpots.forEach((spot) => {
      const latLng = getSpotLatLng(spot);
      if (!latLng) return;

      bounds.push(latLng);

      const marker = L.circleMarker(latLng, {
        radius: 8,
        color: '#000000',
        weight: 2,
        fillColor: '#ffd54a',
        fillOpacity: 1
      });

      marker.on('click', () => {
        openSpotSidebar(spot);
      });

      markerLayer.addLayer(marker);
    });

    if (bounds.length === 1) {
      mapInstance.setView(bounds[0], 13);
    } else if (bounds.length > 1) {
      mapInstance.fitBounds(bounds, { padding: [30, 30] });
    } else {
      mapInstance.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }

  onDestroy(() => {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
      markerLayer = null;
    }
  });

  function getSpotKey(spot) {
    return spot.id || spot.name;
  }

  function getSpotImages(spot) {
    return [1, 2, 3].map((slot) => ({
      label: `${spot.name} · Photo ${slot}`
    }));
  }

  function getCurrentImageIndex(spot) {
    const key = getSpotKey(spot);
    return galleryIndexes[key] ?? 0;
  }

  function setImageIndex(spot, newIndex) {
    const key = getSpotKey(spot);
    galleryIndexes = {
      ...galleryIndexes,
      [key]: newIndex
    };
  }

  function previousImage(spot) {
    const images = getSpotImages(spot);
    const current = getCurrentImageIndex(spot);
    const next = (current - 1 + images.length) % images.length;
    setImageIndex(spot, next);
  }

  function nextImage(spot) {
    const images = getSpotImages(spot);
    const current = getCurrentImageIndex(spot);
    const next = (current + 1) % images.length;
    setImageIndex(spot, next);
  }

  function openLightbox(spot) {
    lightboxSpot = spot;
    lightboxIndex = getCurrentImageIndex(spot);
  }

  function closeLightbox() {
    lightboxSpot = null;
  }

  function closeSpotSidebar() {
    selectedSpot = null;
  }

  function openSpotSidebar(spot) {
    selectedSpot = spot;
  }

  function lightboxPrevious() {
    if (!lightboxSpot) return;
    const images = getSpotImages(lightboxSpot);
    lightboxIndex = (lightboxIndex - 1 + images.length) % images.length;
    setImageIndex(lightboxSpot, lightboxIndex);
  }

  function lightboxNext() {
    if (!lightboxSpot) return;
    const images = getSpotImages(lightboxSpot);
    lightboxIndex = (lightboxIndex + 1) % images.length;
    setImageIndex(lightboxSpot, lightboxIndex);
  }

  $: filteredSpots = spots.filter((spot) => {
    const cityMatch = selectedCity === 'all' || spot.city === selectedCity;
    const equipmentMatch =
      selectedEquipment.length === 0 ||
      selectedEquipment.some((item) => (spot.equipment || []).includes(item));

    return cityMatch && equipmentMatch;
  });

  $: if (currentView === 'map' && mapContainer && L && !mapInstance) {
    ensureMapReady();
  }

  $: if (currentView === 'map' && mapInstance) {
    filteredSpots;
    refreshMarkers();
    scheduleMapInvalidate();
  }

  $: if (selectedSpot && !filteredSpots.some((spot) => (spot.id || spot.name) === (selectedSpot.id || selectedSpot.name))) {
    selectedSpot = null;
  }
</script>

<div class="min-h-screen bg-neutral-950 py-12 px-4">
  <div class="max-w-7xl mx-auto">
    <div class="mb-10">
      <h1 class="text-4xl font-bold text-neutral-100 mb-3">Training Spots</h1>
      <p class="text-xl text-neutral-400">Discover outdoor training locations in Trieste and Milan</p>
    </div>

    <div class="card p-5 mb-4 space-y-5">
      <div class="grid md:grid-cols-1 gap-4">
        <div>
          <label for="city-filter" class="block text-sm font-medium text-neutral-300 mb-2">City</label>
          <select id="city-filter" bind:value={selectedCity} class="input w-full">
            <option value="all">All Cities</option>
            <option value="trieste">Trieste</option>
            <option value="milan">Milan</option>
          </select>
        </div>
      </div>

      <div>
        <p class="block text-sm font-medium text-neutral-300 mb-2">Equipment Filter</p>
        <div class="flex flex-wrap gap-2">
          {#if availableEquipment.length === 0}
            <span class="text-sm text-neutral-500">No equipment tags found.</span>
          {:else}
            {#each availableEquipment as equipment}
              <button
                on:click={() => toggleEquipment(equipment)}
                class="px-3 py-1 text-xs rounded-sm border transition-colors {selectedEquipment.includes(equipment)
                  ? 'border-neutral-100 bg-neutral-900 text-neutral-100'
                  : 'border-neutral-700 bg-neutral-950 text-neutral-300 hover:border-neutral-500'}"
              >
                {formatEquipmentLabel(equipment)}
              </button>
            {/each}
          {/if}
        </div>

        {#if selectedEquipment.length > 0}
          <button
            on:click={() => (selectedEquipment = [])}
            class="text-xs text-neutral-400 hover:text-neutral-200 mt-3"
          >
            Clear equipment filters
          </button>
        {/if}
      </div>
    </div>

    <div class="card p-5 mb-8">
      <p class="block text-sm font-medium text-neutral-300 mb-2">View Mode</p>
      <div class="grid grid-cols-2 gap-2 md:max-w-sm">
        <button
          on:click={() => (currentView = 'list')}
          class="btn {currentView === 'list' ? 'btn-primary' : 'btn-accent'}"
        >
          List View
        </button>
        <button
          on:click={() => (currentView = 'map')}
          class="btn {currentView === 'map' ? 'btn-primary' : 'btn-accent'}"
        >
          Map View
        </button>
      </div>
    </div>

    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-300"></div>
        <p class="mt-4 text-neutral-400">Loading spots...</p>
      </div>
    {:else if error}
      <div class="card p-8 bg-neutral-900 border border-red-900">
        <p class="text-red-300 font-medium">{error}</p>
      </div>
    {:else if currentView === 'map'}
      <div class="card p-0 overflow-hidden">
        <div class="relative h-[560px]">
          {#if selectedSpot}
            <aside class="absolute left-0 top-0 bottom-0 w-full sm:w-[360px] z-[1000] pointer-events-auto bg-neutral-900 border-r border-neutral-800 overflow-y-auto">
              <div class="p-4 border-b border-neutral-800 flex items-center justify-between">
                <h3 class="text-neutral-100 font-semibold">Spot Details</h3>
                <button
                  on:click={closeSpotSidebar}
                  class="text-neutral-400 hover:text-neutral-100"
                  aria-label="Close spot details"
                >
                  ✕
                </button>
              </div>

              <div class="p-4">
                <h4 class="text-xl font-bold text-neutral-100 mb-1">{selectedSpot.name}</h4>
                <p class="text-xs uppercase tracking-[0.12em] text-neutral-500 mb-4">{selectedSpot.city}</p>

                <div class="relative mb-4">
                  <button
                    on:click={() => openLightbox(selectedSpot)}
                    class="w-full aspect-video rounded-sm border border-neutral-800 bg-neutral-950 text-neutral-300 flex items-center justify-center"
                  >
                    <span class="text-xs">{getSpotImages(selectedSpot)[getCurrentImageIndex(selectedSpot)].label}</span>
                  </button>

                  <button
                    on:click={() => previousImage(selectedSpot)}
                    class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-100 hover:border-neutral-500"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    on:click={() => nextImage(selectedSpot)}
                    class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-100 hover:border-neutral-500"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </div>

                <p class="text-sm text-neutral-400 mb-4">
                  {selectedSpot.description || 'No description available.'}
                </p>

                <div class="flex items-center justify-between text-sm mb-4">
                  <span class="text-neutral-300">⭐ {selectedSpot.avg_rating ?? 0}</span>
                  <span class="text-neutral-500">{selectedSpot.review_count ?? 0} reviews</span>
                </div>

                {#if selectedSpot.equipment?.length}
                  <div class="flex flex-wrap gap-2">
                    {#each selectedSpot.equipment as item}
                      <span class="px-2 py-1 text-xs rounded-sm bg-neutral-950 border border-neutral-800 text-neutral-300">
                        {formatEquipmentLabel(item)}
                      </span>
                    {/each}
                  </div>
                {/if}
              </div>
            </aside>
          {/if}

          <div class="absolute inset-0 z-0" bind:this={mapContainer}></div>
        </div>

        {#if filteredSpots.length === 0}
          <p class="text-sm text-neutral-500 p-3">No spots match the current filters.</p>
        {/if}
      </div>
    {:else if filteredSpots.length === 0}
      <div class="card p-10 text-center">
        <h2 class="text-2xl font-bold text-neutral-100 mb-3">No spots found</h2>
        <p class="text-neutral-400">Try changing city or equipment filters.</p>
      </div>
    {:else}
      <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {#each filteredSpots as spot}
          <article class="card p-6 bg-neutral-900/90 border-neutral-800">
            <div class="flex items-start justify-between gap-3 mb-3">
              <h2 class="text-xl font-bold text-neutral-100">{spot.name}</h2>
              <span class="text-xs uppercase tracking-[0.12em] text-neutral-500">{spot.city}</span>
            </div>

            <div class="relative mb-4">
              <button
                on:click={() => openLightbox(spot)}
                class="w-full aspect-video rounded-sm border border-neutral-800 bg-neutral-950 text-neutral-400 flex items-center justify-center hover:border-neutral-600 transition-colors"
              >
                <span class="text-xs">{getSpotImages(spot)[getCurrentImageIndex(spot)].label}</span>
              </button>

              <button
                on:click={() => previousImage(spot)}
                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-200 hover:border-neutral-500"
                aria-label="Previous image"
              >
                ←
              </button>

              <button
                on:click={() => nextImage(spot)}
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-200 hover:border-neutral-500"
                aria-label="Next image"
              >
                →
              </button>

              <div class="mt-2 text-[11px] text-neutral-500 text-center">
                {getCurrentImageIndex(spot) + 1} / {getSpotImages(spot).length}
              </div>
            </div>

            <p class="text-neutral-400 text-sm mb-4 line-clamp-3">{spot.description || 'No description available.'}</p>

            <div class="flex items-center justify-between text-sm mb-4">
              <span class="text-neutral-300">⭐ {spot.avg_rating ?? 0}</span>
              <span class="text-neutral-500">{spot.review_count ?? 0} reviews</span>
            </div>

            {#if spot.equipment?.length}
              <div class="flex flex-wrap gap-2">
                {#each spot.equipment as item}
                  <span class="px-2 py-1 text-xs rounded-sm bg-neutral-950 border border-neutral-800 text-neutral-300">
                    {formatEquipmentLabel(item)}
                  </span>
                {/each}
              </div>
            {/if}
          </article>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if lightboxSpot}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      class="absolute inset-0 bg-black/80"
      aria-label="Close image overview"
      on:click={closeLightbox}
    ></button>
    <div class="w-full max-w-4xl relative z-10">
      <div class="card p-4 bg-neutral-900 border-neutral-700">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-neutral-100 font-semibold">{lightboxSpot.name}</h3>
          <button on:click={closeLightbox} class="text-neutral-300 hover:text-neutral-100" aria-label="Close">
            ✕
          </button>
        </div>

        <div class="relative">
          <div class="w-full aspect-video rounded-sm border border-neutral-700 bg-neutral-950 text-neutral-300 flex items-center justify-center">
            <span>{getSpotImages(lightboxSpot)[lightboxIndex].label}</span>
          </div>

          <button
            on:click={lightboxPrevious}
            class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-100 hover:border-neutral-500"
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            on:click={lightboxNext}
            class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-sm border border-neutral-700 bg-neutral-950/90 text-neutral-100 hover:border-neutral-500"
            aria-label="Next image"
          >
            →
          </button>
        </div>

        <p class="text-xs text-neutral-500 text-center mt-3">
          {lightboxIndex + 1} / {getSpotImages(lightboxSpot).length}
        </p>
      </div>
    </div>
  </div>
{/if}
