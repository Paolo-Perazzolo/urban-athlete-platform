/**
 * TRAINING PLAN GENERATOR
 * 
 * Deterministic algorithm to generate personalized workout plans
 * based on user profile and available equipment at a training spot.
 * 
 * NO AI API CALLS - Pure logic-based selection
 */

/**
 * Generate a weekly training plan
 * @param {Object} userProfile - User data from profiles table
 * @param {Array} availableEquipment - Equipment at the selected spot
 * @param {Array} exercises - All exercises from database
 * @returns {Object} Weekly training plan with workouts
 */
export function generateTrainingPlan(userProfile, availableEquipment, exercises) {
  const experience_level = userProfile?.experience_level ?? 'beginner';
  const training_days_per_week = userProfile?.training_days_per_week ?? 3;
  const training_goal = userProfile?.training_goal ?? 'general';
  const age = userProfile?.age ?? 25;
  const gender = userProfile?.gender ?? 'male';

  // Map experience level to difficulty range
  const difficultyRange = getDifficultyRange(experience_level);
  
  // Filter exercises by difficulty and equipment
  const suitableExercises = filterExercises(exercises, difficultyRange, availableEquipment);
  
  // Group exercises by type (push, pull, legs, core)
  const exercisesByType = groupExercisesByType(suitableExercises);
  
  // Generate workout days based on training frequency
  const workoutDays = generateWorkoutDays(
    training_days_per_week,
    training_goal,
    exercisesByType
  );
  
  return {
    plan_name: `${capitalize(experience_level)} ${capitalize(training_goal)} Plan`,
    weeks: 4, // 4-week program
    days_per_week: training_days_per_week,
    workouts: workoutDays,
    notes: generatePlanNotes(experience_level, training_goal)
  };
}

/**
 * Map experience level to difficulty range (1-4)
 */
function getDifficultyRange(experienceLevel) {
  const ranges = {
    beginner: [1, 2],      // Difficulty 1-2
    intermediate: [2, 3],  // Difficulty 2-3
    advanced: [3, 4]       // Difficulty 3-4
  };
  return ranges[experienceLevel] || [1, 2];
}

/**
 * Filter exercises by difficulty and available equipment
 */
function filterExercises(exercises, difficultyRange, availableEquipment) {
  return exercises.filter(ex => {
    // Check difficulty
    const inDifficultyRange = ex.difficulty >= difficultyRange[0] && 
                               ex.difficulty <= difficultyRange[1];
    
    // Check equipment (exercise needs no equipment OR equipment is available)
    const hasEquipment = ex.equipment_needed.length === 0 || 
                         ex.equipment_needed.some(eq => availableEquipment.includes(eq));
    
    return inDifficultyRange && hasEquipment;
  });
}

/**
 * Group exercises by muscle groups into workout types
 */
function groupExercisesByType(exercises) {
  const groups = {
    push: [],    // Chest, shoulders, triceps
    pull: [],    // Back, biceps
    legs: [],    // Quads, glutes, hamstrings
    core: []     // Abs, obliques
  };
  
  exercises.forEach(ex => {
    const muscles = ex.muscle_groups || [];
    
    if (muscles.some(m => ['chest', 'shoulders', 'triceps'].includes(m))) {
      groups.push.push(ex);
    }
    if (muscles.some(m => ['back', 'biceps', 'lats'].includes(m))) {
      groups.pull.push(ex);
    }
    if (muscles.some(m => ['quads', 'glutes', 'hamstrings'].includes(m))) {
      groups.legs.push(ex);
    }
    if (muscles.some(m => ['core', 'abs', 'obliques'].includes(m))) {
      groups.core.push(ex);
    }
  });
  
  return groups;
}

/**
 * Generate workout days based on frequency and goal
 */
