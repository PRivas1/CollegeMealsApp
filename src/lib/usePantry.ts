import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { useAuth } from './AuthContext'

export type PantryItem = {
  id: string
  user_id: string
  ingredient_name: string
  quantity: number
  unit: string
  created_at: string
}

export type SavedRecipe = {
  id: string
  user_id: string
  recipe_id: string
  recipe_name: string
  recipe_image: string
  created_at: string
}

export function usePantry() {
  const { user } = useAuth()
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch pantry items
  const fetchPantryItems = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPantryItems(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch pantry items'))
    }
  }

  // Fetch saved recipes
  const fetchSavedRecipes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSavedRecipes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch saved recipes'))
    }
  }

  // Add item to pantry
  const addPantryItem = async (ingredient: Omit<PantryItem, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User must be logged in')

    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .insert([
          {
            user_id: user.id,
            ...ingredient,
          },
        ])
        .select()

      if (error) throw error
      await fetchPantryItems()
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add pantry item'))
      throw err
    }
  }

  // Remove item from pantry
  const removePantryItem = async (itemId: string) => {
    if (!user) throw new Error('User must be logged in')

    try {
      const { error } = await supabase
        .from('pantry_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchPantryItems()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove pantry item'))
      throw err
    }
  }

  // Save recipe
  const saveRecipe = async (recipe: Omit<SavedRecipe, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('User must be logged in')

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .insert([
          {
            user_id: user.id,
            ...recipe,
          },
        ])
        .select()

      if (error) throw error
      await fetchSavedRecipes()
      return data[0]
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save recipe'))
      throw err
    }
  }

  // Remove saved recipe
  const removeSavedRecipe = async (recipeId: string) => {
    if (!user) throw new Error('User must be logged in')

    try {
      const { error } = await supabase
        .from('saved_recipes')
        .delete()
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id)

      if (error) throw error
      await fetchSavedRecipes()
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove saved recipe'))
      throw err
    }
  }

  // Check if recipe is saved
  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(recipe => recipe.recipe_id === recipeId)
  }

  // Initial fetch
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchPantryItems(), fetchSavedRecipes()])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'))
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    } else {
      setPantryItems([])
      setSavedRecipes([])
      setLoading(false)
    }
  }, [user])

  return {
    pantryItems,
    savedRecipes,
    loading,
    error,
    addPantryItem,
    removePantryItem,
    saveRecipe,
    removeSavedRecipe,
    isRecipeSaved,
    refreshPantry: fetchPantryItems,
    refreshSavedRecipes: fetchSavedRecipes,
  }
} 