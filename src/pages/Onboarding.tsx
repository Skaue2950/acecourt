import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createClub, joinClub } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles, Users, ChevronRight, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'choice' | 'create' | 'join' | 'success'

export function Onboarding() {
  const navigate = useNavigate()
  const { user, profile, refreshProfile } = useAuth()
  const [step, setStep] = useState<Step>('choice')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clubName, setClubName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [createdClub, setCreatedClub] = useState<{ name: string; inviteCode: string } | null>(null)
  const [copied, setCopied] = useState(false)

  if (!user || !profile) {
    return null
  }

  const handleCreateClub = async () => {
    if (!clubName.trim()) {
      setError('Klubnavnet er påkrævet')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const club = await createClub(clubName, user.id, logoUrl || undefined)
      setCreatedClub({ name: club.name, inviteCode: club.invite_code })
      setStep('success')
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fejl ved oprettelse af klub')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinClub = async () => {
    if (!inviteCode.trim()) {
      setError('Invitationskoden er påkrævet')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await joinClub(inviteCode, user.id)
      setStep('success')
      await refreshProfile()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fejl ved tilslutning til klub')
    } finally {
      setLoading(false)
    }
  }

  const handleFinish = () => {
    navigate('/dashboard')
  }

  const copyToClipboard = () => {
    if (createdClub?.inviteCode) {
      navigator.clipboard.writeText(createdClub.inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-ace-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        {step !== 'success' && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {['choice', 'create', 'join'].map((s, idx) => (
              <div
                key={idx}
                className={cn(
                  'h-2 w-8 rounded-full transition-colors',
                  ['choice', 'create', 'join'].indexOf(step) >= idx ? 'bg-emerald-500' : 'bg-gray-700'
                )}
              />
            ))}
          </div>
        )}

        {/* Step 1: Choice */}
        {step === 'choice' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Velkommen til ACECOURT</h1>
              <p className="text-gray-400">Lad os starte med at sætte din klub op</p>
            </div>

            <div className="grid gap-4">
              {/* Create Club Card */}
              <button
                onClick={() => setStep('create')}
                className={cn(
                  'relative overflow-hidden rounded-2xl p-6 text-left transition-all border-2',
                  'bg-gradient-to-br from-emerald-900 to-emerald-800/30 border-emerald-600',
                  'hover:scale-105 active:scale-95'
                )}
              >
                <div className="absolute top-0 right-0 text-8xl opacity-10">🎾</div>
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-black text-white">Opret ny klub</h3>
                  <p className="text-sm text-emerald-200/70 mt-1">Start din digitale tennisklub fra bunden</p>
                  <div className="mt-4 flex items-center text-emerald-400 text-sm font-medium">
                    Fortsæt <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </button>

              {/* Join Club Card */}
              <button
                onClick={() => setStep('join')}
                className={cn(
                  'relative overflow-hidden rounded-2xl p-6 text-left transition-all border-2',
                  'bg-gray-900 border-gray-700 hover:border-gray-600',
                  'hover:scale-105 active:scale-95'
                )}
              >
                <div className="absolute top-0 right-0 text-8xl opacity-10">👥</div>
                <div className="relative">
                  <Users className="h-8 w-8 text-gray-400 mb-3" />
                  <h3 className="text-xl font-black text-white">Tilslut klub</h3>
                  <p className="text-sm text-gray-400 mt-1">Deltag i en eksisterende klub med invitationskode</p>
                  <div className="mt-4 flex items-center text-gray-400 text-sm font-medium">
                    Fortsæt <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2a: Create Club */}
        {step === 'create' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-1">Opret klub</h2>
              <p className="text-gray-400">Giv din klub et navn</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clubName" className="text-gray-300">
                  Klubnavn
                </Label>
                <Input
                  id="clubName"
                  placeholder="F.eks. København Tennis Club"
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl" className="text-gray-300">
                  Logo URL (valgfrit)
                </Label>
                <Input
                  id="logoUrl"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('choice')}
                  disabled={loading}
                  className="flex-1 h-11"
                >
                  Tilbage
                </Button>
                <Button
                  onClick={handleCreateClub}
                  disabled={loading || !clubName.trim()}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500"
                >
                  {loading ? 'Opretter...' : 'Opret klub'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 2b: Join Club */}
        {step === 'join' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white mb-1">Tilslut klub</h2>
              <p className="text-gray-400">Indtast invitationskoden fra din træner</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inviteCode" className="text-gray-300">
                  Invitationskode
                </Label>
                <Input
                  id="inviteCode"
                  placeholder="000000"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  maxLength={6}
                  className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500 font-mono text-center text-lg"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep('choice')}
                  disabled={loading}
                  className="flex-1 h-11"
                >
                  Tilbage
                </Button>
                <Button
                  onClick={handleJoinClub}
                  disabled={loading || inviteCode.length !== 6}
                  className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-500"
                >
                  {loading ? 'Tilslutter...' : 'Tilslut'}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-4">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Tillykke!</h2>
              <p className="text-gray-400">
                {createdClub
                  ? `Du har oprettet ${createdClub.name}`
                  : 'Du er nu medlem af klubben'}
              </p>
            </div>

            {/* Invite Code Display */}
            {createdClub && (
              <Card className="p-6 bg-emerald-900/20 border-emerald-800 space-y-3">
                <p className="text-sm text-emerald-300 font-medium">Inviter dine træner og spillere:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-gray-800 rounded-lg">
                    <p className="font-mono text-lg font-bold text-white tracking-widest">
                      {createdClub.inviteCode}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </Card>
            )}

            <Button
              onClick={handleFinish}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500"
            >
              Gå til dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
