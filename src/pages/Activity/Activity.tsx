import { HeroHeader } from "#/components/HeroHeader"
import { StatsRow } from "#/components/StatsRow"

import { HabitsList } from "#/components/HabitsList"
import { LocalHabitsList } from "#/components/LocalHabitsList"
import { EditHabitModal } from "#/components/EditHabitModal"
import { useState } from "react"

export function ActivityPage() {
  const [showEditForm, setShowEditForm] = useState(false)

  return (
    <main className="page-wrap px-4 pb-14 pt-8">
      <HeroHeader onAddHabit={() => setShowEditForm(true)} />

      <StatsRow />

      {/* ── Old habits list ── */}
      <LocalHabitsList />

      {/* ── New habits list ── */}
      <HabitsList />

      <EditHabitModal isOpen={showEditForm} onClose={() => setShowEditForm(false)} />
    </main>
  )
}
