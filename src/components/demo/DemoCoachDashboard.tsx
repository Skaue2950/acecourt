import React from 'react'
import { useDemo } from '@/contexts/DemoContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SessionCard } from '@/components/coach/SessionCard'
import { AttendanceTracker } from '@/components/coach/AttendanceTracker'
import { PlayerProfileCard } from '@/components/coach/PlayerProfileCard'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'

export function DemoCoachDashboard() {
  const t = useTranslation()
  const { currentCoach, players, sessions, attendance, skills } = useDemo()

  return (
    <div className="space-y-8">
      {/* Coach Header */}
      <Card className="border-ace-border bg-gradient-to-r from-emerald-500/10 to-ace-card">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentCoach.avatar_url} alt={currentCoach.full_name} />
              <AvatarFallback>{currentCoach.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-100">{currentCoach.full_name}</h1>
              <p className="mt-1 text-gray-400">Coaching {players.length} players</p>

              <div className="mt-4 flex gap-4">
                <div>
                  <div className="text-sm text-gray-400">Active Sessions</div>
                  <div className="text-2xl font-bold text-emerald-400">{sessions.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Total Players</div>
                  <div className="text-2xl font-bold text-emerald-400">{players.length}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-100">{t('nav.sessions')}</h2>
        <div className="space-y-4">
          {sessions.slice(0, 3).map((session) => {
            const sessionAttendance = attendance.filter((a) => a.session_id === session.id)
            return (
              <SessionCard
                key={session.id}
                session={session}
                attendanceCount={sessionAttendance.length}
              />
            )
          })}
        </div>
      </div>

      {/* Attendance for Latest Session */}
      {sessions.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-100">Mark Attendance</h2>
          <AttendanceTracker
            players={players}
            attendance={attendance.filter((a) => a.session_id === sessions[0].id)}
          />
        </div>
      )}

      {/* Player Profiles */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-100">Your Players</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {players.slice(0, 4).map((player) => {
            const playerSkills = skills.find((s) => s.player_id === player.id)
            return (
              <PlayerProfileCard
                key={player.id}
                player={player}
                skills={playerSkills}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
