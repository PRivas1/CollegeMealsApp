import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Mail, Lock, CreditCard, AlertTriangle } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { supabase } from '../lib/supabase'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    active: true,
    isTrial: true,
    plan: 'Free Trial',
    expires: '2023-12-31'
  })
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Validate password fields
      if (newPassword) {
        if (newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long')
        }
        if (newPassword !== confirmPassword) {
          throw new Error('New passwords do not match')
        }
        if (!password) {
          throw new Error('Please enter your current password to change it')
        }
      } else {
        throw new Error('Please enter a new password to change it')
      }

      // Update password if provided
      if (newPassword) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword
        })
        if (updateError) throw updateError
      }

      // Clear password fields and show success message
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setSuccess('Password updated successfully')
    } catch (err) {
      console.error('Error updating settings:', err)
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500)
    }
  }

  const handleCancelSubscription = () => {
    if (subscriptionStatus.isTrial || !subscriptionStatus.active) {
      setError('Cannot cancel trial or inactive subscription')
      setShowCancelConfirm(false)
      return
    }

    setSubscriptionStatus({
      ...subscriptionStatus,
      active: false,
      plan: 'None',
      expires: ''
    })
    setShowCancelConfirm(false)
    setSuccess('Subscription cancelled successfully')
  }

  const canCancelSubscription = () => {
    return subscriptionStatus.active && !subscriptionStatus.isTrial
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

      <main className="container mx-auto p-4 max-w-3xl space-y-6">
        {/* Account Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#AFC2D5]">
          <h2 className="text-xl font-semibold mb-4 text-[#0E1428]">Account Information</h2>
          
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
              <label className="block text-sm font-medium text-[#0E1428]">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-[#6EA4BF]" />
                </div>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="pl-10 w-full p-2 border border-[#AFC2D5] rounded-lg bg-gray-100 cursor-not-allowed"
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#0E1428] text-white rounded-lg font-medium hover:bg-[#1a2542] transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Subscription Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#AFC2D5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#0E1428]">Subscription</h2>
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-[#6EA4BF]" />
              {subscriptionStatus.active ? (
                <span className={`text-sm font-medium ${subscriptionStatus.isTrial ? 'text-[#ECA72C]' : 'text-green-600'}`}>
                  {subscriptionStatus.plan} (expires {subscriptionStatus.expires})
                </span>
              ) : (
                <span className="text-sm font-medium text-red-600">No active subscription</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {subscriptionStatus.active ? (
              <>
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full py-3 bg-[#ECA72C] text-[#0E1428] rounded-lg font-medium hover:bg-[#d89a26] transition-colors"
                >
                  {subscriptionStatus.isTrial ? 'Subscribe Now' : 'Change Plan'}
                </button>
                {!subscriptionStatus.isTrial && (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full py-3 border border-red-500 text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors"
                  >
                    Cancel Subscription
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => navigate('/pricing')}
                className="w-full py-3 bg-[#0E1428] text-white rounded-lg font-medium hover:bg-[#1a2542] transition-colors"
              >
                Subscribe Now
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-xl font-semibold text-[#0E1428]">Cancel Subscription</h3>
            </div>
            <p className="text-[#0E1428] mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 border border-[#0E1428] text-[#0E1428] rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
