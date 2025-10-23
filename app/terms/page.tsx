export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using FunnelPulse ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-gray-700 mb-4">
                We reserve the right to update or modify these Terms at any time. Your continued use of the Service after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                FunnelPulse is a Meta (Facebook/Instagram) advertising analytics and reporting platform that helps businesses:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Analyze advertising campaign performance</li>
                <li>Generate detailed performance reports with insights</li>
                <li>Visualize conversion funnels and customer journeys</li>
                <li>Track key performance metrics (ROAS, CPA, CTR, etc.)</li>
                <li>Receive optimization recommendations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.1 Account Creation</h3>
              <p className="text-gray-700 mb-4">
                To use FunnelPulse, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your account credentials.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.2 Account Requirements</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>You must be at least 18 years old</li>
                <li>You must provide accurate and truthful information</li>
                <li>You must have authorization to connect the Meta ad accounts you add</li>
                <li>One person or entity per account (no account sharing)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">3.3 Account Security</h3>
              <p className="text-gray-700 mb-4">
                You are responsible for all activity under your account. Notify us immediately of any unauthorized access or security breach.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Subscription and Payment</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.1 Free Trial</h3>
              <p className="text-gray-700 mb-4">
                We may offer a free trial period. At the end of the trial, you will be charged for the selected plan unless you cancel before the trial ends.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.2 Subscription Plans</h3>
              <p className="text-gray-700 mb-4">
                Subscription fees are billed in advance on a monthly or annual basis. All fees are non-refundable except as required by law or as explicitly stated in these Terms.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.3 Payment</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>You authorize us to charge your payment method for all fees</li>
                <li>You must provide current, complete, and accurate billing information</li>
                <li>You must promptly update payment information if it changes</li>
                <li>Failed payments may result in service suspension or termination</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.4 Price Changes</h3>
              <p className="text-gray-700 mb-4">
                We may change subscription prices with 30 days' notice. Price changes will not affect your current billing cycle. Existing customers may be grandfathered at their current rate at our discretion.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">4.5 Cancellation</h3>
              <p className="text-gray-700 mb-4">
                You may cancel your subscription at any time. Cancellation takes effect at the end of your current billing period. No refunds will be provided for partial months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Acceptable Use</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.1 Permitted Use</h3>
              <p className="text-gray-700 mb-4">
                You may use FunnelPulse only for lawful business purposes related to advertising analytics and reporting.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Prohibited Activities</h3>
              <p className="text-gray-700 mb-4">You may not:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to the Service</li>
                <li>Reverse engineer, decompile, or disassemble the Service</li>
                <li>Use automated tools to scrape or access the Service</li>
                <li>Resell or redistribute the Service without permission</li>
                <li>Connect ad accounts you don't have authorization to access</li>
                <li>Share your account credentials with others</li>
                <li>Use the Service to harass, spam, or harm others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Meta Platform Compliance</h2>
              <p className="text-gray-700 mb-4">
                By using FunnelPulse, you agree to comply with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Meta's Terms of Service</li>
                <li>Meta's Platform Policies</li>
                <li>Meta's Advertising Policies</li>
                <li>Meta's Data Use Policy</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your access if Meta revokes our access to their API or if you violate Meta's policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Data and Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your use of FunnelPulse is governed by our <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>, which is incorporated into these Terms by reference. You grant us permission to access and process your Meta advertising data as described in the Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.1 Our Rights</h3>
              <p className="text-gray-700 mb-4">
                FunnelPulse and all related trademarks, logos, and content are owned by us or our licensors. You may not use our intellectual property without prior written permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.2 Your Data</h3>
              <p className="text-gray-700 mb-4">
                You retain all rights to your advertising data and business information. You grant us a limited license to use this data solely to provide the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">8.3 Feedback</h3>
              <p className="text-gray-700 mb-4">
                If you provide feedback or suggestions about the Service, we may use them without any obligation to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Service Availability</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.1 Uptime</h3>
              <p className="text-gray-700 mb-4">
                We strive to maintain high availability but do not guarantee uninterrupted access. The Service may be unavailable due to maintenance, updates, or circumstances beyond our control.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">9.2 Changes to Service</h3>
              <p className="text-gray-700 mb-4">
                We may modify, suspend, or discontinue any part of the Service at any time with reasonable notice. We are not liable for any modifications or discontinuation.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Disclaimers</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 mb-2">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                </p>
                <p className="text-gray-700 mb-2">
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR RELIABILITY OF ANY CONTENT, INSIGHTS, OR RECOMMENDATIONS PROVIDED BY THE SERVICE.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Limitation of Liability</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-gray-700 mb-2">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                  <li>Your use or inability to use the Service</li>
                  <li>Unauthorized access to your data</li>
                  <li>Errors or inaccuracies in the Service</li>
                  <li>Third-party conduct or content</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Indemnification</h2>
              <p className="text-gray-700 mb-4">
                You agree to indemnify and hold harmless FunnelPulse and its affiliates from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
                <li>Your advertising data or campaigns</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Termination</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.1 By You</h3>
              <p className="text-gray-700 mb-4">
                You may terminate your account at any time through the account settings or by contacting support.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.2 By Us</h3>
              <p className="text-gray-700 mb-4">
                We may suspend or terminate your access immediately if you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Violate these Terms</li>
                <li>Engage in fraudulent activity</li>
                <li>Fail to pay applicable fees</li>
                <li>Pose a security or legal risk</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">13.3 Effect of Termination</h3>
              <p className="text-gray-700 mb-4">
                Upon termination, your access will cease immediately. Your data will be retained for 30 days for recovery purposes, then permanently deleted unless required by law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Dispute Resolution</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">14.1 Informal Resolution</h3>
              <p className="text-gray-700 mb-4">
                Before filing a claim, contact us at <a href="mailto:support@funnelpulse.com" className="text-blue-600 hover:underline">support@funnelpulse.com</a> to resolve the dispute informally.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">14.2 Governing Law</h3>
              <p className="text-gray-700 mb-4">
                These Terms are governed by the laws of the United States, without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. General Provisions</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.1 Entire Agreement</h3>
              <p className="text-gray-700 mb-4">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and FunnelPulse.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.2 Severability</h3>
              <p className="text-gray-700 mb-4">
                If any provision is found unenforceable, the remaining provisions will continue in full effect.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">15.3 Assignment</h3>
              <p className="text-gray-700 mb-4">
                You may not assign these Terms without our consent. We may assign these Terms without restriction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms, contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:legal@funnelpulse.com" className="text-blue-600 hover:underline">legal@funnelpulse.com</a></p>
                <p className="text-gray-700 mb-2"><strong>Support:</strong> <a href="mailto:support@funnelpulse.com" className="text-blue-600 hover:underline">support@funnelpulse.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
