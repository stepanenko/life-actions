import { createFileRoute } from "@tanstack/react-router"
import { ActivityPage } from "#/pages/Activity/Activity"
import { habitProgressQueryOptions, habitsQueryOptions } from "#/queries/habits"

export const Route = createFileRoute("/activity")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(habitsQueryOptions()),
      context.queryClient.ensureQueryData(habitProgressQueryOptions()),
    ]),
  component: ActivityPage,
})
