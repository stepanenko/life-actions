import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models"
import { supabase } from "#/utils/supabase"

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at')

  if (error) throw error

  return data
}

export async function getHabitProgress(): Promise<HabitProgress[]> {
  const { data, error } = await supabase
    .from('habit_progress')
    .select('*')

  if (error) throw error

  return data
}
