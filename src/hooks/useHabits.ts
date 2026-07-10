import { useQuery } from "@tanstack/react-query"

import { habitsQueryOptions } from "#/queries/habits"

export const useHabits = () => {
  return useQuery(habitsQueryOptions())
}
