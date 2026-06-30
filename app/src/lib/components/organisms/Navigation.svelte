<script>
  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }
</script>

<nav class="bg-neutral-950 border-b border-neutral-800 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-neutral-100 rounded-sm flex items-center justify-center">
            <span class="text-neutral-950 font-bold text-xl">UA</span>
          </div>
          <span class="text-xl font-bold text-neutral-100 hidden sm:block">Urban Athlete</span>
        </a>
      </div>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-8">
        <a href="/" class="text-neutral-300 hover:text-neutral-100 font-medium transition-colors">
          Home
        </a>
        <a href="/spots" class="text-neutral-300 hover:text-neutral-100 font-medium transition-colors">
          Spots
        </a>
        <a href="/plan" class="text-neutral-300 hover:text-neutral-100 font-medium transition-colors">
          Training Plan
        </a>
      </div>

      <!-- Desktop CTA -->
      <div class="hidden md:flex items-center">
        <a href="/plan" class="btn btn-primary px-5 py-2">
          Generate Plan
        </a>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button
          on:click={toggleMobileMenu}
          class="text-neutral-300 hover:text-neutral-100 p-2"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {#if mobileMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden border-t border-neutral-800 bg-neutral-950">
      <div class="px-4 py-4 space-y-3">
        <a
          href="/"
          class="block text-neutral-300 hover:text-neutral-100 font-medium py-2"
          on:click={() => mobileMenuOpen = false}
        >
          Home
        </a>
        <a
          href="/spots"
          class="block text-neutral-300 hover:text-neutral-100 font-medium py-2"
          on:click={() => mobileMenuOpen = false}
        >
          Spots
        </a>
        <a
          href="/plan"
          class="block text-neutral-300 hover:text-neutral-100 font-medium py-2"
          on:click={() => mobileMenuOpen = false}
        >
          Training Plan
        </a>
        <a
          href="/plan"
          class="block btn btn-primary text-center py-2"
          on:click={() => mobileMenuOpen = false}
        >
          Generate Plan
        </a>
      </div>
    </div>
  {/if}
</nav>
