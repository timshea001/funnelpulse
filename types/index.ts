// Onboarding types
export interface BusinessContext {
  industry: string
  businessModel: 'B2C' | 'B2B' | 'D2C'
  primaryGoal: 'purchases' | 'leads' | 'app_installs' | 'brand_awareness'
}

export interface ProductEconomics {
  averageOrderValue: number
  profitMargin: number
  hasRepeatPurchases: boolean
  repeatPurchaseFrequency?: string
}

export interface ProfitabilityMetrics {
  breakEvenCPA: number
  targetCPA: number
  minimumROAS: number
  targetROAS: number
  ltvMultiplier?: number
}

// Meta Ads types
export interface MetaInsights {
  impressions: number
  reach: number
  clicks: number
  ctr: number
  cpm: number
  cpc: number
  spend: number
  purchases?: number
  revenue?: number
  link_clicks?: number
  view_content?: number
  add_to_cart?: number
  initiate_checkout?: number
}

export interface FunnelStage {
  name: string
  count: number
  conversionRate?: number
  status?: 'above' | 'within' | 'below'
  benchmark?: {
    min: number
    max: number
    avg: number
  }
}

export interface Funnel {
  impressions: number
  clicks: number
  pageViews: number
  addToCarts: number
  checkouts: number
  purchases: number
  stages: FunnelStage[]
  weakestStage?: string
}

// Report types
export interface ReportMetrics {
  spend: number
  revenue: number
  purchases: number
  roas: number
  cpa: number
  impressions: number
  clicks: number
  ctr: number
  cpm: number
  cpc: number
}

export interface AdSetPerformance {
  id: string
  name: string
  spend: number
  ctr: number
  cpm: number
  cpc: number
  atcs: number
  purchases: number
}

export interface CreativePerformance {
  id: string
  creativeName: string
  audienceName: string
  spend: number
  ctr: number
  cpm: number
  cpc: number
  atcs: number
  purchases: number
  tier?: 'top' | 'middle' | 'bottom'
}

export interface Insight {
  type: 'primary' | 'secondary' | 'warning' | 'opportunity'
  title: string
  message: string
  recommendations?: string[]
}

export interface DateRange {
  start: Date
  end: Date
  label: string
}
