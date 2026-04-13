import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Message } from '@/types'

export function useMessages(userId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(
    async (conversationPartnerId?: string) => {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
          .order('created_at', { ascending: false })

        if (conversationPartnerId) {
          query = supabase
            .from('messages')
            .select('*')
            .or(
              `and(sender_id.eq.${userId},recipient_id.eq.${conversationPartnerId}),and(sender_id.eq.${conversationPartnerId},recipient_id.eq.${userId})`
            )
            .order('created_at', { ascending: true })
        }

        const { data, error: err } = await query

        if (err) throw err
        setMessages(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch messages')
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  const sendMessage = useCallback(
    async (recipientId: string, content: string) => {
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('messages')
          .insert({
            sender_id: userId,
            recipient_id: recipientId,
            content,
          })
          .select()
          .single()

        if (err) throw err
        setMessages((prev) => [data, ...prev])
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message'
        setError(message)
        throw new Error(message)
      }
    },
    [userId]
  )

  const markAsRead = useCallback(
    async (messageId: string) => {
      setError(null)
      try {
        const { error: err } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', messageId)

        if (err) throw err
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, read: true } : m))
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to mark as read')
      }
    },
    []
  )

  return {
    messages,
    loading,
    error,
    fetchMessages,
    sendMessage,
    markAsRead,
  }
}
