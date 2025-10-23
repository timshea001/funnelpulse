import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    // Meta sends a signed_request parameter
    const body = await request.json()
    const signedRequest = body.signed_request

    if (!signedRequest) {
      return NextResponse.json({ error: 'No signed_request provided' }, { status: 400 })
    }

    // Parse the signed request
    // Format: base64_signature.base64_payload
    const [encodedSig, encodedPayload] = signedRequest.split('.')

    if (!encodedPayload) {
      return NextResponse.json({ error: 'Invalid signed_request format' }, { status: 400 })
    }

    // Decode the payload
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'))
    const userId = payload.user_id

    console.log('[Meta Data Deletion] Data deletion request for user:', userId)

    // Generate a unique confirmation code for tracking
    const confirmationCode = `deletion_${userId}_${Date.now()}`

    // Log the deletion request for compliance tracking
    // In production, you might want to:
    // 1. Mark data for deletion (soft delete)
    // 2. Schedule actual deletion after 30 days (grace period)
    // 3. Send notification to the user
    // 4. Keep logs for compliance (but delete PII)

    // Example implementation (uncomment and modify as needed):
    /*
    await db.adAccount.updateMany({
      where: { metaUserId: userId },
      data: {
        scheduledForDeletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        isActive: false
      }
    })
    */

    // Return the confirmation code and status URL
    // Meta requires you to provide a way for users to check deletion status
    const statusUrl = `https://funnel-pulse.com/data-deletion-status?code=${confirmationCode}`

    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode
    })
  } catch (error) {
    console.error('[Meta Data Deletion] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Meta might also send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Data deletion endpoint is active'
  })
}
