import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Privacy Policy | Kitchen Sink' },
      {
        name: 'description',
        content:
          'Learn how Kitchen Sink collects, uses, and protects your personal information.',
      },
      // Open Graph
      { property: 'og:title', content: 'Privacy Policy | Kitchen Sink' },
      {
        property: 'og:description',
        content:
          'Learn how Kitchen Sink collects, uses, and protects your personal information.',
      },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'Privacy Policy | Kitchen Sink' },
    ],
  }),
  component: PrivacyPolicyPage,
})

function PrivacyPolicyPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us when you
                create an account, use our services, or communicate with us.
                This may include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Name and email address</li>
                <li>Account credentials</li>
                <li>
                  Payment information (processed securely by our payment
                  provider)
                </li>
                <li>Usage data and analytics</li>
                <li>Files and content you upload to our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
                <li>Detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Information Sharing and Disclosure
              </h2>
              <p className="text-gray-700 mb-4">
                We do not sell your personal information. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>With your consent</li>
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>In connection with a business transfer or acquisition</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Data Security
              </h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction. These measures
                include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Third-Party Services
              </h2>
              <p className="text-gray-700 mb-4">
                Our service integrates with third-party services, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Payment processors (Polar)</li>
                <li>Cloud storage (Cloudflare R2)</li>
                <li>Analytics services</li>
              </ul>
              <p className="text-gray-700 mt-4">
                These services have their own privacy policies governing how
                they collect and use information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights and Choices
              </h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Access and receive a copy of your data</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict certain processing</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to
                provide our services and fulfill the purposes outlined in this
                privacy policy. When you delete your account, we will delete or
                anonymize your personal information within 30 days, unless we
                are required to retain it for legal or regulatory purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure that
                such transfers comply with applicable data protection laws and
                that your data receives adequate protection.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not directed to children under 13 years of age.
                We do not knowingly collect personal information from children.
                If you believe we have collected information from a child,
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will
                notify you of any material changes by posting the new policy on
                this page and updating the "Last updated" date. Your continued
                use of our services after such changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Contact Us
              </h2>
              <p className="text-gray-700">
                If you have any questions about this privacy policy or our
                privacy practices, please contact us at:
              </p>
              <p className="text-gray-700 mt-4">
                Email: privacy@kitchensink.com
                <br />
                Address: [Your Company Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
