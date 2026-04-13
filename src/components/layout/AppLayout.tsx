import { useState, useEffect } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  className?: string
}

export function AppLayout({ children, showSidebar = true, className }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return true
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved ? JSON.parse(saved) : true
  })

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="flex min-h-screen flex-col bg-ace-bg">
      <Navbar onSidebarToggle={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, icon-only on tablet, full on desktop */}
        {showSidebar && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
            className="hidden md:block"
          />
        )}

        {/* Main content - Add padding for bottom nav on mobile */}
        <main className={cn('flex-1 overflow-y-auto pb-nav md:pb-0', className)}>
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      {showSidebar && <BottomNav />}
    </div>
  )
}
