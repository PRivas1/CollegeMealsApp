import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock } from 'lucide-react'

export default function SettingsPage() {
  const [name, setName] = useState('John Doe')
  const [email, setEmail] = useState('john@example.com')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword && newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    // Mock update
    setSuccess('Account settings updated successfully')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0E1428] text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/app')}
            className="flex items-center gap-1 hover:text-[#ECA72C] transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Account Settings</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#AFC2D5]">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#0E1428]">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#6EA4BF]" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                />
              </div>
            </div>

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
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#0E1428]">Current Password</label>
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
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#0E1428]">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#6EA4BF]" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ECA72C]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-[#0E1428]">Confirm New Password</label>
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
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#0E1428] text-white rounded-lg font-medium hover:bg-[#1a2542] transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
