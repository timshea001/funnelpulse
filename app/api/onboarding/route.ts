import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { calculateProfitabilityMetrics } from '@/lib/calculations'

export async function POST(request: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      industry,
      businessModel,
      primaryGoal,
      averageOrderValue,
      profitMargin,
      hasRepeatPurchases,
      repeatPurchaseFrequency,
    } = body

    // Calculate profitability metrics
    const metrics = calculateProfitabilityMetrics({
      averageOrderValue,
      profitMargin,
      hasRepeatPurchases,
      repeatPurchaseFrequency,
    })

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || null,
        industry,
        businessModel,
        primaryGoal,
        averageOrderValue,
        profitMargin,
        hasRepeatPurchases,
        repeatPurchaseFrequency: hasRepeatPurchases ? repeatPurchaseFrequency : null,
        breakEvenCPA: metrics.breakEvenCPA,
        targetCPA: metrics.targetCPA,
        minimumROAS: metrics.minimumROAS,
        targetROAS: metrics.targetROAS,
        ltvMultiplier: metrics.ltvMultiplier,
        updatedAt: new Date(),
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        name: user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || null,
        industry,
        businessModel,
        primaryGoal,
        averageOrderValue,
        profitMargin,
        hasRepeatPurchases,
        repeatPurchaseFrequency: hasRepeatPurchases ? repeatPurchaseFrequency : null,
        breakEvenCPA: metrics.breakEvenCPA,
        targetCPA: metrics.targetCPA,
        minimumROAS: metrics.minimumROAS,
        targetROAS: metrics.targetROAS,
        ltvMultiplier: metrics.ltvMultiplier,
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    })

    return NextResponse.json({ success: true, user: dbUser })
  } catch (error) {
    console.error('Onboarding error:', error)
    console.error('Error details:', error instanceof Error ? error.message : JSON.stringify(error))
    return NextResponse.json(
      {
        error: 'Failed to save onboarding data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
