-- URBAN ATHLETE PLATFORM - Initial Database Schema
-- Run this in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  city TEXT CHECK (city IN ('trieste', 'milan')),
  age INTEGER,
  gender TEXT,
  height_cm INTEGER,
  experience_level TEXT DEFAULT 'beginner' CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  training_days_per_week INTEGER DEFAULT 3,
  training_goal TEXT, -- 'strength', 'endurance', 'skills', 'general'
  total_xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- TRAINING SPOTS
-- ============================================================================
CREATE TABLE spots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL CHECK (city IN ('trieste', 'milan')),
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  equipment TEXT[], -- Array: ['pull_up_bar', 'parallel_bars', 'rings', ...]
  avg_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for spots
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;

-- Everyone can read spots
CREATE POLICY "Spots are viewable by everyone"
  ON spots FOR SELECT
  USING (true);

-- Authenticated users can create spots
CREATE POLICY "Authenticated users can create spots"
  ON spots FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- SPOT PHOTOS (max 5 per spot)
-- ============================================================================
CREATE TABLE spot_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for photos
ALTER TABLE spot_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are viewable by everyone"
  ON spot_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload photos"
  ON spot_photos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- REVIEWS
-- ============================================================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spot_id UUID REFERENCES spots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(spot_id, user_id) -- One review per user per spot
);

-- RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- EXERCISE DATABASE (AI-generated, static)
-- ============================================================================
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_it TEXT, -- Italian name
  description TEXT,
  muscle_groups TEXT[], -- ['chest', 'triceps', 'shoulders']
  equipment_needed TEXT[], -- ['pull_up_bar'] or [] for no equipment
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5), -- 1=beginner, 5=elite
  exercise_type TEXT, -- 'strength', 'endurance', 'skill', 'mobility'
  default_sets INTEGER,
  default_reps TEXT, -- '8-12' or '30s' for timed exercises
  default_rest_seconds INTEGER,
  progression_from UUID REFERENCES exercises(id), -- easier version
  progression_to UUID REFERENCES exercises(id), -- harder version
  video_url TEXT, -- optional YouTube/demo link
  tips TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for exercises (read-only for users)
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by everyone"
  ON exercises FOR SELECT
  USING (true);

-- ============================================================================
-- TRAINING PLANS
-- ============================================================================
CREATE TABLE training_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  plan_data JSONB NOT NULL, -- Structured weekly plan
  equipment_available TEXT[], -- What equipment was available
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for training plans
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own training plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create training plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- XP EVENTS (for gamification)
-- ============================================================================
CREATE TABLE xp_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  event_type TEXT NOT NULL, -- 'check_in', 'review', 'workout_complete', 'streak_bonus'
  xp_amount INTEGER NOT NULL,
  metadata JSONB, -- Flexible context data
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for XP events
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP events"
  ON xp_events FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES for performance
-- ============================================================================
CREATE INDEX idx_spots_city ON spots(city);
CREATE INDEX idx_spots_location ON spots(latitude, longitude);
CREATE INDEX idx_reviews_spot ON reviews(spot_id);
CREATE INDEX idx_xp_events_user ON xp_events(user_id);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_equipment ON exercises USING GIN(equipment_needed);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update avg_rating when a review is added
CREATE OR REPLACE FUNCTION update_spot_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE spots
  SET 
    avg_rating = (SELECT AVG(rating) FROM reviews WHERE spot_id = NEW.spot_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE spot_id = NEW.spot_id)
  WHERE id = NEW.spot_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update spot ratings
CREATE TRIGGER update_spot_rating_trigger
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_spot_rating();

-- Function to update user level based on XP
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET 
    total_xp = (SELECT SUM(xp_amount) FROM xp_events WHERE user_id = NEW.user_id),
    level = FLOOR((SELECT SUM(xp_amount) FROM xp_events WHERE user_id = NEW.user_id) / 100) + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update user level
CREATE TRIGGER update_user_level_trigger
AFTER INSERT ON xp_events
FOR EACH ROW
EXECUTE FUNCTION update_user_level();
