import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useTranslation } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Trophy, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

type Period = 'weekly' | 'monthly' | 'alltime'

export function Leaderboard() {
  const t = useTranslation()
  const { club, user } = useAuth()
  const [period, setPeriod] = useState<Period>('alltime')
  const { data: leaderboard, isLoading } = useLeaderboard(club?.id, period)

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const topThree = leaderboard?.slice(0, 3) || []
  const rest = leaderboard?.slice(3) || []

  return (
    <AppLayout className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {t('nav.leaderboard')}
          </h1>
          <p className="text-gray-400">Top spillere i {period === 'weekly' ? 'denne uge' : period === 'monthly' ? 'denne måned' : 'alt-tid'}</p>
        </div>

        {/* Period Tabs */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1">
            <TabsTrigger value="weekly" className="rounded text-xs sm:text-sm">
              Denne uge
            </TabsTrigger>
            <TabsTrigger value="monthly" className="rounded text-xs sm:text-sm">
              Denne måned
            </TabsTrigger>
            <TabsTrigger value="alltime" className="rounded text-xs sm:text-sm">
              Alt-tid
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            {topThree.length > 0 && (
              <div className="space-y-3 mb-6">
                {/* Rank 1 - Gold */}
                {topThree[0] && (
                  <div className="relative">
                    <Card className="bg-gradient-to-r from-yellow-900/40 to-yellow-800/20 border-yellow-700/50 p-4 sm:p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center text-3xl sm:text-4xl font-black">
                          🥇
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-10 w-10 border-2 border-yellow-500">
                              <AvatarImage src={topThree[0].avatar_url} alt={topThree[0].full_name} />
                              <AvatarFallback className="bg-yellow-600">
                                {getInitials(topThree[0].full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-bold text-white">{topThree[0].full_name}</p>
                              <p className="text-xs text-yellow-400">Level {topThree[0].level}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl sm:text-3xl font-black text-yellow-400">
                            {topThree[0].xp_earned}
                          </p>
                          <p className="text-xs text-gray-400">XP</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Rank 2 & 3 - Silver & Bronze */}
                {topThree.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Rank 2 */}
                    <Card className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 border-gray-600/50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-2xl">🥈</div>
                        <Avatar className="h-9 w-9 border border-gray-500">
                          <AvatarImage src={topThree[1].avatar_url} alt={topThree[1].full_name} />
                          <AvatarFallback className="bg-gray-600 text-sm">
                            {getInitials(topThree[1].full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <p className="font-semibold text-white text-sm truncate">{topThree[1].full_name}</p>
                      <p className="text-xs text-gray-400 mb-2">Level {topThree[1].level}</p>
                      <p className="text-xl font-black text-gray-300">{topThree[1].xp_earned}</p>
                      <p className="text-xs text-gray-400">XP</p>
                    </Card>

                    {/* Rank 3 */}
                    {topThree.length > 2 && (
                      <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/20 border-orange-700/50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="text-2xl">🥉</div>
                          <Avatar className="h-9 w-9 border border-orange-600">
                            <AvatarImage src={topThree[2].avatar_url} alt={topThree[2].full_name} />
                            <AvatarFallback className="bg-orange-700 text-sm">
                              {getInitials(topThree[2].full_name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <p className="font-semibold text-white text-sm truncate">{topThree[2].full_name}</p>
                        <p className="text-xs text-gray-400 mb-2">Level {topThree[2].level}</p>
                        <p className="text-xl font-black text-orange-400">{topThree[2].xp_earned}</p>
                        <p className="text-xs text-gray-400">XP</p>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ranking List */}
            {leaderboard && leaderboard.length > 3 && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Placeringer 4+
                </h3>
                <Card className="divide-y divide-ace-border">
                  {rest.map((entry, idx) => {
                    const isCurrentUser = entry.id === user?.id
                    return (
                      <div
                        key={entry.id}
                        className={cn(
                          'flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors',
                          isCurrentUser && 'bg-emerald-900/20 border-l-2 border-emerald-500'
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="font-bold text-gray-400 w-8">#{topThree.length + idx + 1}</span>
                          <Avatar className="h-9 w-9 shrink-0">
                            <AvatarImage src={entry.avatar_url} alt={entry.full_name} />
                            <AvatarFallback className="bg-emerald-600 text-xs">
                              {getInitials(entry.full_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'font-semibold truncate',
                              isCurrentUser ? 'text-emerald-400' : 'text-white'
                            )}>
                              {entry.full_name}
                            </p>
                            <p className="text-xs text-gray-400">Level {entry.level}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className={cn(
                            'font-bold',
                            isCurrentUser ? 'text-emerald-400' : 'text-gray-300'
                          )}>
                            {entry.xp_earned}
                          </p>
                          <p className="text-xs text-gray-400">XP</p>
                        </div>
                      </div>
                    )
                  })}
                </Card>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Ingen data tilgængelig</p>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
