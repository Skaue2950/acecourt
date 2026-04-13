import React from 'react'
import { useDemo } from '@/contexts/DemoContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { XPProgressBar } from '@/components/player/XPProgressBar'
import { SkillRadarChart } from '@/components/player/SkillRadarChart'
import { BadgeCollection } from '@/components/player/BadgeCollection'
import { StreakDisplay } from '@/components/player/StreakDisplay'
import { ChallengeCard } from '@/components/player/ChallengeCard'
import { LeaderboardTable } from '@/components/player/LeaderboardTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Zap, Award, Medal } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function DemoPlayerDashboard() {
  const t = useTranslation()
  const { currentPlayer, skills, badges, challenges, leaderboard, players } = useDemo()
  const playerSkills = skills[0]

  const playerNameMap = players.reduce(
    (acc, p) => {
      acc[p.id] = p.full_name
      return acc
    },
    {} as Record<string, string>
  )

  return (
    <div className="space-y-8">
      {/* Player Header */}
      <Card className="border-ace-border bg-gradient-to-r from-emerald-500/10 to-ace-card">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentPlayer.avatar_url} alt={currentPlayer.full_name} />
              <AvatarFallback>{currentPlayer.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-100">{currentPlayer.full_name}</h1>
                <Badge className="bg-emerald-500/20 text-emerald-300">Level {currentPlayer.level}</Badge>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Zap className="h-4 w-4 text-emerald-400" />
                    XP
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-100">
                    {currentPlayer.xp.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Medal className="h-4 w-4 text-yellow-400" />
                    Ace Coins
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-100">{currentPlayer.ace_coins}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Award className="h-4 w-4 text-purple-400" />
                    Badges
                  </div>
                  <div className="mt-1 text-2xl font-bold text-gray-100">{badges.length}</div>
                </div>
              </div>

              <div className="mt-4">
                <XPProgressBar currentXp={currentPlayer.xp} currentLevel={currentPlayer.level} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <StreakDisplay currentStreak={7} longestStreak={21} multiplier={1.25} />

      {/* Skills */}
      <Card className="border-ace-border bg-ace-card">
        <CardHeader>
          <CardTitle>{t('player.skillProgress')}</CardTitle>
        </CardHeader>
        <CardContent>
          {playerSkills && <SkillRadarChart skills={playerSkills} />}
        </CardContent>
      </Card>

      {/* Challenges */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-100">{t('nav.challenges')}</h2>
        <div className="space-y-4">
          {challenges.slice(0, 3).map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

      {/* Badges */}
      <BadgeCollection badges={badges} />

      {/* Leaderboard */}
      <LeaderboardTable
        entries={leaderboard}
        playerNames={playerNameMap}
        currentPlayerRank={leaderboard.find((e) => e.player_id === currentPlayer.id)?.rank}
      />
    </div>
  )
}
