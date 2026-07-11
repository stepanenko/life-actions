
import type { Habit } from "#/pages/Activity/Activity.models"
import { CalendarDays, Pencil, Trash2 } from "lucide-react"
import { EditHabitModal } from "./EditHabitModal";
import { useState } from "react";
import { HabitHistoryCalendar } from "./HabitHistoryCalendar";
import { useLocalHabits } from "#/context/localHabitsContext";

interface HabitActionsProps {
  habit: Habit;
}

export const HabitActions = ({ habit }: HabitActionsProps) => {
  const [showEditForm, setShowEditForm] = useState(false)
  const [habitHistory, setHabitHistory] = useState<Habit | null>(null)

  const { localHabits, saveLocalHabits } = useLocalHabits()

  const saveHabits = (updated: Habit[]) => {
    saveLocalHabits(updated)
  }

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      saveHabits(localHabits.filter((h) => h.id !== id))
    }
  }

  return (
    <div className="ml-2 flex h-12 items-center gap-1 border-l border-[var(--line)] pl-4">
      <button
        type="button"
        onClick={() => setHabitHistory(habit)}
        className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-[var(--lagoon-deep)]/10 hover:text-[var(--lagoon-deep)]"
        aria-label={`View history for ${habit.name}`}
        title="View History"
      >
        <CalendarDays size={16} />
      </button>
      <button
        type="button"
        onClick={() => setShowEditForm(true)}
        className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-[var(--lagoon-deep)]/10 hover:text-[var(--lagoon-deep)]"
        aria-label={`Edit ${habit.name}`}
        title="Edit Habit"
      >
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={() => handleDeleteHabit(habit.id)}
        className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-rose-500/10 hover:text-rose-500"
        aria-label={`Delete ${habit.name}`}
        title="Delete Habit"
      >
        <Trash2 size={16} />
      </button>

      <EditHabitModal habit={habit} isOpen={showEditForm} onClose={() => setShowEditForm(false)} />

      {habitHistory && (
        <HabitHistoryCalendar habit={habitHistory} onClose={() => setHabitHistory(null)} />
      )}
    </div>
  )
}