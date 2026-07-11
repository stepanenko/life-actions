import { useQuery } from "@tanstack/react-query"

import { habitProgressQueryOptions, habitsQueryOptions } from "#/queries/habits"

export const useHabits = () => {
  return useQuery(habitsQueryOptions())
}

export const useHabitProgress = () => {
  return useQuery(habitProgressQueryOptions())
}
