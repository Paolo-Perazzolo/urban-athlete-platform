<script>
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let loading = false;
  let error = '';

  async function handleLogin() {
    try {
      loading = true;
      error = '';
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;
      
      goto('/profile');
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 px-4">
  <div class="card max-w-md w-full p-8">
    <h1 class="text-3xl font-bold text-center mb-2">Welcome Back</h1>
    <p class="text-neutral-600 text-center mb-8">Sign in to your account</p>

    {#if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        {error}
      </div>
    {/if}

    <form on:submit|preventDefault={handleLogin} class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-neutral-700 mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="input w-full"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-neutral-700 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          class="input w-full"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary w-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-neutral-600">
        Don't have an account?
        <a href="/auth/signup" class="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </a>
      </p>
    </div>
  </div>
</div>
