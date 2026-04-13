import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Player, PlayerWithStats } from '@/types'
import { supabase, getClubPlayers, getPlayerSkills, inviteMember } from '@/lib/supabase'

export function usePlayers(clubId: string | undefined) {
  return useQuery<Player[]>({
    queryKey: ['players', clubId],
    queryFn: async () => {
      if (!clubId) return []
      return await getClubPlayers(clubId)
    },
    enabled: !!clubId,
  })
}

export function usePlayer(playerId: string | undefined) {
  return useQuery<PlayerWithStats | null>({
    queryKey: ['player', playerId],
    queryFn: async () => {
      if (!playerId) return null

      const { data: player, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playerId)
        .single()

      if (error) return null

      const skills = await getPlayerSkills(playerId)

      const { data: badges } = await supabase
        .from('player_badges')
        .select(`
          badge_id,
          earned_at,
          badges(*)
        `)
        .eq('player_id', playerId)

      const { data: evaluations } = await supabase
        .from('evaluations')
        .select('*')
        .eq('player_id', playerId)
        .order('created_at', { ascending: false })
        .limit(10)

      return {
        ...player,
        skills: skills || undefined,
        badges: badges?.map((b: any) => b.badges) || [],
        recent_evaluations: evaluations || [],
      }
    },
    enabled: !!playerId,
  })
}

export function useInvitePlayer(clubId: string, invitedBy: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: 'player' | 'coach' }) => {
      return await inviteMember(email, role, clubId, invitedBy)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', clubId] })
    },
  })
}

export function useRemovePlayer(clubId: string, playerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('profiles')
        .update({ club_id: null })
        .eq('id', playerId)

      if (error) throw error

      // Also remove roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', playerId)
        .eq('club_id', clubId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players', clubId] })
    },
  })
}
