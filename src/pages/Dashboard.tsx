import React from 'react'
import { Link } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useSessions } from '@/hooks/useSessions'
import { usePlayerStats } from '@/hooks/usePlayerStats'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useTranslation } from '@/lib/i18n'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Trophy,
  Calendar,
  Users,
  Flame,
  ChevronRight,
  Target,
  TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dashboard() {
  const t = useTranslation()
  const { user, profile, club, hasRole } = useAuth()
  const { data: sessions, isLoading: sessionsLoading } = useSessions(club?.id)
  const { data: stats } = usePlayerStats(user?.id)
  const { data: leaderboard } = useLeaderboard(club?.id, 'alltime')

  const isCoach = hasRole('coach')
  const isAdmin = hasRole('admin')

  const now = new Date()
  const upcomingSessions = sessions?.filter((s) => new Date(s.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []
  const pastSessions = sessions?.filter((s) => new Date(s.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []

  const getLevelGradient = (level: number) => {
    if (level < 5) return 'from-blue-600 to-blue-700'
    if (level < 10) return 'from-green-600 to-emerald-700'
    if (level < 15) return 'from-purple-600 to-pink-700'
    return 'from-yellow-500 to-orange-600'
  }

  return (
    <AppLayout className="p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        {/* Hero Greeting Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-800/50 to-gray-900 p-6 mb-8 border border-emerald-800/30">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/10 -translate-y-8 translate-x-8" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-emerald-500/5 translate-y-6 -translate-x-6" />

          <div className="relative">
            <p className="text-emerald-400 text-sm font-medium mb-1 uppercase tracking-wider">
              Velkommen tilbage
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-4">{profile?.full_name}</h1>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                'px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold'
              )}>
                Level {profile?.level}
              </span>
              <span className="text-gray-400 text-sm">{club?.name}</span>
            </div>
          </div>
        </div>

        {/* Player Dashboard */}
        {!isCoach && (
          <div className="space-y-6">
            {/* Stats Grid - 2x2 on mobile, 4 across on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Level Card */}
              <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-800/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-1">
                      Level
                    </p>
                    <p className="text-3xl sm:text-4xl font-black text-white">{profile?.level}</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                    <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-blue-400" />
                  </div>
                </div>
              </Card>

              {/* XP Card */}
              <Card className="bg-gradient-to-br from-yellow-900/40 to-gray-900 border-yellow-800/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-yellow-400 uppercase tracking-wider font-medium mb-1">
                      XP
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white truncate">{profile?.xp}</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-yellow-400" />
                  </div>
                </div>
              </Card>

              {/* AceCoins Card */}
              <Card className="bg-gradient-to-br from-amber-900/40 to-gray-900 border-amber-800/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-amber-400 uppercase tracking-wider font-medium mb-1">
                      Coins
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white truncate">{profile?.ace_coins}</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xl sm:text-2xl">🪙</span>
                  </div>
                </div>
              </Card>

              {/* Streak Card */}
              <Card className="bg-gradient-to-br from-orange-900/40 to-gray-900 border-orange-800/30 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-orange-400 uppercase tracking-wider font-medium mb-1">
                      Streak
                    </p>
                    <p className="text-2xl sm:text-3xl font-black text-white">0</p>
                  </div>
                  <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Flame className="h-6 w-6 sm:h-7 sm:w-7 text-orange-400" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Kommende sessioner</h2>
                <Button variant="ghost" size="sm" className="text-emerald-400 -mr-2 h-auto p-1">
                  <Link to="/sessions" className="flex items-center gap-1">
                    Se alle <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {sessionsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <Card
                      key={session.id}
                      className="flex items-center justify-between p-4 cursor-pointer hover:border-emerald-800 transition-colors active:scale-98"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{session.title}</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                          {new Date(session.date).toLocaleString('da-DK', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Calendar className="h-5 w-5 text-emerald-500 shrink-0 ml-2" />
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-gray-400">Ingen kommende sessioner</p>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link to="/challenges">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12">
                  <Target className="h-4 w-4 mr-2" />
                  Udfordringer
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12">
                  <Trophy className="h-4 w-4 mr-2" />
                  Rangliste
                </Button>
              </Link>
            </div>

            {/* Leaderboard Preview */}
            {leaderboard && leaderboard.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-white">Top spillere</h2>
                  <Button variant="ghost" size="sm" className="text-emerald-400 -mr-2 h-auto p-1">
                    <Link to="/leaderboard" className="flex items-center gap-1">
                      Se alle <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <Card className="p-4">
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((entry, idx) => (
                      <div
                        key={entry.id}
                        className={cn(
                          'flex items-center justify-between py-2 px-2 rounded-lg',
                          idx === 0 && 'bg-yellow-900/20 border border-yellow-800/30',
                          idx === 1 && 'bg-gray-800/30 border border-gray-700/30',
                          idx === 2 && 'bg-orange-900/20 border border-orange-800/30'
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm font-bold text-gray-400 w-6">{entry.rank}</span>
                          <span className="text-sm font-medium text-white truncate">
                            {entry.full_name}
                          </span>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-emerald-400 shrink-0 ml-2">
                          {entry.xp_earned}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Coach Dashboard */}
        {isCoach && (
          <div className="space-y-6">
            {/* Today's Sessions Card */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-white">Dagens sessioner</h2>
                <Button variant="ghost" size="sm" className="text-emerald-400 -mr-2 h-auto p-1">
                  <Link to="/sessions" className="flex items-center gap-1">
                    Se alle <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {sessionsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : upcomingSessions.length > 0 ? (
                <div className="space-y-3">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 cursor-pointer hover:border-emerald-800 transition-colors active:scale-98"
                    >
                      <p className="font-semibold text-white">{session.title}</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(session.date).toLocaleString('da-DK', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-gray-400">Ingen sessioner i dag</p>
                </Card>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-800/30 p-4 sm:p-5">
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-2">
                  Denne uge
                </p>
                <p className="text-3xl font-black text-white">
                  {upcomingSessions.filter((s) => {
                    const date = new Date(s.date)
                    const daysFromNow = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    return daysFromNow <= 7
                  }).length}
                </p>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-800/30 p-4 sm:p-5">
                <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-2">
                  Afholdt
                </p>
                <p className="text-3xl font-black text-white">{pastSessions.length}</p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-800/30 p-4 sm:p-5">
                <p className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-2">
                  Kommende
                </p>
                <p className="text-3xl font-black text-white">{upcomingSessions.length}</p>
              </Card>
            </div>

            {/* Coach Actions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link to="/sessions">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12">
                  <Calendar className="h-4 w-4 mr-2" />
                  Sessioner
                </Button>
              </Link>
              <Link to="/players">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12">
                  <Users className="h-4 w-4 mr-2" />
                  Spillere
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {isAdmin && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card className="bg-gradient-to-br from-emerald-900/40 to-gray-900 border-emerald-800/30 p-4 sm:p-5">
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-medium mb-2">
                  Spillere
                </p>
                <p className="text-3xl font-black text-white">0</p>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/40 to-gray-900 border-blue-800/30 p-4 sm:p-5">
                <p className="text-xs text-blue-400 uppercase tracking-wider font-medium mb-2">
                  Træner
                </p>
                <p className="text-3xl font-black text-white">0</p>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-900/40 to-gray-900 border-yellow-800/30 p-4 sm:p-5">
                <p className="text-xs text-yellow-400 uppercase tracking-wider font-medium mb-2">
                  Sessioner
                </p>
                <p className="text-3xl font-black text-white">{sessions?.length || 0}</p>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/40 to-gray-900 border-purple-800/30 p-4 sm:p-5">
                <p className="text-xs text-purple-400 uppercase tracking-wider font-medium mb-2">
                  Niveau
                </p>
                <p className="text-3xl font-black text-white">{club?.name ? 'Aktiv' : '-'}</p>
              </Card>
            </div>

            <Link to="/admin">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-500 h-12 text-base">
                <TrendingUp className="h-4 w-4 mr-2" />
                Gå til Administration
              </Button>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
