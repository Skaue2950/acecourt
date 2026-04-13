import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

type Callback<T> = (payload: T) => void

export function useRealtime<T>(
  table: string,
  onInsert?: Callback<T>,
  onUpdate?: Callback<T>,
  onDelete?: Callback<T>
) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table,
        },
        (payload: any) => {
          onInsert?.(payload.new as T)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table,
        },
        (payload: any) => {
          onUpdate?.(payload.new as T)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table,
        },
        (payload: any) => {
          onDelete?.(payload.old as T)
        }
      )
      .subscribe((status) => {
        if (status === 'CLOSED') {
          setError('Connection closed')
        }
      })

    setSubscription(channel)

    return () => {
      channel.unsubscribe()
    }
  }, [table, onInsert, onUpdate, onDelete])

  return { subscription, error }
}

export function useRealtimeTable<T>(table: string) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: items, error: err } = await supabase
          .from(table)
          .select('*')

        if (err) throw err
        setData(items || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    const channel = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setData((prev) => [...prev, payload.new as T])
          } else if (payload.eventType === 'UPDATE') {
            setData((prev) =>
              prev.map((item: any) =>
                item.id === (payload.new as any).id ? (payload.new as T) : item
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setData((prev) =>
              prev.filter((item: any) => item.id !== (payload.old as any).id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [table])

  return { data, loading, error }
}
