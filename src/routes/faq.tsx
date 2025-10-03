import { createFileRoute } from '@tanstack/react-router'
import type { JSX } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Frequently Asked Questions | Kitchen Sink' },
      {
        name: 'description',
        content:
          'Find answers to common questions about Kitchen Sink, including account management, billing, features, and technical support.',
      },
      // Open Graph
      {
        property: 'og:title',
        content: 'Frequently Asked Questions | Kitchen Sink',
      },
      {
        property: 'og:description',
        content:
          'Find answers to common questions about Kitchen Sink, including account management, billing, features, and technical support.',
      },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      {
        name: 'twitter:title',
        content: 'Frequently Asked Questions | Kitchen Sink',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is Kitchen Sink?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Kitchen Sink is a modern full-stack TypeScript starter template that includes authentication, database management, file uploads, subscriptions, and a comprehensive UI component library.',
              },
            },
            {
              '@type': 'Question',
              name: 'How do I get started?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Sign up for a free account, set up your environment variables, run database migrations, and start building your application using our pre-configured stack.',
              },
            },
            {
              '@type': 'Question',
              name: 'Can I cancel my subscription anytime?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: "Yes! You can cancel your subscription at any time from your billing dashboard. You'll continue to have access until the end of your billing period.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: FAQPage,
})

function FAQPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions about Kitchen Sink
          </p>
        </div>

        <div className="space-y-8">
          {/* General Questions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              General
            </h2>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="general-1">
                <AccordionTrigger className="px-6">
                  What is Kitchen Sink?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Kitchen Sink is a modern full-stack TypeScript starter
                  template that includes everything you need to build
                  production-ready web applications. It comes with
                  authentication (BetterAuth), database management (Drizzle ORM
                  with PostgreSQL), file uploads (R2), subscriptions (Polar),
                  and a comprehensive UI component library (shadcn/ui).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-2">
                <AccordionTrigger className="px-6">
                  Who is Kitchen Sink for?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Kitchen Sink is designed for developers who want to quickly
                  build and deploy full-stack applications without spending
                  weeks on boilerplate setup. It's perfect for SaaS products,
                  internal tools, and MVPs.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general-3">
                <AccordionTrigger className="px-6">
                  What technologies does Kitchen Sink use?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Kitchen Sink is built with TypeScript, TanStack Start, React,
                  BetterAuth, Drizzle ORM, PostgreSQL, Cloudflare R2, Polar for
                  subscriptions, shadcn/ui components, and Tailwind CSS for
                  styling.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Account & Authentication */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Account & Authentication
            </h2>

            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="account-1">
                <AccordionTrigger className="px-6">
                  How do I create an account?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Click the "Sign Up" button in the header, enter your email and
                  password, and verify your email address. You can also sign up
                  using Google OAuth for faster registration.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account-2">
                <AccordionTrigger className="px-6">
                  Can I change my email address?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes, you can update your email address from your account
                  settings. You'll need to verify the new email address before
                  the change takes effect.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account-3">
                <AccordionTrigger className="px-6">
                  What should I do if I forget my password?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Click the "Forgot Password" link on the login page, enter your
                  email address, and we'll send you instructions to reset your
                  password.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="account-4">
                <AccordionTrigger className="px-6">
                  How do I delete my account?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  You can delete your account from your account settings. Please
                  note that this action is irreversible and will permanently
                  delete all your data after 30 days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Billing & Subscriptions */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Billing & Subscriptions
            </h2>

            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="billing-1">
                <AccordionTrigger className="px-6">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  We accept all major credit cards (Visa, Mastercard, American
                  Express, Discover) and debit cards. Payments are processed
                  securely through Polar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="billing-2">
                <AccordionTrigger className="px-6">
                  Can I change my plan?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes! You can upgrade or downgrade your plan at any time from
                  your billing dashboard. Changes take effect immediately, and
                  we'll prorate the difference.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="billing-3">
                <AccordionTrigger className="px-6">
                  Can I cancel my subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Absolutely! You can cancel your subscription at any time from
                  your billing dashboard. You'll continue to have access until
                  the end of your current billing period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="billing-4">
                <AccordionTrigger className="px-6">
                  Do you offer refunds?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  We offer a 30-day money-back guarantee on all paid plans. If
                  you're not satisfied with Kitchen Sink, contact our support
                  team for a full refund within 30 days of your purchase.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="billing-5">
                <AccordionTrigger className="px-6">
                  Will I be notified before my subscription renews?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes, we'll send you an email notification 7 days before your
                  subscription renews, giving you time to make any changes if
                  needed.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Features & Usage */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Features & Usage
            </h2>

            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="features-1">
                <AccordionTrigger className="px-6">
                  How do file uploads work?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Kitchen Sink uses Cloudflare R2 (S3-compatible) for file
                  storage. Files are uploaded directly to R2 using presigned
                  URLs, ensuring fast and secure uploads. All uploads are
                  tracked in your database for easy management.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features-2">
                <AccordionTrigger className="px-6">
                  What database does Kitchen Sink use?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Kitchen Sink uses PostgreSQL with Drizzle ORM for type-safe
                  database queries. You can use any PostgreSQL-compatible
                  database service (Neon, Supabase, AWS RDS, etc.).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features-3">
                <AccordionTrigger className="px-6">
                  Can I customize the UI components?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes! All UI components are built with shadcn/ui and Tailwind
                  CSS, making them fully customizable. You own the code and can
                  modify it to match your brand.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features-4">
                <AccordionTrigger className="px-6">
                  Does Kitchen Sink support team collaboration?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Team collaboration features are coming soon! We're working on
                  adding workspace management, team invitations, and role-based
                  permissions.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Technical Support */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Technical Support
            </h2>

            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="support-1">
                <AccordionTrigger className="px-6">
                  How do I get help?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  You can reach our support team via email at
                  support@kitchensink.com. We also have a community Discord
                  server where you can ask questions and connect with other
                  developers.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support-2">
                <AccordionTrigger className="px-6">
                  What are your support hours?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Our support team is available Monday through Friday, 9 AM to 6
                  PM EST. We aim to respond to all inquiries within 24 hours.
                  Premium plans receive priority support.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support-3">
                <AccordionTrigger className="px-6">
                  Where can I find documentation?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Our comprehensive documentation is available in the repository
                  and on our blog. We also provide code examples and tutorials
                  to help you get started quickly.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="support-4">
                <AccordionTrigger className="px-6">
                  Do you offer migration assistance?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes! For enterprise plans, we offer migration assistance to
                  help you move your existing application to Kitchen Sink.
                  Contact our sales team to learn more.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Security & Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Security & Privacy
            </h2>
            <Accordion
              type="single"
              collapsible
              className="bg-white rounded-lg shadow-lg"
            >
              <AccordionItem value="security-1">
                <AccordionTrigger className="px-6">
                  How secure is my data?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  We take security seriously. All data is encrypted in transit
                  (TLS/SSL) and at rest. We implement regular security audits,
                  access controls, and follow industry best practices for data
                  protection.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security-2">
                <AccordionTrigger className="px-6">
                  Is Kitchen Sink GDPR compliant?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes, Kitchen Sink is GDPR compliant. We provide tools to help
                  you manage user data, handle data subject requests, and comply
                  with privacy regulations. See our Privacy Policy and DPA for
                  more details.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security-3">
                <AccordionTrigger className="px-6">
                  Where is my data stored?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Your data is stored in secure, SOC 2 compliant data centers.
                  You can choose your preferred region during setup to ensure
                  compliance with data residency requirements.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security-4">
                <AccordionTrigger className="px-6">
                  Do you perform regular backups?
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  Yes, we perform automated daily backups of all databases. You
                  can also export your data at any time from your dashboard.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Contact CTA */}
          <div className="mt-16 text-center bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here
              to help.
            </p>
            <a
              href="mailto:support@kitchensink.com"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
