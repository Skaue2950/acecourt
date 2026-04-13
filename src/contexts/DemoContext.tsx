import React, { createContext, useContext, useState } from 'react'
import { Player, Coach, Badge, Challenge, TennisSession, SessionAttendance, Evaluation, PlayerSkills, LeaderboardEntry, ProShopItem } from '@/types'

export type DemoRole = 'player' | 'coach' | 'admin'

interface DemoContextType {
  currentRole: DemoRole
  setCurrentRole: (role: DemoRole) => void
  currentPlayer: Player
  currentCoach: Coach
  currentAdmin: Player
  players: Player[]
  sessions: TennisSession[]
  attendance: SessionAttendance[]
  evaluations: Evaluation[]
  skills: PlayerSkills[]
  badges: Badge[]
  challenges: Challenge[]
  leaderboard: LeaderboardEntry[]
  proShopItems: ProShopItem[]
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

// Mock data
const mockPlayers: Player[] = [
  {
    id: '1',
    full_name: 'Magnus Sørensen',
    xp: 14520,
    level: 12,
    ace_coins: 2450,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Magnus',
    created_at: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    full_name: 'Emma Christiansen',
    xp: 7200,
    level: 8,
    ace_coins: 1200,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    created_at: '2024-02-20T00:00:00Z',
  },
  {
    id: '3',
    full_name: 'Oliver Nielsen',
    xp: 22000,
    level: 15,
    ace_coins: 3500,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    created_at: '2023-11-05T00:00:00Z',
  },
  {
    id: '4',
    full_name: 'Sofie Andersen',
    xp: 4800,
    level: 6,
    ace_coins: 800,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofie',
    created_at: '2024-03-10T00:00:00Z',
  },
  {
    id: '5',
    full_name: 'Lucas Hansen',
    xp: 10500,
    level: 10,
    ace_coins: 1800,
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    created_at: '2024-01-25T00:00:00Z',
  },
]

const mockCoach: Coach = {
  id: 'coach-1',
  full_name: 'Thomas Vestergaard',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
  created_at: '2023-06-01T00:00:00Z',
}

const mockAdmin: Player = {
  id: 'admin-1',
  full_name: 'Mette Jakobsen',
  xp: 0,
  level: 0,
  ace_coins: 0,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mette',
  created_at: '2023-05-01T00:00:00Z',
}

const mockSessions: TennisSession[] = [
  {
    id: 'session-1',
    title: 'Forehand Training',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    coach_id: 'coach-1',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'session-2',
    title: 'Volley Drills',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    coach_id: 'coach-1',
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'session-3',
    title: 'Match Play',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    coach_id: 'coach-1',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'session-4',
    title: 'Fitness & Footwork',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    coach_id: 'coach-1',
    created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'session-5',
    title: 'Serve Technique',
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    coach_id: 'coach-1',
    created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const mockAttendance: SessionAttendance[] = [
  { id: '1', session_id: 'session-1', player_id: '1', status: 'present', marked_at: mockSessions[0].date },
  { id: '2', session_id: 'session-1', player_id: '2', status: 'present', marked_at: mockSessions[0].date },
  { id: '3', session_id: 'session-1', player_id: '3', status: 'late', marked_at: mockSessions[0].date },
  { id: '4', session_id: 'session-1', player_id: '4', status: 'absent', marked_at: mockSessions[0].date },
  { id: '5', session_id: 'session-1', player_id: '5', status: 'present', marked_at: mockSessions[0].date },
  { id: '6', session_id: 'session-2', player_id: '1', status: 'present', marked_at: mockSessions[1].date },
  { id: '7', session_id: 'session-2', player_id: '2', status: 'absent', marked_at: mockSessions[1].date },
  { id: '8', session_id: 'session-2', player_id: '3', status: 'present', marked_at: mockSessions[1].date },
  { id: '9', session_id: 'session-2', player_id: '4', status: 'present', marked_at: mockSessions[1].date },
  { id: '10', session_id: 'session-2', player_id: '5', status: 'excused', marked_at: mockSessions[1].date },
]

const mockEvaluations: Evaluation[] = [
  {
    id: '1',
    session_id: 'session-1',
    player_id: '1',
    coach_id: 'coach-1',
    motivation: 5,
    development: 4,
    engagement: 5,
    notes: 'Excellent focus today',
    created_at: mockSessions[0].date,
  },
  {
    id: '2',
    session_id: 'session-1',
    player_id: '2',
    coach_id: 'coach-1',
    motivation: 3,
    development: 3,
    engagement: 2,
    notes: 'Needs more focus on technique',
    created_at: mockSessions[0].date,
  },
  {
    id: '3',
    session_id: 'session-1',
    player_id: '3',
    coach_id: 'coach-1',
    motivation: 5,
    development: 5,
    engagement: 5,
    notes: 'Outstanding performance',
    created_at: mockSessions[0].date,
  },
]

const mockSkills: PlayerSkills[] = [
  {
    id: '1',
    player_id: '1',
    coach_id: 'coach-1',
    forehand: 8,
    backhand: 7,
    serve: 9,
    volley: 7,
    footwork: 8,
    fitness: 9,
    assessed_at: new Date().toISOString(),
  },
  {
    id: '2',
    player_id: '2',
    coach_id: 'coach-1',
    forehand: 5,
    backhand: 5,
    serve: 6,
    volley: 4,
    footwork: 5,
    fitness: 6,
    assessed_at: new Date().toISOString(),
  },
  {
    id: '3',
    player_id: '3',
    coach_id: 'coach-1',
    forehand: 10,
    backhand: 9,
    serve: 10,
    volley: 9,
    footwork: 10,
    fitness: 10,
    assessed_at: new Date().toISOString(),
  },
  {
    id: '4',
    player_id: '4',
    coach_id: 'coach-1',
    forehand: 4,
    backhand: 4,
    serve: 5,
    volley: 3,
    footwork: 4,
    fitness: 5,
    assessed_at: new Date().toISOString(),
  },
  {
    id: '5',
    player_id: '5',
    coach_id: 'coach-1',
    forehand: 7,
    backhand: 6,
    serve: 8,
    volley: 6,
    footwork: 7,
    fitness: 8,
    assessed_at: new Date().toISOString(),
  },
]

const mockBadges: Badge[] = [
  {
    id: '1',
    name: 'First Session',
    description: 'Attended your first training session',
    icon: 'Trophy',
    color: 'emerald',
    rarity: 'common',
  },
  {
    id: '2',
    name: '10-Day Streak',
    description: 'Maintained a 10-day training streak',
    icon: 'Flame',
    color: 'orange',
    rarity: 'rare',
  },
  {
    id: '3',
    name: 'MDE Master',
    description: 'Achieved outstanding MDE scores',
    icon: 'Star',
    color: 'yellow',
    rarity: 'epic',
  },
  {
    id: '4',
    name: 'Ace Serve',
    description: 'Reached level 10 serve skill',
    icon: 'Zap',
    color: 'blue',
    rarity: 'rare',
  },
  {
    id: '5',
    name: 'Club Champion',
    description: 'Top of the leaderboard',
    icon: 'Crown',
    color: 'gold',
    rarity: 'legendary',
  },
]

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Daily Forehand',
    description: 'Hit 50 forehands in practice',
    type: 'daily',
    category: 'skill',
    target_value: 50,
    xp_reward: 100,
    coin_reward: 20,
    icon: 'Target',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Weekly Attendance',
    description: 'Attend 3 sessions this week',
    type: 'weekly',
    category: 'attendance',
    target_value: 3,
    xp_reward: 250,
    coin_reward: 50,
    icon: 'Calendar',
    active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Monthly Master',
    description: 'Reach level 15',
    type: 'monthly',
    category: 'skill',
    target_value: 15,
    xp_reward: 1000,
    coin_reward: 200,
    icon: 'Medal',
    active: true,
    created_at: new Date().toISOString(),
  },
]

const mockLeaderboard: LeaderboardEntry[] = [
  { id: '1', player_id: '3', period_type: 'alltime', xp_earned: 22000, rank: 1, updated_at: new Date().toISOString() },
  { id: '2', player_id: '1', period_type: 'alltime', xp_earned: 14520, rank: 2, updated_at: new Date().toISOString() },
  { id: '3', player_id: '5', period_type: 'alltime', xp_earned: 10500, rank: 3, updated_at: new Date().toISOString() },
  { id: '4', player_id: '2', period_type: 'alltime', xp_earned: 7200, rank: 4, updated_at: new Date().toISOString() },
  { id: '5', player_id: '4', period_type: 'alltime', xp_earned: 4800, rank: 5, updated_at: new Date().toISOString() },
]

const mockProShopItems: ProShopItem[] = [
  {
    id: '1',
    name: 'Pro Tennis Racket',
    description: 'High-performance carbon fiber racket',
    category: 'equipment',
    price: 500,
    icon: 'Racket',
    rarity: 'legendary',
    active: true,
  },
  {
    id: '2',
    name: 'Performance Grip',
    description: 'Enhanced grip tape for better control',
    category: 'accessories',
    price: 50,
    icon: 'Hand',
    rarity: 'common',
    active: true,
  },
  {
    id: '3',
    name: 'Premium Tennis Shoes',
    description: 'Professional-grade tennis shoes',
    category: 'equipment',
    price: 300,
    icon: 'Shoe',
    rarity: 'epic',
    active: true,
  },
  {
    id: '4',
    name: 'Golden Ace Avatar',
    description: 'Exclusive golden avatar border',
    category: 'cosmetics',
    price: 100,
    icon: 'Sparkles',
    rarity: 'epic',
    active: true,
  },
  {
    id: '5',
    name: 'Tennis Balls (12-pack)',
    description: 'Official tournament balls',
    category: 'equipment',
    price: 80,
    icon: 'Circle',
    rarity: 'common',
    active: true,
  },
]

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<DemoRole>('player')

  return (
    <DemoContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentPlayer: mockPlayers[0],
        currentCoach: mockCoach,
        currentAdmin: mockAdmin,
        players: mockPlayers,
        sessions: mockSessions,
        attendance: mockAttendance,
        evaluations: mockEvaluations,
        skills: mockSkills,
        badges: mockBadges,
        challenges: mockChallenges,
        leaderboard: mockLeaderboard,
        proShopItems: mockProShopItems,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}
