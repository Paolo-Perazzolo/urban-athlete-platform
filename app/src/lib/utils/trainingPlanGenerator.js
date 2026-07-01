function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeProfile(profile = {}) {
  return {
    age: Number(profile.age ?? 25),
    experienceLevel: profile.experience_level ?? 'beginner',
    trainingDaysPerWeek: clamp(Number(profile.training_days_per_week ?? 3), 1, 7),
    trainingGoal: profile.training_goal ?? 'general'
  };
}

function getDifficultyCap(experienceLevel) {
  if (experienceLevel === 'advanced') return 4;
  if (experienceLevel === 'intermediate') return 3;
  return 2;
}

function getLoadMultiplier(intensity, age) {
  const base = intensity === 'high' ? 1.12 : intensity === 'low' ? 0.9 : 1;
  if (age >= 50) return base * 0.88;
  if (age >= 40) return base * 0.94;
  return base;
}

function getRestMultiplier(intensity, age) {
  const base = intensity === 'high' ? 0.9 : intensity === 'low' ? 1.15 : 1;
  if (age >= 50) return base * 1.2;
  if (age >= 40) return base * 1.1;
  return base;
}

function matchesEquipment(exercise = {}, availableEquipment = []) {
  const needed = Array.isArray(exercise.equipment_needed) ? exercise.equipment_needed : [];
  if (needed.length === 0) return true;
  return needed.every((eq) => availableEquipment.includes(eq));
}

function adjustReps(defaultReps, loadMultiplier) {
  if (!defaultReps || typeof defaultReps !== 'string') return '8-12';

  if (defaultReps.includes('s')) {
    const n = Number(defaultReps.replace(/[^0-9]/g, '') || 30);
    const adjusted = clamp(Math.round(n * (2 - loadMultiplier)), 10, 120);
    return `${adjusted}s`;
  }

  const range = defaultReps.match(/(\d+)\s*-\s*(\d+)/);
  if (range) {
    const min = clamp(Math.round(Number(range[1]) * loadMultiplier), 1, 50);
    const max = clamp(Math.round(Number(range[2]) * loadMultiplier), min, 60);
    return `${min}-${max}`;
  }

  const single = defaultReps.match(/\d+/);
  if (!single) return defaultReps;
  return String(clamp(Math.round(Number(single[0]) * loadMultiplier), 1, 60));
}

function categorizeExercise(exercise = {}) {
  const groups = Array.isArray(exercise.muscle_groups) ? exercise.muscle_groups : [];
  const g = groups.join('|');
  if (g.includes('back') || g.includes('biceps')) return 'pull';
  if (g.includes('chest') || g.includes('triceps') || g.includes('shoulders')) return 'push';
  if (g.includes('quads') || g.includes('glutes') || g.includes('hamstrings')) return 'legs';
  return 'core';
}

function pickExercises(pool, category, count) {
  const inCategory = pool.filter((e) => categorizeExercise(e) === category);
  const source = inCategory.length >= count ? inCategory : pool;
  return source.slice(0, count);
}

export function generateTrainingPlan(profile, availableEquipment = [], exercises = [], options = {}) {
  const p = normalizeProfile(profile);
  const intensity = options.intensity ?? 'medium';
  const difficultyCap = getDifficultyCap(p.experienceLevel);
  const loadMultiplier = getLoadMultiplier(intensity, p.age);
  const restMultiplier = getRestMultiplier(intensity, p.age);

  const usable = (Array.isArray(exercises) ? exercises : [])
    .filter((e) => Number(e.difficulty ?? 1) <= difficultyCap)
    .filter((e) => matchesEquipment(e, availableEquipment))
    .sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')));

  if (usable.length === 0) {
    throw new Error('No compatible exercises found for your profile and available equipment.');
  }

  const dayTemplates = ['push', 'pull', 'legs', 'core'];
  const workouts = [];

  for (let day = 0; day < p.trainingDaysPerWeek; day += 1) {
    const focus = dayTemplates[day % dayTemplates.length];
    const selected = pickExercises(usable, focus, 4);

    workouts.push({
      name: `${focus[0].toUpperCase()}${focus.slice(1)} Focus`,
      exercises: selected.map((e) => {
        const defaultSets = Number(e.default_sets ?? 3);
        const rest = Number(e.default_rest_seconds ?? 90);
        const adjustedSets = clamp(Math.round(defaultSets * (loadMultiplier >= 1.05 ? 1.1 : loadMultiplier <= 0.92 ? 0.9 : 1)), 2, 6);
        const adjustedRest = clamp(Math.round(rest * restMultiplier), 30, 240);

        return {
          name: e.name ?? 'Exercise',
          sets: adjustedSets,
          reps: adjustReps(e.default_reps ?? '8-12', loadMultiplier),
          rest_seconds: adjustedRest,
          tips: e.tips ?? ''
        };
      })
    });
  }

  return {
    plan_name: `${p.trainingGoal[0].toUpperCase()}${p.trainingGoal.slice(1)} Plan`,
    weeks: 4,
    days_per_week: p.trainingDaysPerWeek,
    intensity,
    notes: [
      `Difficulty cap based on level: ${difficultyCap}`,
      `Age-aware adjustments applied for age ${p.age}`,
      'Same inputs always generate the same plan'
    ],
    workouts
  };
}
