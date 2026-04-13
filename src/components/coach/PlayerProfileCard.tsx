import React from 'react'
import { Player, PlayerSkills } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from '@/lib/i18n'

interface PlayerProfileCardProps {
  player: Player
  skills?: PlayerSkills
}

export function PlayerProfileCard({ player, skills }: PlayerProfileCardProps) {
  const t = useTranslation()

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={player.avatar_url} alt={player.full_name} />
              <AvatarFallback className="text-lg">
                {player.full_name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{player.full_name}</CardTitle>
              <p className="text-sm text-gray-400">
                Level {player.level} • {player.xp.toLocaleString()} XP
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300">{player.ace_coins} Coins</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.forehand')}</span>
              <span className="font-medium text-emerald-400">{skills.forehand}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.backhand')}</span>
              <span className="font-medium text-emerald-400">{skills.backhand}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.serve')}</span>
              <span className="font-medium text-emerald-400">{skills.serve}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.volley')}</span>
              <span className="font-medium text-emerald-400">{skills.volley}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.footwork')}</span>
              <span className="font-medium text-emerald-400">{skills.footwork}/10</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-gray-900/50 p-2">
              <span className="text-sm text-gray-400">{t('player.fitness')}</span>
              <span className="font-medium text-emerald-400">{skills.fitness}/10</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
