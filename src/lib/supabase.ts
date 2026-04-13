import { createClient } from '@supabase/supabase-js'
import { Player, UserRole, Club, TennisSession, SessionAttendance, Evaluation, PlayerSkills } from '@/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ===== Auth Functions =====

export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) throw new Error(error.message || 'Sign up failed')
  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw new Error(error.message || 'Sign in failed')
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message || 'Sign out failed')
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error) throw new Error(error.message || 'Failed to get user')
  return data.user
}

// ===== Profile Functions =====

export async function getProfile(userId: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    throw new Error(error.message || 'Failed to fetch profile')
  }
  return data
}

export async function createProfile(userId: string, fullName: string, clubId?: string): Promise<Player> {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      full_name: fullName,
      club_id: clubId || null,
      xp: 0,
      level: 1,
      ace_coins: 0,
    })
    .select()
    .single()

  if (error) throw new Error(error.message || 'Failed to create profile')
  return data
}

export async function updateProfile(userId: string, updates: Partial<Player>): Promise<Player> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw new Error(error.message || 'Failed to update profile')
  return data
}

// ===== Club Functions =====

export async function createClub(name: string, adminId: string, logoUrl?: string): Promise<Club> {
  const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase()

  const { data, error } = await supabase
    .from('clubs')
    .insert({
      name,
      invite_code: inviteCode,
      logo_url: logoUrl || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message || 'Failed to create club')

  // Update admin profile with club_id
  await updateProfile(adminId, { club_id: data.id })

  // Assign admin role to creator
  await supabase
    .from('user_roles')
    .insert({
      user_id: adminId,
      role: 'admin',
      club_id: data.id,
    })

  return data
}

export async function getClub(clubId: string): Promise<Club> {
  const { data, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('id', clubId)
    .single()

  if (error) throw new Error(error.message || 'Failed to fetch club')
  return data
}

export async function joinClub(inviteCode: string, userId: string, role: 'coach' | 'player' = 'player'): Promise<Club> {
  // Validate invite code
  const { data: club, error: clubError } = await supabase
    .from('clubs')
    .select('*')
    .eq('invite_code', inviteCode)
    .single()

  if (clubError || !club) throw new Error('Invalid invite code')

  // Update user profile
  await updateProfile(userId, { club_id: club.id })

  // Assign role
  await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role,
      club_id: club.id,
    })
    .select()

  return club
}

// ===== Role Functions =====

export async function hasRole(userId: string, role: string, clubId?: string): Promise<boolean> {
  let query = supabase
    .from('user_roles')
    .select('id')
    .eq('user_id', userId)
    .eq('role', role)

  if (clubId) {
    query = query.eq('club_id', clubId)
  }

  const { data, error } = await query.single()
  if (error) return false
  return !!data
}

