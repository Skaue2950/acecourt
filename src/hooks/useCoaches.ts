import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Player } from '@/types'
import { supabase, getClubMembers, inviteMember } from '@/lib/supabase'

export function useCoaches(clubId: string | undefined) {
  return useQuery<Player[]>({
    queryKey: ['coaches', clubId],
    queryFn: async () => {
      if (!clubId) return []
      return await getClubMembers(clubId, 'coach')
    },
    enabled: !!clubId,
  })
}

export function useInviteCoach(clubId: string, invitedBy: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (email: string) => {
      return await inviteMember(email, 'coach', clubId, invitedBy)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coaches', clubId] })
    },
  })
}
