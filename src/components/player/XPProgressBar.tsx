import React from 'react'
import { Progress } from '@/components/ui/progress'
import { useTranslation } from '@/lib/i18n'
import { calculateXpProgress, calculateXpToNextLevel } from '@/lib/utils'

interface XPProgressBarProps {
  currentXp: number
  currentLevel: number
}

export function XPProgressBar({ currentXp, currentLevel }: XPProgressBarProps) {
  const t = useTranslation()
  const progress = calculateXpProgress(currentXp)
  const xpToNext = calculateXpToNextLevel(currentXp)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">
          {t('player.level')} {currentLevel + 1}
        </span>
        <span className="text-sm text-gray-400">
          {xpToNext} {t('player.xp')} {t('player.until')}
        </span>
      </div>
      <Progress value={progress} className="h-3" />
    </div>
  )
}
