import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useTranslation } from '@/lib/i18n'
import { Users, Award, Zap, TrendingUp } from 'lucide-react'

interface ClubStatsProps {
  totalPlayers?: number
  totalCoaches?: number
  activeSessions?: number
  averageAttendance?: number
}

export function ClubStats({
  totalPlayers = 245,
  totalCoaches = 12,
  activeSessions = 8,
  averageAttendance = 85,
}: ClubStatsProps) {
  const t = useTranslation()

  const stats = [
    {
      icon: Users,
      label: t('admin.totalPlayers'),
      value: totalPlayers,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Award,
      label: t('admin.totalCoaches'),
      value: totalCoaches,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Zap,
      label: t('admin.activeSessions'),
      value: activeSessions,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      icon: TrendingUp,
      label: t('admin.averageAttendance'),
      value: `${averageAttendance}%`,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <Card key={idx} className="border-ace-border bg-ace-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-100">{stat.value}</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
