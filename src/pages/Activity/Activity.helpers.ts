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

// ─── Demo habits ──────────────────────────────────────────────────────────────

export function getDemoHabits(): Habit[] {
  const t = getLocalDateString(0)
  const y = getLocalDateString(1)
  const d2 = getLocalDateString(2)
  const d3 = getLocalDateString(3)
  const d4 = getLocalDateString(4)

  return [
    {
      id: 'demo-1',
      name: 'Hydrate 3L Water',
      category: 'health',
      color: 'emerald',
      createdAt: d4,
      type: 'count',
      goal: 3,
      completionData: { [t]: 3, [y]: 3, [d2]: 3, [d3]: 3 },
    },
    {
      id: 'demo-2',
      name: 'Learn Java',
      category: 'work',
      color: 'purple',
      createdAt: d4,
      type: 'duration',
      goal: 20,
      completionData: { [y]: 20, [d2]: 20, [d3]: 20, [t]: 10 },
    },
    {
      id: 'demo-3',
      name: 'Read Technical Articles',
      category: 'learning',
      color: 'blue',
      createdAt: d4,
      type: 'count',
      goal: 3,
      completionData: { [y]: 3, [d2]: 2, [d3]: 3, [t]: 1 },
    },
  ]
}

// ─── Streak calculation ───────────────────────────────────────────────────────

export function calculateStreak(completionData: Record<string, number>, goal: number): number {
  if (!completionData || Object.keys(completionData).length === 0) return 0

  const isCompleted = (date: string) => (completionData[date] ?? 0) >= goal

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
