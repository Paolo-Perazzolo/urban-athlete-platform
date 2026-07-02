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
  let showFilters = false;
  let availableEquipment = [];
  let galleryIndexes = {};
  let lightboxSpot = null;
  let lightboxIndex = 0;
  let selectedSpot = null;
  let mapContainer;
  let mapInstance = null;
  let markerLayer = null;
  let L = null;

  const FILTERS_KEY = 'ua_spots_filters';
  const SPOT_PHOTO_SOURCES = [
    '/images/spots/image1.webp',
    '/images/spots/image2.webp',
    '/images/spots/image3.jpg',
    '/images/spots/image4.jpg',
    '/images/spots/image5.webp',
    '/images/spots/image6.jpg',
    '/images/spots/image7.jpg',
    '/images/spots/image7.jpeg',
    '/images/spots/image8.jpg',
    '/images/spots/image9.jpg',
    '/images/spots/image10.jpg'
  ];

  const DEFAULT_CENTER = [45.65, 13.77];
  const DEFAULT_ZOOM = 8;

  async function scheduleMapInvalidate() {
    await tick();
    mapInstance?.invalidateSize();
  }

  onMount(async () => {
    restoreFilters();

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
      selectedEquipment = selectedEquipment.filter((equipment) => availableEquipment.includes(equipment));
    }

    loading = false;
  });

  function restoreFilters() {
    if (typeof window === 'undefined') return;

    try {
      const savedFilters = sessionStorage.getItem(FILTERS_KEY);
      if (!savedFilters) return;

      const parsed = JSON.parse(savedFilters);
      selectedCity = parsed.selectedCity ?? selectedCity;
      selectedEquipment = Array.isArray(parsed.selectedEquipment) ? parsed.selectedEquipment : selectedEquipment;
      currentView = parsed.currentView ?? currentView;
    } catch (_) {
      // Ignore invalid session payload
    }
  }

  function saveFilters() {
    if (typeof window === 'undefined') return;

    try {
      sessionStorage.setItem(
        FILTERS_KEY,
        JSON.stringify({ selectedCity, selectedEquipment, currentView })
      );
    } catch (_) {
      // Ignore storage issues
    }
  }

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

  function getStableOffset(value, modulo) {
    const text = String(value || '');
    let hash = 0;

    for (let index = 0; index < text.length; index += 1) {
      hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }

    return modulo > 0 ? hash % modulo : 0;
  }

  function getSpotImages(spot) {
    const offset = getStableOffset(getSpotKey(spot), SPOT_PHOTO_SOURCES.length);
    const rotatedSources = SPOT_PHOTO_SOURCES.map(
      (_, index) => SPOT_PHOTO_SOURCES[(index + offset) % SPOT_PHOTO_SOURCES.length]
    );
    const selectedSources = rotatedSources.slice(0, 2);

    return selectedSources.map((src, index) => ({
      src,
      label: `${spot.name} · Photo ${index + 1}`
    }));
  }

  function getCurrentSpotImage(spot) {
    const images = getSpotImages(spot);
    return images[getCurrentImageIndex(spot)] ?? images[0];
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

  function closeFilters() {
    showFilters = false;
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

  $: saveFilters();

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
      <div class="grid gap-4">
        <div>
          <label for="city-filter" class="block text-sm font-medium text-neutral-300 mb-2">City</label>
          <select id="city-filter" bind:value={selectedCity} class="input w-full pr-12">
            <option value="all">All Cities</option>
            <option value="trieste">Trieste</option>
            <option value="milan">Milan</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-between gap-3 md:hidden">
        <div>
          <p class="text-sm font-medium text-neutral-200">Equipment Filters</p>
          <p class="text-xs text-neutral-500">
            {selectedEquipment.length === 0
              ? 'No equipment filter selected'
              : `${selectedEquipment.length} selected`}
          </p>
        </div>
        <button on:click={() => (showFilters = true)} class="btn btn-accent min-h-[44px]">
          Edit Filters
        </button>
      </div>

      <div class="hidden md:block">
        <p class="block text-sm font-medium text-neutral-300 mb-2">Equipment Filter</p>
        <div class="flex flex-wrap gap-2">
          {#if availableEquipment.length === 0}
            <span class="text-sm text-neutral-500">No equipment tags found.</span>
          {:else}
            {#each availableEquipment as equipment}
              <button
                on:click={() => toggleEquipment(equipment)}
                class="px-3 py-2 min-h-[44px] text-sm rounded-sm border transition-colors {selectedEquipment.includes(equipment)
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

    <div class="mb-8 grid grid-cols-2 gap-2">
      <button
        on:click={() => (currentView = 'list')}
        class="btn flex items-center justify-center gap-2 {currentView === 'list' ? 'btn-primary' : 'btn-accent'}"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" aria-hidden="true">
          <path d="M8 7h12M8 12h12M8 17h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          <circle cx="4" cy="7" r="1" fill="currentColor" />
          <circle cx="4" cy="12" r="1" fill="currentColor" />
          <circle cx="4" cy="17" r="1" fill="currentColor" />
        </svg>
        <span>List View</span>
      </button>
      <button
        on:click={() => (currentView = 'map')}
        class="btn flex items-center justify-center gap-2 {currentView === 'map' ? 'btn-primary' : 'btn-accent'}"
      >
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" aria-hidden="true">
          <path d="M4 6.5 9 4l6 2.5L20 4v13.5L15 20l-6-2.5L4 20V6.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
          <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <span>Map View</span>
      </button>
    </div>

    {#if showFilters}
      <div class="fixed inset-0 z-50 md:hidden">
        <button
          type="button"
          class="absolute inset-0 bg-black/70"
          aria-label="Close filters"
          on:click={closeFilters}
        ></button>

        <div class="absolute inset-x-0 bottom-0 rounded-t-2xl border border-neutral-800 bg-neutral-900 p-5 max-h-[78vh] overflow-y-auto">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-neutral-100">Equipment Filters</h2>
            <button
              on:click={closeFilters}
              class="h-10 w-10 rounded-sm border border-neutral-700 text-neutral-300 hover:text-neutral-100"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>

          {#if availableEquipment.length === 0}
            <span class="text-sm text-neutral-500">No equipment tags found.</span>
          {:else}
            <div class="flex flex-wrap gap-2">
              {#each availableEquipment as equipment}
                <button
                  on:click={() => toggleEquipment(equipment)}
                  class="px-3 py-2 min-h-[44px] text-sm rounded-sm border transition-colors {selectedEquipment.includes(equipment)
                    ? 'border-neutral-100 bg-neutral-950 text-neutral-100'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:border-neutral-500'}"
                >
                  {formatEquipmentLabel(equipment)}
                </button>
              {/each}
            </div>
          {/if}

          <div class="mt-6 flex gap-3">
            <button
              on:click={() => (selectedEquipment = [])}
              class="btn btn-accent flex-1 min-h-[44px]"
              disabled={selectedEquipment.length === 0}
            >
              Clear
            </button>
            <button on:click={closeFilters} class="btn btn-primary flex-1 min-h-[44px]">
              Apply
            </button>
          </div>
        </div>
      </div>
    {/if}

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
                    type="button"
                    on:click={() => openLightbox(selectedSpot)}
                    class="w-full aspect-video overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950"
                  >
                    <img
                      src={getCurrentSpotImage(selectedSpot).src}
                      alt={getCurrentSpotImage(selectedSpot).label}
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </button>

                  <div class="pointer-events-none absolute bottom-2 right-2 rounded-sm border border-neutral-700/70 bg-black/40 p-1.5 text-neutral-100/90">
                    <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                      <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5" />
                      <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                      <path d="m7 15 3-3 2.5 2.5L14 13l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
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
        {#each filteredSpots as spot (getSpotKey(spot))}
          <article class="card p-6 bg-neutral-900/90 border-neutral-800">
            <div class="flex items-start justify-between gap-3 mb-3">
              <h2 class="text-xl font-bold text-neutral-100">{spot.name}</h2>
              <span class="text-xs uppercase tracking-[0.12em] text-neutral-500">{spot.city}</span>
            </div>

            <div class="relative mb-4">
              <button
                type="button"
                on:click={() => openLightbox(spot)}
                class="w-full aspect-video overflow-hidden rounded-sm border border-neutral-800 bg-neutral-950 hover:border-neutral-600 transition-colors"
              >
                <img
                  src={getCurrentSpotImage(spot).src}
                  alt={getCurrentSpotImage(spot).label}
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>

              <div class="pointer-events-none absolute bottom-2 right-2 rounded-sm border border-neutral-700/70 bg-black/40 p-1.5 text-neutral-100/90">
                <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" aria-hidden="true">
                  <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5" />
                  <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                  <path d="m7 15 3-3 2.5 2.5L14 13l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
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
          <div class="w-full aspect-video overflow-hidden rounded-sm border border-neutral-700 bg-neutral-950">
            <img
              src={getSpotImages(lightboxSpot)[lightboxIndex].src}
              alt={getSpotImages(lightboxSpot)[lightboxIndex].label}
              class="h-full w-full object-cover"
            />
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
