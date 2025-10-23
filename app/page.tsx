import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import Link from 'next/link'
import Footer from '@/components/Footer'

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">FunnelPulse</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
              <Link href="/sign-up" className="btn-primary px-6 py-2 text-sm">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
                Finally understand <span className="text-orange-600">why</span> your ads work
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Stop drowning in data. FunnelPulse transforms your Meta ad metrics into actionable insights with AI-powered analysis and industry benchmarks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-up" className="btn-primary px-8 py-4 text-lg">
                  Start 7-Day Free Trial
                </Link>
                <Link href="#features" className="px-8 py-4 text-lg border-2 border-gray-300 rounded-lg hover:border-gray-400 font-medium text-gray-700">
                  See How It Works
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                No credit card required • Setup in 2 minutes
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-12 bg-gray-50 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-600 mb-8">Trusted by growth marketers at leading D2C brands</p>
            <div className="flex justify-center items-center gap-12 flex-wrap opacity-50">
              <div className="text-2xl font-bold text-gray-400">BRAND</div>
              <div className="text-2xl font-bold text-gray-400">BRAND</div>
              <div className="text-2xl font-bold text-gray-400">BRAND</div>
              <div className="text-2xl font-bold text-gray-400">BRAND</div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything you need to optimize Meta ads</h2>
              <p className="text-xl text-gray-600">Built for marketers who need answers, not just dashboards</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Visual Funnel Analysis</h3>
                <p className="text-gray-600">
                  See exactly where customers drop off. From impression to purchase, understand every step of your funnel with industry benchmarks.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get specific, actionable recommendations based on your performance data. No more guessing what to optimize next.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Business-First Metrics</h3>
                <p className="text-gray-600">
                  Enter your AOV and margins once. We'll calculate break-even CPA, target ROAS, and LTV automatically.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Benchmarks</h3>
                <p className="text-gray-600">
                  Compare your CTR, conversion rates, and ROAS against industry standards. Know if you're winning or losing.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">2-Minute Setup</h3>
                <p className="text-gray-600">
                  Connect your Meta account, enter your business info, and get your first report. No complex configuration needed.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Client-Ready Reports</h3>
                <p className="text-gray-600">
                  Generate professional PDF reports with insights and recommendations. Perfect for client updates or stakeholder meetings.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview */}
        <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
              <p className="text-xl text-gray-600">Start free, scale as you grow</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Trial */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free Trial</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/7 days</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">1 ad account</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Full dashboard access</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Generate 1 report</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block w-full text-center py-3 px-6 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                  Start Free Trial
                </Link>
              </div>

              {/* Starter */}
              <div className="bg-white p-8 rounded-xl border-2 border-orange-500 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">1 ad account</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Unlimited reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Email support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">PDF export</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block w-full text-center py-3 px-6 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700">
                  Get Started
                </Link>
              </div>

              {/* Agency */}
              <div className="bg-white p-8 rounded-xl border-2 border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Agency</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">$199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Up to 25 ad accounts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">White-label reports</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Multi-user access</span>
                  </li>
                </ul>
                <Link href="/sign-up" className="block w-full text-center py-3 px-6 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-gray-400">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-600 to-orange-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to understand your Meta ads?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Join hundreds of marketers who've stopped guessing and started growing.
            </p>
            <Link href="/sign-up" className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
              Start Your Free Trial
            </Link>
            <p className="mt-4 text-sm text-orange-100">
              No credit card required • Cancel anytime
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
