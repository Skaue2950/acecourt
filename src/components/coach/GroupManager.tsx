import React, { useState } from 'react'
import { Player, TrainingGroup } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, X } from 'lucide-react'

interface GroupManagerProps {
  group: TrainingGroup
  groupMembers: Player[]
  availablePlayers: Player[]
  onAddPlayer?: (playerId: string) => void
  onRemovePlayer?: (playerId: string) => void
}

export function GroupManager({
  group,
  groupMembers,
  availablePlayers,
  onAddPlayer,
  onRemovePlayer,
}: GroupManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  const playersToAdd = availablePlayers.filter(
    (p) => !groupMembers.some((m) => m.id === p.id)
  )

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{group.name}</CardTitle>
          <Badge variant="secondary">{groupMembers.length} members</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="mb-3 font-semibold text-gray-100">Members</h3>
          <div className="space-y-2">
            {groupMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-ace-border bg-gray-900/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                    <AvatarFallback>{member.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-100">{member.full_name}</div>
                    <div className="text-xs text-gray-400">Level {member.level}</div>
                  </div>
                </div>
                {onRemovePlayer && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemovePlayer(member.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {onAddPlayer && playersToAdd.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Player
              </Button>
            </DialogTrigger>
            <DialogContent className="border-ace-border bg-ace-card">
              <DialogHeader>
                <DialogTitle>Add Player to Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                {playersToAdd.map((player) => (
                  <button
                    key={player.id}
                    onClick={() => {
                      onAddPlayer(player.id)
                      setDialogOpen(false)
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-ace-border bg-gray-900/50 p-3 transition-colors hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar_url} alt={player.full_name} />
                        <AvatarFallback>{player.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium text-gray-100">{player.full_name}</div>
                        <div className="text-xs text-gray-400">Level {player.level}</div>
                      </div>
                    </div>
                    <Plus className="h-4 w-4 text-emerald-400" />
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  )
}
