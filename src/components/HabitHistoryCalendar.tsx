import { useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react"

import type { Habit } from "#/pages/Activity/Activity.models"

type HabitHistoryCalendarProps = {
  habit: Habit
  onClose: () => void
}

type ViewMode = "month" | "year"

type CalendarDay = {
  date: Date
  inCurrentMonth: boolean
  isCompleted: boolean
  progressValue: number
  progressLabel: string | null
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatProgressLabel(habit: Habit, progressValue: number) {
  if (habit.type === "duration") {
    return `${progressValue}m`
  }

  return `${progressValue}/${habit.goal}`
}

export function HabitHistoryCalendar({ habit, onClose }: HabitHistoryCalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")

  const monthDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
    const lastDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0)
    const startDay = firstDayOfMonth.getDay()
    const totalDays = lastDayOfMonth.getDate()

    const days: CalendarDay[] = []

    for (let index = 0; index < startDay; index += 1) {
      const date = new Date(firstDayOfMonth)
      date.setDate(firstDayOfMonth.getDate() - (startDay - index))
      const progressValue = habit.completionData[formatDateKey(date)] ?? 0
      const isCompleted = progressValue >= habit.goal
      days.push({
        date,
        inCurrentMonth: false,
        isCompleted,
        progressValue,
        progressLabel: !isCompleted && progressValue > 0 ? formatProgressLabel(habit, progressValue) : null,
      })
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
      const progressValue = habit.completionData[formatDateKey(date)] ?? 0
      const isCompleted = progressValue >= habit.goal
      days.push({
        date,
        inCurrentMonth: true,
        isCompleted,
        progressValue,
        progressLabel: !isCompleted && progressValue > 0 ? formatProgressLabel(habit, progressValue) : null,
      })
    }

    const remainingCells = (7 - (days.length % 7)) % 7
    for (let index = 1; index <= remainingCells; index += 1) {
      const date = new Date(lastDayOfMonth)
      date.setDate(lastDayOfMonth.getDate() + index)
      const progressValue = habit.completionData[formatDateKey(date)] ?? 0
      const isCompleted = progressValue >= habit.goal
      days.push({
        date,
        inCurrentMonth: false,
        isCompleted,
        progressValue,
        progressLabel: !isCompleted && progressValue > 0 ? formatProgressLabel(habit, progressValue) : null,
      })
    }

    return days
  }, [habit.completionData, habit.goal, viewDate])

  const yearMonths = useMemo(() => {
    const year = viewDate.getFullYear()

    return Array.from({ length: 12 }, (_, monthIndex) => {
      const firstDayOfMonth = new Date(year, monthIndex, 1)
      const lastDayOfMonth = new Date(year, monthIndex + 1, 0)
      const startDay = firstDayOfMonth.getDay()
      const totalDays = lastDayOfMonth.getDate()
      const daySquares: Array<{ day: number; isCompleted: boolean; hasProgress: boolean }> = []
      let completedCount = 0

      for (let index = 0; index < startDay; index += 1) {
        daySquares.push({ day: 0, isCompleted: false, hasProgress: false })
      }

      for (let day = 1; day <= totalDays; day += 1) {
        const date = new Date(year, monthIndex, day)
        const progressValue = habit.completionData[formatDateKey(date)] ?? 0
        const isCompleted = progressValue >= habit.goal
        if (isCompleted) {
          completedCount += 1
        }

        daySquares.push({ day, isCompleted, hasProgress: progressValue > 0 })
      }

      const remainingCells = (7 - (daySquares.length % 7)) % 7
      for (let index = 0; index < remainingCells; index += 1) {
        daySquares.push({ day: 0, isCompleted: false, hasProgress: false })
      }

      return {
        monthIndex,
        label: firstDayOfMonth.toLocaleDateString("en-US", { month: "short" }),
        completedCount,
        totalDays,
        daySquares,
      }
    })
  }, [habit.completionData, habit.goal, viewDate])

  const completedCount = monthDays.filter((day) => day.inCurrentMonth && day.isCompleted).length

  const handleNavigate = (direction: -1 | 1) => {
    if (viewMode === "year") {
      setViewDate(new Date(viewDate.getFullYear() + direction, viewDate.getMonth(), 1))
      return
    }

    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + direction, 1))
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(15,27,31,0.6)] px-4 py-6 backdrop-blur-sm">
      <div className="island-shell relative w-full max-w-xl rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_24px_80px_rgba(23,58,64,0.24)]">
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
            aria-label="Close history"
          >
            <X size={18} />
          </button>

          <button
            type="button"
            onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
            className="cursor-pointer rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
          >
            {viewMode === "month" ? "Year view" : "Month view"}
          </button>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              <CalendarDays size={14} />
              Habit history
            </div>
            <h2 className="m-0 text-xl font-bold text-[var(--sea-ink)]">{habit.name}</h2>
            <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
              {habit.type === "duration"
                ? `Goal: ${habit.goal} minutes per day`
                : `Goal: ${habit.goal} times per day`}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleNavigate(-1)}
            className="cursor-pointer rounded-full border border-[var(--line)] bg-[var(--chip-bg)] p-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
            aria-label={viewMode === "year" ? "Previous year" : "Previous month"}
          >
            <ChevronLeft size={16} />
          </button>

          <div className="text-sm font-semibold text-[var(--sea-ink)]">
            {viewMode === "month"
              ? viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
              : viewDate.getFullYear().toString()}
          </div>

          <button
            type="button"
            onClick={() => handleNavigate(1)}
            className="cursor-pointer rounded-full border border-[var(--line)] bg-[var(--chip-bg)] p-2 text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
            aria-label={viewMode === "year" ? "Next year" : "Next month"}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {viewMode === "month" ? (
          <>
            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold uppercase tracking-wider text-[var(--sea-ink-soft)]">
              {WEEK_DAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {monthDays.map((day) => (
                <div
                  key={day.date.toISOString()}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border px-1 text-sm font-semibold ${
                    day.inCurrentMonth
                      ? day.isCompleted
                        ? "border-emerald-500/10 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                        : day.progressLabel
                          ? "border-[var(--lagoon-deep)]/6 bg-[var(--lagoon-deep)]/5 text-[var(--sea-ink)]"
                          : "border-[var(--lagoon-deep)]/12 bg-[var(--chip-bg)] text-[var(--sea-ink-soft)]"
                      : "border-transparent bg-transparent text-[var(--sea-ink-soft)]/35"
                  }`}
                >
                  <span>{day.date.getDate()}</span>
                  {day.isCompleted && day.inCurrentMonth && <span className="mt-0.5 text-[10px]">Done</span>}
                  {day.progressLabel && day.inCurrentMonth && (
                    <span className="mt-0.5 text-[10px] leading-none">{day.progressLabel}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {yearMonths.map((month) => (
              <button
                key={month.monthIndex}
                type="button"
                style={{ height: 135 }}
                onClick={() => {
                  setViewDate(new Date(viewDate.getFullYear(), month.monthIndex, 1))
                  setViewMode("month")
                }}
                className="cursor-pointer flex flex-col justify-between rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-2 text-left transition hover:border-[var(--lagoon-deep)]/30 hover:bg-[var(--link-bg-hover)]"
              >
                <div className="text-[10px] font-semibold text-[var(--sea-ink)]">{month.label}</div>
                <div style={{ padding: "0 4px" }} className="grid grid-cols-7 gap-1">
                  {month.daySquares.map((daySquare, index) => (
                    <div
                      style={{ height: 10, width: 10 }}
                      key={`${month.monthIndex}-${daySquare.day || "empty"}-${index}`}
                      className={`aspect-square w-full rounded-[2px] ${
                        daySquare.day === 0
                          ? "transparent"
                          : daySquare.isCompleted
                            ? "bg-emerald-500/70"
                            : daySquare.hasProgress
                              ? "bg-emerald-500/30"
                              : "bg-[var(--line)]/60"
                      }`}
                    />
                  ))}
                </div>
                <div className="text-[9px] uppercase tracking-wider text-[var(--sea-ink-soft)]">
                  {month.completedCount}/{month.totalDays}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] px-3 py-2 text-sm text-[var(--sea-ink-soft)]">
          <span>{completedCount} completed days</span>
          <span>{habit.type === "duration" ? `${habit.goal} min goal` : `${habit.goal}x goal`}</span>
        </div>
      </div>
    </div>
  )
}
