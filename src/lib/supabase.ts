import { createClient } from '@supabase/supabase-js'

// These will be replaced with your actual Supabase project URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export type Profile = {
  id: string
  email: string
  full_name: string | null
  subscription_status: 'trial' | 'weekly' | 'monthly' | 'yearly'
  trial_end_date: string | null
  created_at: string
  updated_at: string
}

export type PantryItem = {
  id: string
  user_id: string
  ingredient_name: string
  quantity: string
  unit: string
  expiry_date: string | null
  created_at: string
  updated_at: string
}

export type SavedRecipe = {
  id: string
  user_id: string
  recipe_data: {
    id: string
    title: string
    prepTime: string
    cookTime: string
    ingredients: string[]
    instructions: string
    description: string
  }
  created_at: string
  updated_at: string
}

// Helper function to get the current user's profile
export async function getCurrentProfile() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }
    if (!user) return null

    // Use the correct way to query with headers
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*', { 
        count: 'exact',
        head: false 
      })
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw profileError
    }

    if (!profile) {
      console.error('No profile found for user:', user.id)
      return null
    }

    return profile as Profile
  } catch (error) {
    console.error('Error in getCurrentProfile:', error)
    return null
  }
}

// Helper function to check if user is in trial period
export async function isInTrialPeriod() {
  const profile = await getCurrentProfile()
  if (!profile) return false

  if (profile.subscription_status !== 'trial') return false
  if (!profile.trial_end_date) return false

  const trialEnd = new Date(profile.trial_end_date)
  return trialEnd > new Date()
}

// Helper function to get remaining trial days
export async function getRemainingTrialDays() {
  const profile = await getCurrentProfile()
  if (!profile || !profile.trial_end_date) return 0

  const trialEnd = new Date(profile.trial_end_date)
  const now = new Date()
  const diffTime = trialEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return Math.max(0, diffDays)
} 