import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Mail, User, ChefHat } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (!email || !password || (!isLogin && !confirmPassword)) {
        throw new Error('Please fill in all fields')
      }
      if (!isLogin && password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      navigate('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1428] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#ECA72C] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ChefHat size={32} className="text-[#0E1428]" />
            <h1 className="text-2xl font-bold text-[#0E1428]">Collegemeals.app</h1>
          </div>
          <p className="text-[#0E1428]">
            {isLogin ? 'Sign in to continue' : 'Join us to get started'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#0E1428]">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-[#6EA4BF]" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                placeholder="you@email.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-[#0E1428]">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-[#6EA4BF]" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#0E1428]">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#6EA4BF]" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 bg-[#0E1428] text-white rounded-lg font-medium hover:bg-[#1a2542] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-[#6EA4BF] hover:text-[#0E1428]"
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
