import { Link, createFileRoute } from '@tanstack/react-router'
import { Check, X } from 'lucide-react'
import type { JSX } from 'react'
import { ProductsGrid } from '@/components/ProductsGrid'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Pricing tier configuration
interface PricingFeature {
  name: string
  free: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started and testing',
    features: [
      'Up to 3 projects',
      '1 GB storage',
      'Community support',
      'Basic analytics',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: 'per month',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited projects',
      '100 GB storage',
      'Priority support',
      'Advanced analytics',
      'Custom domains',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with advanced needs',
    features: [
      'Everything in Pro',
      'Unlimited storage',
      'Dedicated support',
      'SLA guarantee',
      'Advanced security',
      'Custom integrations',
      'Training & onboarding',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const comparisonFeatures: Array<PricingFeature> = [
  { name: 'Projects', free: '3', pro: 'Unlimited', enterprise: 'Unlimited' },
  { name: 'Storage', free: '1 GB', pro: '100 GB', enterprise: 'Unlimited' },
  { name: 'Team members', free: '1', pro: '10', enterprise: 'Unlimited' },
  { name: 'API access', free: true, pro: true, enterprise: true },
  { name: 'Custom domains', free: false, pro: true, enterprise: true },
  {
    name: 'Advanced analytics',
    free: false,
    pro: true,
    enterprise: true,
  },
  { name: 'Priority support', free: false, pro: true, enterprise: true },
  { name: 'SLA guarantee', free: false, pro: false, enterprise: true },
  { name: 'Dedicated support', free: false, pro: false, enterprise: true },
  {
    name: 'Custom integrations',
    free: false,
    pro: false,
    enterprise: true,
  },
]

function renderFeatureValue(value: boolean | string): JSX.Element {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className="h-5 w-5 text-green-600 mx-auto" />
    ) : (
      <X className="h-5 w-5 text-gray-300 mx-auto" />
    )
  }
  return <span className="text-gray-700">{value}</span>
}

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Pricing Plans | Kitchen Sink' },
      {
        name: 'description',
        content:
          'Simple, transparent pricing for Kitchen Sink. Choose the plan that fits your needs and start building today.',
      },
      // Open Graph
      { property: 'og:title', content: 'Pricing Plans | Kitchen Sink' },
      {
        property: 'og:description',
        content:
          'Simple, transparent pricing for Kitchen Sink. Choose the plan that fits your needs.',
      },
      { property: 'og:type', content: 'website' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Pricing Plans | Kitchen Sink' },
      {
        name: 'twitter:description',
        content:
          'Simple, transparent pricing for Kitchen Sink. Choose the plan that fits your needs.',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Kitchen Sink',
          description:
            'A modern full-stack TypeScript starter template for building production-ready applications.',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '0',
            offerCount: '3',
          },
        }),
      },
    ],
  }),
  component: PricingPage,
})

function PricingPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to
            our core features and dedicated support.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.highlighted
                    ? 'border-blue-500 border-2 shadow-xl'
                    : 'border-gray-200'
                }`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span className="text-gray-600 ml-2">/{tier.period}</span>
                    )}
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block">
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? 'default' : 'outline'}
                      size="lg"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Compare Plans
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">
                      Features
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Free
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900 bg-blue-50">
                      Pro
                    </th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr
                      key={feature.name}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-4 px-6 text-gray-900 font-medium">
                        {feature.name}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {renderFeatureValue(feature.free)}
                      </td>
                      <td className="py-4 px-6 text-center bg-blue-50/50">
                        {renderFeatureValue(feature.pro)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {renderFeatureValue(feature.enterprise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Polar Products (if you want to show actual subscription products) */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Subscribe Now
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Ready to get started? Choose your plan and subscribe today.
          </p>
          <ProductsGrid />
        </div>

        {/* Feature Comparison */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What's Included
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  Authentication
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Email/password authentication
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Session management</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  Database & Storage
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      PostgreSQL with Drizzle ORM
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">R2/S3 file uploads</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Type-safe queries</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  Billing & Subscriptions
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Polar integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Subscription management
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Webhook handling</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  UI Components
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">shadcn/ui components</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Tailwind CSS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Responsive design</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  Developer Experience
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">TypeScript</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Hot module replacement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">ESLint & Prettier</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Support</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Community support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Regular updates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Pricing FAQ
          </h2>
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-lg shadow-lg"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="px-6">
                Can I change plans later?
              </AccordionTrigger>
              <AccordionContent className="px-6">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate the difference.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="px-6">
                What payment methods do you accept?
              </AccordionTrigger>
              <AccordionContent className="px-6">
                We accept all major credit cards and debit cards through our
                secure payment processor, Polar.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="px-6">
                Is there a free trial?
              </AccordionTrigger>
              <AccordionContent className="px-6">
                Our free tier gives you access to core features with no time
                limit. You can explore the platform before committing to a paid
                plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="px-6">
                Can I cancel anytime?
              </AccordionTrigger>
              <AccordionContent className="px-6">
                Absolutely! You can cancel your subscription at any time from
                your billing dashboard. You'll continue to have access until the
                end of your billing period.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="px-6">
                Do you offer refunds?
              </AccordionTrigger>
              <AccordionContent className="px-6">
                We offer a 30-day money-back guarantee on all paid plans. If
                you're not satisfied, contact support for a full refund.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of developers building amazing applications with
            Kitchen Sink.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg">Start Building Free</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
