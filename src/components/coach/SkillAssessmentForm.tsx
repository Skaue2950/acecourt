import React, { useState } from 'react'
import { Player } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTranslation } from '@/lib/i18n'

interface SkillAssessmentFormProps {
  player: Player
  onSubmit?: (skills: {
    forehand: number
    backhand: number
    serve: number
    volley: number
    footwork: number
    fitness: number
  }) => void
}

const skillKeys = [
  'forehand',
  'backhand',
  'serve',
  'volley',
  'footwork',
  'fitness',
] as const

export function SkillAssessmentForm({ player, onSubmit }: SkillAssessmentFormProps) {
  const t = useTranslation()
  const [skills, setSkills] = useState({
    forehand: 5,
    backhand: 5,
    serve: 5,
    volley: 5,
    footwork: 5,
    fitness: 5,
  })

  const handleSkillChange = (skill: keyof typeof skills, value: number) => {
    setSkills((prev) => ({
      ...prev,
      [skill]: value,
    }))
  }

  const handleSubmit = () => {
    onSubmit?.(skills)
  }

  const averageSkill =
    Object.values(skills).reduce((a, b) => a + b) / Object.keys(skills).length

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
            <p className="text-xs text-gray-400">Skill Assessment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {skillKeys.map((skill) => (
          <div key={skill}>
            <div className="mb-2 flex items-center justify-between">
              <Label className="capitalize">{t(`player.${skill}`)}</Label>
              <span className="text-sm font-medium text-emerald-400">{skills[skill]}/10</span>
            </div>
            <Input
              type="range"
              min="1"
              max="10"
              value={skills[skill]}
              onChange={(e) => handleSkillChange(skill, Number(e.target.value))}
              className="accent-emerald-500"
            />
          </div>
        ))}

        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-300">Average Skill Level</span>
            <span className="text-xl font-bold text-emerald-400">{averageSkill.toFixed(1)}/10</span>
          </div>
        </div>

        <Button onClick={handleSubmit} className="w-full">
          {t('coach.assessSkills')}
        </Button>
      </CardContent>
    </Card>
  )
}
