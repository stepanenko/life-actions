import { supabase } from "#/utils/supabase";
import type { CreateHabitProgress, HabitProgress } from "#/pages/Activity/Activity.models";

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

export async function addHabitProgress(newHabitProgress: CreateHabitProgress) {
  const { data, error } = await supabase
    .from('habit_progress')
    .insert(newHabitProgress)
    .select()

  if (error) {
    console.error("Error updating habit progress:", error);
    throw error
  } else {
    console.log("Habit progress updated");
    return data
  }
}

export async function updateHabitProgress({ id, progress }: { id: string, progress: number }) {
  const { data, error } = await supabase
    .from('habit_progress')
    .update({ progress })
    .eq('id', id)
    .select()

  if (error) {
    console.error("Error updating habit progress:", error);
    throw error
  } else {
    console.log("Habit progress updated");
    return data
  }
}
