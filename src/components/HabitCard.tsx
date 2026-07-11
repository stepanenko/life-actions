import { useMemo, useState } from "react"
import { HabitSummary } from "#/components/HabitSummary"
import { ProgressDrop } from "#/components/ProgressDrop"
import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models"
import { calculateStreak, getDayName, getDayNum, getHabitStats, getLocalDateString } from "#/pages/Activity/Activity.helpers"
import { HabitHistoryCalendar } from "./HabitHistoryCalendar"
import { HabitActions } from "./HabitActions"

type HabitCardProps = {
  habit: Habit
  progress?: HabitProgress[]
}

export function HabitCard({ habit, progress }: HabitCardProps) {
  const [habitHistory, setHabitHistory] = useState<Habit | null>(null)

  // 7-day timeline (oldest -> today)
  const dateTimeline = [6, 5, 4, 3, 2, 1, 0].map((offset) => ({
    dateStr: getLocalDateString(offset),
    dayName: getDayName(offset),
    dayNum: getDayNum(offset),
    isToday: offset === 0,
  }))

  const progressByHabit = useMemo(() => {
    console.log("progress", progress);
    
    const map = new Map<string, HabitProgress[]>()

    for (const p of progress ?? []) {
      const list = map.get(p.habit_id) ?? []
      list.push(p)
      map.set(p.habit_id, list)
    }

    console.log("map", map);
    
    return map
  }, [progress])

  const streak = calculateStreak(habit.completionData, habit.goal)
  const habitProgress = progressByHabit.get(habit.id) ?? []

  const { todayProgress, todayComplete, totalCompletions } = getHabitStats(habit, habitProgress)

  return (
    <article className="flex flex-col justify-between gap-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-all hover:border-[var(--lagoon-deep)]/30 hover:shadow-[0_12px_32px_rgba(30,90,72,0.04)] sm:flex-row sm:items-center">
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

              <ProgressDrop habit={habit} dateStr={dateStr} dayName={dayName} />
            </div>
          ))}
        </div>

        <HabitActions habit={habit} />
      </div>

      {habitHistory && (
        <HabitHistoryCalendar habit={habitHistory} onClose={() => setHabitHistory(null)} />
      )}
    </article>
  )
}
