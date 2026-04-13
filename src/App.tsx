import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { DemoProvider } from '@/contexts/DemoContext'
import { I18nContext, type I18nContextType } from '@/lib/i18n'
import { Landing } from '@/pages/Landing'
import { Auth } from '@/pages/Auth'
import { Dashboard } from '@/pages/Dashboard'
import { Sessions } from '@/pages/Sessions'
import { Performance } from '@/pages/Performance'
import { Players } from '@/pages/Players'
import { Challenges } from '@/pages/Challenges'
import { Leaderboard } from '@/pages/Leaderboard'
import { ProShop } from '@/pages/ProShop'
import { Admin } from '@/pages/Admin'
import { Demo } from '@/pages/Demo'
import { Onboarding } from '@/pages/Onboarding'

interface ProtectedRouteProps {
  children: React.ReactNode
}

interface ClubRouteProps {
  children: React.ReactNode
}

interface AdminRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Indlæser...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/auth', { replace: true })
    return null
  }

  return <>{children}</>
}

function ClubRoute({ children }: ClubRouteProps) {
  const { user, loading, onboarding } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Indlæser...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/auth', { replace: true })
    return null
  }

  if (onboarding === 'needs_club') {
    navigate('/onboarding', { replace: true })
    return null
  }

  return <>{children}</>
}

function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading, hasRole } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Indlæser...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    navigate('/auth', { replace: true })
    return null
  }

  if (!hasRole('admin')) {
    navigate('/dashboard', { replace: true })
    return null
  }

  return <>{children}</>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/demo" element={<Demo />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Protected Routes with Club */}
      <Route
        path="/dashboard"
        element={
          <ClubRoute>
            <Dashboard />
          </ClubRoute>
        }
      />
      <Route
        path="/sessions"
        element={
          <ClubRoute>
            <Sessions />
          </ClubRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ClubRoute>
            <Performance />
          </ClubRoute>
        }
      />
      <Route
        path="/players"
        element={
          <ClubRoute>
            <Players />
          </ClubRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ClubRoute>
            <Challenges />
          </ClubRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <ClubRoute>
            <Leaderboard />
          </ClubRoute>
        }
      />
      <Route
        path="/pro-shop"
        element={
          <ClubRoute>
            <ProShop />
          </ClubRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [language, setLanguage] = useState<'da' | 'en'>('da')

  const i18nContext: I18nContextType = {
    language,
    setLanguage,
  }

  return (
    <I18nContext.Provider value={i18nContext}>
      <QueryClientProvider client={queryClient}>
        <DemoProvider>
          <AuthProvider>
            <Router>
              <AppRoutes />
            </Router>
          </AuthProvider>
        </DemoProvider>
      </QueryClientProvider>
    </I18nContext.Provider>
  )
}
