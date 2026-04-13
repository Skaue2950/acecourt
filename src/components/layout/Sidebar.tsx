import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  Zap,
  TrendingUp,
  Users,
  Target,
  Award,
  ShoppingBag,
  BarChart3,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ className, collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation()
  const { hasRole, profile, signOut } = useAuth()
  const t = useTranslation()

  const isActive = (path: string) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, show: true },
    { path: '/sessions', label: t('nav.sessions'), icon: Zap, show: hasRole('coach') },
    { path: '/performance', label: t('nav.performance'), icon: TrendingUp, show: hasRole('player') },
    { path: '/players', label: t('nav.players'), icon: Users, show: hasRole('coach') },
    { path: '/challenges', label: t('nav.challenges'), icon: Target, show: hasRole('player') },
    { path: '/leaderboard', label: t('nav.leaderboard'), icon: Award, show: true },
    { path: '/pro-shop', label: t('nav.proShop'), icon: ShoppingBag, show: true },
    { path: '/admin', label: t('nav.admin'), icon: BarChart3, show: hasRole('admin') },
    { path: '/demo', label: t('nav.demo'), icon: Gamepad2, show: true },
  ]

  const visibleItems = navItems.filter((item) => item.show)

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'AA'

  return (
    <aside
      className={cn(
        'border-r border-ace-border bg-ace-card transition-all duration-300 flex flex-col',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Logo and Collapse Button */}
      <div className="flex items-center justify-between p-4 border-b border-ace-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-emerald-500 flex items-center justify-center text-lg font-bold text-ace-bg">
              A
            </div>
            <span className="font-bold text-white">ACE</span>
          </div>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            title={collapsed ? 'Udvid' : 'Kollaps'}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link key={item.path} to={item.path}>
              <button
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                  'hover:bg-gray-800/50',
                  active
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'text-gray-400 hover:text-gray-200'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-ace-border p-3 space-y-2">
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-800/50 transition-colors',
            collapsed && 'justify-center'
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
            <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
              <p className="text-xs text-gray-400">Level {profile?.level}</p>
            </div>
          )}
        </div>

        <button
          onClick={() => signOut()}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg',
            'text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors',
            'text-sm'
          )}
          title={collapsed ? 'Log ud' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Log ud</span>}
        </button>
      </div>
    </aside>
  )
}
