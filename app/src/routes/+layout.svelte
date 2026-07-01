<!--
  ROOT LAYOUT
  This wraps every page in your app.
  Perfect place for: navigation, footer, global styles
-->

<script>
  import '../app.css';
  import { page } from '$app/stores';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/spots', label: 'Spots' },
    { href: '/plan', label: 'Plan' }
  ];

  function isActive(pathname, href) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }
</script>

<header class="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-center md:justify-between px-4 py-3">
    <a href="/" class="inline-flex items-center transition-opacity hover:opacity-90">
      <img
        src="/images/logo1.png"
        alt="Urban Athlete"
        class="h-[60px] w-auto md:h-[66px]"
      />
    </a>
    <div class="hidden md:flex items-center gap-5 text-base">
      {#each navItems as item}
        <a
          href={item.href}
          class="{isActive($page.url.pathname, item.href)
            ? 'text-neutral-100 font-semibold'
            : 'text-neutral-300 hover:text-neutral-100'}"
        >
          {item.label}
        </a>
      {/each}
    </div>
  </nav>
</header>

<nav class="mobile-bottom-nav md:hidden" aria-label="Primary">
  {#each navItems as item}
    <a
      href={item.href}
      class="mobile-bottom-nav-item {isActive($page.url.pathname, item.href)
        ? 'mobile-bottom-nav-item-active'
        : ''}"
    >
      {item.label}
    </a>
  {/each}
</nav>

<!-- 
  <slot /> is where page content appears
  Think of it as a placeholder for each page
-->
<main class="pb-24 md:pb-0">
  <slot />
</main>
