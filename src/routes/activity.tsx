import { createFileRoute } from "@tanstack/react-router"
import { ActivityPage } from "#/pages/Activity/Activity"

export const Route = createFileRoute("/activity")({
  component: ActivityPage,
})
