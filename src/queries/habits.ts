import { queryOptions } from "@tanstack/react-query";

import { getHabits } from "#/api/habits";
import { getHabitProgress } from "#/api/habitProgress";

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
