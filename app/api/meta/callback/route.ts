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

    const tokenResponse = await fetch(tokenUrl.toString())

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user's ad accounts
    const metaAPI = new MetaAPI(accessToken)
    const accounts = await metaAPI.getAdAccounts()

    if (accounts.length === 0) {
      return NextResponse.redirect(
        new URL('/onboarding?error=No ad accounts found. Please ensure you have access to Meta ad accounts.', request.url)
      )
    }

    // Store ad accounts in database
    const encryptedToken = await encrypt(accessToken)

    for (const account of accounts) {
      await db.adAccount.upsert({
        where: {
          userId_platform_accountId: {
            userId,
            platform: 'meta',
            accountId: account.id
          }
        },
        create: {
          userId,
          platform: 'meta',
          accountId: account.id,
          accountName: account.name,
          accessToken: encryptedToken,
          refreshToken: encryptedToken, // Meta doesn't use refresh tokens the same way
          tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          connectedAt: new Date(),
          lastSyncedAt: new Date(),
          isActive: true
        },
        update: {
          accountName: account.name,
          accessToken: encryptedToken,
          tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          lastSyncedAt: new Date(),
          isActive: true
        }
      })
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (error) {
    console.error('Error in Meta OAuth callback:', error)
    return NextResponse.redirect(
      new URL(`/onboarding?error=${encodeURIComponent('Failed to connect Meta account. Please try again.')}`, request.url)
    )
  }
}
