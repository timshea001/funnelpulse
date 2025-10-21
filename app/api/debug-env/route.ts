import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? 'Set (length: ' + process.env.FACEBOOK_CLIENT_ID.length + ')' : 'NOT SET',
    NEXT_PUBLIC_META_REDIRECT_URI: process.env.NEXT_PUBLIC_META_REDIRECT_URI || 'NOT SET',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
  })
}
