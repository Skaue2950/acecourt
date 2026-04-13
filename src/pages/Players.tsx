import { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { usePlayers } from '@/hooks/usePlayers'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { PlayerProfileModal } from '@/components/player/PlayerProfileModal'
import { Plus, Search, Users, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Players() {
  const t = useTranslation()
  const { club, hasRole } = useAuth()
  const { data: players, isLoading } = usePlayers(club?.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)

  const isCoach = hasRole('coach')

  const getLevelGradient = (level: number) => {
    if (level < 5) return 'bg-gradient-to-br from-blue-600 to-blue-700'
    if (level < 10) return 'bg-gradient-to-br from-emerald-600 to-green-700'
    if (level < 15) return 'bg-gradient-to-br from-purple-600 to-pink-700'
    return 'bg-gradient-to-br from-yellow-500 to-orange-600'
  }

  const filteredPlayers = players?.filter(
    (player) =>
      player.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.id.includes(searchQuery)
  ) || []

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <AppLayout className="p-4 sm:p-6 relative">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            {t('nav.players')}
          </h1>
          <p className="text-gray-400">
            {filteredPlayers.length} spiller{filteredPlayers.length !== 1 ? 'e' : ''}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Søg efter spiller..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              'w-full pl-12 pr-4 py-3 rounded-lg',
              'bg-gray-800 border border-gray-700 text-white placeholder-gray-500',
              'focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            )}
          />
        </div>

        {/* Invite Button */}
        {isCoach && (
          <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-11 mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Inviter spiller
          </Button>
        )}

        {/* Players List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="space-y-3">
            {filteredPlayers.map((player) => {
              const initials = getInitials(player.full_name)
              const xpPercent = Math.min(100, (player.xp % 100) * 100 / 100)

              return (
                <Card
                  key={player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:border-emerald-800 transition-colors active:scale-98"
                >
                  {/* Avatar */}
                  <Avatar className={cn(
                    'h-12 w-12 shrink-0 text-white font-bold text-sm',
                    getLevelGradient(player.level)
                  )}>
                    <AvatarImage src={player.avatar_url} alt={player.full_name} />
                    <AvatarFallback className={getLevelGradient(player.level)}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white truncate">{player.full_name}</p>
                      <span className="shrink-0 px-2 py-0.5 bg-emerald-900/50 rounded text-emerald-400 text-xs font-bold">
                        Lv.{player.level}
                      </span>
                    </div>

                    {/* XP Bar */}
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>

                    {/* Stats */}
                    <p className="text-xs text-gray-400 mt-1">
                      {player.xp} XP
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-600 shrink-0" />
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">
              {searchQuery ? 'Ingen spillere fundet' : 'Ingen spillere'}
            </p>
            {isCoach && (
              <Button className="bg-emerald-600 hover:bg-emerald-500">
                <Plus className="h-4 w-4 mr-2" />
                Inviter første spiller
              </Button>
            )}
          </Card>
        )}

        {/* Player Profile Modal */}
        {selectedPlayerId && (
          <PlayerProfileModal
            playerId={selectedPlayerId}
            open={!!selectedPlayerId}
            onOpenChange={(open) => !open && setSelectedPlayerId(null)}
          />
        )}
      </div>
    </AppLayout>
  )
}
