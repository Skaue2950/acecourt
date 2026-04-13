import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNow } from '@/lib/utils'

interface CoachActivityItem {
  id: string
  name: string
  avatar?: string
  action: string
  timestamp: string
  detail?: string
}

interface CoachActivityProps {
  activities?: CoachActivityItem[]
}

const defaultActivities: CoachActivityItem[] = [
  {
    id: '1',
    name: 'Thomas Vestergaard',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    action: 'Created session',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    detail: 'Forehand Training',
  },
  {
    id: '2',
    name: 'Anna Schmidt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    action: 'Evaluated players',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    detail: '5 players assessed',
  },
  {
    id: '3',
    name: 'Lars Jensen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lars',
    action: 'Updated group',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    detail: 'Advanced Group',
  },
]

export function CoachActivity({ activities = defaultActivities }: CoachActivityProps) {
  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <CardTitle>Coach Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 border-b border-ace-border pb-4 last:border-0"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={activity.avatar} alt={activity.name} />
                <AvatarFallback>{activity.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-100">{activity.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{activity.action}</span>
                  {activity.detail && (
                    <>
                      <span>•</span>
                      <span>{activity.detail}</span>
                    </>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(activity.timestamp)}
                </div>
              </div>

              <Badge variant="secondary" className="text-xs">
                Now
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
