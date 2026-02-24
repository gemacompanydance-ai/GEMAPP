import { differenceInWeeks, startOfWeek, endOfWeek, format } from 'date-fns'
import { es } from 'date-fns/locale'

const ACADEMY_START_DATE = new Date('2025-03-01')

export function getCurrentWeek(): number {
  const now = new Date()
  const diff = differenceInWeeks(now, ACADEMY_START_DATE)
  return Math.max(1, diff + 1)
}

export function getWeekDateRange(weekNumber: number): {
  start: Date
  end: Date
} {
  const start = new Date(ACADEMY_START_DATE)
  start.setDate(start.getDate() + (weekNumber - 1) * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  return { start, end }
}

export function formatWeekLabel(weekNumber: number): string {
  const { start, end } = getWeekDateRange(weekNumber)
  const startStr = format(start, 'd MMM', { locale: es })
  const endStr = format(end, 'd MMM', { locale: es })
  return `Semana ${weekNumber} · ${startStr} - ${endStr}`
}

export function isCurrentWeek(weekNumber: number): boolean {
  return weekNumber === getCurrentWeek()
}

export function getWeekStart(): Date {
  return startOfWeek(new Date(), { weekStartsOn: 1 })
}

export function getWeekEnd(): Date {
  return endOfWeek(new Date(), { weekStartsOn: 1 })
}
