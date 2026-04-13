import { useQuery } from '@tanstack/react-query'
import { Club, Player, UserRole } from '@/types'
import { supabase, getClub, getClubMembers } from '@/lib/supabase'

export function useClub(clubId: string | undefined) {
  return useQuery({
    queryKey: ['club', clubId],
    queryFn: async () => {
      if (!clubId) return null
      return await getClub(clubId)
    },
    enabled: !!clubId,
  })
}

export function useClubMembers(clubId: string | undefined, role?: string) {
  return useQuery<(Player & { roles?: UserRole[] })[]>({
    queryKey: ['club-members', clubId, role],
    queryFn: async () => {
      if (!clubId) return []
      return await getClubMembers(clubId, role)
    },
    enabled: !!clubId,
  })
}

export function useClubStats(clubId: string | undefined) {
  return useQuery({
    queryKey: ['club-stats', clubId],
    queryFn: async () => {
      if (!clubId) return null

      const { data: sessions } = await supabase
        .from('sessions')
        .select('id')
        .eq('club_id', clubId)

      const { data: players } = await supabase
        .from('profiles')
        .select('id')
        .eq('club_id', clubId)

      return {
        totalPlayers: players?.length || 0,
        totalSessions: sessions?.length || 0,
        totalCoaches: 0, // Will be calculated by member query
      }
    },
    enabled: !!clubId,
  })
}
