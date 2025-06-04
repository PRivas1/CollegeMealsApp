-- Add recipe_data column to saved_recipes
ALTER TABLE public.saved_recipes
ADD COLUMN IF NOT EXISTS recipe_data jsonb; 