import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap } from 'lucide-react'

export function Hero() {
  const t = useTranslation()

  return (
    <section className="relative overflow-hidden bg-ace-bg px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-300">{t('common.loading')}</span>
          </div>
        </div>

        <h1 className="mb-6 text-center text-5xl font-bold tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
          {t('landing.heroTitle')}
        </h1>

        <p className="mb-8 text-center text-lg text-gray-400 sm:text-xl">
          {t('landing.heroSubtitle')}
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link to="/auth">
              {t('landing.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/demo">{t('landing.learnMore')}</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold text-emerald-400">500K+</div>
            <div className="text-gray-400">XP Earned Daily</div>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold text-emerald-400">100+</div>
            <div className="text-gray-400">Danish Clubs</div>
          </div>
          <div className="text-center">
            <div className="mb-3 text-4xl font-bold text-emerald-400">50K+</div>
            <div className="text-gray-400">Active Players</div>
          </div>
        </div>
      </div>
    </section>
  )
}
