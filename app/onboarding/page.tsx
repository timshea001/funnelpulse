'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checkingOnboarding, setCheckingOnboarding] = useState(true)

  // Form state
  const [businessContext, setBusinessContext] = useState({
    industry: '',
    businessModel: 'B2C' as 'B2C' | 'B2B' | 'D2C',
    primaryGoal: 'purchases' as 'purchases' | 'leads' | 'app_installs' | 'brand_awareness',
  })

  // Check if user has already completed onboarding
  useEffect(() => {
    async function checkOnboardingStatus() {
      try {
        const response = await fetch('/api/user/profile')
        if (response.ok) {
          const data = await response.json()
          // If user has industry set, they've completed onboarding
          if (data.user?.industry) {
            router.push('/dashboard')
            return
          }
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error)
      } finally {
        setCheckingOnboarding(false)
      }
    }

    checkOnboardingStatus()
  }, [])

  const [productEconomics, setProductEconomics] = useState({
    averageOrderValue: 0,
    profitMargin: 0,
    hasRepeatPurchases: false,
    repeatPurchaseFrequency: '',
  })

  const [calculatedMetrics, setCalculatedMetrics] = useState({
    breakEvenCPA: 0,
    targetROAS: 0,
  })

  // Calculate metrics in real-time
  const updateCalculations = (aov: number, margin: number) => {
    const profitPerSale = aov * (margin / 100)
    const breakEvenCPA = profitPerSale
    const targetROAS = (1 / (margin / 100)) * 1.2

    setCalculatedMetrics({
      breakEvenCPA: Number(breakEvenCPA.toFixed(2)),
      targetROAS: Number(targetROAS.toFixed(2)),
    })
  }

  const handleAOVChange = (value: string) => {
    const aov = parseFloat(value) || 0
    setProductEconomics(prev => ({ ...prev, averageOrderValue: aov }))
    updateCalculations(aov, productEconomics.profitMargin)
  }

  const handleMarginChange = (value: string) => {
    const margin = parseFloat(value) || 0
    setProductEconomics(prev => ({ ...prev, profitMargin: margin }))
    updateCalculations(productEconomics.averageOrderValue, margin)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...businessContext,
          ...productEconomics,
          breakEvenCPA: calculatedMetrics.breakEvenCPA,
          targetROAS: calculatedMetrics.targetROAS,
        }),
      })

      if (response.ok) {
        // Only redirect to dashboard if we're not going to Meta OAuth
        // (Meta OAuth will redirect to dashboard after completion)
        return true
      } else {
        alert('Error saving onboarding data')
        return false
      }
    } catch (error) {
      console.error('Onboarding error:', error)
      alert('Error saving onboarding data')
      return false
    } finally {
      setLoading(false)
    }
  }

  if (checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-brand' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">
            Step {step} of 3
          </p>
        </div>

        {/* Step 1: Business Context */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your business
              </h2>
              <p className="text-gray-600">
                We'll use this to provide personalized benchmarks and insights
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={businessContext.industry}
                onChange={(e) =>
                  setBusinessContext({ ...businessContext, industry: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              >
                <option value="">Select industry...</option>
                <option value="ecommerce_food">E-commerce - Food & Beverage</option>
                <option value="ecommerce_fashion">E-commerce - Fashion & Apparel</option>
                <option value="ecommerce_beauty">E-commerce - Beauty & Cosmetics</option>
                <option value="ecommerce_home">E-commerce - Home & Garden</option>
                <option value="ecommerce_general">E-commerce - Other</option>
                <option value="b2b_saas">B2B SaaS</option>
                <option value="local_services">Local Services</option>
                <option value="education">Education/Courses</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Model
              </label>
              <div className="flex gap-4">
                {(['B2C', 'B2B', 'D2C'] as const).map((model) => (
                  <label key={model} className="flex items-center">
                    <input
                      type="radio"
                      name="businessModel"
                      value={model}
                      checked={businessContext.businessModel === model}
                      onChange={(e) =>
                        setBusinessContext({
                          ...businessContext,
                          businessModel: e.target.value as any,
                        })
                      }
                      className="mr-2"
                    />
                    {model}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Advertising Goal
              </label>
              <div className="space-y-2">
                {[
                  { value: 'purchases', label: 'Online Purchases' },
                  { value: 'leads', label: 'Lead Generation' },
                  { value: 'app_installs', label: 'App Installs' },
                  { value: 'brand_awareness', label: 'Brand Awareness' },
                ].map((goal) => (
                  <label key={goal.value} className="flex items-center">
                    <input
                      type="radio"
                      name="primaryGoal"
                      value={goal.value}
                      checked={businessContext.primaryGoal === goal.value}
                      onChange={(e) =>
                        setBusinessContext({
                          ...businessContext,
                          primaryGoal: e.target.value as any,
                        })
                      }
                      className="mr-2"
                    />
                    {goal.label}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!businessContext.industry}
              className="btn-primary w-full"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Product Economics */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Let's understand your unit economics
              </h2>
              <p className="text-gray-600">
                This helps us show you exactly what CPA and ROAS you need to be profitable.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                🔒 Your data is private and never shared.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Order Value (AOV)
              </label>
              <input
                type="number"
                placeholder="e.g., 95"
                value={productEconomics.averageOrderValue || ''}
                onChange={(e) => handleAOVChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                The typical amount customers spend per purchase
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Average Profit Margin (%)
              </label>
              <input
                type="number"
                placeholder="e.g., 30"
                value={productEconomics.profitMargin || ''}
                onChange={(e) => handleMarginChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Revenue minus all costs (product, shipping, fulfillment)
              </p>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={productEconomics.hasRepeatPurchases}
                  onChange={(e) =>
                    setProductEconomics({
                      ...productEconomics,
                      hasRepeatPurchases: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  My customers typically purchase more than once
                </span>
              </label>

              {productEconomics.hasRepeatPurchases && (
                <div className="mt-3 ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many times in the first 12 months?
                  </label>
                  <select
                    value={productEconomics.repeatPurchaseFrequency}
                    onChange={(e) =>
                      setProductEconomics({
                        ...productEconomics,
                        repeatPurchaseFrequency: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="1-2">1-2 times</option>
                    <option value="3-4">3-4 times</option>
                    <option value="5+">5+ times</option>
                    <option value="not_sure">Not sure</option>
                  </select>
                </div>
              )}
            </div>

            {/* Live calculation preview */}
            {productEconomics.averageOrderValue > 0 && productEconomics.profitMargin > 0 && (
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <p className="font-medium text-gray-900 mb-2">Based on your inputs:</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Break-even CPA: ${calculatedMetrics.breakEvenCPA.toFixed(2)}</li>
                  <li>• Target ROAS: {calculatedMetrics.targetROAS.toFixed(2)}x+</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  We'll track these in every report.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!productEconomics.averageOrderValue || !productEconomics.profitMargin}
                className="btn-primary flex-1"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connect Ad Account */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Connect your Meta Ads account
              </h2>
              <p className="text-gray-600">
                Connect your Facebook/Instagram ads account to start generating reports.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <button
                onClick={async () => {
                  // Save onboarding data first
                  await handleSubmit()
                  // Then redirect to Meta OAuth
                  window.location.href = '/api/meta/authorize'
                }}
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Connect Meta Ads'}
              </button>
              <p className="text-sm text-gray-500 mt-4">
                You can also connect later from Settings
              </p>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                Back
              </button>
              <button
                onClick={async () => {
                  const success = await handleSubmit()
                  if (success) {
                    router.push('/dashboard')
                  }
                }}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                {loading ? 'Saving...' : 'Skip for now'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
