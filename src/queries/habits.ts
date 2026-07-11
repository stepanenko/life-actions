import { queryOptions } from "@tanstack/react-query";

import { getHabitProgress, getHabits } from "#/api/habits";

export const habitsQueryOptions = () =>
  queryOptions({
    queryKey: ['habits'],
    queryFn: getHabits,
  })

export const habitProgressQueryOptions = () =>
  queryOptions({
    queryKey: ['habitProgress'],
    queryFn: getHabitProgress,
  })
