-- =====================================================
-- SQL Migration: Add Free Trial Support to Profiles
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- =====================================================

-- 1. Add trial columns to the profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS trial_start_date TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_subjects TEXT[] DEFAULT ARRAY['090', '040'];

-- 2. Create an index for faster trial queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_profiles_trial_start_date 
ON profiles(trial_start_date) 
WHERE trial_start_date IS NOT NULL;

-- 3. Update RLS policies if needed (only if you have strict RLS)
-- This allows users to read their own trial data
-- Skip this if your existing policies already allow full profile access

-- 4. Optional: Grant trial access to existing approved users who don't have subscriptions
-- Uncomment the following if you want existing users to also get a trial
-- UPDATE profiles 
-- SET trial_start_date = NOW(), 
--     trial_subjects = ARRAY['090', '040']
-- WHERE trial_start_date IS NULL 
--   AND is_approved = true;

-- =====================================================
-- Verification: Check that columns were added correctly
-- =====================================================
-- Run this to verify:
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
--   AND column_name IN ('trial_start_date', 'trial_subjects');
