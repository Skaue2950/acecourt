import React, { useState } from 'react'
import { Player } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from '@/lib/i18n'

interface MDEEvaluationFormProps {
  player: Player
  onSubmit?: (data: {
    motivation: number
    development: number
    engagement: number
    notes: string
  }) => void
}

export function MDEEvaluationForm({ player, onSubmit }: MDEEvaluationFormProps) {
  const t = useTranslation()
  const [motivation, setMotivation] = useState(3)
  const [development, setDevelopment] = useState(3)
  const [engagement, setEngagement] = useState(3)
  const [notes, setNotes] = useState('')

  const handleSubmit = () => {
    onSubmit?.({
      motivation,
      development,
      engagement,
      notes,
    })
  }

  const totalScore = (motivation + development + engagement) / 3

  return (
    <Card className="border-ace-border bg-ace-card">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={player.avatar_url} alt={player.full_name} />
            <AvatarFallback>{player.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{player.full_name}</CardTitle>
            <p className="text-xs text-gray-400">Level {player.level}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{t('coach.motivation')}</Label>
              <span className="text-sm font-medium text-emerald-400">{motivation}</span>
            </div>
            <Input
              type="range"
              min="1"
              max="5"
              value={motivation}
              onChange={(e) => setMotivation(Number(e.target.value))}
              className="accent-emerald-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{t('coach.development')}</Label>
              <span className="text-sm font-medium text-emerald-400">{development}</span>
            </div>
            <Input
              type="range"
              min="1"
              max="5"
              value={development}
              onChange={(e) => setDevelopment(Number(e.target.value))}
              className="accent-emerald-500"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{t('coach.engagement')}</Label>
              <span className="text-sm font-medium text-emerald-400">{engagement}</span>
            </div>
            <Input
              type="range"
              min="1"
              max="5"
              value={engagement}
              onChange={(e) => setEngagement(Number(e.target.value))}
              className="accent-emerald-500"
            />
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-300">Average Score</span>
            <span className="text-xl font-bold text-emerald-400">{totalScore.toFixed(1)}/5</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional feedback..."
            className="mt-2 w-full rounded-md border border-ace-border bg-gray-800 px-3 py-2 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          {t('coach.evaluate')}
        </Button>
      </CardContent>
    </Card>
  )
}
