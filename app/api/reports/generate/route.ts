import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/encryption'
import { MetaAPI } from '@/lib/meta-api'
import { generateInsights } from '@/lib/intelligence'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { adAccountId, dateRangeStart, dateRangeEnd } = body

    if (!adAccountId || !dateRangeStart || !dateRangeEnd) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get user data for profitability calculations
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get the ad account
    const adAccount = await db.adAccount.findFirst({
      where: {
        id: adAccountId,
        userId: user.id,
        isActive: true
      }
    })

    if (!adAccount) {
      return NextResponse.json({ error: 'Ad account not found' }, { status: 404 })
    }

    if (!adAccount.accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 404 })
    }

    // Decrypt access token
    const accessToken = await decrypt(adAccount.accessToken)
    const metaAPI = new MetaAPI(accessToken)

    // Fetch insights from Meta API
    const [accountInsights, campaignInsights, adsetInsights] = await Promise.all([
      metaAPI.getInsights(adAccount.accountId, dateRangeStart, dateRangeEnd, 'account'),
      metaAPI.getInsights(adAccount.accountId, dateRangeStart, dateRangeEnd, 'campaign'),
      metaAPI.getInsights(adAccount.accountId, dateRangeStart, dateRangeEnd, 'adset')
    ])

    // Calculate conversion rates and metrics
    const funnelData = {
      impressions: accountInsights.summary.impressions,
      clicks: accountInsights.summary.clicks,
      pageViews: accountInsights.summary.viewContent || accountInsights.summary.clicks, // Fallback to clicks if no view_content
      addToCarts: accountInsights.summary.addToCarts,
      checkouts: accountInsights.summary.initiateCheckouts,
      purchases: accountInsights.summary.purchases,
      stages: [
        {
          name: 'Impressions → Clicks',
          count: accountInsights.summary.clicks,
          conversionRate: (accountInsights.summary.clicks / accountInsights.summary.impressions) * 100
        },
        {
          name: 'Clicks → Page Views',
          count: accountInsights.summary.viewContent || accountInsights.summary.clicks,
          conversionRate: accountInsights.summary.clicks > 0 ? ((accountInsights.summary.viewContent || accountInsights.summary.clicks) / accountInsights.summary.clicks) * 100 : 0
        },
        {
          name: 'Page Views → Add to Cart',
          count: accountInsights.summary.addToCarts,
          conversionRate: (accountInsights.summary.viewContent || accountInsights.summary.clicks) > 0 ? (accountInsights.summary.addToCarts / (accountInsights.summary.viewContent || accountInsights.summary.clicks)) * 100 : 0
        },
        {
          name: 'Add to Cart → Checkout',
          count: accountInsights.summary.initiateCheckouts,
          conversionRate: accountInsights.summary.addToCarts > 0 ? (accountInsights.summary.initiateCheckouts / accountInsights.summary.addToCarts) * 100 : 0
        },
        {
          name: 'Checkout → Purchase',
          count: accountInsights.summary.purchases,
          conversionRate: accountInsights.summary.initiateCheckouts > 0 ? (accountInsights.summary.purchases / accountInsights.summary.initiateCheckouts) * 100 : 0
        }
      ]
    }

    // Calculate conversion rates
    const conversionRates = {
      clickToView: funnelData.clicks > 0 ? (funnelData.pageViews / funnelData.clicks) * 100 : 0,
      viewToATC: funnelData.pageViews > 0 ? (funnelData.addToCarts / funnelData.pageViews) * 100 : 0,
      atcToCheckout: funnelData.addToCarts > 0 ? (funnelData.checkouts / funnelData.addToCarts) * 100 : 0,
      checkoutToPurchase: funnelData.checkouts > 0 ? (funnelData.purchases / funnelData.checkouts) * 100 : 0,
      overall: funnelData.clicks > 0 ? (funnelData.purchases / funnelData.clicks) * 100 : 0
    }

    const roas = accountInsights.summary.spend > 0 ? accountInsights.summary.revenue / accountInsights.summary.spend : 0
    const cpa = accountInsights.summary.purchases > 0 ? accountInsights.summary.spend / accountInsights.summary.purchases : 0

    // Get benchmarks for user's industry
    const benchmarks = await db.benchmark.findMany({
      where: {
        industry: user.industry || 'ecommerce_general'
      }
    })

    // Prepare data for AI insights
    const reportData = {
      summary: {
        impressions: accountInsights.summary.impressions,
        clicks: accountInsights.summary.clicks,
        spend: accountInsights.summary.spend,
        revenue: accountInsights.summary.revenue,
        purchases: accountInsights.summary.purchases,
        ctr: accountInsights.summary.impressions > 0 ? (accountInsights.summary.clicks / accountInsights.summary.impressions) * 100 : 0,
        cpm: accountInsights.summary.impressions > 0 ? (accountInsights.summary.spend / accountInsights.summary.impressions) * 1000 : 0,
        cpc: accountInsights.summary.clicks > 0 ? accountInsights.summary.spend / accountInsights.summary.clicks : 0,
        roas,
        cpa
      },
      funnel: funnelData,
      conversionRates,
      profitability: {
        breakEvenCPA: user.breakEvenCPA?.toNumber() || 0,
        targetROAS: user.targetROAS?.toNumber() || 0,
        isProfitable: cpa ? cpa < (user.breakEvenCPA?.toNumber() || 0) : false
      },
      campaigns: campaignInsights.data,
      adsets: adsetInsights.data
    }

    // Generate AI insights
    const insights = await generateInsights({
      industry: user.industry || 'general',
      averageOrderValue: user.averageOrderValue?.toNumber() || 0,
      profitMargin: user.profitMargin?.toNumber() || 0,
      dateRange: `${dateRangeStart} to ${dateRangeEnd}`,
      metrics: reportData.summary,
      funnel: funnelData,
      profitability: reportData.profitability
    })

    // Store report in database
    const report = await db.report.create({
      data: {
        userId: user.id,
        adAccountId: adAccount.id,
        reportType: 'account_overview',
        dateRangeStart: new Date(dateRangeStart),
        dateRangeEnd: new Date(dateRangeEnd),
        dataSnapshot: reportData as any,
        calculatedMetrics: {
          conversionRates,
          roas,
          cpa
        } as any,
        insights: insights as any,
        generationTimeMs: Date.now() - Date.now() // Will be updated with actual time
      }
    })

    // Update last synced timestamp
    await db.adAccount.update({
      where: { id: adAccount.id },
      data: { lastSyncedAt: new Date() }
    })

    return NextResponse.json({
      reportId: report.id,
      data: reportData,
      insights
    })
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate report' },
      { status: 500 }
    )
  }
}
