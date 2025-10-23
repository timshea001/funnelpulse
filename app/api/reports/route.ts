import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const adAccountId = searchParams.get('adAccountId')

    // Fetch reports
    const reports = await db.report.findMany({
      where: {
        userId: user.id,
        ...(adAccountId && { adAccountId })
      },
      select: {
        id: true,
        reportType: true,
        dateRangeStart: true,
        dateRangeEnd: true,
        generatedAt: true,
        adAccount: {
          select: {
            accountName: true
          }
        }
      },
      orderBy: {
        generatedAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    console.error('Error details:', error instanceof Error ? error.stack : String(error))
    return NextResponse.json({
      error: 'Failed to fetch reports',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
