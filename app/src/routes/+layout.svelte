<!--
  ROOT LAYOUT
  This wraps every page in your app.
  Perfect place for: navigation, footer, global styles
-->

<script>
  import '../app.css';
</script>

<header class="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
    <a href="/" class="text-sm font-semibold tracking-wide text-neutral-100">Urban Athlete</a>
    <div class="flex items-center gap-4 text-sm text-neutral-300">
      <a href="/spots" class="hover:text-neutral-100">Spots</a>
      <a href="/plan" class="hover:text-neutral-100">Plan</a>
    </div>
  </nav>
</header>

<!-- 
  <slot /> is where page content appears
  Think of it as a placeholder for each page
-->
<slot />
