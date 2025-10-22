import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      include: {
        adAccounts: {
          select: {
            id: true,
            accountId: true,
            accountName: true,
            platform: true,
            isActive: true,
            connectedAt: true,
            lastSyncedAt: true,
            accessToken: true // Will show if encrypted token exists
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        error: 'User not found',
        clerkId: clerkUserId
      }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        clerkId: user.clerkId,
        industry: user.industry
      },
      adAccounts: user.adAccounts.map(acc => ({
        ...acc,
        hasAccessToken: !!acc.accessToken,
        accessToken: acc.accessToken ? 'EXISTS (encrypted)' : 'MISSING'
      }))
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
