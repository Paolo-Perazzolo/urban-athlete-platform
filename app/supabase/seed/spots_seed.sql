-- SPOTS DATABASE SEED
-- Realistic baseline spots for Trieste and Milan
-- Idempotent insert: skips rows that already exist by (name, city)

WITH seed_data AS (
  SELECT *
  FROM (VALUES
    -- =============================
    -- TRIESTE
    -- =============================
    ('Giardino Pubblico de Tommasini', 'trieste', 45.64980, 13.78060,
      'Outdoor bars area in the public garden, good for beginner to intermediate bodyweight sessions.',
      ARRAY['pull_up_bar', 'parallel_bars', 'ground']::TEXT[]),

    ('Parco di San Giovanni - Calisthenics Area', 'trieste', 45.66820, 13.78530,
      'Open calisthenics station inside the San Giovanni park with bars and open training space.',
      ARRAY['pull_up_bar', 'parallel_bars', 'low_bar', 'ground']::TEXT[]),

    ('Molo Audace Training Corner', 'trieste', 45.65090, 13.76820,
      'Sea-view training point near the waterfront, mostly useful for bodyweight and mobility work.',
      ARRAY['ground', 'bench']::TEXT[]),

    ('Parco di Villa Revoltella', 'trieste', 45.63580, 13.78750,
      'Green area with benches and open space for circuits, running and conditioning sessions.',
      ARRAY['bench', 'ground']::TEXT[]),

    ('Valmaura Sports Park Bars', 'trieste', 45.63100, 13.80620,
      'Simple park bars close to sports facilities, suitable for pull and push basics.',
      ARRAY['pull_up_bar', 'parallel_bars', 'ground']::TEXT[]),

    ('Barcola Seafront Workout Point', 'trieste', 45.68670, 13.74230,
      'Popular seafront spot for calisthenics-style circuits and running warm-ups.',
      ARRAY['ground', 'bench']::TEXT[]),

    ('Piazzale Rosmini Street Workout Zone', 'trieste', 45.66240, 13.79390,
      'Compact neighborhood setup with bars for quick sessions and skill practice.',
      ARRAY['pull_up_bar', 'low_bar', 'ground']::TEXT[]),

    ('Campi Elisi Park Fitness Area', 'trieste', 45.64010, 13.77920,
      'Community training corner with outdoor equipment and enough room for group sessions.',
      ARRAY['parallel_bars', 'bench', 'ground']::TEXT[]),

    ('Boschetto Trail + Bodyweight Spot', 'trieste', 45.65340, 13.80020,
      'Trail-adjacent bodyweight area ideal for endurance-focused workouts.',
      ARRAY['ground', 'bench', 'low_bar']::TEXT[]),

    ('Parco Farneto Workout Area', 'trieste', 45.65950, 13.82110,
      'Hilly park location used for mixed running and calisthenics sessions.',
      ARRAY['pull_up_bar', 'ground']::TEXT[]),

    -- =============================
    -- MILAN
    -- =============================
    ('Parco Sempione Calisthenics Area', 'milan', 45.47270, 9.17760,
      'One of the most used outdoor workout points in central Milan with multiple bars.',
      ARRAY['pull_up_bar', 'parallel_bars', 'low_bar', 'ground']::TEXT[]),

    ('Parco Lambro Street Workout', 'milan', 45.50080, 9.25890,
      'Large park with dedicated street workout stations and open space for circuits.',
      ARRAY['pull_up_bar', 'parallel_bars', 'rings', 'ground']::TEXT[]),

    ('CityLife Park Workout Zone', 'milan', 45.47880, 9.15370,
      'Modern park area with bodyweight equipment and high foot traffic.',
      ARRAY['pull_up_bar', 'parallel_bars', 'bench', 'ground']::TEXT[]),

    ('Parco Nord Milano Fitness Area', 'milan', 45.53190, 9.19720,
      'Extended green area with fitness corners, good for volume sessions.',
      ARRAY['pull_up_bar', 'low_bar', 'bench', 'ground']::TEXT[]),

    ('Idroscalo Outdoor Bars', 'milan', 45.44510, 9.28650,
      'Lakeside training spot, useful for weekend long sessions and conditioning.',
      ARRAY['pull_up_bar', 'parallel_bars', 'ground']::TEXT[]),

    ('Giardini Indro Montanelli Fitness Spot', 'milan', 45.47720, 9.20140,
      'Central location with bodyweight-friendly setup and easy access.',
      ARRAY['low_bar', 'bench', 'ground']::TEXT[]),

    ('Parco delle Cave Workout Bars', 'milan', 45.46710, 9.12180,
      'West Milan park with bars and long paths for cardio + strength sessions.',
      ARRAY['pull_up_bar', 'parallel_bars', 'ground']::TEXT[]),

    ('Parco Forlanini Training Point', 'milan', 45.46290, 9.24760,
      'Open area combining running loops and bodyweight stations.',
      ARRAY['pull_up_bar', 'bench', 'ground']::TEXT[]),

    ('Parco Trenno Street Workout', 'milan', 45.48410, 9.11940,
      'Known local training area with bars suited for pull progression.',
      ARRAY['pull_up_bar', 'low_bar', 'parallel_bars', 'ground']::TEXT[]),

    ('Bicocca Urban Workout Corner', 'milan', 45.51530, 9.21290,
      'Neighborhood urban fitness point with compact but useful setup.',
      ARRAY['parallel_bars', 'bench', 'ground']::TEXT[])
  ) AS t(name, city, latitude, longitude, description, equipment)
)
INSERT INTO spots (name, city, latitude, longitude, description, equipment)
SELECT
  s.name,
  s.city,
  s.latitude,
  s.longitude,
  s.description,
  s.equipment
FROM seed_data s
WHERE NOT EXISTS (
  SELECT 1
  FROM spots existing
  WHERE existing.name = s.name
    AND existing.city = s.city
);
