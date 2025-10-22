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

  // Calculate conversion rates
  const clicks = data.summary.clicks || 0
  const addToCarts = data.summary.addToCarts || 0
  const checkouts = data.summary.initiateCheckouts || 0
  const purchases = data.summary.purchases || 0

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
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Total Spend</td>
                  <td className="p-3 border-b border-gray-200">{formatCurrency(data.summary.spend)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Revenue</td>
                  <td className="p-3 border-b border-gray-200">{formatCurrency(data.summary.revenue)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Purchases</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(purchases)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">ROAS</td>
                  <td className="p-3 border-b border-gray-200">{(data.summary.spend > 0 ? (data.summary.revenue / data.summary.spend) : 0).toFixed(2)}x</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">CPA</td>
                  <td className="p-3 border-b border-gray-200">{purchases > 0 ? formatCurrency(data.summary.spend / purchases) : 'N/A'}</td>
                </tr>
              </tbody>
            </table>
            {user?.hasRepeatPurchases && (
              <div className="text-sm italic text-gray-600">
                LTV Projections: {user.repeatPurchaseFrequency || 'N/A'}
              </div>
            )}
          </section>

          {/* Campaign Performance - Only if we have campaign level data */}
          {data.campaigns && data.campaigns.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Campaign Performance Metrics</h2>
              {data.campaigns.map((campaign: any, idx: number) => (
                <div key={idx} className="mb-6">
                  <h3 className="text-base font-semibold mb-3 text-gray-700">Campaign: {campaign.name}</h3>
                  <table className="w-full border-collapse mb-6">
                    <thead>
                      <tr>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Ad Set</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Spend</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">CTR</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">CPM</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Link Click CPC</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">ATCs</th>
                        <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Purchases</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaign.adsets?.map((adset: any, adsetIdx: number) => (
                        <tr key={adsetIdx} className="hover:bg-gray-50">
                          <td className="p-3 border-b border-gray-200">{adset.name}</td>
                          <td className="p-3 border-b border-gray-200">{formatCurrency(adset.spend)}</td>
                          <td className="p-3 border-b border-gray-200">{formatPercentage(adset.ctr)}</td>
                          <td className="p-3 border-b border-gray-200">{formatCurrency(adset.cpm)}</td>
                          <td className="p-3 border-b border-gray-200">{formatCurrency(adset.cpc)}</td>
                          <td className="p-3 border-b border-gray-200">{formatNumber(adset.addToCarts)}</td>
                          <td className="p-3 border-b border-gray-200">{formatNumber(adset.purchases)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </section>
          )}

          {/* Funnel Activity */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-5 pb-2 border-b border-gray-300">Funnel Activity</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Stage</th>
                  <th className="bg-gray-50 p-3 text-left font-semibold border-b-2 border-gray-300">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Link Clicks</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(clicks)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Add to Carts</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(addToCarts)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Checkouts Initiated</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(checkouts)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Purchases</td>
                  <td className="p-3 border-b border-gray-200">{formatNumber(purchases)}</td>
                </tr>
              </tbody>
            </table>
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
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Click → Add to Cart</td>
                  <td className="p-3 border-b border-gray-200">{clickToATC.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.clickToATC.min}-{benchmarks.clickToATC.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(clickToATC, benchmarks.clickToATC).class}`}>
                    {getStatus(clickToATC, benchmarks.clickToATC).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">ATC → Checkout</td>
                  <td className="p-3 border-b border-gray-200">{atcToCheckout.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.atcToCheckout.min}-{benchmarks.atcToCheckout.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(atcToCheckout, benchmarks.atcToCheckout).class}`}>
                    {getStatus(atcToCheckout, benchmarks.atcToCheckout).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Checkout → Purchase</td>
                  <td className="p-3 border-b border-gray-200">{checkoutToPurchase.toFixed(1)}%</td>
                  <td className="p-3 border-b border-gray-200">{benchmarks.checkoutToPurchase.min}-{benchmarks.checkoutToPurchase.max}%</td>
                  <td className={`p-3 border-b border-gray-200 ${getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).class}`}>
                    {getStatus(checkoutToPurchase, benchmarks.checkoutToPurchase).text}
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 border-b border-gray-200 font-semibold">Overall ATC → Purchase</td>
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
