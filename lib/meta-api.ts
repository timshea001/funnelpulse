import { MetaInsights, AdAccount, CampaignData } from '@/types'

export class MetaAPI {
  private accessToken: string
  private baseUrl = 'https://graph.facebook.com/v21.0' // Updated to latest stable version

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async getAdAccounts(): Promise<AdAccount[]> {
    try {
      console.log('Fetching accounts from /me/adaccounts')
      const response = await fetch(
        `${this.baseUrl}/me/adaccounts?fields=id,name,account_status,currency,timezone_name,business&access_token=${this.accessToken}`
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 401 || response.status === 400) {
          if (errorData?.error?.code === 190) {
            throw new Error('Access token expired or invalid. Please reconnect your Meta account.')
          }
          if (errorData?.error?.code === 102) {
            throw new Error('Session key invalid. Please reconnect your Meta account.')
          }
          throw new Error('Authentication failed. Please reconnect your Meta account.')
        }

        if (response.status === 403) {
          throw new Error('Permission denied. Please check your Meta app permissions.')
        }

        throw new Error(`Meta API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      if (data.error) {
        if (data.error.code === 190 || data.error.code === 102) {
          throw new Error('Access token expired or invalid. Please reconnect your Meta account.')
        }
        throw new Error(data.error.message || 'Unknown API error')
      }

      let accounts = data.data || []
      console.log(`Found ${accounts.length} accounts from /me/adaccounts`)

      // Also try to get accounts through businesses
      try {
        console.log('Fetching accounts through businesses...')
        const businessResponse = await fetch(
          `${this.baseUrl}/me/businesses?fields=id,name&access_token=${this.accessToken}`
        )

        if (businessResponse.ok) {
          const businessData = await businessResponse.json()
          const businesses = businessData.data || []
          console.log(`Found ${businesses.length} businesses`)

          for (const business of businesses) {
            try {
              const endpoints = [
                { name: 'owned', endpoint: 'owned_ad_accounts' },
                { name: 'client', endpoint: 'client_ad_accounts' }
              ]

              for (const { name, endpoint } of endpoints) {
                const businessAccountsResponse = await fetch(
                  `${this.baseUrl}/${business.id}/${endpoint}?fields=id,name,account_status,currency,timezone_name,business&access_token=${this.accessToken}`
                )

                if (businessAccountsResponse.ok) {
                  const businessAccountsData = await businessAccountsResponse.json()
                  const businessAccounts = businessAccountsData.data || []
                  console.log(`Found ${businessAccounts.length} ${name} accounts in business ${business.name}`)

                  for (const account of businessAccounts) {
                    if (!accounts.find(existingAccount => existingAccount.id === account.id)) {
                      accounts.push(account)
                      console.log(`Added new ${name} account from business: ${account.name} (${account.id})`)
                    }
                  }
                }
              }
            } catch (error) {
              console.log(`Error fetching accounts for business ${business.name}:`, error)
            }
          }
        }
      } catch (error) {
        console.log('Error fetching business accounts:', error)
      }

      console.log(`Total accounts found: ${accounts.length}`)
      return accounts
    } catch (error) {
      console.error('Error fetching ad accounts:', error)
      throw error
    }
  }

  async getInsights(
    accountId: string,
    startDate: string,
    endDate: string,
    level: 'account' | 'campaign' | 'adset' | 'ad' = 'account'
  ): Promise<MetaInsight> {
    try {
      const accountIdFormatted = accountId.startsWith('act_') ? accountId : `act_${accountId}`

      // Base fields for all levels
      const baseFields = [
        'spend',
        'impressions',
        'inline_link_clicks',
        'inline_link_click_ctr',
        'cpc',
        'cpm',
        'actions',
        'action_values',
        'purchase_roas'
      ]

      // Add level-specific fields
      let fields = [...baseFields]
      if (level === 'campaign') {
        fields.unshift('campaign_id', 'campaign_name')
      } else if (level === 'adset') {
        fields.unshift('campaign_id', 'campaign_name', 'adset_id', 'adset_name')
      } else if (level === 'ad') {
        fields.unshift('campaign_id', 'campaign_name', 'adset_id', 'adset_name', 'ad_id', 'ad_name')
      }

      const params = new URLSearchParams({
        access_token: this.accessToken,
        level,
        fields: fields.join(','),
        time_range: JSON.stringify({
          since: startDate,
          until: endDate
        }),
        action_attribution_windows: '7d_click,1d_view',
        action_breakdowns: 'action_type'
      })

      const response = await fetch(
        `${this.baseUrl}/${accountIdFormatted}/insights?${params}`
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Meta API error: ${response.status} - ${errorData?.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      return this.processInsightsData(data.data || [])
    } catch (error) {
      console.error('Error fetching insights:', error)
      throw error
    }
  }

  private processInsightsData(data: any[]): MetaInsight {
    const processed = data.map(row => {
      // Extract actions and action values
      let purchases = 0
      let revenue = 0
      let addToCarts = 0
      let initiateCheckouts = 0
      let viewContent = 0

      if (row.actions) {
        const actionsDict = row.actions.reduce((acc: any, action: any) => {
          acc[action.action_type] = parseInt(action.value || '0')
          return acc
        }, {})

        // Purchases
        purchases += actionsDict['purchase'] || 0
        purchases += actionsDict['onsite_conversion.purchase'] || 0

        // Add to carts
        addToCarts += actionsDict['add_to_cart'] || 0
        addToCarts += actionsDict['onsite_conversion.add_to_cart'] || 0

        // Checkouts
        initiateCheckouts += actionsDict['initiate_checkout'] || 0
        initiateCheckouts += actionsDict['onsite_conversion.initiate_checkout'] || 0

        // View content (landing page views)
        viewContent += actionsDict['view_content'] || 0
        viewContent += actionsDict['onsite_conversion.view_content'] || 0
        viewContent += actionsDict['landing_page_view'] || 0
      }

      if (row.action_values) {
        const actionValuesDict = row.action_values.reduce((acc: any, actionValue: any) => {
          acc[actionValue.action_type] = parseFloat(actionValue.value || '0')
          return acc
        }, {})

        revenue += actionValuesDict['purchase'] || 0
        revenue += actionValuesDict['onsite_conversion.purchase'] || 0
      }

      const spend = parseFloat(row.spend || '0')
      const impressions = parseInt(row.impressions || '0')
      const clicks = parseInt(row.inline_link_clicks || '0')
      const ctr = parseFloat(row.inline_link_click_ctr || '0')
      const cpc = parseFloat(row.cpc || '0')
      const cpm = parseFloat(row.cpm || '0')

      return {
        campaign_id: row.campaign_id,
        campaign_name: row.campaign_name,
        adset_id: row.adset_id,
        adset_name: row.adset_name,
        ad_id: row.ad_id,
        ad_name: row.ad_name,
        spend,
        impressions,
        clicks,
        ctr,
        cpc,
        cpm,
        purchases,
        revenue,
        addToCarts,
        initiateCheckouts,
        viewContent,
        date_start: row.date_start || '',
        date_stop: row.date_stop || ''
      }
    })

    // Calculate aggregated metrics
    const totals = processed.reduce((acc, row) => ({
      spend: acc.spend + row.spend,
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      purchases: acc.purchases + row.purchases,
      revenue: acc.revenue + row.revenue,
      addToCarts: acc.addToCarts + row.addToCarts,
      initiateCheckouts: acc.initiateCheckouts + row.initiateCheckouts,
      viewContent: acc.viewContent + row.viewContent
    }), {
      spend: 0,
      impressions: 0,
      clicks: 0,
      purchases: 0,
      revenue: 0,
      addToCarts: 0,
      initiateCheckouts: 0,
      viewContent: 0
    })

    return {
      summary: totals,
      data: processed
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
    try {
      // Meta long-lived tokens don't typically need refreshing (60 days)
      // But this endpoint can exchange short-lived for long-lived tokens
      const response = await fetch(
        `${this.baseUrl}/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${process.env.FACEBOOK_CLIENT_ID}&` +
        `client_secret=${process.env.FACEBOOK_CLIENT_SECRET}&` +
        `fb_exchange_token=${refreshToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to refresh access token')
      }

      const data = await response.json()

      return {
        accessToken: data.access_token,
        expiresAt: Date.now() + (data.expires_in * 1000) // Convert to timestamp
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      throw error
    }
  }
}

// Helper function to create MetaAPI instance from database token
export async function createMetaAPI(accessToken: string): Promise<MetaAPI> {
  return new MetaAPI(accessToken)
}
