<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/utils/supabase';
  import { generateTrainingPlan } from '$lib/utils/trainingPlanGenerator';
  
  const STORAGE_KEY = 'ua_plan_history';
  const SETTINGS_KEY = 'ua_plan_settings';

  let plan = null;
  let planHistory = [];
  let loading = false;
  let generating = false;
  let error = '';
  let showForm = true;
  let exercises = [];

  // Form fields
  let age = 25;
  let gender = 'male';
  let experienceLevel = 'beginner';
  let trainingDaysPerWeek = 3;
  let trainingGoal = 'general';
  let selectedIntensity = 'medium';

  onMount(async () => {
    restoreSession();
    await loadExercises();
  });

  function restoreSession() {
    try {
      const savedSettings = sessionStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        const s = JSON.parse(savedSettings);
        age = s.age ?? age;
        gender = s.gender ?? gender;
        experienceLevel = s.experience_level ?? experienceLevel;
        trainingDaysPerWeek = s.training_days_per_week ?? trainingDaysPerWeek;
        trainingGoal = s.training_goal ?? trainingGoal;
        selectedIntensity = s.intensity ?? selectedIntensity;
      }

      const savedHistory = sessionStorage.getItem(STORAGE_KEY);
      if (savedHistory) {
        planHistory = JSON.parse(savedHistory);
        if (planHistory.length > 0) {
          plan = planHistory[0];
          showForm = false;
        }
      }
    } catch (_) { /* ignore corrupt storage */ }
  }

  function saveToSession() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(planHistory));
      sessionStorage.setItem(SETTINGS_KEY, JSON.stringify({
        age, gender, experience_level: experienceLevel,
        training_days_per_week: trainingDaysPerWeek,
        training_goal: trainingGoal, intensity: selectedIntensity
      }));
    } catch (_) { /* storage full or unavailable */ }
  }

  async function loadExercises() {
    loading = true;
    const { data, error: loadError } = await supabase
      .from('exercises')
      .select('*');

    if (loadError || !data || data.length === 0) {
      error = loadError?.message || 'No exercises found in database.';
    } else {
      exercises = data;
    }
    loading = false;
  }

  function generateNewPlan() {
    generating = true;
    error = '';

    try {
      const profile = {
        age: Number(age),
        gender,
        experience_level: experienceLevel,
        training_days_per_week: Number(trainingDaysPerWeek),
        training_goal: trainingGoal
      };

      const generatedPlan = generateTrainingPlan(
        profile,
        ['pull_up_bar', 'parallel_bars', 'bench', 'ground'],
        exercises,
        { intensity: selectedIntensity }
      );

      const entry = {
        plan_data: generatedPlan,
        created_at: new Date().toISOString()
      };

      planHistory = [entry, ...planHistory].slice(0, 10);
      plan = entry;
      showForm = false;
      saveToSession();
    } catch (err) {
      error = err.message;
    } finally {
      generating = false;
    }
  }

  function viewPlan(index) {
    plan = planHistory[index];
    showForm = false;
  }

  function editSettings() {
    showForm = true;
  }
</script>

