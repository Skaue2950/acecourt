import React from 'react'
import { LeaderboardEntry } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Trophy, TrendingUp } from 'lucide-react'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  playerNames: Record<string, string>
  playerAvatars?: Record<string, string>
  currentPlayerRank?: number
}

export function LeaderboardTable({
  entries,
  playerNames,
  playerAvatars = {},
  currentPlayerRank,
}: LeaderboardTableProps) {
  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-400" />
          Top Players
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ace-border">
                <th className="px-4 py-2 text-left text-gray-400">Rank</th>
                <th className="px-4 py-2 text-left text-gray-400">Player</th>
                <th className="px-4 py-2 text-right text-gray-400">XP</th>
                <th className="px-4 py-2 text-right text-gray-400">Change</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, idx) => {
                const playerName = playerNames[entry.player_id] || 'Unknown'
                const isCurrentPlayer = entry.rank === currentPlayerRank
                return (
                  <tr
                    key={entry.id}
                    className={`border-b border-ace-border transition-colors ${
                      isCurrentPlayer ? 'bg-emerald-500/10' : 'hover:bg-gray-800/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-300">
                      {entry.rank === 1 && '🥇'}
                      {entry.rank === 2 && '🥈'}
                      {entry.rank === 3 && '🥉'}
                      {entry.rank > 3 && entry.rank}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={playerAvatars[entry.player_id]} alt={playerName} />
                          <AvatarFallback>{playerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-100">{playerName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-400">
                      {entry.xp_earned.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 text-green-400">
                        <TrendingUp className="h-4 w-4" />
                        +250
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
