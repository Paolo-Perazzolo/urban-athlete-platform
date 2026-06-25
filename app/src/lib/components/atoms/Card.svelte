<!--
  CARD COMPONENT (Atom)
  Container with shadow and rounded corners
  
  Usage:
    <Card>
      <h3>Title</h3>
      <p>Content here</p>
    </Card>
    
    <Card padding="lg" hover={true}>
      Content with more padding and hover effect
    </Card>
-->

<script>
  // Props
  export let padding = 'md'; // 'sm', 'md', 'lg'
  export let hover = false; // Add hover effect
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
</script>

<div class="card {paddingClasses[padding]} {hover ? 'hover:shadow-card-hover cursor-pointer' : ''}">
  <slot />
</div>
