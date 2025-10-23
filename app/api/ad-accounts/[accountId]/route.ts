import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
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

    // Await params
    const { accountId } = await params

    // Get the ad account
    const account = await db.adAccount.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    })

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    return NextResponse.json({ account })
  } catch (error) {
    console.error('Error fetching account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
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

    // Await params
    const { accountId } = await params

    const body = await request.json()
    const {
      industry,
      businessModel,
      primaryGoal,
      averageOrderValue,
      profitMargin,
      hasRepeatPurchases,
      repeatPurchaseFrequency,
      targetCPA,
      targetROAS
    } = body

    // Calculate break-even CPA and minimum ROAS based on inputs
    const aov = parseFloat(averageOrderValue) || 0
    const margin = parseFloat(profitMargin) || 0
    const breakEvenCPA = aov * (margin / 100)
    const minimumROAS = aov > 0 && breakEvenCPA > 0 ? aov / breakEvenCPA : 1

    // Update the account
    const account = await db.adAccount.update({
      where: {
        id: accountId,
        userId: user.id
      },
      data: {
        industry,
        businessModel,
        primaryGoal,
        averageOrderValue: aov,
        profitMargin: margin,
        hasRepeatPurchases,
        repeatPurchaseFrequency,
        breakEvenCPA,
        targetCPA: parseFloat(targetCPA) || null,
        minimumROAS,
        targetROAS: parseFloat(targetROAS) || null,
        ltvMultiplier: hasRepeatPurchases
          ? (repeatPurchaseFrequency === '5+' ? 3 : repeatPurchaseFrequency === '3-4' ? 2 : 1.5)
          : 1
      }
    })

    return NextResponse.json({ account })
  } catch (error) {
    console.error('Error updating account:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
