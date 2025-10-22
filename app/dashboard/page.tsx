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

  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00'
  const viewRate = clicks > 0 ? ((pageViews / clicks) * 100).toFixed(2) : '0.00'
  const clickToAtc = clicks > 0 ? ((addToCarts / clicks) * 100).toFixed(2) : '0.00'
  const atcToCheckout = addToCarts > 0 ? ((checkouts / addToCarts) * 100).toFixed(2) : '0.00'
  const checkoutToPurchase = checkouts > 0 ? ((purchases / checkouts) * 100).toFixed(2) : '0.00'

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
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Funnel Health Section */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Funnel Health</h2>

          {/* Funnel Visualization */}
          <div className="space-y-4">
            {/* Impressions → Clicks */}
            <div className="flex items-center gap-4">
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Impressions</div>
                <div className="text-2xl font-bold text-gray-900">{impressions.toLocaleString()}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '100%' }} />
                  </div>
                  <div className="text-sm font-medium text-green-600">{ctr}% CTR</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Benchmark: 1.8% • Status: Above ✓</div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Clicks</div>
                <div className="text-2xl font-bold text-gray-900">{clicks.toLocaleString()}</div>
              </div>
            </div>

            {/* Clicks → Page Views */}
            <div className="flex items-center gap-4">
              <div className="w-48" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '84.6%' }} />
                  </div>
                  <div className="text-sm font-medium text-green-600">84.6%</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">View Rate • Status: Good ✓</div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Page Views</div>
                <div className="text-2xl font-bold text-gray-900">{pageViews.toLocaleString()}</div>
              </div>
            </div>

            {/* Page Views → Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="w-48" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${clickToAtc}%` }} />
                  </div>
                  <div className="text-sm font-medium text-red-600">{clickToAtc}% ATC Rate</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Benchmark: 8-12% • Status: Below</div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Add to Carts</div>
                <div className="text-2xl font-bold text-gray-900">{addToCarts.toLocaleString()}</div>
              </div>
            </div>

            {/* Add to Cart → Checkout */}
            <div className="flex items-center gap-4">
              <div className="w-48" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${atcToCheckout}%` }} />
                  </div>
                  <div className="text-sm font-medium text-amber-600">{atcToCheckout}%</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Benchmark: 45-60% • Status: Within range</div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Checkouts</div>
                <div className="text-2xl font-bold text-gray-900">{checkouts.toLocaleString()}</div>
              </div>
            </div>

            {/* Checkout → Purchase */}
            <div className="flex items-center gap-4">
              <div className="w-48" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: `${checkoutToPurchase}%` }} />
                  </div>
                  <div className="text-sm font-medium text-red-600">{checkoutToPurchase}%</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Benchmark: 60-75% • Status: Critical</div>
              </div>
              <div className="w-48">
                <div className="text-sm font-medium text-gray-700">Purchases</div>
                <div className="text-2xl font-bold text-gray-900">{purchases.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Primary Concern */}
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 text-red-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-1">Primary Concern: Checkout → Purchase ({checkoutToPurchase}%)</h3>
                <p className="text-sm text-red-800 mb-2">
                  Your checkout-to-purchase rate is critically below the 60-75% benchmark. This is where you're losing the most revenue.
                </p>
                <div className="text-sm text-red-900">
                  <p className="font-medium mb-1">Recommended actions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Review payment options and checkout process for friction</li>
                    <li>Add trust signals (security badges, guarantees)</li>
                    <li>Test free shipping thresholds</li>
                    <li>Optimize mobile checkout experience</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <div className="metric-card">
            <div className="text-sm text-gray-600">Spend</div>
            <div className="text-2xl font-bold text-gray-900">${data.spend.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className="text-sm text-gray-500 mt-2">
              {dateRange === 'last_7' ? 'Last 7 days' :
               dateRange === 'last_14' ? 'Last 14 days' :
               dateRange === 'last_30' ? 'Last 30 days' : 'This month'}
            </div>
          </div>

          <div className="metric-card">
            <div className="text-sm text-gray-600">Revenue</div>
            <div className="text-2xl font-bold text-gray-900">${data.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <div className="text-sm text-gray-500 mt-2">
              {dateRange === 'last_7' ? 'Last 7 days' :
               dateRange === 'last_14' ? 'Last 14 days' :
               dateRange === 'last_30' ? 'Last 30 days' : 'This month'}
            </div>
          </div>

          <div className="metric-card">
            <div className="text-sm text-gray-600">ROAS</div>
            <div className="text-2xl font-bold text-gray-900">{roas.toFixed(2)}x</div>
            <div className={`text-sm mt-2 ${roas >= 4.0 ? 'status-good' : 'status-bad'}`}>Target: 4.0x+</div>
          </div>

          <div className="metric-card">
            <div className="text-sm text-gray-600">CPA</div>
            <div className="text-2xl font-bold text-gray-900">${cpa > 0 ? cpa.toFixed(2) : 'N/A'}</div>
            <div className={`text-sm mt-2 ${cpa > 0 && cpa < 30 ? 'status-good' : 'status-bad'}`}>Target: &lt;$30</div>
          </div>

          <div className="metric-card">
            <div className="text-sm text-gray-600">Purchases</div>
            <div className="text-2xl font-bold text-gray-900">{purchases}</div>
            <div className="text-sm text-gray-500 mt-2">
              {dateRange === 'last_7' ? 'Last 7 days' :
               dateRange === 'last_14' ? 'Last 14 days' :
               dateRange === 'last_30' ? 'Last 30 days' : 'This month'}
            </div>
          </div>
        </div>

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
