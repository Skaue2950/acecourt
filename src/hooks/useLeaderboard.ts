import { useQuery } from '@tanstack/react-query'
import { Player } from '@/types'
import { getLeaderboard } from '@/lib/supabase'

export function useLeaderboard(
  clubId: string | undefined,
  period: 'weekly' | 'monthly' | 'alltime' = 'alltime'
) {
  return useQuery<(Player & { rank: number; xp_earned: number })[]>({
    queryKey: ['leaderboard', clubId, period],
    queryFn: async () => {
      if (!clubId) return []
      return await getLeaderboard(clubId, period)
    },
    enabled: !!clubId,
  })
}
