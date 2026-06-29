<script>
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let username = '';
  let city = 'trieste';
  let loading = false;
  let error = '';
  let success = false;

  async function handleSignup() {
    try {
      loading = true;
      error = '';
      
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            city
          }
        }
      });

      if (signUpError) throw signUpError;
      
      // Manually create profile (fallback if trigger doesn't exist)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: username,
            city: city,
            experience_level: 'beginner'
          });
        
        // Ignore error if profile already exists (trigger created it)
        if (profileError && !profileError.message.includes('duplicate')) {
          console.warn('Profile creation warning:', profileError);
        }
      }
      
      success = true;
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        goto('/auth/login');
      }, 2000);
      
    } catch (err) {
      // Handle specific error types
      if (err.message?.includes('429') || err.message?.includes('rate limit')) {
        error = 'Too many signup attempts. Please wait an hour and try again, or contact support.';
      } else if (err.message?.includes('already registered')) {
        error = 'This email is already registered. Try signing in instead.';
      } else {
        error = err.message;
      }
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500 px-4">
  <div class="card max-w-md w-full p-8">
    <h1 class="text-3xl font-bold text-center mb-2">Join Urban Athlete</h1>
    <p class="text-neutral-600 text-center mb-8">Create your account and start training</p>

    {#if error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
        <p class="font-medium mb-2">{error}</p>
        {#if error.includes('rate limit') || error.includes('Too many')}
          <p class="text-sm mt-2">
            Already have an account? 
            <a href="/auth/login" class="underline font-medium">Sign in here</a>
          </p>
        {/if}
      </div>
    {/if}

    {#if success}
      <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
        Account created! Check your email to verify. Redirecting...
      </div>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-neutral-700 mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          bind:value={username}
          required
          class="input w-full"
          placeholder="athlete123"
        />
      </div>

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
          minlength="6"
          class="input w-full"
          placeholder="••••••••"
        />
        <p class="text-xs text-neutral-500 mt-1">At least 6 characters</p>
      </div>

      <div>
        <label for="city" class="block text-sm font-medium text-neutral-700 mb-2">
          City
        </label>
        <select
          id="city"
          bind:value={city}
          required
          class="input w-full"
        >
          <option value="trieste">Trieste</option>
          <option value="milan">Milan</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        class="btn btn-primary w-full"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>

    <div class="mt-6 text-center">
      <p class="text-neutral-600">
        Already have an account?
        <a href="/auth/login" class="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </a>
      </p>
    </div>
  </div>
</div>
