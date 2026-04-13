import React from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useTranslation } from '@/lib/i18n'
import { useDemo } from '@/contexts/DemoContext'
import { DemoRoleSwitcher } from '@/components/demo/DemoRoleSwitcher'
import { DemoPlayerDashboard } from '@/components/demo/DemoPlayerDashboard'
import { DemoCoachDashboard } from '@/components/demo/DemoCoachDashboard'
import { DemoAdminDashboard } from '@/components/demo/DemoAdminDashboard'

export function Demo() {
  const t = useTranslation()
  const { currentRole } = useDemo()

  return (
    <AppLayout className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-100">{t('nav.demo')}</h1>
          <p className="text-gray-400">
            Experience ACECOURT from different perspectives. Switch roles to explore all features.
          </p>
        </div>

        <div className="mb-8">
          <DemoRoleSwitcher />
        </div>

        {currentRole === 'player' && <DemoPlayerDashboard />}
        {currentRole === 'coach' && <DemoCoachDashboard />}
        {currentRole === 'admin' && <DemoAdminDashboard />}
      </div>
    </AppLayout>
  )
}
