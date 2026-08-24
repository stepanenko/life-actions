import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { queryClient } from "#/router"
import { addHabit, deleteHabit, updateHabit } from "#/api/habits"
import { addHabitProgress, updateHabitProgress } from "#/api/habitProgress"
import { habitProgressQueryOptions, habitsQueryOptions } from "#/queries/habits"
import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models"

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

  return { habits: habits ?? [], createHabit: createHabit.mutate, editHabit: editHabit.mutate }
}

export function useDeleteHabit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHabit,
    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({ queryKey: ['habits'] })
      await queryClient.cancelQueries({ queryKey: ['habitProgress'] })

      const previousHabits = queryClient.getQueryData<Habit[]>(['habits'])
      const previousProgress = queryClient.getQueryData<HabitProgress[]>(['habitProgress'])

      queryClient.setQueryData<Habit[]>(['habits'], (old) =>
        old?.filter((h) => h.id !== habitId) ?? []
      )
      queryClient.setQueryData<HabitProgress[]>(['habitProgress'], (old) =>
        old?.filter((p) => p.habit_id !== habitId) ?? []
      )

      return { previousHabits, previousProgress }
    },
    onError: (_err, _habitId, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(['habits'], context.previousHabits)
      }
      if (context?.previousProgress) {
        queryClient.setQueryData(['habitProgress'], context.previousProgress)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] })
      queryClient.invalidateQueries({ queryKey: ['habitProgress'] })
    },
  }).mutate
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
    habitProgress: habitProgress ?? [],
    createHabitProgress: createHabitProgress.mutate,
    editHabitProgress: editHabitProgress.mutate,
  }
}
