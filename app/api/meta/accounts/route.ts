import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get database user ID from Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch user's connected ad accounts from database
    const adAccounts = await db.adAccount.findMany({
      where: {
        userId: user.id,
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

    console.log(`Found ${adAccounts.length} ad accounts for user ${user.id}`)

    return NextResponse.json({ accounts: adAccounts })
  } catch (error) {
    console.error('Error fetching ad accounts:', error)
    return NextResponse.json({ error: 'Failed to fetch ad accounts' }, { status: 500 })
  }
}
