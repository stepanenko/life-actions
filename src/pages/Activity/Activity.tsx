import { useState } from "react"

import { HeroHeader } from "#/components/HeroHeader"
import { StatsRow } from "#/components/StatsRow"
import { HabitsList } from "#/components/HabitsList"
import { EditHabitModal } from "#/components/EditHabitModal"

export function ActivityPage() {
  const [showEditForm, setShowEditForm] = useState(false)

  return (
    <main className="page-wrap px-4 pb-14 pt-8">
      <HeroHeader onAddHabit={() => setShowEditForm(true)} />

      <StatsRow />

      {/* ── New habits list ── */}
      <HabitsList />

      <EditHabitModal isOpen={showEditForm} onClose={() => setShowEditForm(false)} />
    </main>
  )
}
