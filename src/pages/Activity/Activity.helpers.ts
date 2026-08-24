import type { Habit, HabitProgress } from "./Activity.models"

// ─── Date helpers ─────────────────────────────────────────────────────────────
// Use UTC here so SSR and the browser produce identical labels and streak keys.

function getKyivDate(offsetDays = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d;
}

export function getLocalDateString(offsetDays = 0): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(getKyivDate(offsetDays));
}

export function getDayName(offsetDays = 0): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Kyiv",
  }).format(getKyivDate(offsetDays));
}

export function getDayNum(offsetDays = 0): string {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: "Europe/Kyiv",
  }).format(getKyivDate(offsetDays));
}

// ─── Step size for duration habits ───────────────────────────────────────────
// Gives ≈ 4-6 clicks to reach goal

export function getDurationStep(goalMinutes: number): number {
  if (goalMinutes <= 20) return 5
  if (goalMinutes <= 60) return 10
  return 15
}

export function getStep(habit: Habit): number {
  return habit.type === 'duration' ? getDurationStep(habit.goal) : 1
}

// ─── Streak calculation ───────────────────────────────────────────────────────

export function calculateStreak(
  habitProgress: HabitProgress[],
  habitId: string,
  goal: number
): number {
  if (!habitProgress || habitProgress.length === 0) return 0

  const progressByDay = new Map<string, number>()
  for (const entry of habitProgress) {
    if (entry.habit_id !== habitId) continue
    const existing = progressByDay.get(entry.day) ?? 0
    progressByDay.set(entry.day, Math.max(existing, entry.progress))
  }

  const isCompleted = (date: string) => (progressByDay.get(date) ?? 0) >= goal

  const todayStr = getLocalDateString(0)
  const yesterdayStr = getLocalDateString(1)

  if (!isCompleted(todayStr) && !isCompleted(yesterdayStr)) return 0

  const checkDate = new Date()
  if (!isCompleted(todayStr)) {
    checkDate.setUTCDate(checkDate.getUTCDate() - 1)
  }

  let streakCount = 0
  while (true) {
    const yyyy = checkDate.getUTCFullYear()
    const mm = String(checkDate.getUTCMonth() + 1).padStart(2, '0')
    const dd = String(checkDate.getUTCDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`
    if (isCompleted(dateStr)) {
      streakCount++
      checkDate.setUTCDate(checkDate.getUTCDate() - 1)
    } else {
      break
    }
  }
  return streakCount
}

export function totalCompletionsAllTime(
  habitProgress: HabitProgress[],
  habitId: string,
  goal: number
): number {
  if (!habitProgress || habitProgress.length === 0) return 0

  const progressByDay = new Map<string, number>()
  for (const entry of habitProgress) {
    if (entry.habit_id !== habitId) continue
    // if there are duplicate entries for a day, keep the highest progress
    const existing = progressByDay.get(entry.day) ?? 0
    progressByDay.set(entry.day, Math.max(existing, entry.progress))
  }

  let total = 0
  for (const progress of progressByDay.values()) {
    if (progress >= goal) total++
  }
  return total
}

export function getHabitStats(habit: Habit, progress: HabitProgress[]) {
  const today = getLocalDateString(0)
  const todayProgress = progress.find((p => p.day === today))?.progress ?? 0

  return {
    todayProgress,
    todayComplete: todayProgress >= habit.goal,
    totalCompletions: progress.filter(
      (p) => p.progress >= habit.goal,
    ).length,
  }
}
