import React from 'react'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

const plans = [
  {
    nameKey: 'landing.free',
    price: 'Free',
    descriptionKey: 'common.pending',
    features: ['5 players', '1 coach', 'Basic analytics'],
    ctaKey: 'landing.getStartedPricing',
  },
  {
    nameKey: 'landing.starter',
    price: '499',
    description: 'kr/month',
    features: ['25 players', '3 coaches', 'Advanced analytics', 'Mobile app'],
    ctaKey: 'landing.getStartedPricing',
    popular: true,
  },
  {
    nameKey: 'landing.professional',
    price: '999',
    description: 'kr/month',
    features: ['100 players', '10 coaches', 'Full analytics', 'API access', 'Custom branding'],
    ctaKey: 'landing.getStartedPricing',
  },
  {
    nameKey: 'landing.enterprise',
    price: 'Custom',
    description: 'pricing',
    features: ['Unlimited players', 'Unlimited coaches', 'Dedicated support', 'Custom integration'],
    ctaKey: 'landing.contactSales',
  },
]

export function Pricing() {
  const t = useTranslation()

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-100">
          {t('landing.pricing')}
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, idx) => (
            <Card
              key={idx}
              className={
                plan.popular
                  ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/20'
                  : 'border-ace-border bg-ace-card'
              }
            >
              {plan.popular && (
                <div className="flex justify-center pt-4">
                  <Badge className="bg-emerald-500/20 text-emerald-300">{t('landing.save')} 20%</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-gray-100">{t(plan.nameKey)}</CardTitle>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-100">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.description}</span>
                </div>
                <CardDescription className="mt-2 text-gray-400">
                  {plan.features.length} features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  asChild
                >
                  <Link to="/auth">{t(plan.ctaKey)}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
