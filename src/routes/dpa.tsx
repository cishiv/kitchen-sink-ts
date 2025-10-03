import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'

export const Route = createFileRoute('/dpa')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Data Processing Agreement | Kitchen Sink' },
      {
        name: 'description',
        content:
          'Our Data Processing Agreement outlines how we process and protect your data in compliance with GDPR and other regulations.',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Data Processing Agreement | Kitchen Sink',
      },
      {
        property: 'og:description',
        content:
          'Our Data Processing Agreement outlines how we process and protect your data.',
      },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content: 'Data Processing Agreement | Kitchen Sink',
      },
    ],
  }),
  component: DPAPage,
})

function DPAPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Data Processing Agreement
          </h1>
          <p className="text-gray-600 mb-8">
            Effective date:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Definitions
              </h2>
              <p className="text-gray-700 mb-4">
                For the purposes of this Data Processing Agreement (DPA):
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>"Controller"</strong> means the entity that determines
                  the purposes and means of processing Personal Data.
                </li>
                <li>
                  <strong>"Processor"</strong> means the entity that processes
                  Personal Data on behalf of the Controller.
                </li>
                <li>
                  <strong>"Personal Data"</strong> means any information
                  relating to an identified or identifiable natural person.
                </li>
                <li>
                  <strong>"Processing"</strong> means any operation performed on
                  Personal Data, including collection, storage, use, and
                  deletion.
                </li>
                <li>
                  <strong>"Data Subject"</strong> means the individual to whom
                  Personal Data relates.
                </li>
                <li>
                  <strong>"GDPR"</strong> means the General Data Protection
                  Regulation (EU) 2016/679.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Scope and Purpose
              </h2>
              <p className="text-gray-700 mb-4">
                This DPA applies to the processing of Personal Data by Kitchen
                Sink (the "Processor") on behalf of the customer (the
                "Controller") in connection with the use of our services.
              </p>
              <p className="text-gray-700">
                The subject matter, duration, nature, and purpose of processing,
                as well as the types of Personal Data and categories of Data
                Subjects, are described in Annex A to this DPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Processor's Obligations
              </h2>
              <p className="text-gray-700 mb-4">The Processor shall:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Process Personal Data only on documented instructions from the
                  Controller
                </li>
                <li>
                  Ensure that persons authorized to process Personal Data are
                  bound by confidentiality obligations
                </li>
                <li>
                  Implement appropriate technical and organizational measures to
                  ensure data security
                </li>
                <li>
                  Assist the Controller in responding to Data Subject requests
                </li>
                <li>
                  Notify the Controller without undue delay upon becoming aware
                  of a data breach
                </li>
                <li>
                  Delete or return all Personal Data upon termination of
                  services
                </li>
                <li>
                  Make available all information necessary to demonstrate
                  compliance
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Controller's Obligations
              </h2>
              <p className="text-gray-700 mb-4">The Controller shall:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  Ensure it has a lawful basis for processing Personal Data
                </li>
                <li>Provide clear instructions for processing Personal Data</li>
                <li>Ensure compliance with applicable data protection laws</li>
                <li>Inform Data Subjects about the processing of their data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Security Measures
              </h2>
              <p className="text-gray-700 mb-4">
                The Processor implements the following technical and
                organizational measures:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encryption of Personal Data in transit and at rest</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Incident response and breach notification procedures</li>
                <li>Data backup and disaster recovery plans</li>
                <li>Employee training on data protection</li>
                <li>Physical security of data centers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Sub-Processors
              </h2>
              <p className="text-gray-700 mb-4">
                The Controller grants general authorization for the Processor to
                engage sub-processors. Current sub-processors include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>
                  <strong>Cloud Infrastructure Providers:</strong> For hosting
                  and data storage
                </li>
                <li>
                  <strong>Payment Processors:</strong> For handling subscription
                  payments
                </li>
                <li>
                  <strong>Analytics Services:</strong> For usage monitoring and
                  improvement
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                The Processor will inform the Controller of any intended changes
                to sub-processors, giving the Controller the opportunity to
                object to such changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Subject Rights
              </h2>
              <p className="text-gray-700 mb-4">
                The Processor will assist the Controller in fulfilling Data
                Subject rights requests, including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Right of access</li>
                <li>Right to rectification</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Data Breach Notification
              </h2>
              <p className="text-gray-700">
                In the event of a Personal Data breach, the Processor will
                notify the Controller without undue delay and no later than 72
                hours after becoming aware of the breach. The notification will
                include all relevant information about the breach, its likely
                consequences, and measures taken to address it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. International Data Transfers
              </h2>
              <p className="text-gray-700">
                Personal Data may be transferred to and processed in countries
                outside the European Economic Area (EEA). The Processor ensures
                that such transfers are subject to appropriate safeguards, such
                as Standard Contractual Clauses approved by the European
                Commission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Audits and Inspections
              </h2>
              <p className="text-gray-700">
                The Processor will make available to the Controller all
                information necessary to demonstrate compliance with this DPA
                and allow for audits, including inspections, by the Controller
                or an auditor mandated by the Controller.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                11. Data Retention and Deletion
              </h2>
              <p className="text-gray-700">
                Upon termination of the services or upon Controller's request,
                the Processor will delete or return all Personal Data to the
                Controller within 30 days, unless required by law to retain
                certain data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                12. Liability and Indemnification
              </h2>
              <p className="text-gray-700">
                Each party's liability under this DPA is subject to the
                limitations of liability set forth in the main service
                agreement. The Processor will indemnify the Controller against
                claims arising from the Processor's breach of this DPA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                13. Duration and Termination
              </h2>
              <p className="text-gray-700">
                This DPA remains in effect for the duration of the service
                agreement and will automatically terminate upon termination of
                the service agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Annex A: Description of Processing
              </h2>
              <div className="space-y-4 text-gray-700">
                <div>
                  <strong>Subject Matter:</strong> Provision of SaaS platform
                  services
                </div>
                <div>
                  <strong>Duration:</strong> Term of the service agreement
                </div>
                <div>
                  <strong>Nature and Purpose:</strong> Processing necessary to
                  provide platform services, including user authentication, data
                  storage, and subscription management
                </div>
                <div>
                  <strong>Types of Personal Data:</strong> Name, email address,
                  authentication credentials, payment information, usage data,
                  uploaded files
                </div>
                <div>
                  <strong>Categories of Data Subjects:</strong> Platform users,
                  customers, and their authorized users
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <p className="text-gray-700">
                For questions about this DPA, please contact:
              </p>
              <p className="text-gray-700 mt-4">
                Email: legal@kitchensink.com
                <br />
                Data Protection Officer: dpo@kitchensink.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
