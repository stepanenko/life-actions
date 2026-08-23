import { supabase } from "#/utils/supabase"
import type { CreateHabitInput, Habit } from "#/pages/Activity/Activity.models"

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('created_at')

  if (error) throw error

  return data
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
