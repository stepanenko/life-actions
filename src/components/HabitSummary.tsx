import { Flame, Hash, Sparkles } from "lucide-react"

import { CATEGORIES, HABIT_TYPE_CONFIG } from "#/pages/Activity/Activity.constants"
import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models"
import { calculateStreak, getHabitStats } from "#/pages/Activity/Activity.helpers"

type HabitSummaryProps = {
  habit: Habit
  habitProgress: HabitProgress[]
}

export function HabitSummary({ habit, habitProgress }: HabitSummaryProps) {
  const CatIcon = CATEGORIES[habit.category]?.icon ?? Sparkles
  const catBadge = CATEGORIES[habit.category]?.defaultBg ?? ""
  const TypeIcon = HABIT_TYPE_CONFIG[habit.type]?.icon ?? Hash

  const streak = calculateStreak(habitProgress, habit.id, habit.goal)

  const { todayProgress, todayComplete, totalCompletions } = getHabitStats(habit, habitProgress)

  return (
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${catBadge}`}>
          <CatIcon size={11} />
          {CATEGORIES[habit.category]?.label}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-semibold text-[var(--sea-ink-soft)]">
          <TypeIcon size={11} />
          {habit.type === "count" ? `${habit.goal}x daily` : `${habit.goal} min`}
        </span>

        {streak > 0 && (
          <span className="inline-flex items-center gap-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-500 dark:text-amber-400">
            <Flame size={11} className="fill-current" />
            {streak} {streak === 1 ? "day" : "days"} streak
          </span>
        )}
      </div>

      <h2 className="mt-2.5 mb-1 truncate text-base font-bold text-[var(--sea-ink)]" title={habit.name}>
        {habit.name}
      </h2>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--sea-ink-soft)]">
        <span>
          Done{" "}
          <span className="font-semibold text-[var(--sea-ink)]">{totalCompletions}</span>{" "}
          days
        </span>
        {todayProgress > 0 && (
          <span className={todayComplete ? "font-semibold text-[var(--sea-ink)]" : ""}>
            Today: {habit.type === "duration" ? `${todayProgress}/${habit.goal} min` : `${todayProgress}/${habit.goal}x`}
          </span>
        )}
      </div>
    </div>
  )
}
