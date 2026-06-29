<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import { goto } from '$app/navigation';
  import { generateTrainingPlan } from '$lib/utils/trainingPlanGenerator';
  
  let user = null;
  let plan = null;
  let loading = true;
  let generating = false;
  let error = '';

  onMount(async () => {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      goto('/auth/login');
      return;
    }
    user = session.user;
    
    // Load user's most recent plan
    await loadPlan();
  });

  async function loadPlan() {
    loading = true;
    const { data, error: loadError } = await supabase
      .from('training_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (loadError) {
      error = loadError.message;
    } else if (data) {
      plan = data;
    }
    loading = false;
  }

  async function generateNewPlan() {
    generating = true;
    error = '';
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        error = profileError?.message || 'Profile not found. Complete signup first.';
        return;
      }

      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('*');

      if (exercisesError || !exercises) {
        error = exercisesError?.message || 'Failed to load exercises';
        return;
      }

      const generatedPlan = generateTrainingPlan(profile, ['pull_up_bar', 'parallel_bars', 'bench', 'ground'], exercises);

      const { data: savedPlan, error: saveError } = await supabase
        .from('training_plans')
        .insert({
          user_id: user.id,
          plan_data: generatedPlan,
          equipment_available: ['pull_up_bar', 'parallel_bars', 'bench', 'ground']
        })
        .select()
        .single();

      if (saveError) {
        error = `Plan generated but not saved: ${saveError.message}`;
        plan = { plan_data: generatedPlan };
      } else {
        plan = savedPlan;
      }
    } catch (err) {
      error = err.message;
    } finally {
      generating = false;
    }
  }
</script>

<div class="min-h-screen bg-neutral-50 py-12 px-4">
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-neutral-900 mb-2">Your Training Plan</h1>
      <p class="text-neutral-600">Personalized workout program based on your goals and available equipment</p>
    </div>

    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p class="mt-4 text-neutral-600">Loading your plan...</p>
      </div>
    {:else if error}
      <div class="card p-8 bg-red-50 border border-red-200">
        <p class="text-red-700 font-medium">{error}</p>
      </div>
    {:else if !plan}
      <div class="card p-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
          <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-neutral-900 mb-4">No Training Plan Yet</h2>
        <p class="text-neutral-600 mb-8 max-w-2xl mx-auto">
          Generate a personalized training plan based on your profile and available equipment.
        </p>
        <button
          on:click={generateNewPlan}
          disabled={generating}
          class="btn btn-primary px-8 py-3"
        >
          {generating ? 'Generating...' : 'Generate My Plan'}
        </button>
      </div>
    {:else}
      <!-- Display the plan -->
      <div class="space-y-6">
        <!-- Plan Header -->
        <div class="card p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-neutral-900">{plan.plan_data.plan_name}</h2>
              <p class="text-neutral-600 mt-1">
                {plan.plan_data.weeks} weeks • {plan.plan_data.days_per_week} days per week
              </p>
            </div>
            <button
              on:click={generateNewPlan}
              disabled={generating}
              class="btn bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
            >
              {generating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
          
          <!-- Plan Notes -->
          {#if plan.plan_data.notes && plan.plan_data.notes.length > 0}
            <div class="bg-primary-50 rounded-lg p-4 mt-4">
              <h3 class="font-semibold text-primary-900 mb-2">📋 Training Notes</h3>
              <ul class="space-y-1 text-sm text-primary-800">
                {#each plan.plan_data.notes as note}
                  <li>• {note}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <!-- Workout Days -->
        {#each plan.plan_data.workouts as workout, dayIndex}
          <div class="card p-6">
            <h3 class="text-xl font-bold text-neutral-900 mb-4">
              Day {dayIndex + 1}: {workout.name}
            </h3>
            
            <div class="space-y-4">
              {#each workout.exercises as exercise, exIndex}
                <div class="flex items-start space-x-4 p-4 bg-neutral-50 rounded-lg">
                  <div class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {exIndex + 1}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-neutral-900">{exercise.name}</h4>
                    <p class="text-sm text-neutral-600 mt-1">
                      {exercise.sets} sets × {exercise.reps} reps • Rest: {exercise.rest_seconds}s
                    </p>
                    {#if exercise.tips}
                      <p class="text-sm text-neutral-500 mt-2 italic">💡 {exercise.tips}</p>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
