require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const app = express()
const port = process.env.PORT || 3001

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

app.use(cors())
app.use(express.json())

// Recipe generation endpoint
app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide a list of ingredients' })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    const prompt = `Generate 5 simple, healthy recipes. For each recipe, use a subset of the following ingredients (do not use all ingredients in every recipe): ${ingredients.join(', ')}. Each recipe should be unique and can use different combinations of the provided ingredients. For each recipe, provide:
    1. A descriptive title
    2. Prep time (in minutes)
    3. Cook time (in minutes)
    4. List of ingredients (including the ones used from the provided list plus any common pantry items)
    5. Step-by-step instructions
    6. A brief description of the dish
    
    Format each recipe as a JSON object with these fields:
    {
      "title": "string",
      "prepTime": "string",
      "cookTime": "string",
      "ingredients": ["string"],
      "instructions": "string",
      "description": "string"
    }
    
    Return an array of 5 recipe objects.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/)
    if (!jsonMatch) {
      throw new Error('Failed to parse recipes from response')
    }
    
    const recipes = JSON.parse(jsonMatch[0])
    
    // Add unique IDs to each recipe
    const recipesWithIds = recipes.map(recipe => ({
      ...recipe,
      id: Date.now() + Math.random()
    }))

    res.json({ recipes: recipesWithIds })
  } catch (error) {
    console.error('Error generating recipes:', error)
    res.status(500).json({ error: 'Failed to generate recipes' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
}) 