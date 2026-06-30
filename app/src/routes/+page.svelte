<script>
  import content from '$lib/content/home.json';

  const featureVisuals = [
    { icon: '📍', label: 'Geo-Mapped Spots' },
    { icon: '⚡', label: 'Adaptive Plans' },
    { icon: '🏆', label: 'Competitive XP' }
  ];

  const heroMetrics = [
    { value: '2 Cities', label: 'Launching now' },
    { value: '25+', label: 'Outdoor spots' },
    { value: '150+', label: 'Athletes joined' }
  ];
</script>

<section class="relative overflow-hidden bg-neutral-950 border-b border-neutral-900">
  <div class="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-200/10 blur-3xl"></div>
  <div class="pointer-events-none absolute -right-32 top-24 h-72 w-72 rounded-full bg-neutral-200/10 blur-3xl"></div>

  <div class="container-custom py-24 md:py-32">
    <div class="grid lg:grid-cols-12 gap-12 items-center">
      <div class="lg:col-span-6 text-neutral-100">
        <p class="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-sm border border-neutral-800 bg-neutral-900/80 text-xs tracking-[0.14em] uppercase text-neutral-300">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-300"></span>
          Urban Athlete Collective
        </p>

        <h1 class="text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-6">
          {content.hero.title}
        </h1>

        <p class="text-lg md:text-xl text-neutral-300 max-w-xl mb-10">
          {content.hero.subtitle}
        </p>

        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <a href="/plan" class="btn btn-primary text-base md:text-lg px-8 py-4 text-center">
            {content.hero.cta_primary}
          </a>
          <a href="/spots" class="btn btn-accent text-base md:text-lg px-8 py-4 text-center">
            {content.hero.cta_secondary}
          </a>
        </div>

        <div class="grid grid-cols-3 gap-3 max-w-xl">
          {#each heroMetrics as metric}
            <div class="rounded-sm border border-neutral-800 bg-neutral-900/70 p-3">
              <p class="text-sm text-neutral-400">{metric.label}</p>
              <p class="text-lg md:text-xl font-semibold text-neutral-100">{metric.value}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="lg:col-span-6">
        <div class="relative mx-auto max-w-2xl">
          <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 sm:col-span-7 border border-neutral-800 rounded-sm overflow-hidden bg-neutral-900">
              <img
                src="/images/image1.webp"
                alt="Athlete training in the city"
                class="w-full h-72 sm:h-[28rem] object-cover"
                loading="eager"
              />
            </div>
            <div class="col-span-12 sm:col-span-5 space-y-4">
              <div class="border border-neutral-800 rounded-sm overflow-hidden bg-neutral-900">
                <img
                  src="/images/image2.webp"
                  alt="Calisthenics movement in urban environment"
                  class="w-full h-48 sm:h-64 object-cover"
                  loading="lazy"
                />
              </div>
              <div class="rounded-sm border border-neutral-800 bg-neutral-900 p-5">
                <p class="text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">Performance Layer</p>
                <p class="text-2xl font-semibold text-neutral-100 mb-1">AI-free precision</p>
                <p class="text-sm text-neutral-400">Deterministic plans adapted to your level and available equipment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="py-24 bg-neutral-950 border-b border-neutral-900">
  <div class="container-custom">
    <div class="mb-14 flex items-end justify-between gap-6 flex-wrap">
      <div>
        <p class="text-xs uppercase tracking-[0.14em] text-neutral-500 mb-2">Platform Edge</p>
        <h2 class="text-4xl md:text-5xl text-neutral-100">Built for street athletes</h2>
      </div>
      <p class="max-w-lg text-neutral-400 text-lg">From spot discovery to progression tracking, every touchpoint is crafted for momentum and local competition.</p>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      {#each content.features as feature, index}
        <article class="card p-7 bg-neutral-900/90 border-neutral-800 hover:border-neutral-600">
          <div class="flex items-center justify-between mb-8">
            <div class="w-12 h-12 rounded-sm bg-neutral-950 border border-neutral-800 flex items-center justify-center text-2xl">
              {featureVisuals[index].icon}
            </div>
            <span class="text-xs uppercase tracking-[0.12em] text-neutral-500">0{index + 1}</span>
          </div>

          <p class="text-xs uppercase tracking-[0.12em] text-neutral-500 mb-3">{featureVisuals[index].label}</p>
          <h3 class="text-2xl font-bold text-neutral-100 mb-3">
            {feature.title}
          </h3>
          <p class="text-neutral-400 text-base leading-relaxed">
            {feature.description}
          </p>

          <div class="mt-8 h-px w-full bg-neutral-800"></div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="py-24 bg-neutral-950 border-b border-neutral-900">
  <div class="container-custom">
    <div class="mb-12 text-center">
      <p class="text-xs uppercase tracking-[0.14em] text-neutral-500 mb-2">Local First Rollout</p>
      <h2 class="text-4xl md:text-5xl text-neutral-100 mb-4">
      {content.cities.title}
      </h2>
      <p class="text-lg text-neutral-400 max-w-2xl mx-auto">{content.cities.subtitle}</p>
    </div>

    <div class="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {#each content.cities.list as city}
        <article class="card p-8 bg-neutral-900/90 border-neutral-800">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-3xl text-neutral-100">{city.name}</h3>
            <div class="text-4xl">{city.flag}</div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-sm border border-neutral-800 bg-neutral-950 p-4 text-center">
              <p class="text-3xl font-semibold text-neutral-100">{city.spots}</p>
              <p class="text-xs uppercase tracking-[0.12em] text-neutral-500 mt-1">Training Spots</p>
            </div>
            <div class="rounded-sm border border-neutral-800 bg-neutral-950 p-4 text-center">
              <p class="text-3xl font-semibold text-neutral-100">{city.athletes}</p>
              <p class="text-xs uppercase tracking-[0.12em] text-neutral-500 mt-1">Athletes</p>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="py-24 bg-neutral-900 text-neutral-100">
  <div class="container-custom text-center">
    <p class="text-xs uppercase tracking-[0.14em] text-neutral-400 mb-3">Join the Movement</p>
    <h2 class="text-4xl md:text-6xl mb-6">
      {content.cta_final.title}
    </h2>
    <p class="text-lg md:text-xl text-neutral-300 mb-10 max-w-2xl mx-auto">
      {content.cta_final.subtitle}
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/plan" class="btn btn-primary text-lg px-12 py-4 inline-block">
        {content.cta_final.button}
      </a>
      <a href="/spots" class="btn btn-accent text-lg px-12 py-4 inline-block">
        Explore Spots
      </a>
    </div>
  </div>
</section>
