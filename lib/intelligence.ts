import OpenAI from 'openai'
import { ReportMetrics, Funnel, ProfitabilityMetrics, Insight } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

interface AnalysisContext {
  industry: string
  averageOrderValue: number
  profitMargin: number
  dateRange: string
  metrics: ReportMetrics
  funnel: Funnel
  profitability: ProfitabilityMetrics
  weakestStage?: string
}

/**
 * Generate contextual insights using OpenAI
 */
export async function generateInsights(context: AnalysisContext): Promise<Insight[]> {
  // If no API key, return rule-based insights only
  if (!process.env.OPENAI_API_KEY) {
    return generateRuleBasedInsights(context)
  }

  try {
    const prompt = buildAnalysisPrompt(context)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert paid media analyst specializing in e-commerce advertising. Your job is to analyze performance data and provide specific, actionable insights. Be concise and focus on what matters most. Always prioritize funnel breakpoints over surface-level metrics. Return your analysis in JSON format with the following structure: {"primaryInsight": {"title": "string", "message": "string", "recommendations": ["string"]}, "secondaryInsights": [{"title": "string", "message": "string"}]}',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0].message.content
    if (!response) {
      return generateRuleBasedInsights(context)
    }

    const parsed = JSON.parse(response)

    const insights: Insight[] = [
      {
        type: 'primary',
        title: parsed.primaryInsight.title,
        message: parsed.primaryInsight.message,
        recommendations: parsed.primaryInsight.recommendations,
      },
    ]

    if (parsed.secondaryInsights && Array.isArray(parsed.secondaryInsights)) {
      parsed.secondaryInsights.forEach((insight: any) => {
        insights.push({
          type: 'secondary',
          title: insight.title,
          message: insight.message,
        })
      })
    }

    return insights
  } catch (error) {
    console.error('Error generating AI insights:', error)
    return generateRuleBasedInsights(context)
  }
}

/**
 * Build the analysis prompt for OpenAI
 */
function buildAnalysisPrompt(context: AnalysisContext): string {
  const { industry, averageOrderValue, profitMargin, dateRange, metrics, funnel, profitability, weakestStage } = context

  return `
Analyze this paid advertising data for a ${industry} business:

BUSINESS CONTEXT:
- Industry: ${industry}
- AOV: $${averageOrderValue}
- Profit Margin: ${profitMargin}%
- Break-even CPA: $${profitability.breakEvenCPA.toFixed(2)}
- Target ROAS: ${profitability.targetROAS.toFixed(2)}x

PERFORMANCE DATA (${dateRange}):
- Spend: $${metrics.spend.toFixed(2)}
- Revenue: $${metrics.revenue.toFixed(2)}
- ROAS: ${metrics.roas.toFixed(2)}x
- CPA: $${metrics.cpa.toFixed(2)}
- Purchases: ${metrics.purchases}
- CTR: ${metrics.ctr.toFixed(2)}%

FUNNEL:
- Impressions: ${funnel.impressions}
- Clicks: ${funnel.clicks} (CTR: ${((funnel.clicks / funnel.impressions) * 100).toFixed(2)}%)
- Page Views: ${funnel.pageViews}
- Add to Carts: ${funnel.addToCarts} (Click→ATC: ${((funnel.addToCarts / funnel.clicks) * 100).toFixed(2)}%)
- Checkouts: ${funnel.checkouts} (ATC→Checkout: ${((funnel.checkouts / funnel.addToCarts) * 100).toFixed(2)}%)
- Purchases: ${funnel.purchases} (Checkout→Purchase: ${((funnel.purchases / funnel.checkouts) * 100).toFixed(2)}%)

${weakestStage ? `WEAKEST STAGE IDENTIFIED: ${weakestStage}` : ''}

Provide:
1. Primary insight focusing on the most critical issue or opportunity
2. 2-3 specific, actionable recommendations
3. 1-2 secondary insights about other notable patterns

Be concise. Focus on the funnel breakpoint. Don't just describe the data - explain what to DO about it.
`.trim()
}

