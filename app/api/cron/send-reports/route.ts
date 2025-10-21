import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (for security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()

    // Find all scheduled reports that are due
    const dueReports = await db.scheduledReport.findMany({
      where: {
        isActive: true,
        nextRunAt: {
          lte: now
        }
      },
      include: {
        adAccount: true,
        user: true
      }
    })

    console.log(`Found ${dueReports.length} reports due for delivery`)

    const results = []

    for (const schedule of dueReports) {
      try {
        // Generate report
        const endDate = new Date()
        const startDate = new Date()

        switch (schedule.dateRangeType) {
          case 'last_7':
            startDate.setDate(endDate.getDate() - 7)
            break
          case 'last_14':
            startDate.setDate(endDate.getDate() - 14)
            break
          case 'last_30':
            startDate.setDate(endDate.getDate() - 30)
            break
          case 'this_month':
            startDate.setDate(1)
            break
          case 'this_quarter':
            const currentQuarter = Math.floor(endDate.getMonth() / 3)
            startDate.setMonth(currentQuarter * 3, 1)
            break
        }

        // Call report generation API (internal)
        const reportResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reports/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            adAccountId: schedule.adAccountId,
            dateRangeStart: startDate.toISOString().split('T')[0],
            dateRangeEnd: endDate.toISOString().split('T')[0]
          })
        })

        if (!reportResponse.ok) {
          throw new Error('Failed to generate report')
        }

        const reportData = await reportResponse.json()

        // Send email
        const emailSubject = `[${schedule.adAccount.accountName}] Account Performance Report - ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Scheduled Performance Report</h2>
            <p>Hi there,</p>
            <p>Your scheduled performance report for <strong>${schedule.adAccount.accountName}</strong> is ready.</p>

            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Quick Summary (${schedule.dateRangeType.replace('_', ' ')})</h3>
              <ul style="list-style: none; padding: 0;">
                <li><strong>Spend:</strong> $${reportData.data.summary.spend.toFixed(2)}</li>
                <li><strong>Revenue:</strong> $${reportData.data.summary.revenue.toFixed(2)}</li>
                <li><strong>ROAS:</strong> ${reportData.data.summary.roas.toFixed(2)}x</li>
                <li><strong>CPA:</strong> $${reportData.data.summary.cpa ? reportData.data.summary.cpa.toFixed(2) : 'N/A'}</li>
                <li><strong>Purchases:</strong> ${reportData.data.summary.purchases}</li>
              </ul>
            </div>

            ${reportData.insights?.primary ? `
              <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196f3; margin: 20px 0;">
                <strong>Key Insight:</strong>
                <p>${reportData.insights.primary}</p>
              </div>
            ` : ''}

            <p style="margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/reports/${reportData.reportId}"
                 style="background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Full Report
              </a>
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #666;">
              This is an automated report from FunnelIQ.<br>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/scheduled-reports">Manage your scheduled reports</a>
            </p>
          </div>
        `

        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'reports@funneliq.com',
          to: schedule.recipients,
          subject: emailSubject,
          html: emailHtml
        })

        // Log delivery
        await db.reportDelivery.create({
          data: {
            scheduledReportId: schedule.id,
            reportId: reportData.reportId,
            deliveredAt: new Date(),
            status: 'success',
            recipients: schedule.recipients
          }
        })

        // Update next run time
        const nextRun = new Date(schedule.nextRunAt!)
        switch (schedule.frequency) {
          case 'weekly':
            nextRun.setDate(nextRun.getDate() + 7)
            break
          case 'biweekly':
            nextRun.setDate(nextRun.getDate() + 14)
            break
          case 'monthly':
            nextRun.setMonth(nextRun.getMonth() + 1)
            break
          case 'quarterly':
            nextRun.setMonth(nextRun.getMonth() + 3)
            break
        }

        await db.scheduledReport.update({
          where: { id: schedule.id },
          data: {
            lastRunAt: new Date(),
            nextRunAt: nextRun
          }
        })

        results.push({ scheduleId: schedule.id, status: 'success' })
      } catch (error) {
        console.error(`Error processing schedule ${schedule.id}:`, error)

        // Log failed delivery
        await db.reportDelivery.create({
          data: {
            scheduledReportId: schedule.id,
            deliveredAt: new Date(),
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
            recipients: schedule.recipients
          }
        })

        results.push({
          scheduleId: schedule.id,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      processed: dueReports.length,
      results
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Cron job failed' },
      { status: 500 }
    )
  }
}
