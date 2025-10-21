import { ProductEconomics, ProfitabilityMetrics, FunnelStage } from '@/types'

/**
 * Calculate profitability metrics based on user's product economics
 */
export function calculateProfitabilityMetrics(
  economics: ProductEconomics
): ProfitabilityMetrics {
  const { averageOrderValue, profitMargin, hasRepeatPurchases, repeatPurchaseFrequency } = economics

  const profitPerSale = averageOrderValue * (profitMargin / 100)

  // Calculate LTV multiplier if repeat purchases
  let ltvMultiplier = 1
  if (hasRepeatPurchases && repeatPurchaseFrequency) {
    switch (repeatPurchaseFrequency) {
      case '1-2':
        ltvMultiplier = 1.5
        break
      case '3-4':
        ltvMultiplier = 2.5
        break
      case '5+':
        ltvMultiplier = 3.5
        break
      default:
        ltvMultiplier = 2
    }
  }

  const effectiveProfit = profitPerSale * ltvMultiplier

  return {
    breakEvenCPA: profitPerSale,
    targetCPA: profitPerSale * 0.8, // 20% buffer for true profitability
    minimumROAS: 1 / (profitMargin / 100),
    targetROAS: (1 / (profitMargin / 100)) * 1.2, // 20% buffer
    ltvMultiplier: hasRepeatPurchases ? ltvMultiplier : undefined,
  }
}

/**
 * Compare a value to benchmark range
 */
export function compareToBenchmark(
  value: number,
  benchmarkMin: number,
  benchmarkMax: number
): 'above' | 'within' | 'below' {
  if (value > benchmarkMax) return 'above'
  if (value < benchmarkMin) return 'below'
  return 'within'
}

/**
 * Get status color based on metric type and comparison
 */
export function getStatusColor(
  metricName: string,
  status: 'above' | 'within' | 'below'
): 'green' | 'yellow' | 'red' {
  // For metrics where higher is better (CTR, conversion rates)
  const higherIsBetter = ['ctr', 'click_to_atc', 'atc_to_checkout', 'checkout_to_purchase']

  // For metrics where lower is better (CPC, CPM, CPA)
  const lowerIsBetter = ['cpc', 'cpm', 'cpa']

  if (status === 'within') return 'green'

  if (higherIsBetter.includes(metricName)) {
    return status === 'above' ? 'green' : 'red'
  }

  if (lowerIsBetter.includes(metricName)) {
    return status === 'below' ? 'green' : 'red'
  }

  return 'yellow'
}

/**
 * Identify the weakest funnel stage
 */
export function identifyWeakestFunnelStage(stages: FunnelStage[]): string | null {
  const stagesWithGap = stages
    .filter(stage => stage.benchmark && stage.conversionRate !== undefined)
    .map(stage => {
      const benchmark = stage.benchmark!
      const gap = benchmark.avg - stage.conversionRate!
      const percentageGap = (gap / benchmark.avg) * 100

      return {
        stage: stage.name,
        gap: percentageGap,
        severity: percentageGap > 30 ? 'critical' : percentageGap > 15 ? 'warning' : 'ok'
      }
    })

  // Sort by largest gap
  stagesWithGap.sort((a, b) => b.gap - a.gap)

  return stagesWithGap.length > 0 && stagesWithGap[0].gap > 10 ? stagesWithGap[0].stage : null
}

/**
 * Calculate conversion rate between two funnel stages
 */
export function calculateConversionRate(from: number, to: number): number {
  if (from === 0) return 0
  return (to / from) * 100
}

/**
 * Format currency
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format number with commas
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(value))
}

/**
 * Calculate ROAS
 */
export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0
  return revenue / spend
}

/**
 * Calculate CPA
 */
export function calculateCPA(spend: number, purchases: number): number {
  if (purchases === 0) return 0
  return spend / purchases
}

/**
 * Calculate CTR
 */
export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0
  return (clicks / impressions) * 100
}

/**
 * Calculate CPM
 */
export function calculateCPM(spend: number, impressions: number): number {
  if (impressions === 0) return 0
  return (spend / impressions) * 1000
}

/**
 * Calculate CPC
 */
export function calculateCPC(spend: number, clicks: number): number {
  if (clicks === 0) return 0
  return spend / clicks
}