/**
 * Generate rule-based insights (fallback when no AI)
 */
function generateRuleBasedInsights(context: AnalysisContext): Insight[] {
  const insights: Insight[] = []
  const { metrics, profitability, funnel, weakestStage } = context

  // Primary insight based on profitability
  if (metrics.cpa > profitability.breakEvenCPA) {
    const lossPerCustomer = metrics.cpa - profitability.breakEvenCPA

    insights.push({
      type: 'primary',
      title: 'Profitability Alert',
      message: `Your current CPA ($${metrics.cpa.toFixed(
        2
      )}) is above your break-even target ($${profitability.breakEvenCPA.toFixed(
        2
      )}), resulting in a loss of ~$${lossPerCustomer.toFixed(2)} per customer.${
        weakestStage
          ? ` The data shows the primary issue is in the ${weakestStage} stage of your funnel.`
          : ''
      }`,
      recommendations: [
        'Review and optimize your checkout process for friction points',
        'Test trust signals and security badges',
        'Analyze abandoned cart data in your e-commerce platform',
      ],
    })
  } else {
    insights.push({
      type: 'primary',
      title: 'Profitable Performance',
      message: `Your CPA ($${metrics.cpa.toFixed(
        2
      )}) is within your profitable range (target: $${profitability.targetCPA.toFixed(
        2
      )}). Focus on scaling what's working.`,
      recommendations: [
        'Increase budget on top-performing ad sets',
        'Expand successful audiences with lookalikes',
        'Test new creatives similar to winners',
      ],
    })
  }

  // Funnel-specific insights
  const clickToAtcRate = (funnel.addToCarts / funnel.clicks) * 100
  const checkoutToPurchaseRate = (funnel.purchases / funnel.checkouts) * 100

  if (clickToAtcRate < 8) {
    insights.push({
      type: 'warning',
      title: 'Low Add-to-Cart Rate',
      message: `Only ${clickToAtcRate.toFixed(
        2
      )}% of clicks are adding to cart (benchmark: 8-12%). This suggests a disconnect between your ads and landing page.`,
    })
  }

  if (checkoutToPurchaseRate < 60) {
    insights.push({
      type: 'warning',
      title: 'Checkout Drop-off',
      message: `${checkoutToPurchaseRate.toFixed(
        2
      )}% checkout completion rate is below the 60-75% benchmark. Review your checkout flow for potential friction.`,
    })
  }

  // CTR insight
  if (metrics.ctr > 2.5) {
    insights.push({
      type: 'opportunity',
      title: 'Strong Creative Performance',
      message: `Your ${metrics.ctr.toFixed(
        2
      )}% CTR is well above industry average, indicating excellent creative resonance with your target audience.`,
    })
  }

  return insights
}

/**
 * Generate recommendations based on funnel stage
 */
export function getStageRecommendations(stageName: string): string[] {
  const recommendations: { [key: string]: string[] } = {
    'Impressions → Clicks': [
      'Test new creative formats and messaging',
      'Refine audience targeting to reach high-intent users',
      'Review ad placements and optimize for better positions',
    ],
    'Clicks → Page Views': [
      'Improve landing page load time',
      'Ensure ad-to-page continuity (message match)',
      'Fix any technical issues preventing page loads',
    ],
    'Page Views → Add to Cart': [
      'Optimize product page layout and imagery',
      'Add customer reviews and social proof',
      'Test different pricing presentations or offers',
      'Improve product descriptions and benefits',
    ],
    'Add to Cart → Checkout': [
      'Simplify cart experience',
      'Test different shipping cost presentations',
      'Add urgency elements (limited stock, timer)',
      'Reduce form fields in cart',
    ],
    'Checkout → Purchase': [
      'Review payment options and add alternatives',
      'Add trust signals (security badges, guarantees)',
      'Test free shipping thresholds',
      'Optimize mobile checkout experience',
      'Check for technical errors in checkout',
    ],
  }

  return recommendations[stageName] || ['Analyze this stage for optimization opportunities']
}
