
import { useLocalHabits } from "#/context/localHabitsContext";
import { calculateStreak, getLocalDateString } from "#/pages/Activity/Activity.helpers";
import { Award, Calendar, Flame } from "lucide-react"

export function StatsRow() {
  const { localHabits } = useLocalHabits()
  
  const todayStr = getLocalDateString(0)

  const habitsCount = localHabits.length

  const completedTodayCount = localHabits.filter(
    (h) => (h.completionData[todayStr] ?? 0) >= h.goal,
  ).length

  const todayProgressPercent =
    habitsCount > 0
      ? Math.round((completedTodayCount / habitsCount) * 100)
      : 0

  const maxStreak =
    habitsCount > 0
      ? Math.max(
          ...localHabits.map((h) => calculateStreak(h.completionData, h.goal)),
        )
      : 0

  const totalCompletionsAllTime = localHabits.reduce(
    (acc, h) =>
      acc +
      Object.values(h.completionData).filter((v) => v >= h.goal).length,
    0,
  )

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="island-shell flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(50,143,151,0.15)] text-[var(--lagoon-deep)]">
          <Calendar size={24} />
        </div>
        <div>
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-[var(--sea-ink-soft)]">
            Today's Progress
          </p>
          <h3 className="mt-1 m-0 text-xl font-bold text-[var(--sea-ink)]">
            {completedTodayCount} / {habitsCount}{" "}
            <span className="text-sm font-medium text-[var(--sea-ink-soft)]">
              ({todayProgressPercent}%)
            </span>
          </h3>
        </div>
      </div>

      <div className="island-shell flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <Flame size={24} />
        </div>
        <div>
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-[var(--sea-ink-soft)]">
            Best Streak
          </p>
          <h3 className="mt-1 m-0 text-xl font-bold text-[var(--sea-ink)]">
            {maxStreak} {maxStreak === 1 ? "day" : "days"}
          </h3>
        </div>
      </div>

      <div className="island-shell flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 backdrop-blur-md">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
          <Award size={24} />
        </div>
        <div>
          <p className="m-0 text-xs font-medium uppercase tracking-wider text-[var(--sea-ink-soft)]">
            Total Completions
          </p>
          <h3 className="mt-1 m-0 text-xl font-bold text-[var(--sea-ink)]">
            {totalCompletionsAllTime}{" "}
            <span className="text-sm font-medium text-[var(--sea-ink-soft)]">
              days
            </span>
          </h3>
        </div>
      </div>
    </section>
  )
}
