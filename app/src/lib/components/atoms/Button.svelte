<!--
  BUTTON COMPONENT (Atom)
  Reusable button with different variants
  
  Usage:
    <Button variant="primary">Click Me</Button>
    <Button variant="accent" size="lg">Get Started</Button>
-->

<script>
  // Props (inputs to this component)
  export let variant = 'primary'; // 'primary', 'accent', 'secondary', 'ghost'
  export let size = 'md'; // 'sm', 'md', 'lg'
  export let fullWidth = false;
  export let disabled = false;
  
  // CSS classes based on variant
  const variantClasses = {
    primary: 'btn-primary',
    accent: 'btn-accent',
    secondary: 'bg-white text-primary-600 hover:bg-neutral-50 border-2 border-primary-500',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700'
  };
  
  // CSS classes based on size
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
</script>

<button
  class="btn {variantClasses[variant]} {sizeClasses[size]} {fullWidth ? 'w-full' : ''}"
  {disabled}
  on:click
>
  <!-- Slot allows you to put anything inside the button -->
  <slot />
</button>