function generateWorkoutDays(daysPerWeek, goal, exercisesByType) {
  const workouts = [];
  
  if (daysPerWeek === 3) {
    // 3-day split: Push, Pull, Legs
    workouts.push(createWorkout('Push Day', exercisesByType.push, exercisesByType.core, goal));
    workouts.push(createWorkout('Pull Day', exercisesByType.pull, exercisesByType.core, goal));
    workouts.push(createWorkout('Leg Day', exercisesByType.legs, exercisesByType.core, goal));
  } else if (daysPerWeek === 4) {
    // 4-day split: Upper, Lower, Upper, Lower
    const upper = [...exercisesByType.push, ...exercisesByType.pull];
    workouts.push(createWorkout('Upper Body A', upper, exercisesByType.core, goal));
    workouts.push(createWorkout('Lower Body A', exercisesByType.legs, exercisesByType.core, goal));
    workouts.push(createWorkout('Upper Body B', upper, exercisesByType.core, goal));
    workouts.push(createWorkout('Lower Body B', exercisesByType.legs, exercisesByType.core, goal));
  } else if (daysPerWeek === 5) {
    // 5-day split: Push, Pull, Legs, Push, Pull
    workouts.push(createWorkout('Push A', exercisesByType.push, exercisesByType.core, goal));
    workouts.push(createWorkout('Pull A', exercisesByType.pull, exercisesByType.core, goal));
    workouts.push(createWorkout('Legs', exercisesByType.legs, exercisesByType.core, goal));
    workouts.push(createWorkout('Push B', exercisesByType.push, exercisesByType.core, goal));
    workouts.push(createWorkout('Pull B', exercisesByType.pull, exercisesByType.core, goal));
  } else {
    // Default: Full body
    const allExercises = [
      ...exercisesByType.push,
      ...exercisesByType.pull,
      ...exercisesByType.legs
    ];
    workouts.push(createWorkout('Full Body', allExercises, exercisesByType.core, goal));
  }
  
  return workouts;
}

/**
 * Create a single workout with exercises
 */
function createWorkout(name, mainExercises, coreExercises, goal) {
  const exercises = [];
  
  // Select 3-4 main exercises
  const selectedMain = selectExercises(mainExercises, goal === 'strength' ? 3 : 4);
  exercises.push(...selectedMain);
  
  // Add 1-2 core exercises
  const selectedCore = selectExercises(coreExercises, 2);
  exercises.push(...selectedCore);
  
  return {
    name,
    exercises: exercises.map(ex => ({
      exercise_id: ex.id,
      name: ex.name,
      name_it: ex.name_it,
      sets: ex.default_sets,
      reps: ex.default_reps,
      rest_seconds: ex.default_rest_seconds,
      tips: ex.tips
    }))
  };
}

/**
 * Select N exercises, avoiding duplicates
 */
function selectExercises(exercises, count) {
  const shuffled = [...exercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, exercises.length));
}

/**
 * Generate plan notes based on experience and goal
 */
function generatePlanNotes(experienceLevel, goal) {
  const notes = [];
  
  if (experienceLevel === 'beginner') {
    notes.push('Focus on form over speed. Take your time with each rep.');
    notes.push('Rest 90-120 seconds between sets.');
    notes.push('If an exercise is too hard, use the progression from easier variation.');
  } else if (experienceLevel === 'intermediate') {
    notes.push('Challenge yourself but maintain good form.');
    notes.push('Rest 60-90 seconds between sets.');
    notes.push('Try to increase reps or difficulty each week.');
  } else {
    notes.push('Push your limits while staying safe.');
    notes.push('Rest 45-75 seconds between sets.');
    notes.push('Consider adding weight or progressing to harder variations.');
  }
  
  if (goal === 'strength') {
    notes.push('Goal: Strength - Focus on lower reps (5-8) with maximum effort.');
  } else if (goal === 'endurance') {
    notes.push('Goal: Endurance - Aim for higher reps (15-20) with shorter rest.');
  } else if (goal === 'skills') {
    notes.push('Goal: Skills - Practice technique and control. Quality over quantity.');
  }
  
  return notes;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
