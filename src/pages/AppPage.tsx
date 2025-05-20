import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChefHat, List, Clock, Plus, Minus, BookOpen, Edit, Star, RefreshCw, User, Settings, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { usePantry } from '../lib/usePantry'

export default function AppPage() {
  const [inputValue, setInputValue] = useState('')
  const [recipes, setRecipes] = useState<any[]>([])
  const [savedRecipes, setSavedRecipes] = useState<any[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'ingredients' | 'recipes' | 'saved'>('ingredients')
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { pantryItems, loading: pantryLoading, addPantryItem, removePantryItem } = usePantry()

  // Convert pantry items to ingredient strings for recipe generation
  const ingredients = pantryItems.map(item => item.ingredient_name)

  const handleAddIngredient = async () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      try {
        await addPantryItem({
          ingredient_name: inputValue.trim(),
          quantity: 1,
          unit: 'piece'
        })
        setInputValue('')
      } catch (error) {
        console.error('Failed to add ingredient:', error)
      }
    }
  }

  const handleRemoveIngredient = async (ingredientName: string) => {
    const item = pantryItems.find(item => item.ingredient_name === ingredientName)
    if (item) {
      try {
        await removePantryItem(item.id)
      } catch (error) {
        console.error('Failed to remove ingredient:', error)
      }
    }
  }

  const generateRecipes = async (clearExisting = false) => {
    setIsLoading(true)
    if (clearExisting) setIsRefreshing(true)
    try {
      const response = await fetch('http://localhost:3001/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients })
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipes')
      }

      const data = await response.json()
      const newRecipes = data.recipes
      
      if (clearExisting) {
        setRecipes(newRecipes)
      } else {
        setRecipes([...recipes, ...newRecipes])
      }
      
      setActiveTab('recipes')
    } catch (error) {
      console.error('Error generating recipes:', error)
      const mockRecipes = [
        {
          id: Date.now() + Math.random(),
          title: "Vegetable Stir Fry",
          prepTime: "15 mins",
          cookTime: "10 mins",
          ingredients: ["bell pepper", "carrot", "onion", "soy sauce"],
          instructions: "1. Chop all vegetables\n2. Heat oil in pan\n3. Stir fry vegetables for 5 mins\n4. Add soy sauce and cook for 2 more mins",
          description: "A quick and healthy vegetable stir fry with a savory soy sauce flavor."
        },
        {
          id: Date.now() + Math.random(),
          title: "Pasta Primavera",
          prepTime: "10 mins",
          cookTime: "15 mins",
          ingredients: ["pasta", "tomato", "garlic", "basil"],
          instructions: "1. Cook pasta\n2. Saute garlic and tomatoes\n3. Combine with pasta\n4. Garnish with basil",
          description: "Simple pasta dish with fresh tomatoes and aromatic basil."
        }
      ]
      setRecipes(clearExisting ? mockRecipes : [...recipes, ...mockRecipes])
      setActiveTab('recipes')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const toggleSavedRecipe = (recipe: any) => {
    if (savedRecipes.some(r => r.id === recipe.id)) {
      setSavedRecipes(savedRecipes.filter(r => r.id !== recipe.id))
    } else {
      setSavedRecipes([...savedRecipes, recipe])
    }
  }

  const handleTabChange = (tab: 'ingredients' | 'recipes' | 'saved') => {
    setActiveTab(tab)
    setSelectedRecipe(null)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
      // Still navigate to login page even if there's an error
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0E1428] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChefHat size={32} className="text-[#ECA72C]" />
            <h1 className="text-2xl font-bold">Collegemeals.app</h1>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-[#1a2542] p-2 rounded-lg transition-colors"
            >
              <User size={24} />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-[#AFC2D5]">
                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate('/settings')
                      setShowDropdown(false)
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0E1428] hover:bg-[#AFC2D5] hover:bg-opacity-20"
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#0E1428] hover:bg-[#AFC2D5] hover:bg-opacity-20"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {!selectedRecipe ? (
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-[#AFC2D5]">
            <div className="flex border-b border-[#AFC2D5]">
              <button
                onClick={() => handleTabChange('ingredients')}
                className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${activeTab === 'ingredients' ? 'bg-white text-[#0E1428] border-b-2 border-[#ECA72C]' : 'bg-[#AFC2D5] text-[#0E1428]'}`}
              >
                <Edit size={18} /> Ingredients
              </button>
              <button
                onClick={() => handleTabChange('recipes')}
                disabled={recipes.length === 0}
                className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${activeTab === 'recipes' ? 'bg-white text-[#0E1428] border-b-2 border-[#ECA72C]' : 'bg-[#AFC2D5] text-[#0E1428]'} ${recipes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <BookOpen size={18} /> Recipes
              </button>
              <button
                onClick={() => handleTabChange('saved')}
                disabled={savedRecipes.length === 0}
                className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${activeTab === 'saved' ? 'bg-white text-[#0E1428] border-b-2 border-[#ECA72C]' : 'bg-[#AFC2D5] text-[#0E1428]'} ${savedRecipes.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Star size={18} /> Saved
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'ingredients' ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[#0E1428]">
                    <List /> Your Ingredients
                  </h2>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Add an ingredient..."
                      className="flex-1 p-2 border border-[#0E1428] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddIngredient()}
                    />
                    <button
                      onClick={handleAddIngredient}
                      className="bg-[#0E1428] text-white p-2 rounded-lg hover:bg-[#1a2542] transition-colors"
                    >
                      <Plus />
                    </button>
                  </div>

                  {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {ingredients.map((ingredient) => (
                        <div key={ingredient} className="flex items-center bg-[#ECA72C] bg-opacity-20 text-[#0E1428] px-3 py-1 rounded-full border border-[#ECA72C]">
                          {ingredient}
                          <button 
                            onClick={() => handleRemoveIngredient(ingredient)}
                            className="ml-2 text-[#0E1428] hover:text-[#CE5534]"
                            disabled={pantryLoading}
                          >
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => generateRecipes(true)}
                    disabled={ingredients.length === 0 || isLoading || pantryLoading}
                    className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${ingredients.length === 0 || isLoading || pantryLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#ECA72C] hover:bg-[#d89a26] text-[#0E1428]'}`}
                  >
                    {isLoading || pantryLoading ? (
                      'Loading...'
                    ) : (
                      <>
                        <Search size={20} /> Generate Recipes
                      </>
                    )}
                  </button>
                </div>
              ) : activeTab === 'recipes' ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-[#0E1428]">Suggested Recipes</h2>
                    <button
                      onClick={() => generateRecipes(true)}
                      disabled={isLoading}
                      className="flex items-center gap-1 text-[#0E1428] hover:text-[#CE5534]"
                    >
                      <RefreshCw 
                        size={16} 
                        className={`${isRefreshing ? 'animate-spin' : ''}`} 
                      /> Refresh
                    </button>
                  </div>
                  <div className="grid gap-4">
                    {recipes.map((recipe) => (
                      <div 
                        key={recipe.id} 
                        className="border border-[#0E1428] rounded-lg p-4 hover:bg-[#AFC2D5] hover:bg-opacity-20 cursor-pointer transition-colors"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg text-[#0E1428]">{recipe.title}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSavedRecipe(recipe)
                            }}
                            className="text-[#ECA72C] hover:text-[#d89a26]"
                          >
                            <Star 
                              size={20} 
                              fill={savedRecipes.some(r => r.id === recipe.id) ? "#ECA72C" : "none"} 
                            />
                          </button>
                        </div>
                        <p className="text-sm text-[#6EA4BF] mt-1">{recipe.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-[#6EA4BF]">
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> Prep: {recipe.prepTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> Cook: {recipe.cookTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => generateRecipes()}
                    disabled={isLoading}
                    className={`w-full mt-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#0E1428] hover:bg-[#1a2542] text-white'}`}
                  >
                    {isLoading ? 'Loading...' : 'Load More Recipes'}
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-[#0E1428]">Saved Recipes</h2>
                  <div className="grid gap-4">
                    {savedRecipes.map((recipe) => (
                      <div 
                        key={recipe.id} 
                        className="border border-[#0E1428] rounded-lg p-4 hover:bg-[#AFC2D5] hover:bg-opacity-20 cursor-pointer transition-colors"
                        onClick={() => setSelectedRecipe(recipe)}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg text-[#0E1428]">{recipe.title}</h3>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleSavedRecipe(recipe)
                            }}
                            className="text-[#ECA72C] hover:text-[#d89a26]"
                          >
                            <Star size={20} fill="#ECA72C" />
                          </button>
                        </div>
                        <p className="text-sm text-[#6EA4BF] mt-1">{recipe.description}</p>
                        <div className="flex gap-4 mt-2 text-sm text-[#6EA4BF]">
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> Prep: {recipe.prepTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> Cook: {recipe.cookTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-[#AFC2D5]">
            <div className="flex justify-between items-start mb-4">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="text-[#CE5534] hover:text-[#0E1428] flex items-center gap-1"
              >
                ← Back to recipes
              </button>
              <button 
                onClick={() => toggleSavedRecipe(selectedRecipe)}
                className="text-[#ECA72C] hover:text-[#d89a26]"
              >
                <Star 
                  size={24} 
                  fill={savedRecipes.some(r => r.id === selectedRecipe.id) ? "#ECA72C" : "none"} 
                />
              </button>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 text-[#0E1428]">{selectedRecipe.title}</h2>
              <p className="text-[#6EA4BF] mb-4">{selectedRecipe.description}</p>
              <div className="flex gap-4 text-sm text-[#6EA4BF]">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> Prep: {selectedRecipe.prepTime}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> Cook: {selectedRecipe.cookTime}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#0E1428]">Ingredients</h3>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients.map((ing: string, i: number) => (
                    <li key={i} className="flex items-start text-[#0E1428]">
                      <span className="inline-block w-5 h-5 bg-[#ECA72C] text-[#0E1428] rounded-full flex items-center justify-center mr-2 mt-0.5">•</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[#0E1428]">Instructions</h3>
                <div className="whitespace-pre-line text-[#0E1428]">{selectedRecipe.instructions}</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
