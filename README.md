# CollegeMeals 

**Live Demo:** [collegemeals.app](https://collegemeals.app)

A minimal AI-powered web app that helps college students quickly turn ingredients into full meal recipes using Google's Gemini API.

## Tech Stack

- Frontend: [Vite](https://vitejs.dev/), TypeScript, CSS
- Deployment: [Vercel](https://vercel.com/)

## Features

- Input any list of ingredients and receive a full meal recipe
- Displays estimated prep and cook time
- Mobile-friendly, responsive design
- Stateless (no login or saved preferences)
- Clean UI optimized for quick access on mobile or desktop

## Note

- May experience slight delays due to free backend hosting tier
- Not intended for real-world production use

## How It Works

1. User enters available ingredients
2. The frontend sends them to a secure backend API (hosted separately)
3. Backend queries Gemini with the ingredients and returns a recipe

---

## Related

- Backend repo: [CollegeMeals Server](https://github.com/PRivas1/CollegeMealsServer)
