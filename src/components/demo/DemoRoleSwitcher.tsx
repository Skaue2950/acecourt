import React from 'react'
import { useDemo, DemoRole } from '@/contexts/DemoContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Zap, BarChart3 } from 'lucide-react'

export function DemoRoleSwitcher() {
  const { currentRole, setCurrentRole } = useDemo()

  const roles: Array<{ value: DemoRole; label: string; icon: React.ReactNode; description: string }> = [
    {
      value: 'player',
      label: 'Player',
      icon: <Users className="h-6 w-6" />,
      description: 'Experience the gamified training platform',
    },
    {
      value: 'coach',
      label: 'Coach',
      icon: <Zap className="h-6 w-6" />,
      description: 'Manage sessions and evaluate players',
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: <BarChart3 className="h-6 w-6" />,
      description: 'View club analytics and management',
    },
  ]

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardContent className="pt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {roles.map((role) => (
            <Button
              key={role.value}
              onClick={() => setCurrentRole(role.value)}
              variant={currentRole === role.value ? 'default' : 'outline'}
              className="h-auto flex-col items-start justify-start gap-2 p-4"
            >
              <div className="flex items-center gap-2">
                {role.icon}
                <span className="font-semibold">{role.label}</span>
              </div>
              <span className="text-xs font-normal text-gray-400">{role.description}</span>
              {currentRole === role.value && (
                <Badge className="mt-2 bg-emerald-500/20 text-emerald-300">Active</Badge>
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
