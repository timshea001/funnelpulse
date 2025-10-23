'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatCurrency, formatPercentage, formatNumber } from '@/lib/calculations'

interface Report {
  id: string
  reportType: string
  dateRangeStart: string
  dateRangeEnd: string
  generatedAt: string
  adAccount: {
    accountName: string
  }
  dataSnapshot: any
  calculatedMetrics: any
  insights: any
}

export default function ReportPage() {
  const params = useParams()
  const router = useRouter()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [account, setAccount] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch report
        const reportResponse = await fetch(`/api/reports/${params.id}`)
        if (!reportResponse.ok) {
          throw new Error('Failed to fetch report')
        }
        const reportData = await reportResponse.json()
        setReport(reportData.report)

        // Fetch user profile for benchmarks
        const userResponse = await fetch('/api/user/profile')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData.user)
        }

        // Fetch account settings for goals
        if (reportData.report?.adAccountId) {
          const accountResponse = await fetch(`/api/ad-accounts/${reportData.report.adAccountId}`)
          if (accountResponse.ok) {
            const accountData = await accountResponse.json()
            setAccount(accountData.account)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading report...</div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error || 'Report not found'}</div>
          <button onClick={() => router.push('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const data = report.dataSnapshot
  const metrics = report.calculatedMetrics
  const insights = report.insights

  // Calculate conversion rates from funnel data (more reliable than summary)
  const clicks = data.funnel?.clicks || data.summary.clicks || 0
  const addToCarts = data.funnel?.addToCarts || data.summary.addToCarts || 0
  const checkouts = data.funnel?.checkouts || data.summary.initiateCheckouts || 0
  const purchases = data.funnel?.purchases || data.summary.purchases || 0

  const clickToATC = clicks > 0 ? (addToCarts / clicks) * 100 : 0
  const atcToCheckout = addToCarts > 0 ? (checkouts / addToCarts) * 100 : 0
  const checkoutToPurchase = checkouts > 0 ? (purchases / checkouts) * 100 : 0
  const overallAtcToPurchase = addToCarts > 0 ? (purchases / addToCarts) * 100 : 0

  // E-commerce industry benchmarks
  const benchmarks = {
    clickToATC: { min: 8, max: 12 },
    atcToCheckout: { min: 45, max: 60 },
    checkoutToPurchase: { min: 60, max: 75 },
    overallAtcToPurchase: { min: 25, max: 35 }
  }

  const getStatus = (value: number, benchmark: { min: number, max: number }) => {
    if (value >= benchmark.min && value <= benchmark.max) {
      return { text: 'Within target', class: 'text-green-600' }
    } else if (value > benchmark.max) {
      return { text: 'Above target', class: 'text-green-600' }
    } else {
      return { text: 'Below target', class: 'text-red-600' }
    }
  }

  // Generate educational insights based on performance
  const generateFunnelInsights = () => {
    const funnelInsights = []

    // Click to ATC Analysis
    if (clickToATC < benchmarks.clickToATC.min) {
      funnelInsights.push({
        stage: 'Click → Add to Cart',
        issue: `Your ${clickToATC.toFixed(1)}% conversion rate is below the ${benchmarks.clickToATC.min}% industry benchmark`,
        factors: [
          'Product page load speed - Every second of delay reduces conversions by 7%',
          'Product images & video - High-quality visuals showing product in use increase trust',
          'Price positioning - Unexpected prices or missing value props cause immediate exits',
          'Product descriptions - Benefits-focused copy outperforms feature lists',
          'Social proof - Reviews, ratings, and testimonials reduce purchase anxiety',
          'Mobile optimization - 60%+ of traffic is mobile; poor mobile UX kills conversions'
        ],
        recommendations: [
          'Test your page load speed on PageSpeed Insights - aim for <2 seconds',
          'Add lifestyle imagery showing your product in context',
          'Include at least 3-5 customer reviews on product pages',
          'A/B test benefit-driven headlines vs. feature lists',
          'Check mobile experience - tap targets should be thumb-friendly'
        ]
      })
    } else if (clickToATC > benchmarks.clickToATC.max) {
      funnelInsights.push({
        stage: 'Click → Add to Cart',
        issue: `Strong performance at ${clickToATC.toFixed(1)}% (above ${benchmarks.clickToATC.max}% benchmark)`,
        factors: [
          'Your product page experience is converting well above industry standards',
          'This indicates strong product-market fit and effective landing pages'
        ],
        recommendations: [
          'Document what\'s working - analyze your top-performing product pages',
          'Focus optimization efforts on the next funnel stage to maximize revenue',
          'Consider slight price increases if you have this much conviction from visitors'
        ]
      })
    }

    // ATC to Checkout Analysis
    if (atcToCheckout < benchmarks.atcToCheckout.min) {
      funnelInsights.push({
        stage: 'Add to Cart → Checkout',
        issue: `Your ${atcToCheckout.toFixed(1)}% progression rate is below the ${benchmarks.atcToCheckout.min}% industry benchmark`,
        factors: [
          'Unexpected shipping costs - The #1 cart abandonment reason (48% of users)',
          'Complex checkout process - Each extra step reduces conversions by 20%',
          'Account creation friction - Forced account creation kills 23% of purchases',
          'Payment options - Limited payment methods (no PayPal, Apple Pay) lose 8-10% of buyers',
          'Trust signals - Missing security badges or unclear return policy creates doubt',
          'Mobile cart experience - Pinch-and-zoom or hard-to-tap buttons cause exits'
        ],
        recommendations: [
          'Show shipping costs earlier in the journey (product page or cart)',
          'Offer guest checkout - collect minimal info upfront',
          'Add trust badges near checkout button (secure checkout, money-back guarantee)',
          'Implement express checkout options (Shop Pay, Apple Pay, Google Pay)',
          'Test a progress indicator showing steps remaining in checkout'
        ]
      })
    }

    // Checkout to Purchase Analysis
    if (checkoutToPurchase < benchmarks.checkoutToPurchase.min) {
      funnelInsights.push({
        stage: 'Checkout → Purchase',
        issue: `Your ${checkoutToPurchase.toFixed(1)}% completion rate is below the ${benchmarks.checkoutToPurchase.min}% industry benchmark`,
        factors: [
          'Payment errors - Card declines or processor issues at final step',
          'Form validation issues - Unclear error messages or strict formatting requirements',
          'Last-minute shipping surprises - Long delivery times revealed only at checkout',
          'Mobile checkout friction - Small input fields or auto-fill not working',
          'Missing reassurance - No order summary or unclear what happens after purchase',
          'Slow processing - Page appears to hang, causing users to abandon or double-click'
        ],
        recommendations: [
          'Implement cart abandonment emails for this stage - users are highly qualified',
          'Add inline form validation with helpful error messages',
          'Display order summary alongside payment form for reassurance',
          'Test payment processor - ensure mobile wallets work seamlessly',
          'Add a clear "What happens next" message near submit button',
          'Show loading state immediately on submit to prevent double-clicks'
        ]
      })
    }

    // Overall funnel health
    const overallHealth = overallAtcToPurchase
    if (overallHealth < benchmarks.overallAtcToPurchase.min) {
      funnelInsights.push({
        stage: 'Overall Funnel Health',
        issue: `Overall conversion (ATC→Purchase) of ${overallHealth.toFixed(1)}% suggests systematic checkout issues`,
        factors: [
          'Multiple friction points compounding throughout the checkout flow',
          'This indicates the checkout experience needs comprehensive optimization',
          'Small improvements at each stage multiply into significant revenue gains'
        ],
        recommendations: [
          'Prioritize checkout optimization - this is your highest-ROI opportunity',
          'Implement session recordings to watch real user checkout experiences',
          'Set up funnel tracking in Google Analytics to identify exact drop-off points',
          'Consider a complete checkout redesign using best-practice templates',
          'Test one-page checkout vs. multi-step to see what works for your audience'
        ]
      })
    }

    return funnelInsights
  }

  const funnelInsights = generateFunnelInsights()

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none; }
          .container { box-shadow: none; }
        }
      `}</style>

      {/* Print/Download buttons */}
      <div className="max-w-7xl mx-auto px-4 py-4 print:hidden">
        <div className="flex justify-end gap-2">
          <button onClick={() => window.print()} className="btn-secondary">
            Print Report
          </button>
          <button onClick={() => router.push('/dashboard')} className="btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Report Container */}
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white p-10 shadow">
          {/* Header */}
          <header className="border-b-2 border-gray-900 pb-5 mb-8">
            <h1 className="text-3xl font-semibold mb-2">
              ACCOUNT PERFORMANCE | {new Date(report.dateRangeStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(report.dateRangeEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </h1>
            <div className="text-gray-600 text-base">{report.adAccount.accountName}</div>
          </header>

          {/* Overall Metrics */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Overall Metrics</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Metric</th>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Value</th>
                  {account && <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Target</th>}
                  {account && <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Status</th>}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Total Spend</td>
                  <td className="p-3 border-b border-gray-200">{formatCurrency(data.summary.spend)}</td>
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Revenue</td>
                  <td className="p-3 border-b border-gray-200">{formatCurrency(data.summary.revenue)}</td>
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Purchases</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(purchases)}</td>
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                  {account && <td className="p-3 border-b border-gray-200">-</td>}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">ROAS</td>
                  <td className="p-3 border-b border-gray-200">
                    {(() => {
                      const actualROAS = data.summary.spend > 0 ? (data.summary.revenue / data.summary.spend) : 0
                      return `${actualROAS.toFixed(2)}x`
                    })()}
                  </td>
                  {account && (
                    <td className="p-3 border-b border-gray-200">
                      {account.targetROAS ? `${parseFloat(account.targetROAS).toFixed(2)}x` : 'Not set'}
                    </td>
                  )}
                  {account && (
                    <td className="p-3 border-b border-gray-200">
                      {(() => {
                        if (!account.targetROAS) return '-'
                        const actualROAS = data.summary.spend > 0 ? (data.summary.revenue / data.summary.spend) : 0
                        const target = parseFloat(account.targetROAS)
                        if (actualROAS >= target) {
                          return <span className="text-green-600 font-semibold">✓ On target</span>
                        } else {
                          const percentOff = ((target - actualROAS) / target * 100).toFixed(0)
                          return <span className="text-red-600 font-semibold">⚠️ {percentOff}% below</span>
                        }
                      })()}
                    </td>
                  )}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">CPA</td>
                  <td className="p-3 border-b border-gray-200">
                    {purchases > 0 ? formatCurrency(data.summary.spend / purchases) : 'N/A'}
                  </td>
                  {account && (
                    <td className="p-3 border-b border-gray-200">
                      {account.targetCPA ? formatCurrency(parseFloat(account.targetCPA)) : 'Not set'}
                    </td>
                  )}
                  {account && (
                    <td className="p-3 border-b border-gray-200">
                      {(() => {
                        if (!account.targetCPA || purchases === 0) return '-'
                        const actualCPA = data.summary.spend / purchases
                        const target = parseFloat(account.targetCPA)
                        if (actualCPA <= target) {
                          return <span className="text-green-600 font-semibold">✓ On target</span>
                        } else {
                          const percentOver = ((actualCPA - target) / target * 100).toFixed(0)
                          return <span className="text-red-600 font-semibold">⚠️ {percentOver}% over</span>
                        }
                      })()}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
            {account?.hasRepeatPurchases && (
              <div className="text-sm italic text-gray-600">
                LTV Multiplier: {account.ltvMultiplier ? `${parseFloat(account.ltvMultiplier).toFixed(1)}x` : 'N/A'} • Repeat Purchase Frequency: {account.repeatPurchaseFrequency || 'N/A'}
              </div>
            )}
            {account && (account.breakEvenCPA || account.minimumROAS) && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h3 className="font-semibold text-sm mb-2">Business Context</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  {account.averageOrderValue && <div>Average Order Value: {formatCurrency(parseFloat(account.averageOrderValue))}</div>}
                  {account.profitMargin && <div>Profit Margin: {parseFloat(account.profitMargin).toFixed(1)}%</div>}
                  {account.breakEvenCPA && <div>Break-even CPA: {formatCurrency(parseFloat(account.breakEvenCPA))}</div>}
                  {account.minimumROAS && <div>Minimum ROAS: {parseFloat(account.minimumROAS).toFixed(2)}x</div>}
                </div>
              </div>
            )}
          </section>

          {/* Campaign Performance - Group adsets by campaign */}
          {data.adsets && data.adsets.length > 0 && (() => {
            // Group adsets by campaign
            const campaignMap = new Map<string, any[]>()
            data.adsets.forEach((adset: any) => {
              const campaignName = adset.campaign_name || 'Unknown Campaign'
              if (!campaignMap.has(campaignName)) {
                campaignMap.set(campaignName, [])
              }
              campaignMap.get(campaignName)!.push(adset)
            })

            return (
              <section className="mb-10">
                <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Ad Set Performance Metrics</h2>
                {Array.from(campaignMap.entries()).map(([campaignName, adsets], idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-base font-semibold mb-3 text-gray-700">Campaign: {campaignName}</h3>
                    <table className="w-full border-collapse mb-6">
                      <thead>
                        <tr>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Ad Set</th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Spend</th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300 group relative">
                            <span className="flex items-center gap-1">
                              CTR
                              <span className="text-xs text-gray-400 cursor-help print:hidden">ⓘ</span>
                            </span>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs font-normal rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 print:hidden">
                              Click-Through Rate - Percentage of people who see your ad and click on it. Industry benchmarks: 0.9-1.5% for most e-commerce. Higher CTR means your creative and targeting resonate.
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                            </div>
                          </th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">CPM</th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Link Click CPC</th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">ATCs</th>
                          <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Purchases</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adsets.map((adset: any, adsetIdx: number) => (
                          <tr key={adsetIdx} className="hover:bg-gray-50">
                            <td className="p-3 border-b border-gray-200">{adset.adset_name || 'Unknown'}</td>
                            <td className="p-3 border-b border-gray-200">{formatCurrency(adset.spend || 0)}</td>
                            <td className="p-3 border-b border-gray-200">{formatPercentage(adset.ctr || 0)}</td>
                            <td className="p-3 border-b border-gray-200">{formatCurrency(adset.cpm || 0)}</td>
                            <td className="p-3 border-b border-gray-200">{formatCurrency(adset.cpc || 0)}</td>
                            <td className="p-3 border-b border-gray-200">{formatNumber(adset.addToCarts || 0)}</td>
                            <td className="p-3 border-b border-gray-200">{formatNumber(adset.purchases || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </section>
            )
          })()}

          {/* Visual Funnel */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Conversion Funnel Visualization</h2>

            <div className="space-y-1 mb-8">
              {/* Stage 1: Clicks */}
              <div className="relative">
                <div className="bg-blue-600 text-white p-4 flex justify-between items-center" style={{ width: '100%' }}>
                  <span className="font-semibold">Link Clicks</span>
                  <span className="text-lg font-bold">{formatNumber(clicks)}</span>
                </div>
              </div>

              {/* Drop-off 1 */}
              <div className="flex items-center justify-between px-4 py-2 bg-red-50 text-sm">
                <span className="text-red-700">
                  ↓ Drop-off: {formatNumber(clicks - addToCarts)} users ({clicks > 0 ? ((clicks - addToCarts) / clicks * 100).toFixed(1) : 0}%)
                </span>
                <span className={`font-semibold ${getStatus(clickToATC, benchmarks.clickToATC).class}`}>
                  Conversion: {clickToATC.toFixed(1)}% {getStatus(clickToATC, benchmarks.clickToATC).text === 'Below target' ? '⚠️' : '✓'}
                </span>
              </div>

              {/* Stage 2: Add to Cart */}
              <div className="relative">
                <div className="bg-blue-500 text-white p-4 flex justify-between items-center" style={{ width: addToCarts > 0 ? `${(addToCarts / clicks) * 100}%` : '0%', minWidth: '40%' }}>
                  <span className="font-semibold">Add to Carts</span>
                  <span className="text-lg font-bold">{formatNumber(addToCarts)}</span>
                </div>
              </div>

              {/* Drop-off 2 */}
              <div className="flex items-center justify-between px-4 py-2 bg-red-50 text-sm">
                <span className="text-red-700">
                  ↓ Drop-off: {formatNumber(addToCarts - checkouts)} users ({addToCarts > 0 ? ((addToCarts - checkouts) / addToCarts * 100).toFixed(1) : 0}%)
                </span>
                <span className={`font-semibold ${getStatus(atcToCheckout, benchmarks.atcToCheckout).class}`}>
                  Conversion: {atcToCheckout.toFixed(1)}% {getStatus(atcToCheckout, benchmarks.atcToCheckout).text === 'Below target' ? '⚠️' : '✓'}
                </span>
              </div>

              {/* Stage 3: Checkout */}
              <div className="relative">
                <div className="bg-blue-400 text-white p-4 flex justify-between items-center" style={{ width: checkouts > 0 ? `${(checkouts / clicks) * 100}%` : '0%', minWidth: '35%' }}>
                  <span className="font-semibold">Checkouts Initiated</span>
                  <span className="text-lg font-bold">{formatNumber(checkouts)}</span>
                </div>
              </div>

              {/* Drop-off 3 */}
              <div className="flex items-center justify-between px-4 py-2 bg-red-50 text-sm">
                <span className="text-red-700">
                  ↓ Drop-off: {formatNumber(checkouts - purchases)} users ({checkouts > 0 ? ((checkouts - purchases) / checkouts * 100).toFixed(1) : 0}%)
                </span>
                <span className={`font-semibold ${getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).class}`}>
                  Conversion: {checkoutToPurchase.toFixed(1)}% {getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).text === 'Below target' ? '⚠️' : '✓'}
                </span>
              </div>

              {/* Stage 4: Purchase */}
              <div className="relative">
                <div className="bg-green-600 text-white p-4 flex justify-between items-center" style={{ width: purchases > 0 ? `${(purchases / clicks) * 100}%` : '0%', minWidth: '30%' }}>
                  <span className="font-semibold">Purchases</span>
                  <span className="text-lg font-bold">{formatNumber(purchases)}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-gray-700">
                <strong>Overall Funnel Efficiency:</strong> {clicks > 0 ? ((purchases / clicks) * 100).toFixed(2) : 0}% of clicks result in purchases
                ({formatNumber(clicks - purchases)} potential customers lost through the funnel)
              </p>
            </div>
          </section>

          {/* Conversion Rates vs Benchmarks */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">
              Conversion Rates vs. E-commerce Benchmarks
            </h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Metric</th>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Current</th>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">E-com Target</th>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 group">
                  <td className="p-3 border-b border-gray-200 font-semibold relative">
                    <span className="flex items-center gap-1">
                      Click → Add to Cart
                      <span className="text-xs text-gray-400 cursor-help print:hidden">ⓘ</span>
                    </span>
                    <div className="absolute left-full ml-2 top-0 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 print:hidden">
                      Percentage of people who click your ad and then add a product to their cart. This measures your product page effectiveness, pricing appeal, and product-market fit.
                      <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200">{clickToATC.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.clickToATC.min}-{benchmarks.clickToATC.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(clickToATC, benchmarks.clickToATC).class}`}>
                    {getStatus(clickToATC, benchmarks.clickToATC).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 group">
                  <td className="p-3 border-b border-gray-200 font-semibold relative">
                    <span className="flex items-center gap-1">
                      ATC → Checkout
                      <span className="text-xs text-gray-400 cursor-help print:hidden">ⓘ</span>
                    </span>
                    <div className="absolute left-full ml-2 top-0 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 print:hidden">
                      Percentage of cart adds that proceed to checkout. Low rates indicate cart abandonment issues like unexpected shipping costs, complex checkout, or trust concerns.
                      <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200">{atcToCheckout.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.atcToCheckout.min}-{benchmarks.atcToCheckout.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(atcToCheckout, benchmarks.atcToCheckout).class}`}>
                    {getStatus(atcToCheckout, benchmarks.atcToCheckout).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 group">
                  <td className="p-3 border-b border-gray-200 font-semibold relative">
                    <span className="flex items-center gap-1">
                      Checkout → Purchase
                      <span className="text-xs text-gray-400 cursor-help print:hidden">ⓘ</span>
                    </span>
                    <div className="absolute left-full ml-2 top-0 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 print:hidden">
                      Percentage of checkouts that complete to purchase. This is your last chance - optimize form fields, payment options, loading times, and reassurance messaging.
                      <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200">{checkoutToPurchase.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.checkoutToPurchase.min}-{benchmarks.checkoutToPurchase.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).class}`}>
                    {getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 group">
                  <td className="p-3 border-b border-gray-200 font-semibold relative">
                    <span className="flex items-center gap-1">
                      Overall ATC → Purchase
                      <span className="text-xs text-gray-400 cursor-help print:hidden">ⓘ</span>
                    </span>
                    <div className="absolute left-full ml-2 top-0 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 print:hidden">
                      Overall checkout funnel health - the percentage of people who add to cart and complete purchase. Below 25% suggests systematic checkout flow issues that need attention.
                      <div className="absolute right-full top-4 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  </td>
                  <td className="p-3 border-b border-gray-200">{overallAtcToPurchase.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.overallAtcToPurchase.min}-{benchmarks.overallAtcToPurchase.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(overallAtcToPurchase, benchmarks.overallAtcToPurchase).class}`}>
                    {getStatus(overallAtcToPurchase, benchmarks.overallAtcToPurchase).text}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* AI Insights */}
          {insights && insights.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Key Insights & Recommendations</h2>
              <div className="space-y-4">
                {insights.map((insight: any, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded border-l-4 border-blue-500">
                    <h3 className="font-semibold mb-2">{insight.title}</h3>
                    <p className="text-gray-700">{insight.description}</p>
                    {insight.recommendation && (
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Recommendation:</span> {insight.recommendation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
