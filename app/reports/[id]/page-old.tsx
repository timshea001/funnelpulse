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

  useEffect(() => {
    async function fetchReport() {
      try {
        const response = await fetch(`/api/reports/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch report')
        }
        const data = await response.json()
        setReport(data.report)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
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
  const insights = report.insights

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 print:border-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ACCOUNT PERFORMANCE | {new Date(report.dateRangeStart).toLocaleDateString()} - {new Date(report.dateRangeEnd).toLocaleDateString()}
              </h1>
              <p className="text-sm text-gray-500">{report.adAccount.accountName}</p>
            </div>
            <div className="flex gap-2 print:hidden">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(`/api/reports/${params.id}/pdf`)
                    if (response.ok) {
                      const blob = await response.blob()
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                    } else {
                      alert('Failed to generate PDF')
                    }
                  } catch (error) {
                    console.error('PDF export error:', error)
                    alert('Failed to generate PDF')
                  }
                }}
                className="btn-primary"
              >
                Export PDF
              </button>
              <button onClick={() => router.push('/dashboard')} className="btn-secondary">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Metrics */}
        <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Metrics</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 font-semibold text-gray-900">Metric</th>
                <th className="text-left py-3 font-semibold text-gray-900">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-700">Total Spend</td>
                <td className="py-3 text-gray-900">{formatCurrency(data.summary.spend)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-700">Revenue</td>
                <td className="py-3 text-gray-900">{formatCurrency(data.summary.revenue)}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-700">Purchases</td>
                <td className="py-3 text-gray-900">{data.summary.purchases}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 font-medium text-gray-700">ROAS</td>
                <td className="py-3 text-gray-900">{data.summary.roas.toFixed(2)}x</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-gray-700">CPA</td>
                <td className="py-3 text-gray-900">{formatCurrency(data.summary.cpa)}</td>
              </tr>
            </tbody>
          </table>

          {/* Profitability Status */}
          {data.profitability && (
            <div className={`mt-6 rounded-lg border p-4 ${
              data.profitability.isProfitable
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className={`font-bold mb-2 ${
                data.profitability.isProfitable ? 'text-green-900' : 'text-red-900'
              }`}>
                {data.profitability.isProfitable ? '✓ Profitable' : '⚠️ PROFITABILITY ALERT'}
              </h3>
              <div className={`text-sm ${
                data.profitability.isProfitable ? 'text-green-800' : 'text-red-800'
              }`}>
                <p>Break-even CPA: {formatCurrency(data.profitability.breakEvenCPA)}</p>
                <p>Current CPA: {formatCurrency(data.summary.cpa)}</p>
                <p>Target ROAS: {data.profitability.targetROAS.toFixed(2)}x+</p>
              </div>
            </div>
          )}
        </section>

        {/* Funnel Health Analysis */}
        {data.funnel && (
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Funnel Health Analysis</h2>

            <div className="space-y-4">
              {[
                { label: 'Impressions', value: data.funnel.impressions },
                { label: 'Clicks', value: data.funnel.clicks, rate: data.conversionRates.ctr, rateName: 'CTR' },
                { label: 'Page Views', value: data.funnel.pageViews },
                { label: 'Add to Carts', value: data.funnel.addToCarts, rate: data.conversionRates.clickToAtc, rateName: 'Click→ATC' },
                { label: 'Checkouts', value: data.funnel.checkouts, rate: data.conversionRates.atcToCheckout, rateName: 'ATC→Checkout' },
                { label: 'Purchases', value: data.funnel.purchases, rate: data.conversionRates.checkoutToPurchase, rateName: 'Checkout→Purchase' }
              ].map((stage, index) => (
                <div key={stage.label} className="flex items-center gap-4">
                  <div className="w-48">
                    <div className="text-sm font-medium text-gray-700">{stage.label}</div>
                    <div className="text-xl font-bold text-gray-900">{formatNumber(stage.value)}</div>
                  </div>
                  {stage.rate !== undefined && (
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-600">{stage.rateName}: {formatPercentage(stage.rate)}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* AI Insights */}
            {insights?.primary && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">Key Insight</h3>
                <p className="text-sm text-blue-800">{insights.primary}</p>
                {insights.recommendations && insights.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-blue-900 mb-1">Recommended Actions:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                      {insights.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Campaign Performance */}
        {data.campaigns && data.campaigns.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Campaign Performance</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Campaign</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Spend</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CTR</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CPC</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Purchases</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {data.campaigns.map((campaign: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-900">{campaign.campaign_name || 'Unknown'}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatCurrency(campaign.spend)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatPercentage(campaign.ctr)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatCurrency(campaign.cpc)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{campaign.purchases}</td>
                      <td className="py-3 px-2 text-right text-gray-900">
                        {campaign.cpa ? formatCurrency(campaign.cpa) : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Ad Set Performance */}
        {data.adsets && data.adsets.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Ad Set Performance</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">Ad Set</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Spend</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CTR</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CPM</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">CPC</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">ATCs</th>
                    <th className="text-right py-3 px-2 font-semibold text-gray-900">Purchases</th>
                  </tr>
                </thead>
                <tbody>
                  {data.adsets.map((adset: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-gray-900">{adset.adset_name || 'Unknown'}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatCurrency(adset.spend)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatPercentage(adset.ctr)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatCurrency(adset.cpm)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{formatCurrency(adset.cpc)}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{adset.addToCarts || 0}</td>
                      <td className="py-3 px-2 text-right text-gray-900">{adset.purchases || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
