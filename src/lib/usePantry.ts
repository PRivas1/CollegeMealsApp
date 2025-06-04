import { useState, useEffect } from 'react'

interface PantryItem {
  id: string
  ingredient_name: string
  quantity: number
  unit: string
}

interface SavedRecipe {
  id: string
  recipe_id: string
  recipe_name: string
  recipe_image: string
  recipe_data: any
}

export function usePantry() {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([])
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([])
  const [loading, setLoading] = useState(false)

  const addPantryItem = async (item: Omit<PantryItem, 'id'>) => {
    const newItem = {
      ...item,
      id: Date.now().toString()
    }
    setPantryItems(prev => [...prev, newItem])
    return newItem
  }

  const removePantryItem = async (id: string) => {
    setPantryItems(prev => prev.filter(item => item.id !== id))
  }

  const saveRecipe = async (recipe: Omit<SavedRecipe, 'id'>) => {
    const newRecipe = {
      ...recipe,
      id: Date.now().toString()
    }
    setSavedRecipes(prev => [...prev, newRecipe])
    return newRecipe
  }

  const removeSavedRecipe = async (recipeId: string) => {
    setSavedRecipes(prev => prev.filter(recipe => recipe.recipe_id !== recipeId))
  }

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(recipe => recipe.recipe_id === recipeId)
  }

  return {
    pantryItems,
    savedRecipes,
    loading,
    addPantryItem,
    removePantryItem,
    saveRecipe,
    removeSavedRecipe,
    isRecipeSaved
  }
} 