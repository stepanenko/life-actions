
// ─── Types ────────────────────────────────────────────────────────────────────

type HabitType = 'count' | 'duration'

interface Habit {
  id: string
  name: string
  category: 'health' | 'mind' | 'learning' | 'productivity' | 'other'
  color: string
  createdAt: string
  type: HabitType
  /** count=N times | duration=N minutes */
  goal: number
  /** date (YYYY-MM-DD) → current progress 0..goal */
  completionData: Record<string, number>
}
