import React from 'react'
import { useDemo } from '@/contexts/DemoContext'
import { ClubStats } from '@/components/admin/ClubStats'
import { CoachActivity } from '@/components/admin/CoachActivity'
import { AdminAnalytics } from '@/components/admin/AdminAnalytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from '@/lib/i18n'

export function DemoAdminDashboard() {
  const t = useTranslation()
  const { currentAdmin, players } = useDemo()

  const topPlayers = players.sort((a, b) => b.xp - a.xp).slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <Card className="border-ace-border bg-gradient-to-r from-emerald-500/10 to-ace-card">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentAdmin.avatar_url} alt={currentAdmin.full_name} />
              <AvatarFallback>{currentAdmin.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100">{currentAdmin.full_name}</h1>
              <p className="mt-1 text-gray-400">Club Administrator</p>

              <div className="mt-4 flex gap-4">
                <Badge className="bg-emerald-500/20 text-emerald-300">
                  {players.length} Active Players
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-300">
                  Platform Health: 98%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Club Statistics */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-100">{t('admin.clubStats')}</h2>
        <ClubStats
          totalPlayers={players.length}
          totalCoaches={4}
          activeSessions={8}
          averageAttendance={85}
        />
      </div>

      {/* Analytics */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-100">Performance Analytics</h2>
        <AdminAnalytics />
      </div>

      {/* Coach Activity */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-100">{t('admin.coachActivity')}</h2>
          <CoachActivity />
        </div>

        {/* Top Performers */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-100">{t('admin.topPerformers')}</h2>
          <Card className="border-ace-border bg-ace-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {topPlayers.map((player, idx) => (
                  <div key={player.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        #{idx + 1}
                      </Badge>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar_url} alt={player.full_name} />
                        <AvatarFallback>{player.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-100">{player.full_name}</div>
                        <div className="text-xs text-gray-400">Level {player.level}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-emerald-400">
                        {player.xp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
