export interface Player {
  id: string
  full_name: string
  avatar_url?: string
  xp: number
  level: number
  ace_coins: number
  club_id?: string
  birth_year?: number
  created_at: string
}

export interface Coach {
  id: string
  full_name: string
  avatar_url?: string
  club_id?: string
  created_at: string
}

export interface Admin {
  id: string
  full_name: string
  avatar_url?: string
  club_id?: string
}

export interface Club {
  id: string
  name: string
  invite_code: string
  logo_url?: string
  created_at: string
}

export interface ClubInvitation {
  id: string
  club_id: string
  email: string
  role: 'coach' | 'player'
  invited_by: string
  token: string
  accepted_at?: string
  expires_at: string
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'coach' | 'player'
  club_id?: string
}

export interface TennisSession {
  id: string
  title: string
  date: string
  coach_id: string
  club_id?: string
  training_group_id?: string
  notes?: string
  created_at: string
}

export interface SessionWithDetails extends TennisSession {
  attendance?: SessionAttendance[]
  evaluations?: Evaluation[]
  coach?: Player
}

export interface PlayerWithStats extends Player {
  skills?: PlayerSkills
  current_streak?: number
  badges?: Badge[]
  recent_evaluations?: Evaluation[]
}

export interface SessionAttendance {
  id: string
  session_id: string
  player_id: string
  status: 'present' | 'absent' | 'late' | 'excused'
  marked_by?: string
  marked_at: string
}

export interface Evaluation {
  id: string
  session_id: string
  player_id: string
  coach_id: string
  motivation: number
  development: number
  engagement: number
  notes?: string
  created_at: string
}

export interface PlayerSkills {
  id: string
  player_id: string
  coach_id: string
  forehand: number
  backhand: number
  serve: number
  volley: number
  footwork: number
  fitness: number
  assessed_at: string
}

export interface PlayerSkillGoals {
  id: string
  player_id: string
  coach_id: string
  forehand_target?: number
  backhand_target?: number
  serve_target?: number
  volley_target?: number
  footwork_target?: number
  fitness_target?: number
  target_date?: string
  completed_at?: string
  created_at: string
}

export interface TrainingGroup {
  id: string
  name: string
  coach_id: string
  club_id?: string
  day_of_week?: number
  start_time?: string
  end_time?: string
  max_players?: number
  created_at: string
}

export interface GroupMember {
  group_id: string
  player_id: string
}

export interface Challenge {
  id: string
  title: string
  description?: string
  type: 'daily' | 'weekly' | 'monthly' | 'special'
  category: 'attendance' | 'skill' | 'streak' | 'social'
  target_value: number
  xp_reward: number
  coin_reward: number
  icon: string
  active: boolean
  created_at: string
}

export interface PlayerChallenge {
  id: string
  player_id: string
  challenge_id: string
  current_value: number
  completed_at?: string
  expires_at?: string
}

export interface Badge {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface PlayerBadge {
  player_id: string
  badge_id: string
  earned_at: string
}

export interface PlayerStreak {
  player_id: string
  current_streak: number
  longest_streak: number
  last_activity_date?: string
  streak_multiplier: number
}

export interface LeaderboardEntry {
  id: string
  player_id: string
  club_id?: string
  period_type: 'weekly' | 'monthly' | 'alltime'
  period_start?: string
  xp_earned: number
  rank: number
  updated_at: string
}

export interface ProShopItem {
  id: string
  name: string
  description?: string
  category: 'equipment' | 'accessories' | 'cosmetics'
  price: number
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  active: boolean
}

export interface PlayerInventory {
  player_id: string
  item_id: string
  purchased_at: string
}

export interface H2HChallenge {
  id: string
  challenger_id: string
  opponent_id: string
  type: string
  stake_coins: number
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  winner_id?: string
  created_at: string
  expires_at?: string
}

export interface Message {
  id: string
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  created_at: string
}

export interface SkillRadarChartProps {
  skills: {
    forehand: number
    backhand: number
    serve: number
    volley: number
    footwork: number
    fitness: number
  }
  language?: 'da' | 'en'
  showBenchmark?: boolean
  benchmarkSkills?: {
    forehand: number
    backhand: number
    serve: number
    volley: number
    footwork: number
    fitness: number
  }
}

export interface AuthUser {
  id: string
  email: string
  user_metadata?: Record<string, unknown>
}

export interface DemoUser {
  id: string
  name: string
  role: 'player' | 'coach' | 'admin'
  level?: number
  xp?: number
  aceCoins?: number
  avatar?: string
}
