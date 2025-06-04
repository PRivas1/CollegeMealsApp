-- Remove subscription-related columns from profiles table
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS subscription_status,
DROP COLUMN IF EXISTS trial_end_date;

-- Update the table to only have essential fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS email text NOT NULL; 