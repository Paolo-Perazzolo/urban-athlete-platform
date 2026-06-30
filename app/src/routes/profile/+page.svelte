<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';
  
  let user = null;
  let profile = null;
  let loading = true;

  onMount(async () => {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      goto('/auth/login');
      return;
    }
    
    user = session.user;
    
    profile = await getOrCreateProfile();
    
    loading = false;
  });

  async function getOrCreateProfile() {
    const { data: existingProfile, error: existingProfileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfileError) {
      throw existingProfileError;
    }

    if (existingProfile) {
      return existingProfile;
    }

    const meta = user?.user_metadata || {};
    const baseUsername = buildUsername(meta?.username);

    let profilePayload = {
      id: user.id,
      username: baseUsername,
      city: meta?.city || 'trieste',
      age: Number(meta?.age ?? 25),
      gender: meta?.gender || 'male',
      experience_level: meta?.experience_level || 'beginner',
      training_days_per_week: Number(meta?.training_days_per_week ?? 3),
      training_goal: meta?.training_goal || 'general'
    };

    let { data: createdProfile, error: createProfileError } = await supabase
      .from('profiles')
      .insert(profilePayload)
      .select('*')
      .single();

    if (createProfileError && createProfileError.code === '23505') {
      profilePayload = {
        ...profilePayload,
        username: `${baseUsername}_${String(user.id).slice(0, 6)}`
      };

      const retry = await supabase
        .from('profiles')
        .insert(profilePayload)
        .select('*')
        .single();

      createdProfile = retry.data;
      createProfileError = retry.error;
    }

    if (createProfileError || !createdProfile) {
      throw createProfileError || new Error('Unable to create profile for this account.');
    }

    return createdProfile;
  }

  function buildUsername(rawUsername) {
    const fallbackFromEmail = user?.email ? user.email.split('@')[0] : '';
    const candidate = String(rawUsername || fallbackFromEmail || `user_${String(user.id).slice(0, 8)}`);

    return candidate.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30) || `user_${String(user.id).slice(0, 8)}`;
  }
</script>

<div class="min-h-screen bg-neutral-950 py-12 px-4">
  <div class="max-w-4xl mx-auto">
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-300"></div>
        <p class="mt-4 text-neutral-400">Loading profile...</p>
      </div>
    {:else if profile}
      <div class="card p-8">
        <div class="flex items-center space-x-6 mb-8">
          <div class="w-20 h-20 bg-neutral-100 rounded-sm flex items-center justify-center">
            <span class="text-neutral-950 font-bold text-3xl">
              {profile.username?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-neutral-100">{profile.username || 'Athlete'}</h1>
            <p class="text-neutral-400">{user.email}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-neutral-950 border border-neutral-800 rounded-sm p-6 text-center">
            <div class="text-4xl font-bold text-neutral-100">{profile.level || 1}</div>
            <div class="text-sm text-neutral-400 mt-2">Level</div>
          </div>
          <div class="bg-neutral-950 border border-neutral-800 rounded-sm p-6 text-center">
            <div class="text-4xl font-bold text-neutral-100">{profile.total_xp || 0}</div>
            <div class="text-sm text-neutral-400 mt-2">Total XP</div>
          </div>
          <div class="bg-neutral-950 border border-neutral-800 rounded-sm p-6 text-center">
            <div class="text-4xl font-bold text-neutral-100">{profile.city || 'N/A'}</div>
            <div class="text-sm text-neutral-400 mt-2">City</div>
          </div>
        </div>

        <div class="border-t border-neutral-800 pt-6">
          <h2 class="text-xl font-bold text-neutral-100 mb-4">Profile Details</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt class="text-sm font-medium text-neutral-500">Experience Level</dt>
              <dd class="mt-1 text-lg text-neutral-100 capitalize">{profile.experience_level || 'beginner'}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-neutral-500">Training Days/Week</dt>
              <dd class="mt-1 text-lg text-neutral-100">{profile.training_days_per_week || 3}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-neutral-500">Training Goal</dt>
              <dd class="mt-1 text-lg text-neutral-100 capitalize">{profile.training_goal || 'general'}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-neutral-500">Member Since</dt>
              <dd class="mt-1 text-lg text-neutral-100">
                {new Date(profile.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    {:else}
      <div class="card p-8 text-center">
        <p class="text-neutral-400">Profile not found. Please complete your profile setup.</p>
      </div>
    {/if}
  </div>
</div>
