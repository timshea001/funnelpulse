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
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get pending OAuth session
    const pendingSession = await db.pendingOAuthSession.findUnique({
      where: { userId: user.id }
    })

    if (!pendingSession) {
      return NextResponse.json(
        { error: 'No pending OAuth session found. Please reconnect your Meta account.' },
        { status: 404 }
      )
    }

    // Check if session has expired
    if (new Date() > pendingSession.expiresAt) {
      // Delete expired session
      await db.pendingOAuthSession.delete({
        where: { id: pendingSession.id }
      })
      return NextResponse.json(
        { error: 'OAuth session expired. Please reconnect your Meta account.' },
        { status: 410 }
      )
    }

    return NextResponse.json({
      accounts: pendingSession.availableAccounts
    })
  } catch (error) {
    console.error('Error fetching pending accounts:', error)
    console.error('Error details:', error instanceof Error ? error.stack : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
