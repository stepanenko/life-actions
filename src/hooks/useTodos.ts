import { todosQueryOptions } from "#/queries/todos"
import { useQuery } from "@tanstack/react-query"

export const useTodos = () => {
  return useQuery(todosQueryOptions())
}
