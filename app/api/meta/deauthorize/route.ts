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

    console.log('[Meta Deauthorize] User deauthorized:', userId)

    // Optional: Mark user's Meta connection as deauthorized in your database
    // You might want to keep the data but mark it as disconnected
    // Or delete the connection entirely based on your data retention policy

    // For now, we'll just log it. You can add database logic here if needed.
    // Example:
    // await db.adAccount.updateMany({
    //   where: { metaUserId: userId },
    //   data: { isActive: false }
    // })

    // Meta requires you to return a confirmation URL
    // This URL will be shown to the user after deauthorization
    const confirmationUrl = `https://funnel-pulse.com/?deauthorized=true`

    return NextResponse.json({
      url: confirmationUrl,
      confirmation_code: `deauth_${userId}_${Date.now()}`
    })
  } catch (error) {
    console.error('[Meta Deauthorize] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Meta might also send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Deauthorize endpoint is active'
  })
}
