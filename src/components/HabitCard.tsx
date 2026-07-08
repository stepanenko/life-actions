import { CalendarDays, Pencil, Trash2 } from "lucide-react"
import { HabitSummary } from "#/components/HabitSummary"
import { ProgressDrop } from "#/components/ProgressDrop"

type HabitCardProps = {
  habit: Habit
  streak: number
  totalCompletions: number
  todayProgress: number
  todayComplete: boolean
  dateTimeline: Array<{
    dateStr: string
    dayName: string
    dayNum: string
    isToday: boolean
  }>
  onEdit: (habit: Habit) => void
  onDelete: (id: string) => void
  onViewHistory: (habit: Habit) => void
  onCycle: (habitId: string, dateStr: string, event: React.MouseEvent<HTMLButtonElement>) => void
}

export function HabitCard({
  habit,
  streak,
  totalCompletions,
  todayProgress,
  todayComplete,
  dateTimeline,
  onEdit,
  onDelete,
  onViewHistory,
  onCycle,
}: HabitCardProps) {
  return (
    <article className="island-shell flex flex-col justify-between gap-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 backdrop-blur-md transition-all hover:border-[var(--lagoon-deep)]/30 hover:shadow-[0_12px_32px_rgba(30,90,72,0.04)] sm:flex-row sm:items-center">
      <HabitSummary
        habit={habit}
        streak={streak}
        totalCompletions={totalCompletions}
        todayProgress={todayProgress}
        todayComplete={todayComplete}
      />

      <div className="flex items-center gap-4 sm:self-center">
        <div className="flex items-center gap-2 sm:gap-3">
          {dateTimeline.map(({ dateStr, dayName, dayNum, isToday }) => (
            <div key={dateStr} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--sea-ink-soft)]">
                {dayName}
              </span>

              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  isToday
                    ? "border border-[var(--lagoon-deep)]/30 bg-[var(--lagoon-deep)]/20 text-[var(--lagoon-deep)]"
                    : "text-[var(--sea-ink-soft)]/60"
                }`}
              >
                {dayNum}
              </span>

              <ProgressDrop
                habit={habit}
                dateStr={dateStr}
                dayName={dayName}
                onCycle={(event) => onCycle(habit.id, dateStr, event)}
              />
            </div>
          ))}
        </div>

        <div className="ml-2 flex h-12 items-center gap-1 border-l border-[var(--line)] pl-4">
          <button
            type="button"
            onClick={() => onViewHistory(habit)}
            className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-[var(--lagoon-deep)]/10 hover:text-[var(--lagoon-deep)]"
            aria-label={`View history for ${habit.name}`}
            title="View History"
          >
            <CalendarDays size={16} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(habit)}
            className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-[var(--lagoon-deep)]/10 hover:text-[var(--lagoon-deep)]"
            aria-label={`Edit ${habit.name}`}
            title="Edit Habit"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(habit.id)}
            className="cursor-pointer rounded-xl p-2 text-[var(--sea-ink-soft)]/40 transition hover:bg-rose-500/10 hover:text-rose-500"
            aria-label={`Delete ${habit.name}`}
            title="Delete Habit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}
