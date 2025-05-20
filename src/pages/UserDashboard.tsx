import React from 'react'
import { Tabs } from 'antd'
import { PantryList } from '../components/PantryList'
import { SavedRecipes } from '../components/SavedRecipes'
import { useAuth } from '../lib/AuthContext'

export function UserDashboard() {
  const { user, profile } = useAuth()

  if (!user || !profile) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
      </div>
    )
  }

  const items = [
    {
      key: 'pantry',
      label: 'My Pantry',
      children: <PantryList />,
    },
    {
      key: 'saved',
      label: 'Saved Recipes',
      children: <SavedRecipes />,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {profile.full_name}!</h1>
        <p className="text-gray-600">
          {profile.subscription_status === 'trial' && profile.trial_end_date ? (
            <>
              You are currently on a trial period until{' '}
              {new Date(profile.trial_end_date).toLocaleDateString()}
            </>
          ) : (
            'Manage your pantry and saved recipes'
          )}
        </p>
      </div>

      <Tabs
        defaultActiveKey="pantry"
        items={items}
        className="bg-white rounded-lg shadow"
      />
    </div>
  )
} 