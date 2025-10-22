import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export default async function Home() {
  // Check if user is authenticated
  const { userId: clerkUserId } = await auth()

  if (clerkUserId) {
    // User is logged in, check if they have completed onboarding and have ad accounts
    const user = await db.user.findUnique({
      where: { clerkId: clerkUserId },
      select: {
        id: true,
        industry: true,
        adAccounts: {
          where: { isActive: true },
          select: { id: true }
        }
      }
    })

    if (user) {
      // User exists in database
      if (user.adAccounts.length > 0) {
        // Has ad accounts, go to dashboard
        redirect('/dashboard')
      } else if (user.industry) {
        // Completed onboarding but no ad accounts, redirect to add accounts
        redirect('/onboarding?step=connect')
      } else {
        // Has not completed onboarding
        redirect('/onboarding')
      }
    } else {
      // User not in database yet, start onboarding
      redirect('/onboarding')
    }
  }

  // Not authenticated, show landing page
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to FunnelIQ
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Paid media reporting that gives you answers, not just data.
        </p>
        <div className="space-y-4">
          <a
            href="/sign-in"
            className="btn-primary inline-block w-full sm:w-auto px-8 py-3 text-lg"
          >
            Get Started
          </a>
          <div className="text-sm text-gray-500">
            7-day free trial • No credit card required
          </div>
        </div>
      </div>
    </main>
  )
}
