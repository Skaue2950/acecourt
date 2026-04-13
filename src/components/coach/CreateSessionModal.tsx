import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useCreateSession } from '@/hooks/useSessions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CreateSessionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateSessionModal({ open, onOpenChange }: CreateSessionModalProps) {
  const { user, club } = useAuth()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  const createSession = useCreateSession(club?.id || '')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !date || !user) {
      return
    }

    createSession.mutate(
      {
        title,
        date,
        coachId: user.id,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          setTitle('')
          setDate('')
          setNotes('')
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setTitle('')
      setDate('')
      setNotes('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Opret træningssession</DialogTitle>
          <DialogDescription>Tilføj en ny træningssession for gruppen</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-slate-300">
              Titel
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="f.eks. Mandag træning - Begyndere"
              disabled={createSession.isPending}
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-slate-300">
              Dato og tid
            </Label>
            <Input
              id="date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={createSession.isPending}
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-slate-300">
              Noter (valgfrit)
            </Label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notatere vedr. træning..."
              disabled={createSession.isPending}
              rows={3}
              className="mt-1 w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md"
            />
          </div>

          {createSession.error && (
            <p className="text-red-400 text-sm">{createSession.error.message}</p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 border-slate-600"
            >
              Annuller
            </Button>
            <Button
              type="submit"
              disabled={createSession.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              {createSession.isPending ? 'Opretter...' : 'Opret session'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
