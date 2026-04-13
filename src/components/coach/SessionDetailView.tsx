import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSession, useMarkAttendance, useSaveEvaluation } from '@/hooks/useSessions'
import { usePlayers } from '@/hooks/usePlayers'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, Circle, Clock, Minus } from 'lucide-react'

interface SessionDetailViewProps {
  sessionId: string
}

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused'

export function SessionDetailView({ sessionId }: SessionDetailViewProps) {
  const { user } = useAuth()
  const { data: session, isLoading: sessionLoading } = useSession(sessionId)
  const { data: players } = usePlayers(session?.club_id)
  const markAttendance = useMarkAttendance()
  const saveEvaluation = useSaveEvaluation()

  const [mdeScores, setMdeScores] = useState<Record<string, { m: number; d: number; e: number }>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('attendance')

  if (sessionLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (!session) return null

  const handleAttendanceChange = (playerId: string, status: AttendanceStatus) => {
    if (!user) return
    markAttendance.mutate({
      sessionId,
      playerId,
      status,
      markedBy: user.id,
    })
  }

  const handleSaveEvaluation = (playerId: string) => {
    if (!user) return
    const score = mdeScores[playerId] || { m: 5, d: 5, e: 5 }
    saveEvaluation.mutate({
      sessionId,
      playerId,
      coachId: user.id,
      mde: {
        motivation: score.m,
        development: score.d,
        engagement: score.e,
      },
      notes: notes[playerId] || undefined,
    })
  }

  const sessionDate = new Date(session.date).toLocaleString('da-DK')
  const attendanceMap = new Map(session.attendance?.map((a) => [a.player_id, a.status]))

  const attendanceStatusLabel = {
    present: 'Til stede',
    absent: 'Fraværende',
    late: 'Sen',
    excused: 'Undskyld',
  }

  const attendanceStatusIcon = {
    present: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    absent: <Circle className="h-5 w-5 text-slate-500" />,
    late: <Clock className="h-5 w-5 text-yellow-500" />,
    excused: <Minus className="h-5 w-5 text-blue-500" />,
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-2">{session.title}</h2>
        <p className="text-slate-400">{sessionDate}</p>
        {session.notes && <p className="text-slate-400 text-sm mt-2">{session.notes}</p>}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="attendance" className="flex-1">
            Fremmøde
          </TabsTrigger>
          <TabsTrigger value="evaluation" className="flex-1">
            MDE
          </TabsTrigger>
          <TabsTrigger value="info" className="flex-1">
            Info
          </TabsTrigger>
        </TabsList>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-3">
          {players?.map((player) => {
            const status = attendanceMap.get(player.id) as AttendanceStatus | undefined
            const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'excused']

            return (
              <Card key={player.id} className="bg-slate-800 border-slate-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-medium">{player.full_name}</p>
                    <p className="text-slate-400 text-sm">Level {player.level}</p>
                  </div>
                  {status && attendanceStatusIcon[status]}
                </div>

                <div className="flex gap-2">
                  {statuses.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={status === s ? 'default' : 'outline'}
                      onClick={() => handleAttendanceChange(player.id, s)}
                      disabled={markAttendance.isPending}
                      className={
                        status === s
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'border-slate-600 hover:bg-slate-700'
                      }
                    >
                      {attendanceStatusLabel[s]}
                    </Button>
                  ))}
                </div>
              </Card>
            )
          })}
        </TabsContent>

        {/* MDE Evaluation Tab */}
        <TabsContent value="evaluation" className="space-y-3">
          {players?.map((player) => {
            const score = mdeScores[player.id] || { m: 5, d: 5, e: 5 }

            return (
              <Card key={player.id} className="bg-slate-800 border-slate-700 p-4">
                <div className="mb-4">
                  <p className="text-white font-medium mb-4">{player.full_name}</p>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-slate-300">Motivation</label>
                        <span className="text-white font-mono">{score.m}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={score.m}
                        onChange={(e) =>
                          setMdeScores({
                            ...mdeScores,
                            [player.id]: { ...score, m: parseInt(e.target.value) },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-slate-300">Udvikling</label>
                        <span className="text-white font-mono">{score.d}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={score.d}
                        onChange={(e) =>
                          setMdeScores({
                            ...mdeScores,
                            [player.id]: { ...score, d: parseInt(e.target.value) },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm text-slate-300">Engagement</label>
                        <span className="text-white font-mono">{score.e}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={score.e}
                        onChange={(e) =>
                          setMdeScores({
                            ...mdeScores,
                            [player.id]: { ...score, e: parseInt(e.target.value) },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  <textarea
                    placeholder="Noter..."
                    value={notes[player.id] || ''}
                    onChange={(e) => setNotes({ ...notes, [player.id]: e.target.value })}
                    className="w-full mt-3 px-3 py-2 bg-slate-700 border border-slate-600 text-white rounded-md text-sm"
                    rows={2}
                  />
                </div>

                <Button
                  onClick={() => handleSaveEvaluation(player.id)}
                  disabled={saveEvaluation.isPending}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Gem evaluering
                </Button>
              </Card>
            )
          })}
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-3">
          <Card className="bg-slate-800 border-slate-700 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Titel</p>
                <p className="text-white">{session.title}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Dato</p>
                <p className="text-white">{sessionDate}</p>
              </div>
              {session.notes && (
                <div>
                  <p className="text-slate-400 text-sm">Noter</p>
                  <p className="text-white">{session.notes}</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
