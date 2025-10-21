import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Meta OAuth URL
    const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI || 'http://localhost:3000/api/meta/callback'
    const clientId = process.env.FACEBOOK_CLIENT_ID

    if (!clientId) {
      return NextResponse.json({ error: 'Meta app not configured' }, { status: 500 })
    }

    // Scopes needed for Meta Ads API
    const scopes = [
      'ads_read',
      'ads_management',
      'business_management',
      'read_insights'
    ].join(',')

    const authUrl = new URL('https://www.facebook.com/v21.0/dialog/oauth')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', scopes)
    authUrl.searchParams.set('state', userId) // Pass userId as state for callback
    authUrl.searchParams.set('response_type', 'code')
    authUrl.searchParams.set('auth_type', 'rerequest') // Force re-authorization
    authUrl.searchParams.set('display', 'popup')

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('Error initiating Meta OAuth:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
