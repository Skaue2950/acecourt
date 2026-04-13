import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TennisSession, SessionAttendance, Evaluation } from '@/types'
import {
  supabase,
  getSessions,
  getSession,
  createSession,
  markAttendance,
  saveEvaluation,
  getSessionAttendance,
  getEvaluations,
} from '@/lib/supabase'

export function useSessions(
  clubId: string | undefined,
  coachId?: string,
  filters?: { startDate?: string; endDate?: string }
) {
  return useQuery<TennisSession[]>({
    queryKey: ['sessions', clubId, coachId, filters],
    queryFn: async () => {
      if (!clubId) return []
      return await getSessions(clubId, coachId, filters)
    },
    enabled: !!clubId,
  })
}

export function useSession(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      if (!sessionId) return null
      const session = await getSession(sessionId)
      const attendance = await getSessionAttendance(sessionId)
      const evaluations = await getEvaluations(sessionId)
      return { ...session, attendance, evaluations }
    },
    enabled: !!sessionId,
  })
}

export function useCreateSession(clubId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      title: string
      date: string
      coachId: string
      trainingGroupId?: string
      notes?: string
    }) => {
      return await createSession({
        ...data,
        clubId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions', clubId] })
    },
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      playerId,
      status,
      markedBy,
    }: {
      sessionId: string
      playerId: string
      status: 'present' | 'absent' | 'late' | 'excused'
      markedBy: string
    }) => {
      return await markAttendance(sessionId, playerId, status, markedBy)
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}

export function useSaveEvaluation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      sessionId,
      playerId,
      coachId,
      mde,
      notes,
    }: {
      sessionId: string
      playerId: string
      coachId: string
      mde: { motivation: number; development: number; engagement: number }
      notes?: string
    }) => {
      return await saveEvaluation(sessionId, playerId, coachId, mde, notes)
    },
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
    },
  })
}

export function useSessionAttendance(sessionId: string | undefined) {
  return useQuery<SessionAttendance[]>({
    queryKey: ['session-attendance', sessionId],
    queryFn: async () => {
      if (!sessionId) return []
      return await getSessionAttendance(sessionId)
    },
    enabled: !!sessionId,
  })
}
