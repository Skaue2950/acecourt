import React from 'react'
import { Challenge, PlayerChallenge } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'
import * as Icons from 'lucide-react'

interface ChallengeCardProps {
  challenge: Challenge
  playerChallenge?: PlayerChallenge
  onClaim?: () => void
}

const iconMap: Record<string, any> = {
  Target: Icons.Target,
  Calendar: Icons.Calendar,
  Medal: Icons.Medal,
  Zap: Icons.Zap,
  Flame: Icons.Flame,
}

export function ChallengeCard({ challenge, playerChallenge, onClaim }: ChallengeCardProps) {
  const t = useTranslation()
  const Icon = iconMap[challenge.icon] || Icons.Target

  const isCompleted = playerChallenge?.completed_at !== undefined
  const progress = playerChallenge
    ? (playerChallenge.current_value / challenge.target_value) * 100
    : 0

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-emerald-500/20 p-2">
                <Icon className="h-4 w-4 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-100">{challenge.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {t(`challenges.${challenge.type}`)}
              </Badge>
            </div>

            {playerChallenge && (
              <>
                <p className="mt-2 text-sm text-gray-400">{challenge.description}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {playerChallenge.current_value} / {challenge.target_value}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="mt-1" />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-sm text-emerald-400">{challenge.xp_reward} XP</div>
              <div className="text-xs text-gray-400">{challenge.coin_reward} Coins</div>
            </div>

            {isCompleted ? (
              <Badge className="bg-emerald-500/20 text-emerald-300">{t('challenges.claimed')}</Badge>
            ) : playerChallenge?.current_value === challenge.target_value ? (
              <Button size="sm" onClick={onClaim}>
                {t('challenges.claim')}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
