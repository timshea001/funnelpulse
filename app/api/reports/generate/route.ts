import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/encryption'
import { MetaAPI } from '@/lib/meta-api'
import { generateInsights } from '@/lib/intelligence'
import { calculateConversionRates, calculateROAS, calculateCPA } from '@/lib/calculations'

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
      purchases: accountInsights.summary.purchases
    }

    const conversionRates = calculateConversionRates(
      funnelData.clicks,
      funnelData.pageViews,
      funnelData.addToCarts,
      funnelData.checkouts,
      funnelData.purchases
    )

    const roas = calculateROAS(accountInsights.summary.revenue, accountInsights.summary.spend)
    const cpa = calculateCPA(accountInsights.summary.spend, accountInsights.summary.purchases)

    // Get benchmarks for user's industry
    const benchmarks = await db.benchmark.findMany({
      where: {
        industry: user.industry || 'ecommerce_general'
      }
    })

    // Prepare data for AI insights
    const reportData = {
      summary: {
        spend: accountInsights.summary.spend,
        revenue: accountInsights.summary.revenue,
        purchases: accountInsights.summary.purchases,
        roas,
        cpa
      },
      funnel: funnelData,
      conversionRates,
      profitability: {
        breakEvenCPA: user.breakEvenCpa?.toNumber() || 0,
        targetROAS: user.targetRoas?.toNumber() || 0,
        isProfitable: cpa ? cpa < (user.breakEvenCpa?.toNumber() || 0) : false
      },
      campaigns: campaignInsights.data,
      adsets: adsetInsights.data
    }

    // Generate AI insights
    const insights = await generateInsights({
      industry: user.industry || 'general',
      businessModel: user.businessModel || 'B2C',
      aov: user.averageOrderValue?.toNumber() || 0,
      margin: user.profitMargin?.toNumber() || 0,
      breakEvenCPA: user.breakEvenCpa?.toNumber() || 0,
      targetROAS: user.targetRoas?.toNumber() || 0,
      dateRange: `${dateRangeStart} to ${dateRangeEnd}`,
      metrics: reportData.summary,
      funnelStages: [
        { name: 'Impressions → Clicks', count: funnelData.clicks, conversionRate: (funnelData.clicks / funnelData.impressions) * 100 },
        { name: 'Clicks → Page Views', count: funnelData.pageViews, conversionRate: (funnelData.pageViews / funnelData.clicks) * 100 },
        { name: 'Page Views → Add to Cart', count: funnelData.addToCarts, conversionRate: (funnelData.addToCarts / funnelData.pageViews) * 100 },
        { name: 'Add to Cart → Checkout', count: funnelData.checkouts, conversionRate: (funnelData.checkouts / funnelData.addToCarts) * 100 },
        { name: 'Checkout → Purchase', count: funnelData.purchases, conversionRate: (funnelData.purchases / funnelData.checkouts) * 100 }
      ]
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
