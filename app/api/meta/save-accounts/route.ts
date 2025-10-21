import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth()

    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { accountIds } = body

    if (!accountIds || !Array.isArray(accountIds) || accountIds.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one account' },
        { status: 400 }
      )
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
      await db.pendingOAuthSession.delete({
        where: { id: pendingSession.id }
      })
      return NextResponse.json(
        { error: 'OAuth session expired. Please reconnect your Meta account.' },
        { status: 410 }
      )
    }

    // Get available accounts from session
    const availableAccounts = pendingSession.availableAccounts as Array<{
      id: string
      name: string
      currency: string
      account_status: number
    }>

    // Filter selected accounts
    const selectedAccounts = availableAccounts.filter(account =>
      accountIds.includes(account.id)
    )

    if (selectedAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No valid accounts selected' },
        { status: 400 }
      )
    }

    // Save selected ad accounts to database
    console.log(`Saving ${selectedAccounts.length} ad accounts for user ${user.id}`)

    for (const account of selectedAccounts) {
      console.log(`Upserting account: ${account.id} - ${account.name}`)
      await db.adAccount.upsert({
        where: {
          userId_platform_accountId: {
            userId: user.id,
            platform: 'meta',
            accountId: account.id
          }
        },
        create: {
          userId: user.id,
          platform: 'meta',
          accountId: account.id,
          accountName: account.name,
          accessToken: pendingSession.accessToken,
          refreshToken: pendingSession.accessToken, // Meta uses same token
          tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          connectedAt: new Date(),
          lastSyncedAt: new Date(),
          isActive: true
        },
        update: {
          accountName: account.name,
          accessToken: pendingSession.accessToken,
          tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          lastSyncedAt: new Date(),
          isActive: true
        }
      })
    }

    console.log('All accounts saved successfully')

    // Delete the pending session
    await db.pendingOAuthSession.delete({
      where: { id: pendingSession.id }
    })

    console.log('Pending session deleted')

    return NextResponse.json({
      success: true,
      accountsConnected: selectedAccounts.length
    })
  } catch (error) {
    console.error('Error saving accounts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
