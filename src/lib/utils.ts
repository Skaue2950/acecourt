import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100))
}

export function calculateXpForNextLevel(currentLevel: number): number {
  return (currentLevel + 1) ** 2 * 100
}

export function calculateXpToNextLevel(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const currentLevelXp = currentLevel ** 2 * 100
  const nextLevelXp = calculateXpForNextLevel(currentLevel)
  return nextLevelXp - currentLevelXp
}

export function calculateXpProgress(currentXp: number): number {
  const currentLevel = calculateLevel(currentXp)
  const currentLevelXp = currentLevel ** 2 * 100
  const nextLevelXp = calculateXpForNextLevel(currentLevel)
  return ((currentXp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
}

export function getStreakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 2.0
  if (streakDays >= 14) return 1.5
  if (streakDays >= 7) return 1.25
  return 1.0
}

export function getMDEColor(score: number): string {
  if (score >= 13) return 'emerald'
  if (score >= 10) return 'green'
  if (score >= 6) return 'yellow'
  return 'red'
}

export function getMDEBgClass(score: number): string {
  if (score >= 13) return 'bg-emerald-500/20 border-emerald-500/50 mde-outstanding'
  if (score >= 10) return 'bg-emerald-500/15 border-emerald-500/40 mde-excellent'
  if (score >= 6) return 'bg-yellow-500/10 border-yellow-500/30'
  return 'bg-red-500/10 border-red-500/30'
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('da-DK', {
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function formatTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('da-DK', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDistanceToNow(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`

  return d.toLocaleDateString('da-DK')
}

export function truncateText(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text
}

export function generateInviteCode(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase()
}
