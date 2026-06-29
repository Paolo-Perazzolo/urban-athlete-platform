<!--
  ROOT LAYOUT
  This wraps every page in your app.
  Perfect place for: navigation, footer, global styles
-->

<script>
  // Import global styles (Tailwind CSS)
  import '../app.css';
  import Navigation from '$lib/components/organisms/Navigation.svelte';
</script>

<!-- Navigation appears on every page -->
<Navigation />

<!-- 
  <slot /> is where page content appears
  Think of it as a placeholder for each page
-->
<slot />
