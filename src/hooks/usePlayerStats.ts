import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { PlayerSkills } from '@/types'
import { supabase, getPlayerStats, getPlayerSkills, savePlayerSkills } from '@/lib/supabase'

export function usePlayerStats(playerId: string | undefined) {
  return useQuery({
    queryKey: ['player-stats', playerId],
    queryFn: async () => {
      if (!playerId) return null
      return await getPlayerStats(playerId)
    },
    enabled: !!playerId,
  })
}

export function useSkills(playerId: string | undefined) {
  return useQuery<PlayerSkills | null>({
    queryKey: ['player-skills', playerId],
    queryFn: async () => {
      if (!playerId) return null
      return await getPlayerSkills(playerId)
    },
    enabled: !!playerId,
  })
}

export function useUpdateSkills(playerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      coachId,
      skills,
    }: {
      coachId: string
      skills: {
        forehand: number
        backhand: number
        serve: number
        volley: number
        footwork: number
        fitness: number
      }
    }) => {
      return await savePlayerSkills(playerId, coachId, skills)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-skills', playerId] })
      queryClient.invalidateQueries({ queryKey: ['player', playerId] })
    },
  })
}

export function useSetGoal(playerId: string, coachId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goals: {
      forehand_target?: number
      backhand_target?: number
      serve_target?: number
      volley_target?: number
      footwork_target?: number
      fitness_target?: number
      target_date?: string
    }) => {
      const { data, error } = await supabase
        .from('player_skill_goals')
        .insert({
          player_id: playerId,
          coach_id: coachId,
          ...goals,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['player-stats', playerId] })
    },
  })
}
