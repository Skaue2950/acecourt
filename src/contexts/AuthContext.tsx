import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser, Player, UserRole, Club } from '@/types'
import { supabase, getProfile, getClub } from '@/lib/supabase'

interface AuthContextType {
  user: AuthUser | null
  profile: Player | null
  roles: UserRole[]
  club: Club | null
  loading: boolean
  error: string | null
  onboarding: 'none' | 'needs_club' | 'complete'
  signOut: () => Promise<void>
  hasRole: (role: string) => boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<Player | null>(null)
  const [roles, setRoles] = useState<UserRole[]>([])
  const [club, setClub] = useState<Club | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [onboarding, setOnboarding] = useState<'none' | 'needs_club' | 'complete'>('none')

  const loadProfile = async (userId: string) => {
    try {
      const profileData = await getProfile(userId)
      setProfile(profileData)

      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)

      setRoles(rolesData || [])

      // Load club if user has one
      if (profileData?.club_id) {
        const clubData = await getClub(profileData.club_id)
        setClub(clubData)
        setOnboarding('complete')
      } else {
        setClub(null)
        setOnboarding('needs_club')
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      setProfile(null)
      setRoles([])
      setClub(null)
      setOnboarding('none')
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          setUser(authUser as AuthUser)
          await loadProfile(authUser.id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load auth')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user as AuthUser)
        await loadProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setRoles([])
        setClub(null)
        setOnboarding('none')
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setRoles([])
      setClub(null)
      setOnboarding('none')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  const handleRefreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  const hasRole = (role: string): boolean => {
    return roles.some((r) => r.role === role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        roles,
        club,
        loading,
        error,
        onboarding,
        signOut: handleSignOut,
        hasRole,
        refreshProfile: handleRefreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
