import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { usePlayer } from '@/hooks/usePlayers'
import { useUpdateSkills } from '@/hooks/usePlayerStats'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Trophy, Zap, Coins } from 'lucide-react'

interface PlayerProfileModalProps {
  playerId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerProfileModal({ playerId, open, onOpenChange }: PlayerProfileModalProps) {
  const { user, hasRole } = useAuth()
  const { data: player, isLoading } = usePlayer(playerId)
  const updateSkills = useUpdateSkills(playerId)
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [skillValues, setSkillValues] = useState<Record<string, number>>({})

  if (!player && !isLoading) return null

  const isCoach = hasRole('coach')
  const canEditSkills = isCoach && user?.id !== playerId

  const handleStartEditSkills = () => {
    if (player?.skills) {
      setSkillValues({
        forehand: player.skills.forehand,
        backhand: player.skills.backhand,
        serve: player.skills.serve,
        volley: player.skills.volley,
        footwork: player.skills.footwork,
        fitness: player.skills.fitness,
      })
    }
    setIsEditingSkills(true)
  }

  const handleSaveSkills = () => {
    if (!user) return
    updateSkills.mutate(
      {
        coachId: user.id,
        skills: skillValues as any,
      },
      {
        onSuccess: () => {
          setIsEditingSkills(false)
        },
      }
    )
  }

  const skillLabels = {
    forehand: 'Forhand',
    backhand: 'Baghånd',
    serve: 'Serv',
    volley: 'Volley',
    footwork: 'Fodarbejde',
    fitness: 'Kondition',
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-emerald-500/20 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Spillerprofil</DialogTitle>
          <DialogDescription>Detaljeret profil og statistikker</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : player ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="overview" className="flex-1">
                Oversigt
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex-1">
                Færdigheder
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex-1">
                Evalueringer
              </TabsTrigger>
              {player.badges && player.badges.length > 0 && (
                <TabsTrigger value="badges" className="flex-1">
                  Badges
                </TabsTrigger>
              )}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-slate-800 border-slate-700 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{player.full_name}</h3>
                    <p className="text-slate-400">Level {player.level}</p>
                  </div>
                  {player.avatar_url && (
                    <img
                      src={player.avatar_url}
                      alt={player.full_name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-slate-400 text-sm">XP</span>
                    </div>
                    <p className="text-white font-bold">{player.xp}</p>
                  </div>

                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-slate-400 text-sm">AceCoins</span>
                    </div>
                    <p className="text-white font-bold">{player.ace_coins}</p>
                  </div>

                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-400 text-sm">Streak</span>
                    </div>
                    <p className="text-white font-bold">{player.current_streak || 0}</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Skills */}
            <TabsContent value="skills" className="space-y-4">
              {isEditingSkills ? (
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <h4 className="text-white font-bold mb-4">Rediger færdigheder</h4>
                  <div className="space-y-3 mb-4">
                    {Object.entries(skillLabels).map(([key, label]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm text-slate-300">{label}</label>
                          <span className="text-white font-mono">{skillValues[key] || 5}</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={skillValues[key] || 5}
                          onChange={(e) =>
                            setSkillValues({
                              ...skillValues,
                              [key]: parseInt(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingSkills(false)}
                      className="flex-1 border-slate-600"
                    >
                      Annuller
                    </Button>
                    <Button
                      onClick={handleSaveSkills}
                      disabled={updateSkills.isPending}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    >
                      Gem
                    </Button>
                  </div>
                </Card>
              ) : player.skills ? (
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-white font-bold">Nuværende færdigheder</h4>
                    {canEditSkills && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleStartEditSkills}
                        className="border-emerald-500/30 text-emerald-400"
                      >
                        Rediger
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {Object.entries(skillLabels).map(([key, label]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-300 text-sm">{label}</span>
                          <span className="text-white font-bold">
                            {(player.skills as any)?.[key] || 0}/10
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${((player.skills as any)?.[key] || 0) * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-slate-400 text-xs mt-4">
                    Vurderet {new Date(player.skills.assessed_at).toLocaleDateString('da-DK')}
                  </p>
                </Card>
              ) : (
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <p className="text-slate-400">Ingen færdighedsvurderinger endnu</p>
                  {canEditSkills && (
                    <Button
                      onClick={handleStartEditSkills}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Vurder færdigheder
                    </Button>
                  )}
                </Card>
              )}
            </TabsContent>

            {/* Evaluations */}
            <TabsContent value="evaluations" className="space-y-3">
              {player.recent_evaluations && player.recent_evaluations.length > 0 ? (
                player.recent_evaluations.map((ev) => (
                  <Card key={ev.id} className="bg-slate-800 border-slate-700 p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium">MDE Evaluering</p>
                        <p className="text-slate-400 text-sm">
                          {new Date(ev.created_at).toLocaleDateString('da-DK')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-slate-700 p-2 rounded">
                        <p className="text-slate-400 text-xs">Motivation</p>
                        <p className="text-white font-bold">{ev.motivation}</p>
                      </div>
                      <div className="bg-slate-700 p-2 rounded">
                        <p className="text-slate-400 text-xs">Udvikling</p>
                        <p className="text-white font-bold">{ev.development}</p>
                      </div>
                      <div className="bg-slate-700 p-2 rounded">
                        <p className="text-slate-400 text-xs">Engagement</p>
                        <p className="text-white font-bold">{ev.engagement}</p>
                      </div>
                    </div>

                    {ev.notes && <p className="text-slate-400 text-sm">{ev.notes}</p>}
                  </Card>
                ))
              ) : (
                <Card className="bg-slate-800 border-slate-700 p-4">
                  <p className="text-slate-400">Ingen evalueringer endnu</p>
                </Card>
              )}
            </TabsContent>

            {/* Badges */}
            {player.badges && player.badges.length > 0 && (
              <TabsContent value="badges" className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {player.badges.map((badge) => (
                    <Card key={badge.id} className="bg-slate-800 border-slate-700 p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <p className="text-white font-bold text-sm">{badge.name}</p>
                        <p className="text-slate-400 text-xs mt-1">{badge.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
