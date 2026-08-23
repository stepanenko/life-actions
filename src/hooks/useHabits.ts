import { useMutation, useQuery } from "@tanstack/react-query"

import { queryClient } from "#/router"
import { addHabit, updateHabit } from "#/api/habits"
import { addHabitProgress, updateHabitProgress } from "#/api/habitProgress"
import { habitProgressQueryOptions, habitsQueryOptions } from "#/queries/habits"

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
  const { data: habitProgress } = useQuery(habitProgressQueryOptions())

  const createHabitProgress = useMutation({
    mutationFn: addHabitProgress,
    onSuccess: (data) => {
      console.log('mutation succeeded:', data)
      queryClient.invalidateQueries({ queryKey: ['habitProgress'] })
    },
    onError: (err) => {
      console.log('mutation failed:', err)
    },
  })

  const editHabitProgress = useMutation({
    mutationFn: updateHabitProgress,
    onSuccess: (data) => {
      console.log('mutation succeeded:', data)
      queryClient.invalidateQueries({ queryKey: ['habitProgress'] })
    },
    onError: (err) => {
      console.log('mutation failed:', err)
    },
  })

  return {
    habitProgress,
    createHabitProgress: createHabitProgress.mutate,
    editHabitProgress: editHabitProgress.mutate,
  }
}
