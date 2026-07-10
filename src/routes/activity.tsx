import { createFileRoute } from "@tanstack/react-router"
import { ActivityPage } from "#/pages/Activity/Activity"
import { habitsQueryOptions } from "#/queries/habits"

export const Route = createFileRoute("/activity")({
  loader: ({ context }) =>
      context.queryClient.ensureQueryData(habitsQueryOptions()),
  component: ActivityPage,
})
