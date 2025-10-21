import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's connected ad accounts from database
    const adAccounts = await db.adAccount.findMany({
      where: {
        userId,
        isActive: true
      },
      select: {
        id: true,
        platform: true,
        accountId: true,
        accountName: true,
        connectedAt: true,
        lastSyncedAt: true
      },
      orderBy: {
        connectedAt: 'desc'
      }
    })

    return NextResponse.json({ accounts: adAccounts })
  } catch (error) {
    console.error('Error fetching ad accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch ad accounts' }, { status: 500 })
  }
}
