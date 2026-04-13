import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  TrendingUp,
  Target,
  Award,
  ShoppingBag,
  Zap,
  Users,
  BarChart3,
  MoreHorizontal,
  X,
  ChevronRight,
  Gamepad2,
} from 'lucide-react'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  show: boolean
}

export function BottomNav() {
  const location = useLocation()
  const { hasRole } = useAuth()
  const t = useTranslation()
  const [sheetOpen, setSheetOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  // All nav items
  const allNavItems: NavItem[] = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, show: true },
    { path: '/performance', label: t('nav.performance'), icon: TrendingUp, show: hasRole('player') },
    { path: '/sessions', label: t('nav.sessions'), icon: Zap, show: hasRole('coach') },
    { path: '/challenges', label: t('nav.challenges'), icon: Target, show: hasRole('player') },
    { path: '/players', label: t('nav.players'), icon: Users, show: hasRole('coach') },
    { path: '/leaderboard', label: t('nav.leaderboard'), icon: Award, show: true },
    { path: '/pro-shop', label: t('nav.proShop'), icon: ShoppingBag, show: true },
    { path: '/admin', label: t('nav.admin'), icon: BarChart3, show: hasRole('admin') },
    { path: '/demo', label: t('nav.demo'), icon: Gamepad2, show: true },
  ]

  // Visible items (5 max, last is "More")
  const visibleItems = allNavItems.filter((item) => item.show).slice(0, 4)
  const moreItems = allNavItems.filter((item) => item.show).slice(4)

  return (
    <>
      {/* Bottom Navigation Bar - Mobile Only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-ace-card/95 backdrop-blur border-t border-ace-border pb-safe">
        <div className="flex h-16 items-center justify-around">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center w-16 h-16 transition-colors rounded-lg -mx-2',
                  active
                    ? 'text-emerald-400'
                    : 'text-gray-400 hover:text-gray-300'
                )}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
              </Link>
            )
          })}

          {/* More Button */}
          {moreItems.length > 0 && (
            <button
              onClick={() => setSheetOpen(true)}
              className={cn(
                'flex flex-col items-center justify-center w-16 h-16 transition-colors rounded-lg -mx-2',
                'text-gray-400 hover:text-gray-300'
              )}
            >
              <MoreHorizontal className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">Mere</span>
            </button>
          )}
        </div>
      </nav>

      {/* More Items Bottom Sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSheetOpen(false)}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-ace-card border-t border-ace-border rounded-t-2xl animate-in slide-in-from-bottom max-h-[80vh] overflow-y-auto pb-safe">
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-ace-border bg-ace-card/80 backdrop-blur">
              <h3 className="text-lg font-bold text-white">Mere muligheder</h3>
              <button
                onClick={() => setSheetOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="divide-y divide-ace-border">
              {moreItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSheetOpen(false)}
                    className={cn(
                      'flex items-center justify-between p-4 transition-colors',
                      active
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : 'hover:bg-gray-800/50 text-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
