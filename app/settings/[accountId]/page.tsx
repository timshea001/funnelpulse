'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

export default function AccountSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const accountId = params.accountId as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [account, setAccount] = useState<any>(null)

  const [formData, setFormData] = useState({
    industry: '',
    businessModel: '',
    primaryGoal: '',
    averageOrderValue: '',
    profitMargin: '',
    hasRepeatPurchases: false,
    repeatPurchaseFrequency: '',
    targetCPA: '',
    targetROAS: ''
  })

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(`/api/ad-accounts/${accountId}`)
        if (response.ok) {
          const data = await response.json()
          setAccount(data.account)

          // Populate form with existing data
          setFormData({
            industry: data.account.industry || '',
            businessModel: data.account.businessModel || '',
            primaryGoal: data.account.primaryGoal || '',
            averageOrderValue: data.account.averageOrderValue || '',
            profitMargin: data.account.profitMargin || '',
            hasRepeatPurchases: data.account.hasRepeatPurchases || false,
            repeatPurchaseFrequency: data.account.repeatPurchaseFrequency || '',
            targetCPA: data.account.targetCPA || '',
            targetROAS: data.account.targetROAS || ''
          })
        }
      } catch (error) {
        console.error('Error loading account:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAccount()
  }, [accountId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/ad-accounts/${accountId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading account settings...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-sm text-gray-500">{account?.accountName}</p>
            </div>
            <UserButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Business Context</h2>

          {/* Industry */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select your industry</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="beauty">Beauty & Cosmetics</option>
              <option value="electronics">Electronics</option>
              <option value="home">Home & Garden</option>
              <option value="health">Health & Wellness</option>
              <option value="food">Food & Beverage</option>
              <option value="sports">Sports & Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Business Model */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Model
            </label>
            <select
              value={formData.businessModel}
              onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select your business model</option>
              <option value="B2C">B2C - Business to Consumer</option>
              <option value="D2C">D2C - Direct to Consumer</option>
              <option value="B2B">B2B - Business to Business</option>
            </select>
          </div>

          {/* Primary Goal */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Campaign Goal
            </label>
            <select
              value={formData.primaryGoal}
              onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select your primary goal</option>
              <option value="purchases">Purchases</option>
              <option value="leads">Lead Generation</option>
              <option value="app_installs">App Installs</option>
              <option value="brand_awareness">Brand Awareness</option>
            </select>
          </div>

          {/* Average Order Value */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Order Value ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.averageOrderValue}
              onChange={(e) => setFormData({ ...formData, averageOrderValue: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 75.00"
              required
            />
          </div>

          {/* Profit Margin */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profit Margin (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formData.profitMargin}
              onChange={(e) => setFormData({ ...formData, profitMargin: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 35"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your profit after costs (COGS, shipping, etc.)
            </p>
          </div>

          {/* Repeat Purchases */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasRepeatPurchases}
                onChange={(e) => setFormData({ ...formData, hasRepeatPurchases: e.target.checked })}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Customers make repeat purchases
              </span>
            </label>
          </div>

          {formData.hasRepeatPurchases && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Repeat Purchase Frequency (per year)
              </label>
              <select
                value={formData.repeatPurchaseFrequency}
                onChange={(e) => setFormData({ ...formData, repeatPurchaseFrequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select frequency</option>
                <option value="1-2">1-2 times per year</option>
                <option value="3-4">3-4 times per year</option>
                <option value="5+">5+ times per year</option>
                <option value="not_sure">Not sure</option>
              </select>
            </div>
          )}

          <hr className="my-8" />

          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Targets</h2>

          {/* Target CPA */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target CPA ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.targetCPA}
              onChange={(e) => setFormData({ ...formData, targetCPA: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 30.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum cost per acquisition you're willing to pay
            </p>
          </div>

          {/* Target ROAS */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target ROAS (x)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.targetROAS}
              onChange={(e) => setFormData({ ...formData, targetROAS: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g., 4.0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum return on ad spend you need to be profitable
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
