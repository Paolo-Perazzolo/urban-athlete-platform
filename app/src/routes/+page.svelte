<!--
  HOME PAGE
  The landing page of your app (/)
  Content comes from: src/lib/content/home.json
-->

<script>
  // Import content from JSON file
  import content from '$lib/content/home.json';
</script>

<!-- Hero Section -->
<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
  <div class="container-custom text-center text-white">
    <!-- Main Title -->
    <h1 class="text-5xl md:text-7xl font-display font-bold mb-6">
      {content.hero.title}
    </h1>
    
    <!-- Subtitle -->
    <p class="text-xl md:text-2xl mb-12 opacity-90 max-w-3xl mx-auto">
      {content.hero.subtitle}
    </p>
    
    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button class="btn btn-accent text-lg px-8 py-4">
        {content.hero.cta_primary}
      </button>
      <button class="btn bg-white text-primary-600 hover:bg-neutral-50 text-lg px-8 py-4">
        {content.hero.cta_secondary}
      </button>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-24 bg-white">
  <div class="container-custom">
    <div class="grid md:grid-cols-3 gap-12">
      <!-- Loop through features from JSON -->
      {#each content.features as feature}
        <div class="text-center">
          <!-- Icon placeholder (we'll add real icons later) -->
          <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">🏋️</span>
          </div>
          
          <!-- Feature title -->
          <h3 class="text-2xl font-bold mb-4">
            {feature.title}
          </h3>
          
          <!-- Feature description -->
          <p class="text-neutral-600 text-lg">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Cities Section -->
<section class="py-24 bg-neutral-50">
  <div class="container-custom text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      {content.cities.title}
    </h2>
    <p class="text-xl text-neutral-600 mb-12">
      {content.cities.subtitle}
    </p>
    
    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {#each content.cities.list as city}
        <div class="card p-8">
          <div class="text-5xl mb-4">{city.flag}</div>
          <h3 class="text-3xl font-bold mb-4">{city.name}</h3>
          <div class="flex justify-center gap-8 text-neutral-600">
            <div>
              <div class="text-2xl font-bold text-primary-500">{city.spots}</div>
              <div class="text-sm">Training Spots</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-accent-500">{city.athletes}</div>
              <div class="text-sm">Athletes</div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Final CTA Section -->
<section class="py-24 bg-primary-600 text-white">
  <div class="container-custom text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      {content.cta_final.title}
    </h2>
    <p class="text-xl mb-12 opacity-90">
      {content.cta_final.subtitle}
    </p>
    <button class="btn btn-accent text-lg px-12 py-4">
      {content.cta_final.button}
    </button>
  </div>
</section>
