import { useMutation, useQuery } from "@tanstack/react-query"

import { habitProgressQueryOptions, habitsQueryOptions } from "#/queries/habits"
import { addHabit, updateHabit } from "#/api/habits"
import { queryClient } from "#/router"

export const useHabits = () => {
  const { data: habits } = useQuery(habitsQueryOptions())

  const createHabit = useMutation({
    mutationFn: addHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
    onError: (err) => {
      console.log('mutation failed:', err)
    },
  })

  const editHabit = useMutation({
    mutationFn: updateHabit,
    onSuccess: (data) => {
      console.log('mutation succeeded:', data)
      queryClient.invalidateQueries({ queryKey: ['habits'] })
    },
    onError: (err) => {
      console.log('mutation failed:', err)
    },
  })

  return { habits, createHabit: createHabit.mutate, editHabit: editHabit.mutate }
}

export const useHabitProgress = () => {
  return useQuery(habitProgressQueryOptions())
}
