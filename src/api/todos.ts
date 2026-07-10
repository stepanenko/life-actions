import { supabase } from "#/utils/supabase"

type Todo = {
  id: number
  text: string
  completed: boolean
}

export async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at')

  if (error) throw error

  return data
}
