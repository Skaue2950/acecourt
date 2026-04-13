import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { PlayerSkillGoals } from '@/types'

export function useGoals(playerId: string, coachId: string) {
  const [goals, setGoals] = useState<PlayerSkillGoals | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('player_skill_goals')
        .select('*')
        .eq('player_id', playerId)
        .eq('coach_id', coachId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (err && err.code !== 'PGRST116') throw err
      setGoals(data || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch goals')
    } finally {
      setLoading(false)
    }
  }, [playerId, coachId])

  const setGoal = useCallback(
    async (skillGoals: Partial<PlayerSkillGoals>) => {
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('player_skill_goals')
          .insert({
            player_id: playerId,
            coach_id: coachId,
            ...skillGoals,
          })
          .select()
          .single()

        if (err) throw err
        setGoals(data)
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to set goals'
        setError(message)
        throw new Error(message)
      }
    },
    [playerId, coachId]
  )

  const updateGoal = useCallback(
    async (goalId: string, updates: Partial<PlayerSkillGoals>) => {
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('player_skill_goals')
          .update(updates)
          .eq('id', goalId)
          .select()
          .single()

        if (err) throw err
        setGoals(data)
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update goals'
        setError(message)
        throw new Error(message)
      }
    },
    []
  )

  const completeGoal = useCallback(
    async (goalId: string) => {
      return updateGoal(goalId, {
        completed_at: new Date().toISOString(),
      })
    },
    [updateGoal]
  )

  return {
    goals,
    loading,
    error,
    fetchGoals,
    setGoal,
    updateGoal,
    completeGoal,
  }
}
