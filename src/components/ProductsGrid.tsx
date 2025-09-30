'use client'

import { createServerFn } from '@tanstack/react-start'
import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { api } from '@/lib/polar'
import { getAuthUser } from '@/lib/auth-helpers'
import type { Product } from '@polar-sh/sdk/models/components'

type ProductsResponse = {
  items: Product[]
}

/**
 * Server function to fetch products from Polar
 */
const getProducts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<ProductsResponse | null> => {
    try {
      const { result } = await api.products.list({
        isArchived: false,
      })

      if (!result?.items) {
        return null
      }

      return {
        items: result.items,
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      return null
    }
  },
)

export function ProductsGrid(): JSX.Element {
  const [productsData] = getProducts()
  const [authData] = getAuthUser()

  const userId = authData?.user.id

  if (!productsData || productsData.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products available
        </h3>
        <p className="text-gray-600">Check back later for available plans.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productsData.items.map((product) => {
        const price = product.prices?.[0]
        const priceDisplay = price
          ? price.amountType === 'fixed'
            ? `${(price.priceAmount / 100).toFixed(2)}`
            : price.amountType === 'free'
              ? 'Free'
              : 'Pay what you want'
          : 'Contact us'

        return (
          <Card key={product.id} className="relative flex flex-col h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{product.name}</CardTitle>
                  {product.description && (
                    <CardDescription className="mt-2">
                      {product.description}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="secondary" className="ml-2">
                  {priceDisplay}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {product.benefits && product.benefits.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">
                      Features:
                    </h4>
                    <ul className="space-y-1">
                      {product.benefits.map((benefit) => (
                        <li
                          key={benefit.id}
                          className="flex items-start gap-2 text-sm"
                        >
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">
                            {benefit.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <Button asChild className="w-full">
                  <Link
                    to="/api/billing/checkout"
                    search={{
                      products: product.id,
                      customerExternalId: userId,
                    }}
                  >
                    {price?.amountType === 'free' ? 'Get Started' : 'Subscribe'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
