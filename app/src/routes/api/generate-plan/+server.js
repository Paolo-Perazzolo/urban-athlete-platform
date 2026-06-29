import { json } from '@sveltejs/kit';
import { supabase } from '$lib/utils/supabase';
import { generateTrainingPlan } from '$lib/utils/trainingPlanGenerator';

/**
 * API endpoint to generate a training plan
 * POST /api/generate-plan
 * Body: { spotId: uuid, userId: uuid }
 */
export async function POST({ request }) {
  try {
    const { spotId, userId } = await request.json();
    
    if (!userId) {
      return json({ error: 'Missing userId' }, { status: 400 });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError || !profile) {
      return json({ error: 'User profile not found' }, { status: 404 });
    }
    
    // Get spot equipment (optional). If spot is missing, use a safe default set.
    let availableEquipment = ['pull_up_bar', 'parallel_bars', 'bench', 'ground'];
    if (spotId) {
      const { data: spot } = await supabase
        .from('spots')
        .select('equipment')
        .eq('id', spotId)
        .maybeSingle();

      if (spot?.equipment?.length) {
        availableEquipment = spot.equipment;
      }
    }
    
    // Get all exercises
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select('*');
    
    if (exercisesError || !exercises) {
      return json({ error: 'Failed to load exercises' }, { status: 500 });
    }
    
    // Generate the plan
    const plan = generateTrainingPlan(profile, availableEquipment, exercises);

    // Return generated plan. Client can persist it with authenticated session.
    return json({ plan, saved: false });
    
  } catch (error) {
    console.error('Error generating plan:', error);
    return json({ error: error.message }, { status: 500 });
  }
}
