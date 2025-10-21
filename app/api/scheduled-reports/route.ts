import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const schedules = await db.scheduledReport.findMany({
      where: { userId: user.id },
      include: {
        adAccount: {
          select: {
            accountName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ schedules })
  } catch (error) {
    console.error('Error fetching scheduled reports:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled reports' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      adAccountId,
      reportType,
      frequency,
      dayOfWeek,
      dayOfMonth,
      timeOfDay,
      timezone,
      dateRangeType,
      recipients,
      deliveryFormat,
      activeCampaignsOnly
    } = body

    // Calculate next run time based on frequency
    const now = new Date()
    const nextRun = new Date(now)

    switch (frequency) {
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + ((7 + dayOfWeek - nextRun.getDay()) % 7))
        break
      case 'biweekly':
        nextRun.setDate(nextRun.getDate() + ((14 + dayOfWeek - nextRun.getDay()) % 14))
        break
      case 'monthly':
        nextRun.setDate(dayOfMonth)
        if (nextRun < now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
        break
      case 'quarterly':
        nextRun.setMonth(Math.floor(nextRun.getMonth() / 3) * 3 + 3)
        nextRun.setDate(dayOfMonth)
        break
    }

    // Set time
    const [hours, minutes] = timeOfDay.split(':')
    nextRun.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    const schedule = await db.scheduledReport.create({
      data: {
        userId: user.id,
        adAccountId,
        reportType,
        frequency,
        dayOfWeek: dayOfWeek || null,
        dayOfMonth: dayOfMonth || null,
        timeOfDay,
        timezone: timezone || 'America/New_York',
        dateRangeType,
        recipients,
        deliveryFormat,
        activeCampaignsOnly: activeCampaignsOnly || false,
        isActive: true,
        nextRunAt: nextRun
      }
    })

    return NextResponse.json({ schedule })
  } catch (error) {
    console.error('Error creating scheduled report:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create scheduled report' },
      { status: 500 }
    )
  }
}
