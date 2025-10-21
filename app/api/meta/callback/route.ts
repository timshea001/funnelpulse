import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { encrypt } from '@/lib/encryption'
import { MetaAPI } from '@/lib/meta-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state') // This is the userId
    const error = searchParams.get('error')

    if (error) {
      console.error('OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/onboarding?error=${encodeURIComponent('Meta connection failed. Please try again.')}`, request.url)
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/onboarding?error=Invalid callback parameters', request.url)
      )
    }

    const clerkUserId = state

    // Look up the user's database ID from their Clerk ID
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.redirect(
        new URL('/onboarding?error=User not found. Please complete onboarding first.', request.url)
      )
    }

    const userId = user.id

    // Exchange code for access token
    const redirectUri = process.env.NEXT_PUBLIC_META_REDIRECT_URI || 'http://localhost:3000/api/meta/callback'
    const clientId = process.env.FACEBOOK_CLIENT_ID
    const clientSecret = process.env.FACEBOOK_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      throw new Error('Meta app credentials not configured')
    }

    const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token')
    tokenUrl.searchParams.set('client_id', clientId)
    tokenUrl.searchParams.set('client_secret', clientSecret)
    tokenUrl.searchParams.set('redirect_uri', redirectUri)
    tokenUrl.searchParams.set('code', code)

    console.log('Exchanging code for access token...')
    const tokenResponse = await fetch(tokenUrl.toString())

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token
    console.log('Access token obtained successfully')

    // Get user's ad accounts
    console.log('Fetching ad accounts for user:', userId)
    const metaAPI = new MetaAPI(accessToken)
    const accounts = await metaAPI.getAdAccounts()
    console.log(`Found ${accounts.length} ad accounts:`, accounts.map(a => ({ id: a.id, name: a.name })))

    if (accounts.length === 0) {
      console.error('No ad accounts found for user:', userId)
      return NextResponse.redirect(
        new URL('/onboarding?error=No ad accounts found. Please ensure you have access to Meta ad accounts.', request.url)
      )
    }

    // Store access token and available accounts temporarily in the database
    // We'll store them as a pending connection that expires in 10 minutes
    const encryptedToken = await encrypt(accessToken)
    const accountsData = accounts.map(a => ({
      id: a.id,
      name: a.name,
      currency: a.currency,
      account_status: a.account_status
    }))

    // Store or update the pending OAuth session
    await db.pendingOAuthSession.upsert({
      where: { userId },
      create: {
        userId,
        platform: 'meta',
        accessToken: encryptedToken,
        availableAccounts: accountsData,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      },
      update: {
        platform: 'meta',
        accessToken: encryptedToken,
        availableAccounts: accountsData,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    })

    console.log('Stored pending OAuth session. Redirecting to account selection...')

    // Redirect to account selection page
    return NextResponse.redirect(new URL('/select-accounts', request.url))
  } catch (error) {
    console.error('Error in Meta OAuth callback:', error)
    return NextResponse.redirect(
      new URL(`/onboarding?error=${encodeURIComponent('Failed to connect Meta account. Please try again.')}`, request.url)
    )
  }
}
