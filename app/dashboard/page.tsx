'use client'

import { useState, useEffect } from 'react'
import { UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [dateRange, setDateRange] = useState('last_7')
  const [loading, setLoading] = useState(true)
  const [adAccounts, setAdAccounts] = useState<any[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)
  const [accountSettings, setAccountSettings] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [recentReports, setRecentReports] = useState<any[]>([])
  const [generatingReport, setGeneratingReport] = useState(false)

  // Fetch ad accounts on mount
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch('/api/meta/accounts')
        if (response.ok) {
          const data = await response.json()
          setAdAccounts(data.accounts)

          // Try to restore previously selected account from localStorage
          const savedAccountId = localStorage.getItem('selectedAdAccountId')
          const savedAccount = data.accounts.find((acc: any) => acc.id === savedAccountId)

          if (savedAccount) {
            setSelectedAccount(savedAccountId)
          } else if (data.accounts.length > 0) {
            setSelectedAccount(data.accounts[0].id)
            localStorage.setItem('selectedAdAccountId', data.accounts[0].id)
          }
        }
      } catch (error) {
        console.error('Error fetching accounts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccounts()
  }, [])

  // Fetch account settings when account changes
  useEffect(() => {
    if (!selectedAccount) return

    async function fetchAccountSettings() {
      try {
        const response = await fetch(`/api/ad-accounts/${selectedAccount}`)
        if (response.ok) {
          const data = await response.json()
          setAccountSettings(data.account)
        }
      } catch (error) {
        console.error('Error fetching account settings:', error)
      }
    }

    fetchAccountSettings()
  }, [selectedAccount])

  // Fetch dashboard data when account or date range changes
  useEffect(() => {
    if (!selectedAccount) return

    async function fetchDashboardData() {
      setLoading(true)
      try {
        // Calculate date range
        const endDate = new Date()
        const startDate = new Date()

        switch (dateRange) {
          case 'last_7':
            startDate.setDate(endDate.getDate() - 7)
            break
          case 'last_14':
            startDate.setDate(endDate.getDate() - 14)
            break
          case 'last_30':
            startDate.setDate(endDate.getDate() - 30)
            break
          case 'this_month':
            startDate.setDate(1)
            break
        }

        const response = await fetch('/api/meta/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: selectedAccount,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            level: 'account'
          })
        })

        if (response.ok) {
          const data = await response.json()
          setDashboardData(data.insights)
        }

        // Also fetch recent reports
        const reportsResponse = await fetch(`/api/reports?limit=5&adAccountId=${selectedAccount}`)
        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json()
          setRecentReports(reportsData.reports)
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [selectedAccount, dateRange])

  const handleGenerateReport = async () => {
    if (!selectedAccount) return

    setGeneratingReport(true)
    try {
      const endDate = new Date()
      const startDate = new Date()

      switch (dateRange) {
        case 'last_7':
          startDate.setDate(endDate.getDate() - 7)
          break
        case 'last_14':
          startDate.setDate(endDate.getDate() - 14)
          break
        case 'last_30':
          startDate.setDate(endDate.getDate() - 30)
          break
        case 'this_month':
          startDate.setDate(1)
          break
      }

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adAccountId: selectedAccount,
          dateRangeStart: startDate.toISOString().split('T')[0],
          dateRangeEnd: endDate.toISOString().split('T')[0]
        })
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/reports/${data.reportId}`)
      } else {
        alert('Failed to generate report')
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report')
    } finally {
      setGeneratingReport(false)
    }
  }

  // Use dashboard data if available, otherwise show loading or empty state
  const data = dashboardData?.summary || { spend: 0, revenue: 0, purchases: 0, addToCarts: 0, initiateCheckouts: 0, viewContent: 0, clicks: 0, impressions: 0 }

  // Calculate metrics
  const roas = data.spend > 0 ? data.revenue / data.spend : 0
  const cpa = data.purchases > 0 ? data.spend / data.purchases : 0

  // Calculate conversion rates
  const impressions = data.impressions || 0
  const clicks = data.clicks || 0
  const pageViews = data.viewContent || clicks // Fallback to clicks
  const addToCarts = data.addToCarts || 0
  const checkouts = data.initiateCheckouts || 0
  const purchases = data.purchases || 0

  // Calculate metrics as numbers for comparison
  const ctrNum = impressions > 0 ? (clicks / impressions) * 100 : 0
  const viewRateNum = clicks > 0 ? (pageViews / clicks) * 100 : 0
  const clickToAtcNum = clicks > 0 ? (addToCarts / clicks) * 100 : 0
  const atcToCheckoutNum = addToCarts > 0 ? (checkouts / addToCarts) * 100 : 0
  const checkoutToPurchaseNum = checkouts > 0 ? (purchases / checkouts) * 100 : 0

  // Format for display
  const ctr = ctrNum.toFixed(2)
  const viewRate = viewRateNum.toFixed(2)
  const clickToAtc = clickToAtcNum.toFixed(2)
  const atcToCheckout = atcToCheckoutNum.toFixed(2)
  const checkoutToPurchase = checkoutToPurchaseNum.toFixed(2)

  // E-commerce benchmarks
  const benchmarks = {
    ctr: { min: 1.5, max: 3.0, name: 'CTR' },
    clickToAtc: { min: 8, max: 12, name: 'Click→ATC' },
    atcToCheckout: { min: 45, max: 60, name: 'ATC→Checkout' },
    checkoutToPurchase: { min: 60, max: 75, name: 'Checkout→Purchase' }
  }

  // Determine status for each stage
  const getStageStatus = (value: number, benchmark: { min: number, max: number }) => {
    if (value >= benchmark.min) return 'good'
    if (value >= benchmark.min * 0.8) return 'warning'
    return 'critical'
  }

  const ctrStatus = getStageStatus(ctrNum, benchmarks.ctr)
  const clickToAtcStatus = getStageStatus(clickToAtcNum, benchmarks.clickToAtc)
  const atcToCheckoutStatus = getStageStatus(atcToCheckoutNum, benchmarks.atcToCheckout)
  const checkoutToPurchaseStatus = getStageStatus(checkoutToPurchaseNum, benchmarks.checkoutToPurchase)

  // Find all problematic stages
  const problematicStages = []
  if (ctrStatus === 'critical') problematicStages.push({ name: 'CTR', value: ctrNum, benchmark: benchmarks.ctr, severity: 'critical' })
  if (ctrStatus === 'warning') problematicStages.push({ name: 'CTR', value: ctrNum, benchmark: benchmarks.ctr, severity: 'warning' })
  if (clickToAtcStatus === 'critical') problematicStages.push({ name: 'Click→ATC', value: clickToAtcNum, benchmark: benchmarks.clickToAtc, severity: 'critical' })
  if (clickToAtcStatus === 'warning') problematicStages.push({ name: 'Click→ATC', value: clickToAtcNum, benchmark: benchmarks.clickToAtc, severity: 'warning' })
  if (atcToCheckoutStatus === 'critical') problematicStages.push({ name: 'ATC→Checkout', value: atcToCheckoutNum, benchmark: benchmarks.atcToCheckout, severity: 'critical' })
  if (atcToCheckoutStatus === 'warning') problematicStages.push({ name: 'ATC→Checkout', value: atcToCheckoutNum, benchmark: benchmarks.atcToCheckout, severity: 'warning' })
  if (checkoutToPurchaseStatus === 'critical') problematicStages.push({ name: 'Checkout→Purchase', value: checkoutToPurchaseNum, benchmark: benchmarks.checkoutToPurchase, severity: 'critical' })
  if (checkoutToPurchaseStatus === 'warning') problematicStages.push({ name: 'Checkout→Purchase', value: checkoutToPurchaseNum, benchmark: benchmarks.checkoutToPurchase, severity: 'warning' })

  // Sort by severity (critical first) then by how far below benchmark
  problematicStages.sort((a, b) => {
    if (a.severity === 'critical' && b.severity !== 'critical') return -1
    if (b.severity === 'critical' && a.severity !== 'critical') return 1
    const aGap = (a.benchmark.min - a.value) / a.benchmark.min
    const bGap = (b.benchmark.min - b.value) / b.benchmark.min
    return bGap - aGap
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  if (adAccounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">No Ad Accounts Connected</h2>
          <p className="text-gray-600 mb-6">Connect your Meta Ads account to get started</p>
          <button onClick={() => window.location.href = '/api/meta/authorize'} className="btn-primary">
            Connect Meta Account
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FunnelIQ</h1>
              <p className="text-sm text-gray-500">Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              {adAccounts.length > 1 && (
                <select
                  value={selectedAccount || ''}
                  onChange={(e) => {
                    const newAccountId = e.target.value
                    setSelectedAccount(newAccountId)
                    localStorage.setItem('selectedAdAccountId', newAccountId)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {adAccounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.accountName}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="last_7">Last 7 days</option>
                <option value="last_14">Last 14 days</option>
                <option value="last_30">Last 30 days</option>
                <option value="this_month">This month</option>
              </select>
              {selectedAccount && (
                <button
                  onClick={() => router.push(`/settings/${selectedAccount}`)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Settings
                </button>
              )}
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 group relative">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              Spend
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${data.spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              Total amount spent on Meta ads during this period. Track this against your budget to ensure you're staying on target.
              <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 group relative">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              Revenue
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${data.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              Total revenue generated from purchases attributed to your Meta ads. This is based on the conversion value tracked by Meta's pixel.
              <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 group relative">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              ROAS
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{roas.toFixed(2)}x</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: {accountSettings?.targetROAS ? `${accountSettings.targetROAS}x` : '4.0x'}
            </div>
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              Return on Ad Spend - How much revenue you generate for every dollar spent. For example, 4.0x means you make $4 for every $1 spent. Higher is better!
              <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 group relative">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              CPA
              <span className="text-xs text-gray-400 cursor-help">ⓘ</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">${cpa.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: ${accountSettings?.targetCPA ? accountSettings.targetCPA.toFixed(2) : '30.00'}
            </div>
            {/* Tooltip */}
            <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              Cost Per Acquisition - How much you pay on average to get one customer. Lower is better. Your target CPA should be lower than your profit per sale.
              <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>

        {/* Funnel Visualization Section */}
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Conversion Funnel</h2>

          {/* Funnel with metrics on left */}
          <div className="flex items-center gap-8">
            {/* Metrics Column */}
            <div className="flex-shrink-0 w-64 space-y-12">
              {/* CTR Metric */}
              <div className="text-right pr-4">
                <div className={`text-3xl font-bold mb-1 ${ctrStatus === 'good' ? 'text-green-600' : ctrStatus === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
                  {ctr}%
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  CTR
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  Target: {benchmarks.ctr.min}-{benchmarks.ctr.max}%
                </div>
              </div>

              {/* Click to ATC Metric */}
              <div className="text-right pr-4 mt-16">
                <div className={`text-3xl font-bold mb-1 ${clickToAtcStatus === 'good' ? 'text-green-600' : clickToAtcStatus === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
                  {clickToAtc}%
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  Click → ATC
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  Target: {benchmarks.clickToAtc.min}-{benchmarks.clickToAtc.max}%
                </div>
              </div>

              {/* ATC to Checkout Metric */}
              <div className="text-right pr-4 mt-16">
                <div className={`text-3xl font-bold mb-1 ${atcToCheckoutStatus === 'good' ? 'text-green-600' : atcToCheckoutStatus === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
                  {atcToCheckout}%
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  ATC → Checkout
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  Target: {benchmarks.atcToCheckout.min}-{benchmarks.atcToCheckout.max}%
                </div>
              </div>

              {/* Checkout to Purchase Metric */}
              <div className="text-right pr-4 mt-16">
                <div className={`text-3xl font-bold mb-1 ${checkoutToPurchaseStatus === 'good' ? 'text-green-600' : checkoutToPurchaseStatus === 'warning' ? 'text-amber-600' : 'text-red-600'}`}>
                  {checkoutToPurchase}%
                </div>
                <div className="text-sm text-gray-600 font-mono">
                  Checkout → Purchase
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  Target: {benchmarks.checkoutToPurchase.min}-{benchmarks.checkoutToPurchase.max}%
                </div>
              </div>
            </div>

            {/* SVG Funnel */}
            <div className="flex-1">
              <svg viewBox="0 0 600 580" className="w-full" style={{ maxHeight: '580px' }}>
                <defs>
                  {/* Gradients for warmer colors */}
                  <linearGradient id="goodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d1fae5" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>
                  <linearGradient id="warningGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                  <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fee2e2" />
                    <stop offset="100%" stopColor="#fecaca" />
                  </linearGradient>
                  <linearGradient id="grayGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f3f4f6" />
                    <stop offset="100%" stopColor="#e5e7eb" />
                  </linearGradient>

                  {/* Rounded corner filters */}
                  <filter id="round">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
                  </filter>
                </defs>

                {/* Impressions */}
                <path d="M 50 30 Q 50 20 60 20 L 540 20 Q 550 20 550 30 L 500 130 Q 500 140 490 140 L 110 140 Q 100 140 100 130 Z"
                  fill="url(#grayGradient)"
                  stroke="#d1d5db"
                  strokeWidth="2"/>
                <text x="300" y="65" textAnchor="middle" className="text-base font-semibold" fill="#6b7280">Impressions</text>
                <text x="300" y="95" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{impressions.toLocaleString()}</text>

                {/* Clicks */}
                <path d="M 100 140 L 500 140 Q 500 140 498 148 L 450 248 Q 450 260 438 260 L 162 260 Q 150 260 150 248 L 102 148 Q 100 140 100 140 Z"
                  fill={ctrStatus === 'good' ? 'url(#goodGradient)' : ctrStatus === 'warning' ? 'url(#warningGradient)' : 'url(#criticalGradient)'}
                  stroke={ctrStatus === 'good' ? '#86efac' : ctrStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="300" y="185" textAnchor="middle" className="text-base font-semibold" fill="#374151">Clicks</text>
                <text x="300" y="215" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{clicks.toLocaleString()}</text>

                {/* Add to Cart */}
                <path d="M 150 260 L 450 260 Q 450 260 448 268 L 400 368 Q 400 380 388 380 L 212 380 Q 200 380 200 368 L 152 268 Q 150 260 150 260 Z"
                  fill={clickToAtcStatus === 'good' ? 'url(#goodGradient)' : clickToAtcStatus === 'warning' ? 'url(#warningGradient)' : 'url(#criticalGradient)'}
                  stroke={clickToAtcStatus === 'good' ? '#86efac' : clickToAtcStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="300" y="305" textAnchor="middle" className="text-base font-semibold" fill="#374151">Add to Cart</text>
                <text x="300" y="335" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{addToCarts.toLocaleString()}</text>

                {/* Checkout */}
                <path d="M 200 380 L 400 380 Q 400 380 398 388 L 350 488 Q 350 500 338 500 L 262 500 Q 250 500 250 488 L 202 388 Q 200 380 200 380 Z"
                  fill={atcToCheckoutStatus === 'good' ? 'url(#goodGradient)' : atcToCheckoutStatus === 'warning' ? 'url(#warningGradient)' : 'url(#criticalGradient)'}
                  stroke={atcToCheckoutStatus === 'good' ? '#86efac' : atcToCheckoutStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="300" y="425" textAnchor="middle" className="text-base font-semibold" fill="#374151">Checkout</text>
                <text x="300" y="455" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{checkouts.toLocaleString()}</text>

                {/* Purchase */}
                <path d="M 250 500 L 350 500 Q 350 500 348 508 L 325 558 Q 325 565 318 565 L 282 565 Q 275 565 275 558 L 252 508 Q 250 500 250 500 Z"
                  fill={checkoutToPurchaseStatus === 'good' ? 'url(#goodGradient)' : checkoutToPurchaseStatus === 'warning' ? 'url(#warningGradient)' : 'url(#criticalGradient)'}
                  stroke={checkoutToPurchaseStatus === 'good' ? '#86efac' : checkoutToPurchaseStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="300" y="522" textAnchor="middle" className="text-base font-semibold" fill="#374151">Purchase</text>
                <text x="300" y="548" textAnchor="middle" className="text-2xl font-bold" fill="#111827">{purchases.toLocaleString()}</text>
              </svg>
            </div>
          </div>

          {/* What This Means Section */}
          <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-lg border border-orange-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Performance Snapshot
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {(() => {
                const goodStages = [ctrStatus, clickToAtcStatus, atcToCheckoutStatus, checkoutToPurchaseStatus].filter(s => s === 'good').length
                const criticalStages = problematicStages.filter(s => s.severity === 'critical').length

                if (goodStages === 4) {
                  return "Excellent performance across all funnel stages! Your campaigns are converting efficiently from impression to purchase. Continue monitoring and testing to maintain these results."
                } else if (goodStages >= 2) {
                  const goodAreas = []
                  if (ctrStatus === 'good') goodAreas.push('ad engagement')
                  if (clickToAtcStatus === 'good') goodAreas.push('product interest')
                  if (atcToCheckoutStatus === 'good') goodAreas.push('cart conversion')
                  if (checkoutToPurchaseStatus === 'good') goodAreas.push('checkout completion')

                  return `Strong ${goodAreas.join(' and ')} ${goodAreas.length > 1 ? 'are' : 'is'} working in your favor. Focus optimization efforts on the highlighted stages below to unlock additional revenue from your existing traffic.`
                } else if (criticalStages > 0) {
                  return "Your funnel has significant optimization opportunities. The critical stages highlighted below represent the biggest wins - small improvements here will have outsized impact on your bottom line."
                } else {
                  return "Your funnel shows room for improvement across multiple stages. Prioritize the recommendations below, starting with stages furthest below benchmark for the fastest ROI."
                }
              })()}
            </p>
          </div>

          {/* Optimization Opportunities */}
          {problematicStages.length > 0 ? (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Optimization Opportunities
              </h3>
              {problematicStages.map((stage, idx) => {
                const isCritical = stage.severity === 'critical'
                const bgColor = isCritical ? 'bg-red-50' : 'bg-amber-50'
                const borderColor = isCritical ? 'border-red-200' : 'border-amber-200'
                const textColor = isCritical ? 'text-red-900' : 'text-amber-900'
                const iconColor = isCritical ? 'text-red-600' : 'text-amber-600'

                // Get industry from account settings
                const industry = accountSettings?.industry || 'ecommerce'

                // Generate context-aware intro
                const getContextIntro = () => {
                  // Check what's working well
                  const goodMetrics = []
                  if (ctrStatus === 'good') goodMetrics.push('CTR')
                  if (clickToAtcStatus === 'good') goodMetrics.push('Click→ATC')
                  if (atcToCheckoutStatus === 'good') goodMetrics.push('ATC→Checkout')
                  if (checkoutToPurchaseStatus === 'good') goodMetrics.push('Checkout→Purchase')

                  if (stage.name === 'Click→ATC' && ctrStatus === 'good') {
                    return 'Your ads are driving traffic at an above-average rate. The issue is on your website - focus on product pages and landing experience.'
                  } else if (stage.name === 'ATC→Checkout' && clickToAtcStatus === 'good') {
                    return 'Customers are interested in your products (good ATC rate), but something is preventing them from starting checkout.'
                  } else if (stage.name === 'Checkout→Purchase' && atcToCheckoutStatus === 'good') {
                    return 'Shoppers are making it to checkout, but abandoning before completing. This is often the easiest win - small friction points have big impact here.'
                  } else if (stage.name === 'CTR') {
                    return goodMetrics.length > 0 ? 'While your site converts well, your ads need attention to drive more qualified traffic.' : 'Your ads aren\'t resonating with your target audience. Fresh creative and better targeting can dramatically improve results.'
                  }
                  return null
                }

                // Generate industry-specific recommendations
                const getRecommendations = () => {
                  const baseRecs: any = {
                    'CTR': [
                      `Test ${industry === 'fashion' ? 'lifestyle imagery and user-generated content' : industry === 'beauty' ? 'before/after visuals and influencer partnerships' : 'product-in-use imagery and social proof'}`,
                      'Refine audience targeting - exclude poor performers and lookalikes',
                      'A/B test ad copy emphasizing unique value (not just features)',
                      'Review ad placements - ensure you\'re showing in high-intent contexts'
                    ],
                    'Click→ATC': [
                      'Page load speed: Every second delay costs 7% conversions',
                      `${industry === 'fashion' || industry === 'beauty' ? 'Add detailed size guides and fit information' : 'Show product from multiple angles with zoom'}`,
                      'Place customer reviews prominently (5-star ratings boost conversions 20%+)',
                      `${industry === 'fashion' ? 'Add \"Complete the look\" recommendations' : 'Test different pricing displays and urgency elements'}`,
                      'Mobile optimization is critical - 60%+ of traffic is mobile'
                    ],
                    'ATC→Checkout': [
                      'Show shipping costs on product page (not just at checkout)',
                      'Offer guest checkout - account creation kills 23% of conversions',
                      'Add trust signals: security badges, money-back guarantee, free returns',
                      `${industry === 'fashion' || industry === 'beauty' ? 'Show \"You may also like\" recommendations in cart' : 'Implement express checkout (Apple Pay, Shop Pay)'}`,
                      'Display progress indicator - let shoppers know how many steps remain'
                    ],
                    'Checkout→Purchase': [
                      'Set up cart abandonment emails (10-15% recovery rate typical)',
                      'Add inline form validation - helpful error messages reduce friction',
                      'Keep order summary visible alongside payment form',
                      'Test payment options - ensure mobile wallets work smoothly',
                      'Add reassurance: \"Secure checkout\" badge and \"What happens next\" copy'
                    ]
                  }

                  return baseRecs[stage.name] || []
                }

                const contextIntro = getContextIntro()

                return (
                  <div key={idx} className={`${bgColor} border ${borderColor} rounded-lg p-4`}>
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 ${iconColor}`}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCritical ? "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" : "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"} />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${textColor} mb-1`}>
                          {idx === 0 && isCritical ? 'Priority: ' : ''}{stage.name} ({stage.value.toFixed(1)}%)
                        </h4>
                        {contextIntro && (
                          <p className={`text-sm ${textColor} mb-2 italic bg-white/30 p-2 rounded`}>
                            💡 {contextIntro}
                          </p>
                        )}
                        <p className={`text-sm ${textColor} mb-2`}>
                          {isCritical ? 'Critically' : 'Currently'} below the {stage.benchmark.min}-{stage.benchmark.max}% benchmark.
                          {isCritical && idx === 0 ? ' This is your highest-impact opportunity.' : ''}
                        </p>
                        <div className={`text-sm ${textColor}`}>
                          <p className="font-medium mb-1">Recommended actions:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {getRecommendations().slice(0, 3).map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-green-900">Funnel Health: Excellent</h3>
                  <p className="text-sm text-green-800">All conversion stages are meeting or exceeding industry benchmarks.</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Reports Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reports</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Overview */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-2">Account Overview</h3>
              <p className="text-sm text-gray-600 mb-4">
                Comprehensive performance analysis with funnel insights
              </p>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3">
                <option value="last_7">Last 7 days</option>
                <option value="last_14">Last 14 days</option>
                <option value="last_30">Last 30 days</option>
              </select>
              <button
                onClick={handleGenerateReport}
                disabled={generatingReport}
                className="btn-primary w-full"
              >
                {generatingReport ? 'Generating...' : 'Generate Report'}
              </button>
              <p className="text-xs text-gray-500 mt-2">
                {recentReports.length > 0
                  ? `Last generated: ${new Date(recentReports[0].generatedAt).toLocaleString()}`
                  : 'Last generated: Never'}
              </p>
            </div>

            {/* Creative Analysis */}
            <div className="border border-gray-200 rounded-lg p-6 relative">
              <div className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                Coming Soon
              </div>
              <h3 className="font-bold text-gray-400 mb-2">Creative Analysis</h3>
              <p className="text-sm text-gray-400 mb-4">
                Deep dive into creative performance by audience
              </p>
              <button disabled className="btn-primary w-full opacity-50 cursor-not-allowed">
                Generate Report
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
