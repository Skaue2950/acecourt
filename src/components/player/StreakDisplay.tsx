import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Flame } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

interface StreakDisplayProps {
  currentStreak: number
  longestStreak: number
  multiplier: number
}

export function StreakDisplay({ currentStreak, longestStreak, multiplier }: StreakDisplayProps) {
  const t = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card className="border-ace-border bg-ace-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20">
              <Flame className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">{t('player.streak')}</div>
              <div className="text-2xl font-bold text-gray-100">
                {currentStreak}
                <span className="text-sm text-gray-400"> {t('player.dayStreak')}</span>
              </div>
              <div className="text-xs text-emerald-400">×{multiplier.toFixed(2)} XP</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-ace-border bg-ace-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
              <Flame className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Longest Streak</div>
              <div className="text-2xl font-bold text-gray-100">
                {longestStreak}
                <span className="text-sm text-gray-400"> {t('player.daysStreak')}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
