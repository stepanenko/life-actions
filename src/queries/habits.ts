import { queryOptions } from "@tanstack/react-query";

import { getHabits } from "#/api/habits";

export const habitsQueryOptions = () =>
  queryOptions({
    queryKey: ['habits'],
    queryFn: getHabits,
  })
