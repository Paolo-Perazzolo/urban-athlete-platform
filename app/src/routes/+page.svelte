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
<section class="min-h-screen flex items-center justify-center bg-neutral-950">
  <div class="container-custom text-center text-neutral-100">
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
      <a href="/auth/signup" class="btn btn-accent text-lg px-8 py-4">
        {content.hero.cta_primary}
      </a>
      <a href="/spots" class="btn btn-accent text-lg px-8 py-4">
        {content.hero.cta_secondary}
      </a>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-24 bg-neutral-950 border-t border-neutral-900">
  <div class="container-custom">
    <div class="grid md:grid-cols-3 gap-12">
      <!-- Loop through features from JSON -->
      {#each content.features as feature}
        <div class="text-center">
          <!-- Icon placeholder (we'll add real icons later) -->
          <div class="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center mx-auto mb-6">
            <span class="text-3xl">🏋️</span>
          </div>
          
          <!-- Feature title -->
          <h3 class="text-2xl font-bold mb-4">
            {feature.title}
          </h3>
          
          <!-- Feature description -->
          <p class="text-neutral-400 text-lg">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Cities Section -->
<section class="py-24 bg-neutral-950 border-t border-neutral-900">
  <div class="container-custom text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      {content.cities.title}
    </h2>
    <p class="text-xl text-neutral-400 mb-12">
      {content.cities.subtitle}
    </p>
    
    <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {#each content.cities.list as city}
        <div class="card p-8">
          <div class="text-5xl mb-4">{city.flag}</div>
          <h3 class="text-3xl font-bold mb-4">{city.name}</h3>
          <div class="flex justify-center gap-8 text-neutral-400">
            <div>
              <div class="text-2xl font-bold text-neutral-100">{city.spots}</div>
              <div class="text-sm">Training Spots</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-neutral-100">{city.athletes}</div>
              <div class="text-sm">Athletes</div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Final CTA Section -->
<section class="py-24 bg-neutral-900 border-t border-neutral-800 text-neutral-100">
  <div class="container-custom text-center">
    <h2 class="text-4xl md:text-5xl font-bold mb-6">
      {content.cta_final.title}
    </h2>
    <p class="text-xl mb-12 opacity-90">
      {content.cta_final.subtitle}
    </p>
    <a href="/auth/signup" class="btn btn-primary text-lg px-12 py-4 inline-block">
      {content.cta_final.button}
    </a>
  </div>
</section>
