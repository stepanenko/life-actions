import { createFileRoute } from '@tanstack/react-router'
import { todosQueryOptions } from "#/queries/todos"
import { About } from "#/pages/About/About"

export const Route = createFileRoute('/about')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(todosQueryOptions()),
  component: About,
})
