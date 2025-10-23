export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to FunnelPulse ("we," "our," or "us"). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our advertising analytics platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Account Information:</strong> Email address, name, and authentication credentials</li>
                <li><strong>Business Information:</strong> Industry, business model, average order value, profit margins, and target performance metrics</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through our payment processor</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.2 Information We Collect from Meta (Facebook)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Ad Account Data:</strong> Ad account IDs, account names, and access permissions</li>
                <li><strong>Campaign Performance Data:</strong> Impressions, clicks, spend, conversions, and other advertising metrics</li>
                <li><strong>Campaign Structure:</strong> Campaign names, ad set names, objectives, and targeting information</li>
                <li><strong>Conversion Events:</strong> Add to cart, initiate checkout, purchase events and their values</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">2.3 Automatically Collected Information</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Usage Data:</strong> Pages visited, features used, and time spent in the application</li>
                <li><strong>Device Information:</strong> Browser type, operating system, and IP address</li>
                <li><strong>Session Data:</strong> Authentication tokens and session identifiers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">We use the collected information for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Service Provision:</strong> Generating advertising performance reports and analytics dashboards</li>
                <li><strong>Insights Generation:</strong> Creating personalized recommendations and optimization suggestions</li>
                <li><strong>Benchmarking:</strong> Comparing your performance against industry standards</li>
                <li><strong>Account Management:</strong> Managing your subscription and providing customer support</li>
                <li><strong>Service Improvement:</strong> Analyzing usage patterns to enhance our platform</li>
                <li><strong>Communication:</strong> Sending service updates, security alerts, and support messages</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Sharing and Third Parties</h2>
              <p className="text-gray-700 mb-4">We share your information only with trusted service providers:</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Service Providers</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-3 mb-4">
                <li>
                  <strong>Clerk (clerk.com):</strong> Authentication and user management
                  <br />
                  <span className="text-sm">Data shared: Email, user ID, authentication tokens</span>
                </li>
                <li>
                  <strong>Supabase (supabase.com):</strong> Database hosting and management
                  <br />
                  <span className="text-sm">Data shared: All stored application data</span>
                </li>
                <li>
                  <strong>OpenAI (openai.com):</strong> AI-powered insights generation
                  <br />
                  <span className="text-sm">Data shared: Anonymized advertising metrics (no personally identifiable information)</span>
                </li>
                <li>
                  <strong>Vercel (vercel.com):</strong> Application hosting and deployment
                  <br />
                  <span className="text-sm">Data shared: Application usage logs and performance metrics</span>
                </li>
              </ul>

              <p className="text-gray-700 mb-4 font-semibold">
                We do NOT sell, rent, or trade your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Retention</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Account Data:</strong> Retained for the duration of your account plus 30 days after deletion</li>
                <li><strong>Advertising Data:</strong> Historical reports retained indefinitely unless you request deletion</li>
                <li><strong>Usage Logs:</strong> Retained for 90 days for security and debugging purposes</li>
                <li><strong>Backup Data:</strong> Deleted from backups within 30 days of account deletion</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
              <p className="text-gray-700 mb-4">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Encryption in transit (TLS/HTTPS) and at rest (AES-256)</li>
                <li>Secure authentication via OAuth 2.0 and JWT tokens</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and principle of least privilege</li>
                <li>Automated backups with encryption</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
                <li><strong>Export:</strong> Download your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Revoke Access:</strong> Disconnect your Meta ad accounts at any time</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, contact us at <a href="mailto:privacy@funnelpulse.com" className="text-blue-600 hover:underline">privacy@funnelpulse.com</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Authentication and session management</li>
                <li>Remembering user preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You can control cookies through your browser settings. Note that disabling cookies may limit functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                FunnelPulse is not intended for users under 18 years of age. We do not knowingly collect information from children. If you become aware that a child has provided us with personal data, please contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your data may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through a notice in the application. Continued use of FunnelPulse after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:privacy@funnelpulse.com" className="text-blue-600 hover:underline">privacy@funnelpulse.com</a></p>
                <p className="text-gray-700 mb-2"><strong>Support:</strong> <a href="mailto:support@funnelpulse.com" className="text-blue-600 hover:underline">support@funnelpulse.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
