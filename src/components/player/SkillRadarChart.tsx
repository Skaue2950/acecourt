import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { useTranslation } from '@/lib/i18n'
import { SkillRadarChartProps } from '@/types'

export function SkillRadarChart({
  skills,
  language = 'da',
  showBenchmark = false,
  benchmarkSkills,
}: SkillRadarChartProps) {
  const t = useTranslation()

  const skillLabels = {
    da: {
      forehand: 'Forhand',
      backhand: 'Backhand',
      serve: 'Servis',
      volley: 'Volley',
      footwork: 'Fodarbejde',
      fitness: 'Fitness',
    },
    en: {
      forehand: 'Forehand',
      backhand: 'Backhand',
      serve: 'Serve',
      volley: 'Volley',
      footwork: 'Footwork',
      fitness: 'Fitness',
    },
  }

  const data = [
    { name: skillLabels[language].forehand, value: skills.forehand, benchmark: benchmarkSkills?.forehand },
    { name: skillLabels[language].backhand, value: skills.backhand, benchmark: benchmarkSkills?.backhand },
    { name: skillLabels[language].serve, value: skills.serve, benchmark: benchmarkSkills?.serve },
    { name: skillLabels[language].volley, value: skills.volley, benchmark: benchmarkSkills?.volley },
    { name: skillLabels[language].footwork, value: skills.footwork, benchmark: benchmarkSkills?.footwork },
    { name: skillLabels[language].fitness, value: skills.fitness, benchmark: benchmarkSkills?.fitness },
  ]

  return (
    <div className="w-full h-auto min-h-[300px] md:min-h-[400px]">
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid stroke="#1f2937" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="name"
            stroke="#9ca3af"
            tick={{ fill: '#d1d5db', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            stroke="#4b5563"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
          />
          <Radar
            name="Dine færdigheder"
            dataKey="value"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.7}
            dot={{ fill: '#34d399', r: 5 }}
            activeDot={{ r: 7, fill: '#6ee7b7' }}
          />
          {showBenchmark && benchmarkSkills && (
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#6b7280"
              fill="#6b7280"
              fillOpacity={0.2}
              dot={{ fill: '#9ca3af', r: 3 }}
            />
          )}
          {showBenchmark && <Legend wrapperStyle={{ paddingTop: '20px' }} />}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
