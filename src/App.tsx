import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import LoginPage from './pages/LoginPage'
import AppPage from './pages/AppPage'
import SettingsPage from './pages/SettingsPage'
import PricingPage from './pages/PricingPage'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1428] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/app" /> : <LoginPage />} 
      />
      <Route 
        path="/app" 
        element={user ? <AppPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/settings" 
        element={user ? <SettingsPage /> : <Navigate to="/" />} 
      />
      <Route 
        path="/pricing" 
        element={user ? <PricingPage /> : <Navigate to="/" />} 
      />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
