import { AlertCircle } from "lucide-react"

type EmptyHabitsStateProps = {
  onAddHabit: () => void
}

export function EmptyHabitsState({ onAddHabit }: EmptyHabitsStateProps) {
  return (
    <div className="island-shell flex flex-col items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-16 text-center">
      <AlertCircle size={48} className="mb-4 text-[var(--sea-ink-soft)]/40" />
      <h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">
        No Habits Added Yet
      </h2>
      <p className="mt-2 mb-6 max-w-sm text-sm text-[var(--sea-ink-soft)]">
        Start structuring your daily routine by adding your first habit!
      </p>
      <button
        type="button"
        onClick={onAddHabit}
        className="cursor-pointer rounded-full bg-[var(--sea-ink)] px-5 py-2.5 text-sm font-semibold text-white transition dark:bg-[var(--lagoon-deep)] dark:text-[var(--sand)]"
      >
        Get Started
      </button>
    </div>
  )
}
