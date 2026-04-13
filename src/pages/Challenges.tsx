import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { getChallenges } from '@/lib/supabase'
import { useTranslation } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { Target, Zap, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Challenges() {
  const t = useTranslation()
  const { club } = useAuth()

  const { data: challenges, isLoading } = useQuery({
    queryKey: ['challenges', club?.id],
    queryFn: async () => {
      try {
        return await getChallenges(club?.id)
      } catch {
        return []
      }
    },
    enabled: !!club?.id,
  })

  const types = ['daily', 'weekly', 'monthly', 'special'] as const

  const challengesByType = (type: string) => {
    return (challenges || []).filter((c) => c.type === type)
  }

  const tabLabels = {
    daily: 'Daglige',
    weekly: 'Ugentlige',
    monthly: 'Månedlige',
    special: 'Special',
  }

  const ChallengeCard = ({ challenge }: { challenge: any }) => {
    const isCompleted = challenge.completed
    const percent = challenge.target > 0 ? (challenge.current / challenge.target) * 100 : 0

    return (
      <Card className="relative overflow-hidden p-5">
        {/* Background icon watermark */}
        <div className="absolute top-2 right-2 opacity-5">
          <Target className="h-20 w-20 text-emerald-500" />
        </div>

        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        <div className="relative">
          <div className="flex items-start gap-4 mb-3">
            <div className="h-12 w-12 rounded-xl bg-emerald-900/50 flex items-center justify-center shrink-0">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white">{challenge.title}</h3>
              <p className="text-sm text-gray-400 mt-0.5">{challenge.description}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Fremgang</span>
              <span className="text-emerald-400">
                {challenge.current}/{challenge.target}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-800">
            <span className="flex items-center gap-1 text-xs text-yellow-400 font-medium">
              <Zap className="h-3 w-3" />
              {challenge.xp_reward} XP
            </span>
            <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
              <span>🪙</span>
              {challenge.coin_reward || 0}
            </span>
            {challenge.time_remaining && (
              <span className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                <Clock className="h-3 w-3" />
                {challenge.time_remaining}
              </span>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <AppLayout className="p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {t('nav.challenges')}
          </h1>
          <p className="text-gray-400">
            {challenges?.length || 0} udfordringer tilgængelige
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-800 p-1">
            {types.map((type) => (
              <TabsTrigger
                key={type}
                value={type}
                className="text-xs sm:text-sm rounded"
              >
                {tabLabels[type]}
              </TabsTrigger>
            ))}
          </TabsList>

          {types.map((type) => {
            const typeChallenges = challengesByType(type)
            return (
              <TabsContent key={type} value={type} className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : typeChallenges.length > 0 ? (
                  <div className="space-y-3">
                    {typeChallenges.map((challenge) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">
                      Ingen {tabLabels[type].toLowerCase()} udfordringer
                    </p>
                  </Card>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </AppLayout>
  )
}
