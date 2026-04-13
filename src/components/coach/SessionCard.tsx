import React from 'react'
import { TennisSession } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Users } from 'lucide-react'
import { formatDate, formatTime } from '@/lib/utils'

interface SessionCardProps {
  session: TennisSession
  attendanceCount?: number
  onEdit?: () => void
  onDelete?: () => void
}

export function SessionCard({
  session,
  attendanceCount = 0,
  onEdit,
  onDelete,
}: SessionCardProps) {
  const sessionDate = new Date(session.date)

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-100">{session.title}</h3>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Calendar className="h-4 w-4" />
                {formatDate(session.date)}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                {formatTime(session.date)}
              </div>
              {attendanceCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Users className="h-4 w-4" />
                  {attendanceCount} players
                </div>
              )}
            </div>

            {session.notes && (
              <p className="mt-3 text-sm text-gray-400">{session.notes}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Badge variant="secondary">Active</Badge>
            {(onEdit || onDelete) && (
              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={onEdit}>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={onDelete}>
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
