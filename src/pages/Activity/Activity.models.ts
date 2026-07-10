
export type HabitType = 'count' | 'duration'
export type Category = 'health' | 'learning' | 'work' | 'house' | 'other'

export interface Habit {
  id: string
  name: string
  category: Category
  color: string
  createdAt: string
  type: HabitType
  /** count=N times | duration=N minutes */
  goal: number
  /** date (YYYY-MM-DD) → current progress 0..goal */
  completionData: Record<string, number>
}

export interface HabitProgress {
  id: string
  habitId: string
  day: string      // YYYY-MM-DD
  progress: number
}

export interface CreateHabitInput {
  name: string
  category: Category
  color: string
  type: HabitType
  goal: number
}
