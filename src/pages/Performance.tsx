import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useSkills } from '@/hooks/usePlayerStats'
import { getPlayerEvaluations } from '@/lib/supabase'
import { useTranslation } from '@/lib/i18n'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkillRadarChart } from '@/components/player/SkillRadarChart'
import { Skeleton } from '@/components/ui/skeleton'

export function Performance() {
  const t = useTranslation()
  const { user } = useAuth()
  const { data: skills, isLoading } = useSkills(user?.id)

  const { data: evaluations, isLoading: evalsLoading } = useQuery({
    queryKey: ['player-evaluations', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      try {
        return await getPlayerEvaluations(user.id, 10)
      } catch {
        return []
      }
    },
    enabled: !!user?.id,
  })

  if (isLoading) {
    return (
      <AppLayout className="p-6">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-100">{t('nav.performance')}</h1>
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className="p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-white">{t('nav.performance')}</h1>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">{t('player.skillProgress')}</CardTitle>
            </CardHeader>
            <CardContent>
              {skills ? (
                <SkillRadarChart
                  skills={{
                    forehand: skills.forehand || 5,
                    backhand: skills.backhand || 5,
                    serve: skills.serve || 5,
                    volley: skills.volley || 5,
                    footwork: skills.footwork || 5,
                    fitness: skills.fitness || 5,
                  }}
                  showBenchmark
                />
              ) : (
                <p className="text-slate-400 text-center py-8">Ingen færdighedsvurderinger endnu</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Seneste evalueringer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {evalsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : evaluations && evaluations.length > 0 ? (
                <div className="space-y-3">
                  {evaluations.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="bg-slate-700 p-3 rounded">
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-300 text-sm">
                          {new Date(ev.created_at).toLocaleDateString('da-DK')}
                        </span>
                        <span className="text-emerald-400 text-sm font-medium">
                          {Math.round((ev.motivation + ev.development + ev.engagement) / 3)}/10
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400">Motivation</span>
                          <p className="text-white font-bold">{ev.motivation}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Udvikling</span>
                          <p className="text-white font-bold">{ev.development}</p>
                        </div>
                        <div>
                          <span className="text-slate-400">Engagement</span>
                          <p className="text-white font-bold">{ev.engagement}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-center py-4">Ingen evalueringer endnu</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