<div class="min-h-screen bg-neutral-950 py-12 px-4">
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-neutral-100 mb-2">Training Plan Generator</h1>
      <p class="text-neutral-400">Get a personalized workout — no account needed</p>
    </div>

    {#if loading}
      <div class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-300"></div>
        <p class="mt-4 text-neutral-400">Loading exercises...</p>
      </div>
    {:else if error}
      <div class="card p-8 bg-neutral-900 border border-red-900 mb-6">
        <p class="text-red-300 font-medium">{error}</p>
      </div>
    {/if}

    <!-- Popup form -->
    {#if showForm && !loading}
      <div class="card max-w-lg mx-auto p-8">
        <h2 class="text-2xl font-bold text-neutral-100 mb-2">Tell us about you</h2>
        <p class="text-neutral-400 text-sm mb-6">Fill in your details to generate a custom training plan.</p>

        <form on:submit|preventDefault={generateNewPlan} class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="age" class="block text-sm font-medium text-neutral-300 mb-1">Age</label>
              <input id="age" type="number" bind:value={age} min="13" max="90" required class="input w-full" />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-neutral-300 mb-1">Gender</label>
              <select id="gender" bind:value={gender} class="input w-full">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label for="experience" class="block text-sm font-medium text-neutral-300 mb-1">Experience Level</label>
            <select id="experience" bind:value={experienceLevel} class="input w-full">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="days" class="block text-sm font-medium text-neutral-300 mb-1">Days / Week</label>
              <input id="days" type="number" bind:value={trainingDaysPerWeek} min="1" max="7" required class="input w-full" />
            </div>
            <div>
              <label for="intensity" class="block text-sm font-medium text-neutral-300 mb-1">Intensity</label>
              <select id="intensity" bind:value={selectedIntensity} class="input w-full">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label for="goal" class="block text-sm font-medium text-neutral-300 mb-1">Training Goal</label>
            <select id="goal" bind:value={trainingGoal} class="input w-full">
              <option value="general">General Fitness</option>
              <option value="strength">Strength</option>
              <option value="endurance">Endurance</option>
              <option value="skills">Skills</option>
            </select>
          </div>

          <button type="submit" disabled={generating || exercises.length === 0} class="btn btn-primary w-full py-3 mt-2">
            {generating ? 'Generating...' : 'Generate My Plan'}
          </button>
        </form>
      </div>

    <!-- Plan display -->
    {:else if plan}
      <div class="space-y-6">
        <!-- Plan Header -->
        <div class="card p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h2 class="text-2xl font-bold text-neutral-100">{plan.plan_data.plan_name}</h2>
              <p class="text-neutral-400 mt-1">
                {plan.plan_data.weeks} weeks · {plan.plan_data.days_per_week} days per week
              </p>
              <p class="text-neutral-500 text-sm mt-1 capitalize">
                Intensity: {plan.plan_data.intensity || 'medium'}
              </p>
            </div>
            <button on:click={editSettings} class="btn btn-accent">
              Change Settings
            </button>
          </div>

          <!-- Plan Notes -->
          {#if plan.plan_data.notes && plan.plan_data.notes.length > 0}
            <div class="bg-neutral-950 border border-neutral-800 rounded-sm p-4 mt-4">
              <h3 class="font-semibold text-neutral-100 mb-2">Training Notes</h3>
              <ul class="space-y-1 text-sm text-neutral-300">
                {#each plan.plan_data.notes as note}
                  <li>· {note}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>

        <!-- Workout Days -->
        {#each plan.plan_data.workouts as workout, dayIndex}
          <div class="card p-6">
            <h3 class="text-xl font-bold text-neutral-100 mb-4">
              Day {dayIndex + 1}: {workout.name}
            </h3>
            
            <div class="space-y-4">
              {#each workout.exercises as exercise, exIndex}
                <div class="flex items-start space-x-4 p-4 bg-neutral-950 border border-neutral-800 rounded-sm">
                  <div class="flex-shrink-0 w-8 h-8 bg-neutral-100 text-neutral-950 rounded-sm flex items-center justify-center font-bold">
                    {exIndex + 1}
                  </div>
                  <div class="flex-1">
                    <h4 class="font-semibold text-neutral-100">{exercise.name}</h4>
                    <p class="text-sm text-neutral-400 mt-1">
                      {exercise.sets} sets × {exercise.reps} reps · Rest: {exercise.rest_seconds}s
                    </p>
                    {#if exercise.tips}
                      <p class="text-sm text-neutral-500 mt-2 italic">{exercise.tips}</p>
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}

        <!-- Plan History -->
        {#if planHistory.length > 1}
          <div class="card p-6 mt-6">
            <h3 class="text-lg font-bold text-neutral-100 mb-4">Previous Plans (this session)</h3>
            <div class="space-y-2">
              {#each planHistory as entry, i}
                <button
                  on:click={() => viewPlan(i)}
                  class="w-full text-left p-3 rounded-sm border transition-colors {plan === entry
                    ? 'border-neutral-100 bg-neutral-900'
                    : 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'}"
                >
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-neutral-100">{entry.plan_data.plan_name}</span>
                    <span class="text-xs text-neutral-500">
                      {new Date(entry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-400 mt-1">
                    {entry.plan_data.days_per_week}d/wk · {entry.plan_data.intensity || 'medium'} intensity
                  </p>
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>
