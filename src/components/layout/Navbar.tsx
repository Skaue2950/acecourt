import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage, useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, Globe, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavbarProps {
  className?: string
  onSidebarToggle?: () => void
  sidebarCollapsed?: boolean
}

export function Navbar({ className, onSidebarToggle, sidebarCollapsed }: NavbarProps) {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const t = useTranslation()
  const { language, setLanguage } = useLanguage()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'AA'

  return (
    <nav
      className={cn(
        'sticky top-0 z-40 border-b border-ace-border bg-ace-card/95 backdrop-blur',
        className
      )}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-16">
        {/* Left: Logo or Sidebar Toggle */}
        <div className="flex items-center gap-4">
          {onSidebarToggle && (
            <button
              onClick={onSidebarToggle}
              className="hidden md:inline-flex p-2 hover:bg-gray-800 rounded-lg transition-colors md:hidden"
              title="Toggle sidebar"
            >
              <Menu className="h-5 w-5 text-gray-400" />
            </button>
          )}

          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-lg font-bold text-ace-bg">
              A
            </div>
            <span className="hidden font-bold text-gray-100 sm:inline">ACECOURT</span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-gray-200"
                title={language === 'da' ? 'Dansk' : 'English'}
              >
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setLanguage('da')}
                className={language === 'da' ? 'bg-emerald-900/50' : ''}
              >
                {t('common.danish')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-emerald-900/50' : ''}
              >
                {t('common.english')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications (placeholder) */}
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-gray-400 hover:text-gray-200 relative"
            title="Notifikationer"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-emerald-500 rounded-full" />
          </Button>

          {/* User Menu */}
          {user && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-800"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="bg-emerald-600 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 px-2 py-1.5">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                    <AvatarFallback className="bg-emerald-600 text-white font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5 leading-none">
                    <p className="font-medium text-gray-100">{profile.full_name}</p>
                    <p className="text-xs text-gray-400">Level {profile.level}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{t('nav.dashboard')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">{t('nav.profile')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-400">
                  {t('nav.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild className="text-sm">
                <Link to="/auth">{t('nav.login')}</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-sm">
                <Link to="/auth">{t('common.signup')}</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
