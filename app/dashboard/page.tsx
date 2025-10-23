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
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Spend</div>
            <div className="text-2xl font-bold text-gray-900">${data.spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-2xl font-bold text-gray-900">${data.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">ROAS</div>
            <div className="text-2xl font-bold text-gray-900">{roas.toFixed(2)}x</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: {accountSettings?.targetROAS ? `${accountSettings.targetROAS}x` : '4.0x'}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-600 mb-1">CPA</div>
            <div className="text-2xl font-bold text-gray-900">${cpa.toFixed(2)}</div>
            <div className="text-xs text-gray-500 mt-1">
              Target: ${accountSettings?.targetCPA ? accountSettings.targetCPA.toFixed(2) : '30.00'}
            </div>
          </div>
        </div>

        {/* Funnel Visualization Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Conversion Funnel</h2>

          {/* SVG Funnel */}
          <div className="relative">
            <svg viewBox="0 0 800 600" className="w-full" style={{ maxHeight: '500px' }}>
              {/* Funnel stages */}
              {/* Impressions */}
              <g>
                <path d="M 100 50 L 700 50 L 650 150 L 150 150 Z" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="2"/>
                <text x="400" y="90" textAnchor="middle" className="text-sm font-semibold" fill="#374151">Impressions</text>
                <text x="400" y="115" textAnchor="middle" className="text-xl font-bold" fill="#111827">{impressions.toLocaleString()}</text>
              </g>

              {/* Clicks */}
              <g>
                <path d="M 150 150 L 650 150 L 600 250 L 200 250 Z"
                  fill={ctrStatus === 'good' ? '#dcfce7' : ctrStatus === 'warning' ? '#fef3c7' : '#fee2e2'}
                  stroke={ctrStatus === 'good' ? '#86efac' : ctrStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="400" y="190" textAnchor="middle" className="text-sm font-semibold" fill="#374151">Clicks</text>
                <text x="400" y="215" textAnchor="middle" className="text-xl font-bold" fill="#111827">{clicks.toLocaleString()}</text>
                <text x="400" y="235" textAnchor="middle" className="text-xs" fill="#6b7280">{ctr}% CTR • Benchmark: {benchmarks.ctr.min}-{benchmarks.ctr.max}%</text>
              </g>

              {/* Add to Cart */}
              <g>
                <path d="M 200 250 L 600 250 L 550 350 L 250 350 Z"
                  fill={clickToAtcStatus === 'good' ? '#dcfce7' : clickToAtcStatus === 'warning' ? '#fef3c7' : '#fee2e2'}
                  stroke={clickToAtcStatus === 'good' ? '#86efac' : clickToAtcStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="400" y="290" textAnchor="middle" className="text-sm font-semibold" fill="#374151">Add to Cart</text>
                <text x="400" y="315" textAnchor="middle" className="text-xl font-bold" fill="#111827">{addToCarts.toLocaleString()}</text>
                <text x="400" y="335" textAnchor="middle" className="text-xs" fill="#6b7280">{clickToAtc}% Rate • Benchmark: {benchmarks.clickToAtc.min}-{benchmarks.clickToAtc.max}%</text>
              </g>

              {/* Checkout */}
              <g>
                <path d="M 250 350 L 550 350 L 500 450 L 300 450 Z"
                  fill={atcToCheckoutStatus === 'good' ? '#dcfce7' : atcToCheckoutStatus === 'warning' ? '#fef3c7' : '#fee2e2'}
                  stroke={atcToCheckoutStatus === 'good' ? '#86efac' : atcToCheckoutStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="400" y="390" textAnchor="middle" className="text-sm font-semibold" fill="#374151">Checkout</text>
                <text x="400" y="415" textAnchor="middle" className="text-xl font-bold" fill="#111827">{checkouts.toLocaleString()}</text>
                <text x="400" y="435" textAnchor="middle" className="text-xs" fill="#6b7280">{atcToCheckout}% Rate • Benchmark: {benchmarks.atcToCheckout.min}-{benchmarks.atcToCheckout.max}%</text>
              </g>

              {/* Purchase */}
              <g>
                <path d="M 300 450 L 500 450 L 450 550 L 350 550 Z"
                  fill={checkoutToPurchaseStatus === 'good' ? '#dcfce7' : checkoutToPurchaseStatus === 'warning' ? '#fef3c7' : '#fee2e2'}
                  stroke={checkoutToPurchaseStatus === 'good' ? '#86efac' : checkoutToPurchaseStatus === 'warning' ? '#fcd34d' : '#fca5a5'}
                  strokeWidth="2"/>
                <text x="400" y="490" textAnchor="middle" className="text-sm font-semibold" fill="#374151">Purchase</text>
                <text x="400" y="515" textAnchor="middle" className="text-xl font-bold" fill="#111827">{purchases.toLocaleString()}</text>
                <text x="400" y="535" textAnchor="middle" className="text-xs" fill="#6b7280">{checkoutToPurchase}% Rate • Benchmark: {benchmarks.checkoutToPurchase.min}-{benchmarks.checkoutToPurchase.max}%</text>
              </g>
            </svg>
          </div>

          {/* Optimization Opportunities */}
          {problematicStages.length > 0 ? (
            <div className="mt-6 space-y-3">
              <h3 className="font-bold text-gray-900">Optimization Opportunities</h3>
              {problematicStages.map((stage, idx) => {
                const isCritical = stage.severity === 'critical'
                const bgColor = isCritical ? 'bg-red-50' : 'bg-amber-50'
                const borderColor = isCritical ? 'border-red-200' : 'border-amber-200'
                const textColor = isCritical ? 'text-red-900' : 'text-amber-900'
                const iconColor = isCritical ? 'text-red-600' : 'text-amber-600'

                // Generate specific recommendations based on stage
                const getRecommendations = () => {
                  switch (stage.name) {
                    case 'CTR':
                      return [
                        'Test new ad creative - refresh imagery and messaging',
                        'Refine audience targeting - exclude poor performers',
                        'A/B test ad copy focusing on benefits over features',
                        'Review ad placement - may be showing in low-intent contexts'
                      ]
                    case 'Click→ATC':
                      return [
                        'Check page load speed - every second costs 7% conversions',
                        'Add more product images showing product in use',
                        'Include customer reviews and ratings prominently',
                        'Test pricing display and value propositions',
                        'Optimize for mobile - 60%+ of traffic is mobile'
                      ]
                    case 'ATC→Checkout':
                      return [
                        'Show shipping costs earlier (on product page or cart)',
                        'Offer guest checkout - reduce account creation friction',
                        'Add trust badges (security, money-back guarantee)',
                        'Implement express checkout (Apple Pay, Shop Pay)',
                        'Test progress indicator in checkout flow'
                      ]
                    case 'Checkout→Purchase':
                      return [
                        'Set up cart abandonment emails - highly qualified users',
                        'Add inline form validation with helpful error messages',
                        'Display order summary alongside payment form',
                        'Test payment processor - ensure mobile wallets work',
                        'Add "What happens next" message near submit button'
                      ]
                    default:
                      return []
                  }
                }

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
                        <p className={`text-sm ${textColor} mb-2`}>
                          {isCritical ? 'Critically' : 'Currently'} below the {stage.benchmark.min}-{stage.benchmark.max}% benchmark.
                          {isCritical && idx === 0 ? ' This is your highest-impact optimization opportunity.' : ''}
                        </p>
                        <div className={`text-sm ${textColor}`}>
                          <p className="font-medium mb-1">Quick wins to test:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {getRecommendations().slice(0, 3).map((rec, i) => (
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
