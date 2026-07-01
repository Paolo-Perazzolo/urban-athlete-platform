<script>
  import content from '$lib/content/home.json';

  const featureVisuals = [
    { icon: '📍', label: 'Geo-Mapped Spots' },
    { icon: '⚡', label: 'Adaptive Plans' },
    { icon: '🏆', label: 'Competitive XP' }
  ];

  const heroMetrics = [
    { value: '25+', label: 'Outdoor spots' },
    { value: '150+', label: 'Athletes joined' }
  ];
</script>

<section class="relative overflow-hidden border-b border-neutral-900 bg-neutral-950">
  <div class="landing-orb landing-orb-a"></div>
  <div class="landing-orb landing-orb-b"></div>

  <div class="container-custom py-16 sm:py-20 md:py-24">
    <div class="grid items-center gap-10 lg:grid-cols-12">
      <div class="animate-fade-up text-neutral-100 lg:col-span-6">
        <p class="mb-5 inline-flex items-center gap-2 rounded-sm border border-neutral-800 bg-neutral-900/85 px-3 py-1 text-xs uppercase tracking-[0.14em] text-neutral-300">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-300"></span>
          Urban Athlete Collective
        </p>

        <h1 class="mb-5 text-4xl leading-[0.98] sm:text-5xl md:text-6xl">
          {content.hero.title}
        </h1>

        <p class="mb-8 max-w-xl text-base text-neutral-300 sm:text-lg">
          {content.hero.subtitle}
        </p>

        <div class="mb-8 flex flex-col gap-3 sm:flex-row">
          <a href="/plan" class="btn btn-primary px-8 py-4 text-center text-base">
            {content.hero.cta_primary}
          </a>
          <a href="/spots" class="btn btn-accent px-8 py-4 text-center text-base">
            {content.hero.cta_secondary}
          </a>
        </div>

        <div class="grid max-w-md grid-cols-2 gap-3">
          {#each heroMetrics as metric}
            <div class="rounded-sm border border-neutral-800 bg-neutral-900/75 p-3">
              <p class="text-xs uppercase tracking-[0.12em] text-neutral-500">{metric.label}</p>
              <p class="mt-1 text-xl font-semibold text-neutral-100">{metric.value}</p>
            </div>
          {/each}
        </div>
      </div>

      <div class="animate-fade-up-delayed lg:col-span-6">
        <div class="mx-auto max-w-xl overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900">
          <img
            src="/images/image1.webp"
            alt="Athlete training in the city"
            class="h-80 w-full object-cover sm:h-[30rem]"
            loading="eager"
          />
          <div class="border-t border-neutral-800 bg-neutral-900/95 p-4">
            <p class="mb-1 text-xs uppercase tracking-[0.14em] text-neutral-500">Performance Layer</p>
            <p class="text-lg font-semibold text-neutral-100">Deterministic plans. Zero guesswork.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="border-b border-neutral-900 bg-neutral-950 py-16 sm:py-20">
  <div class="container-custom">
    <div class="mb-10 max-w-2xl">
      <p class="mb-2 text-xs uppercase tracking-[0.14em] text-neutral-500">Platform Edge</p>
      <h2 class="text-3xl text-neutral-100 sm:text-4xl">Built for street athletes</h2>
      <p class="mt-4 text-base text-neutral-400 sm:text-lg">
        Discover real spots, build consistent routines, and keep momentum in your city.
      </p>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      {#each content.features as feature, index}
        <article class="card animate-fade-up p-6 bg-neutral-900/90 border-neutral-800 hover:border-neutral-600">
          <div class="mb-6 flex items-center justify-between">
            <div class="flex h-11 w-11 items-center justify-center rounded-sm border border-neutral-800 bg-neutral-950 text-xl">
              {featureVisuals[index].icon}
            </div>
            <span class="text-xs uppercase tracking-[0.12em] text-neutral-500">0{index + 1}</span>
          </div>

          <h3 class="mb-2 text-xl font-bold text-neutral-100">{feature.title}</h3>
          <p class="text-sm leading-relaxed text-neutral-400">{feature.description}</p>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="border-b border-neutral-900 bg-neutral-950 py-16 sm:py-20">
  <div class="container-custom">
    <div class="mb-10 text-center">
      <p class="mb-2 text-xs uppercase tracking-[0.14em] text-neutral-500">Local First Rollout</p>
      <h2 class="text-3xl text-neutral-100 sm:text-4xl">{content.cities.title}</h2>
    </div>

    <div class="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
      {#each content.cities.list as city}
        <article class="card p-6 bg-neutral-900/85 border-neutral-800">
          <div class="mb-5 flex items-center justify-between">
            <h3 class="text-2xl text-neutral-100">{city.name}</h3>
            <span class="text-3xl">{city.flag}</span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-sm border border-neutral-800 bg-neutral-950 p-3 text-center">
              <p class="text-2xl font-semibold text-neutral-100">{city.spots}</p>
              <p class="mt-1 text-[11px] uppercase tracking-[0.12em] text-neutral-500">Spots</p>
            </div>
            <div class="rounded-sm border border-neutral-800 bg-neutral-950 p-3 text-center">
              <p class="text-2xl font-semibold text-neutral-100">{city.athletes}</p>
              <p class="mt-1 text-[11px] uppercase tracking-[0.12em] text-neutral-500">Athletes</p>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="bg-neutral-900 py-16 text-neutral-100 sm:py-20">
  <div class="container-custom text-center">
    <p class="mb-3 text-xs uppercase tracking-[0.14em] text-neutral-400">Join the Movement</p>
    <h2 class="mb-5 text-3xl sm:text-4xl md:text-5xl">
      {content.cta_final.title}
    </h2>
    <p class="mx-auto mb-8 max-w-xl text-base text-neutral-300 sm:text-lg">
      {content.cta_final.subtitle}
    </p>
    <div class="flex flex-col justify-center gap-3 sm:flex-row">
      <a href="/plan" class="btn btn-primary inline-block px-10 py-4 text-base">
        {content.cta_final.button}
      </a>
      <a href="/spots" class="btn btn-accent inline-block px-10 py-4 text-base">
        Explore Spots
      </a>
    </div>
  </div>
</section>

<style>
  .landing-orb {
    pointer-events: none;
    position: absolute;
    border-radius: 9999px;
    filter: blur(64px);
    opacity: 0.5;
  }

  .landing-orb-a {
    top: -6rem;
    left: 45%;
    height: 20rem;
    width: 20rem;
    transform: translateX(-50%);
    background: rgba(251, 191, 36, 0.16);
    animation: drift 12s ease-in-out infinite;
  }

  .landing-orb-b {
    top: 2rem;
    right: -5rem;
    height: 16rem;
    width: 16rem;
    background: rgba(229, 231, 235, 0.1);
    animation: drift 14s ease-in-out infinite reverse;
  }

  .animate-fade-up {
    animation: fadeUp 520ms ease-out both;
  }

  .animate-fade-up-delayed {
    animation: fadeUp 680ms ease-out both;
    animation-delay: 120ms;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(14px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes drift {
    0% {
      transform: translate3d(-50%, 0, 0) scale(1);
    }
    50% {
      transform: translate3d(-48%, 8px, 0) scale(1.04);
    }
    100% {
      transform: translate3d(-50%, 0, 0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .landing-orb,
    .animate-fade-up,
    .animate-fade-up-delayed {
      animation: none;
    }
  }
</style>
