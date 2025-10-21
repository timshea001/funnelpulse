import Link from 'next/link'

export default function Home() {
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
          <Link
            href="/onboarding"
            className="btn-primary inline-block w-full sm:w-auto px-8 py-3 text-lg"
          >
            Get Started
          </Link>
          <div className="text-sm text-gray-500">
            7-day free trial • No credit card required
          </div>
        </div>
      </div>
    </main>
  )
}