export async function getClubMembers(clubId: string, role?: string): Promise<(Player & { roles?: UserRole[] })[]> {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      user_roles!inner(*)
    `)
    .eq('club_id', clubId)

  if (role) {
    query = query.eq('user_roles.role', role)
  }

  const { data, error } = await query

  if (error) throw new Error(error.message || 'Failed to fetch club members')
  return data || []
}

export async function getClubCoaches(clubId: string): Promise<Player[]> {
  return getClubMembers(clubId, 'coach')
}

export async function getClubPlayers(clubId: string): Promise<Player[]> {
  return getClubMembers(clubId, 'player')
}

// ===== Invitation Functions =====

export async function inviteMember(
  email: string,
  role: 'coach' | 'player',
  clubId: string,
  invitedBy: string
): Promise<{ token: string; clubId: string }> {
  const { data, error } = await supabase
    .from('club_invitations')
    .insert({
      email,
      role,
      club_id: clubId,
      invited_by: invitedBy,
    })
    .select('id, token')
    .single()

  if (error) throw new Error(error.message || 'Failed to create invitation')

  return { token: data.token, clubId }
}

// ===== Session Functions =====

export async function createSession(sessionData: {
  title: string
  date: string
  coachId: string
  clubId: string
  trainingGroupId?: string
  notes?: string
}): Promise<TennisSession> {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      title: sessionData.title,
      date: sessionData.date,
      coach_id: sessionData.coachId,
      club_id: sessionData.clubId,
      training_group_id: sessionData.trainingGroupId || null,
      notes: sessionData.notes || null,
    })
    .select()
    .single()

  if (error) throw new Error(error.message || 'Failed to create session')
  return data
}

export async function getSessions(
  clubId: string,
  coachId?: string,
  filters?: { startDate?: string; endDate?: string }
): Promise<TennisSession[]> {
  let query = supabase
    .from('sessions')
    .select('*')
    .eq('club_id', clubId)

  if (coachId) {
    query = query.eq('coach_id', coachId)
  }

  if (filters?.startDate) {
    query = query.gte('date', filters.startDate)
  }

  if (filters?.endDate) {
    query = query.lte('date', filters.endDate)
  }

  const { data, error } = await query.order('date', { ascending: false })

  if (error) throw new Error(error.message || 'Failed to fetch sessions')
  return data || []
}

export async function getSession(sessionId: string): Promise<TennisSession> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) throw new Error(error.message || 'Failed to fetch session')
  return data
}

// ===== Attendance Functions =====

export async function markAttendance(
  sessionId: string,
  playerId: string,
  status: 'present' | 'absent' | 'late' | 'excused',
  markedBy: string
): Promise<SessionAttendance> {
  const { data: existing } = await supabase
    .from('session_attendance')
    .select('id')
    .eq('session_id', sessionId)
    .eq('player_id', playerId)
    .single()

  let result
  if (existing) {
    // Update existing
    result = await supabase
      .from('session_attendance')
      .update({
        status,
        marked_by: markedBy,
        marked_at: new Date().toISOString(),
      })
      .eq('session_id', sessionId)
      .eq('player_id', playerId)
      .select()
      .single()
  } else {
    // Create new
    result = await supabase
      .from('session_attendance')
      .insert({
        session_id: sessionId,
        player_id: playerId,
        status,
        marked_by: markedBy,
        marked_at: new Date().toISOString(),
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message || 'Failed to mark attendance')
  return result.data
}

export async function getSessionAttendance(sessionId: string): Promise<SessionAttendance[]> {
  const { data, error } = await supabase
    .from('session_attendance')
    .select('*')
    .eq('session_id', sessionId)

  if (error) throw new Error(error.message || 'Failed to fetch attendance')
  return data || []
}

// ===== Evaluation Functions =====

export async function saveEvaluation(
  sessionId: string,
  playerId: string,
  coachId: string,
  mde: { motivation: number; development: number; engagement: number },
  notes?: string
): Promise<Evaluation> {
  const { data: existing } = await supabase
    .from('evaluations')
    .select('id')
    .eq('session_id', sessionId)
    .eq('player_id', playerId)
    .single()

  let result
  if (existing) {
    // Update
    result = await supabase
      .from('evaluations')
      .update({
        motivation: mde.motivation,
        development: mde.development,
        engagement: mde.engagement,
        notes: notes || null,
      })
      .eq('session_id', sessionId)
      .eq('player_id', playerId)
      .select()
      .single()
  } else {
    // Create
    result = await supabase
      .from('evaluations')
      .insert({
        session_id: sessionId,
        player_id: playerId,
        coach_id: coachId,
        motivation: mde.motivation,
        development: mde.development,
        engagement: mde.engagement,
        notes: notes || null,
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message || 'Failed to save evaluation')
  return result.data
}

export async function getEvaluations(sessionId: string): Promise<Evaluation[]> {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('session_id', sessionId)

  if (error) throw new Error(error.message || 'Failed to fetch evaluations')
  return data || []
}

export async function getPlayerEvaluations(playerId: string, limit: number = 10): Promise<Evaluation[]> {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message || 'Failed to fetch player evaluations')
  return data || []
}

// ===== Skills Functions =====

export async function savePlayerSkills(
  playerId: string,
  coachId: string,
  skills: {
    forehand: number
    backhand: number
    serve: number
    volley: number
    footwork: number
    fitness: number
  }
): Promise<PlayerSkills> {
  const { data: existing } = await supabase
    .from('player_skills')
    .select('id')
    .eq('player_id', playerId)
    .order('assessed_at', { ascending: false })
    .limit(1)
    .single()

  let result
  if (existing) {
    // Create new assessment (don't update, keep history)
    result = await supabase
      .from('player_skills')
      .insert({
        player_id: playerId,
        coach_id: coachId,
        ...skills,
        assessed_at: new Date().toISOString(),
      })
      .select()
      .single()
  } else {
    result = await supabase
      .from('player_skills')
      .insert({
        player_id: playerId,
        coach_id: coachId,
        ...skills,
        assessed_at: new Date().toISOString(),
      })
      .select()
      .single()
  }

  if (result.error) throw new Error(result.error.message || 'Failed to save skills')
  return result.data
}

export async function getPlayerSkills(playerId: string): Promise<PlayerSkills | null> {
  const { data, error } = await supabase
    .from('player_skills')
    .select('*')
    .eq('player_id', playerId)
    .order('assessed_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw new Error(error.message || 'Failed to fetch skills')
  }
  return data
}

// ===== Stats Functions =====

export async function getPlayerStats(playerId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('xp, level, ace_coins')
    .eq('id', playerId)
    .single()

  if (error) throw new Error(error.message || 'Failed to fetch player stats')
  return data
}

// ===== Leaderboard Functions =====

export async function getLeaderboard(clubId: string, period: 'weekly' | 'monthly' | 'alltime' = 'alltime'): Promise<(Player & { rank: number; xp_earned: number })[]> {
  const { data, error } = await supabase
    .from('leaderboard_entries')
    .select(`
      *,
      profiles(*)
    `)
    .eq('club_id', clubId)
    .eq('period_type', period)
    .order('rank', { ascending: true })

  if (error) throw new Error(error.message || 'Failed to fetch leaderboard')

  return (data || []).map((entry: any) => ({
    ...entry.profiles,
    rank: entry.rank,
    xp_earned: entry.xp_earned,
  }))
}

// ===== Challenges Functions =====

export async function getChallenges(clubId?: string) {
  let query = supabase
    .from('challenges')
    .select('*')
    .eq('active', true)

  const { data, error } = await query

  if (error) throw new Error(error.message || 'Failed to fetch challenges')
  return data || []
}

// ===== Pro Shop Functions =====

export async function getProShopItems() {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('active', true)

  if (error) throw new Error(error.message || 'Failed to fetch shop items')
  return data || []
}

export async function purchaseItem(playerId: string, itemId: string): Promise<void> {
  const { error } = await supabase
    .from('player_inventory')
    .insert({
      player_id: playerId,
      item_id: itemId,
      purchased_at: new Date().toISOString(),
    })

  if (error) throw new Error(error.message || 'Failed to purchase item')
}
