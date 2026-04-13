import React, { useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useAuth } from '@/contexts/AuthContext'
import { useSessions } from '@/hooks/useSessions'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreateSessionModal } from '@/components/coach/CreateSessionModal'
import { SessionDetailView } from '@/components/coach/SessionDetailView'
import { Plus, Calendar, Users, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sessions() {
  const t = useTranslation()
  const { club, user, hasRole } = useAuth()
  const { data: sessions, isLoading } = useSessions(club?.id)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [filterTab, setFilterTab] = useState<'kommende' | 'tidligere' | 'alle'>('kommende')

  const isCoach = hasRole('coach')

  const now = new Date()
  const upcomingSessions = sessions?.filter((s) => new Date(s.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || []
  const pastSessions = sessions?.filter((s) => new Date(s.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || []

  const displayedSessions = () => {
    switch (filterTab) {
      case 'kommende':
        return upcomingSessions
      case 'tidligere':
        return pastSessions
      case 'alle':
        return sessions || []
      default:
        return upcomingSessions
    }
  }

  if (selectedSessionId) {
    return (
      <AppLayout className="p-4 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <Button
            variant="outline"
            onClick={() => setSelectedSessionId(null)}
            className="mb-4"
          >
            Tilbage
          </Button>
          <SessionDetailView sessionId={selectedSessionId} />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout className="p-4 sm:p-6 relative">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {t('nav.sessions')}
          </h1>
          <p className="text-gray-400">
            {upcomingSessions.length} kommende | {pastSessions.length} afholdt
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {['kommende', 'tidligere', 'alle'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab as typeof filterTab)}
              className={cn(
                'px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all shrink-0',
                filterTab === tab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-gray-200'
              )}
            >
              {tab === 'kommende' && 'Kommende'}
              {tab === 'tidligere' && 'Tidligere'}
              {tab === 'alle' && 'Alle'}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : displayedSessions().length > 0 ? (
          <div className="space-y-3">
            {displayedSessions().map((session) => {
              const sessionDate = new Date(session.date)
              const isPast = sessionDate < now
              const isToday =
                sessionDate.toDateString() === now.toDateString()

              return (
                <Card
                  key={session.id}
                  onClick={() => setSelectedSessionId(session.id)}
                  className={cn(
                    'p-4 cursor-pointer transition-all active:scale-98',
                    isPast && 'opacity-75',
                    isToday && 'border-emerald-600 bg-emerald-900/10'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-white">{session.title}</h3>
                        {isPast && (
                          <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                            Afsluttet
                          </span>
                        )}
                        {isToday && (
                          <span className="text-xs px-2 py-1 bg-emerald-900 text-emerald-300 rounded-full">
                            I dag
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4 shrink-0" />
                          <span>
                            {sessionDate.toLocaleString('da-DK', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                      </div>

                      {session.title && (
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {session.title}
                        </p>
                      )}
                    </div>

                    <ChevronRight className="h-5 w-5 text-gray-600 shrink-0 mt-1" />
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Ingen sessioner</p>
            {isCoach && (
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Opret session
              </Button>
            )}
          </Card>
        )}

        {/* FAB - Floating Action Button for Coaches */}
        {isCoach && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="fixed bottom-24 md:bottom-8 right-4 z-40 h-14 w-14 rounded-full bg-emerald-600 shadow-lg shadow-emerald-900/50 flex items-center justify-center active:scale-95 transition-transform hover:bg-emerald-500"
            title="Opret session"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>
        )}

        {/* Create Session Modal */}
        {createModalOpen && (
          <CreateSessionModal
            open={createModalOpen}
            onOpenChange={() => setCreateModalOpen(false)}
          />
        )}
      </div>
    </AppLayout>
  )
}
