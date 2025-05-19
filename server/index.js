const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-recipes', async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients array is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 5 simple recipes using these ingredients: ${ingredients.join(', ')}. 
    For each recipe, provide:
    1. Title
    2. Prep time (in minutes)
    3. Cook time (in minutes) 
    4. List of ingredients (including the ones provided)
    5. Step-by-step instructions
    6. A short description of what the dish is
    
    Format as JSON array with these keys: id, title, prepTime, cookTime, ingredients, instructions, description`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response and add IDs
    const recipes = JSON.parse(text.replace(/```json|```/g, '')).map(recipe => ({
      ...recipe,
      id: Date.now() + Math.random()
    }));

    res.json({ recipes });
  } catch (error) {
    console.error('Error generating recipes:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 