export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accessibility Statement</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 mb-4">
                FunnelPulse is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Conformance Status</h2>
              <p className="text-gray-700 mb-4">
                We strive to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Current Status:</strong> Partially conformant - Some parts of the content do not fully conform to the WCAG 2.1 Level AA standard.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <p className="text-gray-700 mb-4">FunnelPulse includes the following accessibility features:</p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Keyboard Navigation</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>All interactive elements are accessible via keyboard</li>
                <li>Logical tab order throughout the application</li>
                <li>Visible focus indicators for keyboard navigation</li>
                <li>Skip navigation links where appropriate</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Visual Design</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>High contrast color schemes for readability</li>
                <li>Clear and consistent visual hierarchy</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>No reliance on color alone to convey information</li>
                <li>Tooltips and labels for data visualizations</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Screen Reader Support</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Semantic HTML markup for proper structure</li>
                <li>ARIA labels and descriptions where needed</li>
                <li>Alt text for informational images</li>
                <li>Descriptive link text</li>
                <li>Proper heading hierarchy</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Forms and Inputs</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Clear labels for all form fields</li>
                <li>Error messages that are clear and actionable</li>
                <li>Inline validation with helpful feedback</li>
                <li>Required field indicators</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Content</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Clear and simple language</li>
                <li>Consistent navigation structure</li>
                <li>Descriptive page titles</li>
                <li>Breadcrumb navigation where appropriate</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>
              <p className="text-gray-700 mb-4">
                Despite our best efforts, some parts of FunnelPulse may not be fully accessible. We are aware of the following limitations and are working to address them:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Data Visualizations:</strong> Some complex charts may be difficult for screen reader users. We provide data tables as alternatives where possible.</li>
                <li><strong>Third-Party Content:</strong> Some integrated third-party services may not meet our accessibility standards.</li>
                <li><strong>PDF Reports:</strong> Generated PDFs may have limited accessibility features. We are working on improving this.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Compatibility</h2>
              <p className="text-gray-700 mb-4">FunnelPulse is designed to be compatible with:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Browsers:</strong> Recent versions of Chrome, Firefox, Safari, and Edge</li>
                <li><strong>Screen Readers:</strong> JAWS, NVDA, VoiceOver, and TalkBack</li>
                <li><strong>Operating Systems:</strong> Windows, macOS, iOS, and Android</li>
                <li><strong>Assistive Technologies:</strong> Voice recognition software, screen magnifiers, and alternative input devices</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Testing and Evaluation</h2>
              <p className="text-gray-700 mb-4">
                We regularly test FunnelPulse using:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Automated accessibility testing tools</li>
                <li>Manual testing with keyboard navigation</li>
                <li>Screen reader testing</li>
                <li>User testing with people with disabilities</li>
                <li>Compliance audits against WCAG 2.1 guidelines</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ongoing Improvements</h2>
              <p className="text-gray-700 mb-4">
                Accessibility is an ongoing commitment. We are actively working on:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Conducting regular accessibility audits</li>
                <li>Training our development team on accessibility best practices</li>
                <li>Incorporating accessibility into our design and development process</li>
                <li>Gathering and responding to user feedback</li>
                <li>Staying current with accessibility guidelines and standards</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback</h2>
              <p className="text-gray-700 mb-4">
                We welcome your feedback on the accessibility of FunnelPulse. If you encounter any accessibility barriers, please let us know:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>Email:</strong> <a href="mailto:accessibility@funnelpulse.com" className="text-blue-600 hover:underline">accessibility@funnelpulse.com</a></p>
                <p className="text-gray-700 mb-2"><strong>Support:</strong> <a href="mailto:support@funnelpulse.com" className="text-blue-600 hover:underline">support@funnelpulse.com</a></p>
              </div>
              <p className="text-gray-700 mt-4">
                We aim to respond to accessibility feedback within <strong>2 business days</strong> and to provide a resolution or alternative within <strong>10 business days</strong>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Alternative Formats</h2>
              <p className="text-gray-700 mb-4">
                If you need information from FunnelPulse in an alternative format, please contact us. We will work with you to provide the information in a format that meets your needs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Technical Specifications</h2>
              <p className="text-gray-700 mb-4">
                FunnelPulse's accessibility relies on the following technologies:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>HTML5</li>
                <li>CSS3</li>
                <li>JavaScript (React/Next.js)</li>
                <li>WAI-ARIA</li>
              </ul>
              <p className="text-gray-700 mb-4">
                These technologies are relied upon for conformance with the accessibility standards used.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Assessment Approach</h2>
              <p className="text-gray-700 mb-4">
                Our accessibility assessment was conducted using:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Self-evaluation:</strong> Internal testing by our development team</li>
                <li><strong>Automated tools:</strong> axe DevTools, WAVE, Lighthouse</li>
                <li><strong>Manual testing:</strong> Keyboard and screen reader testing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Legal Information</h2>
              <p className="text-gray-700 mb-4">
                This accessibility statement is provided in accordance with our commitment to digital accessibility and is aligned with the standards set forth in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Americans with Disabilities Act (ADA)</li>
                <li>Section 508 of the Rehabilitation Act</li>
                <li>Web Content Accessibility Guidelines (WCAG) 2.1</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
