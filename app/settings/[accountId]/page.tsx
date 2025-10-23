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

  // Calculate break-even metrics based on current form values
  const calculateBreakEven = () => {
    const aov = parseFloat(formData.averageOrderValue) || 0
    const margin = parseFloat(formData.profitMargin) || 0

    const breakEvenCPA = aov * (margin / 100)
    const minimumROAS = aov > 0 && breakEvenCPA > 0 ? aov / breakEvenCPA : 0

    // Calculate LTV multiplier
    let ltvMultiplier = 1
    if (formData.hasRepeatPurchases) {
      if (formData.repeatPurchaseFrequency === '5+') ltvMultiplier = 3
      else if (formData.repeatPurchaseFrequency === '3-4') ltvMultiplier = 2
      else if (formData.repeatPurchaseFrequency === '1-2') ltvMultiplier = 1.5
    }

    const ltvAdjustedCPA = breakEvenCPA * ltvMultiplier
    const ltvAdjustedROAS = ltvMultiplier > 0 ? minimumROAS / ltvMultiplier : minimumROAS

    return {
      breakEvenCPA: breakEvenCPA > 0 ? breakEvenCPA : null,
      minimumROAS: minimumROAS > 0 ? minimumROAS : null,
      ltvMultiplier,
      ltvAdjustedCPA: ltvAdjustedCPA > 0 ? ltvAdjustedCPA : null,
      ltvAdjustedROAS: ltvAdjustedROAS > 0 ? ltvAdjustedROAS : null
    }
  }

  const breakEvenMetrics = calculateBreakEven()

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

          {/* Break-even metrics explanation */}
          {breakEvenMetrics.breakEvenCPA && breakEvenMetrics.minimumROAS && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Recommended Targets Based on Your Business
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Break-even CPA:</span>
                  <span className="font-mono">${breakEvenMetrics.breakEvenCPA.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Minimum ROAS to break even:</span>
                  <span className="font-mono">{breakEvenMetrics.minimumROAS.toFixed(2)}x</span>
                </div>
                {formData.hasRepeatPurchases && breakEvenMetrics.ltvMultiplier > 1 && (
                  <>
                    <hr className="my-2 border-blue-200" />
                    <p className="text-xs text-gray-600 italic">
                      With repeat purchases ({breakEvenMetrics.ltvMultiplier}x LTV multiplier), you can afford higher acquisition costs:
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">LTV-adjusted Max CPA:</span>
                      <span className="font-mono text-green-700">${breakEvenMetrics.ltvAdjustedCPA?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">LTV-adjusted Min ROAS:</span>
                      <span className="font-mono text-green-700">{breakEvenMetrics.ltvAdjustedROAS?.toFixed(2)}x</span>
                    </div>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    targetCPA: breakEvenMetrics.ltvAdjustedCPA
                      ? breakEvenMetrics.ltvAdjustedCPA.toFixed(2)
                      : breakEvenMetrics.breakEvenCPA?.toFixed(2) || '',
                    targetROAS: breakEvenMetrics.ltvAdjustedROAS
                      ? breakEvenMetrics.ltvAdjustedROAS.toFixed(2)
                      : breakEvenMetrics.minimumROAS?.toFixed(2) || ''
                  })
                }}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Use Recommended Targets
              </button>
            </div>
          )}

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
              placeholder={breakEvenMetrics.breakEvenCPA ? `e.g., ${breakEvenMetrics.breakEvenCPA.toFixed(2)}` : 'e.g., 30.00'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum cost per acquisition you're willing to pay. Your break-even CPA is ${breakEvenMetrics.breakEvenCPA?.toFixed(2) || '0.00'} based on your AOV and margin.
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
              placeholder={breakEvenMetrics.minimumROAS ? `e.g., ${breakEvenMetrics.minimumROAS.toFixed(2)}` : 'e.g., 4.0'}
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum return on ad spend you need to be profitable. Your minimum ROAS is {breakEvenMetrics.minimumROAS?.toFixed(2) || '0.00'}x to break even.
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
