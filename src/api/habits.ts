import type { CreateHabitInput, Habit, HabitProgress } from "#/pages/Activity/Activity.models"
import { supabase } from "#/utils/supabase"

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at')

  if (error) throw error

  return data
}

export async function getHabitProgress(): Promise<HabitProgress[] | undefined> {
  const { data, error } = await supabase
    .from('habit_progress')
    .select('*')

  if (error) {
    console.error("Error getting habit progress:", error);
  } else {
    return data
  }
}

export async function addHabit(newHabit: CreateHabitInput) {
  const { data, error } = await supabase
    .from('habits')
    .insert([newHabit])
    .select() // returns the inserted row(s)

  if (error) {
    console.error("Error inserting habit:", error);
    throw error
  } else {
    console.log("New habit inserted");
    return data
  }
}

export async function updateHabit({ id, ...updates }: CreateHabitInput & { id: string }) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    console.error("Error updating habit:", error);
    throw error
  } else {
    console.log("Habit updated");
    return data
  }
}
