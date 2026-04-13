import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslation } from '@/lib/i18n'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signUp, signIn } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

export function Auth() {
  const t = useTranslation()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [tab, setTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validatePassword = (password: string) => password.length >= 6

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateEmail(email)) {
      setError('Ugyldigt email')
      return
    }

    if (!validatePassword(password)) {
      setError('Adgangskode skal være mindst 6 tegn')
      return
    }

    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login mislykkedes'
      if (errorMsg.includes('Invalid login credentials')) {
        setError('Ugyldige loginoplysninger')
      } else {
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError('Dit navn er påkrævet')
      return
    }

    if (!validateEmail(email)) {
      setError('Ugyldigt email')
      return
    }

    if (!validatePassword(password)) {
      setError('Adgangskode skal være mindst 6 tegn')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, fullName)
      setSuccess(true)
      setEmail('')
      setPassword('')
      setFullName('')
      setTimeout(() => {
        navigate('/dashboard', { replace: true })
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Tilmelding mislykkedes'
      if (errorMsg.includes('already registered')) {
        setError('Denne email er allerede registreret')
      } else {
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ace-bg flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        {/* Left Side - Hero (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-900 to-gray-950 relative overflow-hidden items-center justify-center p-12">
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-96 h-96 rounded-full border-4 border-emerald-500" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500/20" />
          </div>

          <div className="relative text-center max-w-md">
            <div className="text-7xl mb-8">🎾</div>
            <h1 className="text-5xl font-black text-white mb-4">ACECOURT</h1>
            <p className="text-xl text-emerald-200 leading-relaxed">
              Din digitale tennispartner — gamified coaching til moderne klubber
            </p>

            {/* Social Proof */}
            <div className="mt-12 pt-8 border-t border-emerald-800">
              <p className="text-emerald-300 font-medium mb-4">Bruges af tennisklubber verden over</p>
              <div className="flex items-center justify-center gap-4 text-sm text-emerald-200">
                <span>🌍 50+ klubber</span>
                <span>•</span>
                <span>👥 10.000+ spillere</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form (Full width on mobile) */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md">
            <Card className="bg-ace-card/50 backdrop-blur border-ace-border p-6 sm:p-8">
              {/* Logo (Mobile) */}
              <div className="lg:hidden text-center mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-emerald-500 text-2xl font-black text-ace-bg mx-auto mb-4">
                  A
                </div>
                <h1 className="text-2xl font-black text-white">ACECOURT</h1>
              </div>

              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-4">
                    <CheckCircle className="h-8 w-8 text-emerald-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Konto oprettet!</h2>
                  <p className="text-gray-400 mb-4">Tjek din email for at bekræfte din konto</p>
                  <p className="text-sm text-gray-500">Du bliver omdirigeret om kort tid...</p>
                </div>
              ) : (
                <>
                  <Tabs defaultValue="signin" value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800 p-1 mb-6">
                      <TabsTrigger value="signin" className="rounded">
                        Log ind
                      </TabsTrigger>
                      <TabsTrigger value="signup" className="rounded">
                        Opret konto
                      </TabsTrigger>
                    </TabsList>

                    {/* Sign In Form */}
                    <TabsContent value="signin" className="space-y-4">
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signin-email" className="text-gray-300">
                            Email
                          </Label>
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signin-password" className="text-gray-300">
                            Adgangskode
                          </Label>
                          <Input
                            id="signin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                            <p className="text-sm text-red-300">{error}</p>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-base font-semibold"
                        >
                          {loading ? 'Logger ind...' : 'Log ind'}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Sign Up Form */}
                    <TabsContent value="signup" className="space-y-4">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="signup-name" className="text-gray-300">
                            Fuldt navn
                          </Label>
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Dit navn"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email" className="text-gray-300">
                            Email
                          </Label>
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password" className="text-gray-300">
                            Adgangskode
                          </Label>
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="Mindst 6 tegn"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="h-11 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                          />
                        </div>

                        {error && (
                          <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                            <p className="text-sm text-red-300">{error}</p>
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-base font-semibold"
                        >
                          {loading ? 'Opretter konto...' : 'Opret konto'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>

                  {/* Demo Link */}
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <p className="text-center text-sm text-gray-400 mb-4">Vil du se en demo først?</p>
                    <Button
                      variant="outline"
                      className="w-full h-10"
                      onClick={() => navigate('/demo')}
                    >
                      Se demo
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
