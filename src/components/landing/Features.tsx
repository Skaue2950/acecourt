import React from 'react'
import { useTranslation } from '@/lib/i18n'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap,
  TrendingUp,
  Calendar,
  Target,
  BarChart3,
  Users,
  Trophy,
  Shield,
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    titleKey: 'landing.gamification',
    descKey: 'landing.gamificationDesc',
  },
  {
    icon: TrendingUp,
    titleKey: 'landing.skills',
    descKey: 'landing.skillsDesc',
  },
  {
    icon: Calendar,
    titleKey: 'landing.attendance',
    descKey: 'landing.attendanceDesc',
  },
  {
    icon: Target,
    titleKey: 'landing.mde',
    descKey: 'landing.mdeDesc',
  },
  {
    icon: BarChart3,
    titleKey: 'landing.analytics',
    descKey: 'landing.analyticsDesc',
  },
  {
    icon: Users,
    titleKey: 'landing.coachFeature',
    descKey: 'landing.playerFeatures',
  },
  {
    icon: Trophy,
    titleKey: 'landing.adminFeature',
    descKey: 'landing.clubStats',
  },
  {
    icon: Shield,
    titleKey: 'landing.customizationFeature',
    descKey: 'landing.supportFeature',
  },
]

export function Features() {
  const t = useTranslation()

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-100">
          {t('landing.featuresTitle')}
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card
                key={idx}
                className="border-ace-border bg-ace-card/50 backdrop-blur-sm transition-all hover:bg-ace-card hover:ring-1 hover:ring-emerald-500/20"
              >
                <CardContent className="pt-6">
                  <div className="mb-4 rounded-lg bg-emerald-500/10 p-3 w-fit">
                    <Icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-gray-100">{t(feature.titleKey)}</h3>
                  <p className="text-sm text-gray-400">{t(feature.descKey)}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
