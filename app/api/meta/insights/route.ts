import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { decrypt } from '@/lib/encryption'
import { MetaAPI } from '@/lib/meta-api'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { accountId, startDate, endDate, level = 'account' } = body

    if (!accountId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId, startDate, endDate' },
        { status: 400 }
      )
    }

    // Get the ad account from database
    const adAccount = await db.adAccount.findFirst({
      where: {
        id: accountId,
        userId,
        isActive: true
      }
    })

    if (!adAccount) {
      return NextResponse.json({ error: 'Ad account not found' }, { status: 404 })
    }

    if (!adAccount.accessToken) {
      return NextResponse.json({ error: 'Access token not found' }, { status: 404 })
    }

    // Decrypt the access token
    const accessToken = await decrypt(adAccount.accessToken)

    // Fetch insights from Meta API
    const metaAPI = new MetaAPI(accessToken)
    const insights = await metaAPI.getInsights(
      adAccount.accountId,
      startDate,
      endDate,
      level
    )

    // Update last synced timestamp
    await db.adAccount.update({
      where: { id: adAccount.id },
      data: { lastSyncedAt: new Date() }
    })

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching Meta insights:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch insights' },
      { status: 500 }
    )
  }
}
