import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useInvitePlayer } from '@/hooks/usePlayers'
import { useInviteCoach } from '@/hooks/useCoaches'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Copy, Check } from 'lucide-react'

interface InviteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type?: 'player' | 'coach'
}

export function InviteModal({ open, onOpenChange, type = 'player' }: InviteModalProps) {
  const { user, club } = useAuth()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'player' | 'coach'>(type)
  const [copied, setCopied] = useState(false)
  const [showClubCode, setShowClubCode] = useState(false)

  const invitePlayer = useInvitePlayer(club?.id || '', user?.id || '')
  const inviteCoach = useInviteCoach(club?.id || '', user?.id || '')

  const isLoading = invitePlayer.isPending || inviteCoach.isPending
  const inviteLink = invitePlayer.data?.token || inviteCoach.data?.token

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      return
    }

    if (role === 'coach') {
      inviteCoach.mutate(email)
    } else {
      invitePlayer.mutate({ email, role: 'player' })
    }
  }

  const handleCopyInviteCode = () => {
    if (club?.invite_code) {
      navigator.clipboard.writeText(club.invite_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEmail('')
      setShowClubCode(false)
      invitePlayer.reset()
      inviteCoach.reset()
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-slate-900 border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="text-white">Inviter til klubben</DialogTitle>
          <DialogDescription>
            Inviter {role === 'coach' ? 'en træner' : 'en spiller'} til din klub
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Invitation Tab */}
          <div className="space-y-4">
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="mt-1 bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-slate-300">
                  Rolle
                </Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="player">Spiller</SelectItem>
                    <SelectItem value="coach">Træner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {invitePlayer.error && (
                <p className="text-red-400 text-sm">{invitePlayer.error.message}</p>
              )}
              {inviteCoach.error && (
                <p className="text-red-400 text-sm">{inviteCoach.error.message}</p>
              )}

              {inviteLink && (
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg">
                  <p className="text-emerald-400 text-sm mb-2">Invitation sendt!</p>
                  <p className="text-white text-xs break-all font-mono">{inviteLink}</p>
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                {isLoading ? 'Sender...' : 'Send invitation'}
              </Button>
            </form>

            {/* Club Code Section */}
            <div className="border-t border-slate-700 pt-4">
              <button
                onClick={() => setShowClubCode(!showClubCode)}
                className="text-sm text-emerald-400 hover:text-emerald-300"
              >
                {showClubCode ? 'Skjul klubkode' : 'Vis klubkode'}
              </button>

              {showClubCode && club?.invite_code && (
                <div className="mt-3 bg-slate-800 p-3 rounded-lg">
                  <p className="text-xs text-slate-400 mb-2">Dele denne kode med spillere:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-white font-mono text-lg">{club.invite_code}</code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyInviteCode}
                      className="border-slate-600 hover:bg-slate-700"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
