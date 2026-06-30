<script>
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';
  
  let email = '';
  let password = '';
  let username = '';
  let city = 'trieste';
  let age = 25;
  let gender = 'male';
  let experienceLevel = 'beginner';
  let trainingDaysPerWeek = 3;
  let trainingGoal = 'general';
  let loading = false;
  let error = '';
  let success = false;

  async function handleSignup() {
    try {
      loading = true;
      error = '';
      
      const profileFields = {
        username,
        city,
        age: Number(age),
        gender,
        experience_level: experienceLevel,
        training_days_per_week: Number(trainingDaysPerWeek),
        training_goal: trainingGoal
      };

      // 1. Sign up with Supabase Auth (metadata is stored in auth.users)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: profileFields }
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Signup succeeded but no user returned');

      // 2. Create/update profile via RPC (SECURITY DEFINER bypasses RLS)
      const { error: rpcError } = await supabase.rpc('upsert_profile', {
        p_id: data.user.id,
        p_username: profileFields.username,
        p_city: profileFields.city,
        p_age: profileFields.age,
        p_gender: profileFields.gender,
        p_experience_level: profileFields.experience_level,
        p_training_days_per_week: profileFields.training_days_per_week,
        p_training_goal: profileFields.training_goal
      });

      if (rpcError) {
        console.error('Profile RPC failed:', rpcError);
        throw new Error(
          `Account created but profile save failed (${rpcError.code || rpcError.message}). ` +
          'Please go to your Profile page after login to complete setup.'
        );
      }
      
      success = true;
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        goto('/auth/login');
      }, 2000);
      
    } catch (err) {
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

<div class="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
  <div class="card max-w-md w-full p-8">
    <h1 class="text-3xl font-bold text-center mb-2">Join Urban Athlete</h1>
    <p class="text-neutral-400 text-center mb-8">Create your account and start training</p>

    {#if error}
      <div class="bg-neutral-900 border border-red-900 text-red-300 px-4 py-3 rounded-sm mb-6">
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
      <div class="bg-neutral-900 border border-green-900 text-green-300 px-4 py-3 rounded-sm mb-6">
        Account created! Check your email to verify. Redirecting...
      </div>
    {/if}

    <form on:submit|preventDefault={handleSignup} class="space-y-6">
      <div>
        <label for="username" class="block text-sm font-medium text-neutral-300 mb-2">
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
        <label for="age" class="block text-sm font-medium text-neutral-300 mb-2">
          Age
        </label>
        <input
          id="age"
          type="number"
          bind:value={age}
          required
          min="13"
          max="90"
          class="input w-full"
          placeholder="25"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-neutral-300 mb-2">
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
        <label for="password" class="block text-sm font-medium text-neutral-300 mb-2">
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
        <label for="city" class="block text-sm font-medium text-neutral-300 mb-2">
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

      <div>
        <label for="gender" class="block text-sm font-medium text-neutral-300 mb-2">
          Gender
        </label>
        <select
          id="gender"
          bind:value={gender}
          class="input w-full"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label for="experience-level" class="block text-sm font-medium text-neutral-300 mb-2">
          Experience Level
        </label>
        <select
          id="experience-level"
          bind:value={experienceLevel}
          required
          class="input w-full"
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label for="training-days" class="block text-sm font-medium text-neutral-300 mb-2">
          Training Days per Week
        </label>
        <input
          id="training-days"
          type="number"
          bind:value={trainingDaysPerWeek}
          required
          min="1"
          max="7"
          class="input w-full"
        />
      </div>

      <div>
        <label for="training-goal" class="block text-sm font-medium text-neutral-300 mb-2">
          Training Goal
        </label>
        <select
          id="training-goal"
          bind:value={trainingGoal}
          required
          class="input w-full"
        >
          <option value="general">General Fitness</option>
          <option value="strength">Strength</option>
          <option value="endurance">Endurance</option>
          <option value="skills">Skills</option>
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
      <p class="text-neutral-400">
        Already have an account?
        <a href="/auth/login" class="text-neutral-100 hover:text-white font-medium">
          Sign in
        </a>
      </p>
    </div>
  </div>
</div>
