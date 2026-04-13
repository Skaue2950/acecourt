import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const xpData = [
  { date: 'Mon', xp: 1200 },
  { date: 'Tue', xp: 1900 },
  { date: 'Wed', xp: 1600 },
  { date: 'Thu', xp: 2200 },
  { date: 'Fri', xp: 2400 },
  { date: 'Sat', xp: 2100 },
  { date: 'Sun', xp: 1800 },
]

const attendanceData = [
  { name: 'Present', value: 85 },
  { name: 'Absent', value: 10 },
  { name: 'Late', value: 3 },
  { name: 'Excused', value: 2 },
]

export function AdminAnalytics() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-ace-border bg-ace-card">
        <CardHeader>
          <CardTitle>XP Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={xpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1a" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111811', border: '1px solid #1a2e1a' }}
                labelStyle={{ color: '#10b981' }}
              />
              <Line
                type="monotone"
                dataKey="xp"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="border-ace-border bg-ace-card">
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1a" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: '#111811', border: '1px solid #1a2e1a' }}
                labelStyle={{ color: '#10b981' }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
