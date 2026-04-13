import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useCoaches } from '@/hooks/useCoaches'
import { usePlayers } from '@/hooks/usePlayers'
import { useSessions } from '@/hooks/useSessions'
import { useClubStats } from '@/hooks/useClub'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { InviteModal } from '@/components/admin/InviteModal'
import { Users, BookOpen, Settings, Plus, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Admin() {
  const t = useTranslation()
  const { club, user } = useAuth()
  const { data: coaches, isLoading: coachesLoading } = useCoaches(club?.id)
  const { data: players, isLoading: playersLoading } = usePlayers(club?.id)
  const { data: sessions, isLoading: sessionsLoading } = useSessions(club?.id)
  const { data: stats } = useClubStats(club?.id)
  const [inviteType, setInviteType] = useState<'coach' | 'player'>('coach')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)

  const now = new Date()
  const upcomingSessions = sessions?.filter((s) => new Date(s.date) > now) || []
  const pastSessions = sessions?.filter((s) => new Date(s.date) <= now) || []

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  return (
    <AppLayout className="p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Admin Center</h1>
          <p className="text-gray-400">{club?.name}</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-800/30 p-4 sm:p-5">
            <p className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-2">
              Spillere
            </p>
            <p className="text-3xl font-black text-white">{players?.length || 0}</p>
            <p className="text-xs text-gray-400 mt-1">i klubben</p>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-800/30 p-4 sm:p-5">
            <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-2">
              Træner
            </p>
            <p className="text-3xl font-black text-white">{coaches?.length || 0}</p>
            <p className="text-xs text-gray-400 mt-1">aktive</p>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/40 to-gray-900 border-yellow-800/30 p-4 sm:p-5">
            <p className="text-xs text-yellow-400 uppercase tracking-wider font-medium mb-2">
              Sessioner
            </p>
            <p className="text-3xl font-black text-white">{sessions?.length || 0}</p>
            <p className="text-xs text-gray-400 mt-1">i alt</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-800/30 p-4 sm:p-5">
            <p className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-2">
              Kommende
            </p>
            <p className="text-3xl font-black text-white">{upcomingSessions.length}</p>
            <p className="text-xs text-gray-400 mt-1">sessioner</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 p-1 mb-6">
            <TabsTrigger value="overview" className="rounded text-xs sm:text-sm">
              Oversigt
            </TabsTrigger>
            <TabsTrigger value="coaches" className="rounded text-xs sm:text-sm">
              Træner ({coaches?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="players" className="rounded text-xs sm:text-sm">
              Spillere ({players?.length || 0})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Invite Section */}
            <Card className="bg-gradient-to-br from-emerald-900/20 to-gray-900 border-emerald-800/30 p-5 sm:p-6">
              <h3 className="text-lg font-bold text-white mb-4">Inviter medlemmer</h3>
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  onClick={() => {
                    setInviteType('coach')
                    setInviteModalOpen(true)
                  }}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Inviter træner
                </Button>
                <Button
                  onClick={() => {
                    setInviteType('player')
                    setInviteModalOpen(true)
                  }}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Inviter spiller
                </Button>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Card className="p-4 cursor-pointer hover:border-emerald-800 transition-colors">
                <TrendingUp className="h-6 w-6 text-emerald-400 mb-2" />
                <p className="text-sm font-semibold text-white">Analyser</p>
                <p className="text-xs text-gray-400 mt-1">Se statistik</p>
              </Card>

              <Card className="p-4 cursor-pointer hover:border-emerald-800 transition-colors">
                <Settings className="h-6 w-6 text-blue-400 mb-2" />
                <p className="text-sm font-semibold text-white">Indstillinger</p>
                <p className="text-xs text-gray-400 mt-1">Klubopsætning</p>
              </Card>
            </div>
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches" className="space-y-3">
            {coachesLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : coaches && coaches.length > 0 ? (
              <div className="space-y-3">
                {coaches.map((coach) => (
                  <Card key={coach.id} className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={coach.avatar_url} alt={coach.full_name} />
                      <AvatarFallback className="bg-blue-600">
                        {getInitials(coach.full_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white">{coach.full_name}</p>
                      <p className="text-xs text-gray-400">Level {coach.level}</p>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8">
                      Håndter
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Ingen træner endnu</p>
                <Button
                  onClick={() => {
                    setInviteType('coach')
                    setInviteModalOpen(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Inviter første træner
                </Button>
              </Card>
            )}
          </TabsContent>

          {/* Players Tab */}
          <TabsContent value="players" className="space-y-3">
            {playersLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : players && players.length > 0 ? (
              <div className="space-y-3">
                {players.slice(0, 10).map((player) => (
                  <Card key={player.id} className="p-4 flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={player.avatar_url} alt={player.full_name} />
                      <AvatarFallback className="bg-emerald-600">
                        {getInitials(player.full_name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-white">{player.full_name}</p>
                        <span className="px-2 py-0.5 bg-emerald-900/50 rounded text-emerald-400 text-xs font-bold">
                          Lv.{player.level}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{player.xp} XP</p>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8">
                      Håndter
                    </Button>
                  </Card>
                ))}

                {players.length > 10 && (
                  <p className="text-center text-sm text-gray-400 py-2">
                    +{players.length - 10} flere
                  </p>
                )}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Ingen spillere endnu</p>
                <Button
                  onClick={() => {
                    setInviteType('player')
                    setInviteModalOpen(true)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Inviter første spiller
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Invite Modal */}
        <InviteModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          type={inviteType}
        />
      </div>
    </AppLayout>
  )
}
