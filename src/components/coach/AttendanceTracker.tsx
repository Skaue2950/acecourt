import React from 'react'
import { SessionAttendance, Player } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface AttendanceTrackerProps {
  players: Player[]
  attendance: SessionAttendance[]
  onUpdate?: (playerId: string, status: string) => void
}

const statusConfig = {
  present: { icon: CheckCircle, color: 'text-green-400', label: 'Present' },
  absent: { icon: XCircle, color: 'text-red-400', label: 'Absent' },
  late: { icon: Clock, color: 'text-yellow-400', label: 'Late' },
  excused: { icon: AlertCircle, color: 'text-blue-400', label: 'Excused' },
}

export function AttendanceTracker({ players, attendance, onUpdate }: AttendanceTrackerProps) {
  const getStatus = (playerId: string) => {
    return attendance.find((a) => a.player_id === playerId)?.status || 'absent'
  }

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {players.map((player) => {
            const status = getStatus(player.id)
            const config = statusConfig[status as keyof typeof statusConfig]
            const Icon = config.icon

            return (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-ace-border bg-gray-900/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar_url} alt={player.full_name} />
                    <AvatarFallback>{player.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-100">{player.full_name}</div>
                    <div className="text-xs text-gray-400">Level {player.level}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  {onUpdate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const nextStatus =
                          status === 'present' ? 'absent' : 'present'
                        onUpdate(player.id, nextStatus)
                      }}
                    >
                      {config.label}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
