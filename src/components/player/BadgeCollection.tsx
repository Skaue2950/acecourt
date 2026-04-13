import React from 'react'
import { Badge as BadgeType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import * as Icons from 'lucide-react'

interface BadgeCollectionProps {
  badges: BadgeType[]
}

const iconMap: Record<string, any> = {
  Trophy: Icons.Trophy,
  Flame: Icons.Flame,
  Star: Icons.Star,
  Zap: Icons.Zap,
  Crown: Icons.Crown,
  Medal: Icons.Medal,
  Shield: Icons.Shield,
}

export function BadgeCollection({ badges }: BadgeCollectionProps) {
  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <CardTitle>{`Badges (${badges.length})`}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon] || Icons.Award
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-2 rounded-lg border border-ace-border bg-gray-900/50 p-4 text-center"
              >
                <div className="rounded-full bg-emerald-500/20 p-3">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-gray-100">{badge.name}</div>
                  <p className="text-xs text-gray-400">{badge.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {badge.rarity}
                </Badge>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
