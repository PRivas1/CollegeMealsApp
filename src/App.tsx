import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AppPage from './pages/AppPage'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/app" /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/app" element={isAuthenticated ? <AppPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
