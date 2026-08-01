import type { MouseEvent } from "react"
import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models"
import { COLOR_PALETTES } from "#/pages/Activity/Activity.constants"
import { getStep } from "#/pages/Activity/Activity.helpers"
import { useLocalHabits } from "#/context/localHabitsContext"

interface ProgressDropProps {
  habit: Habit
  dateStr: string
  dayName: string
  habitProgress: HabitProgress[]
}

export function ProgressBox({ habit, dateStr, dayName, habitProgress }: ProgressDropProps) {
  const { localProgress, saveLocalProgress } = useLocalHabits()

  const current = habitProgress.find(hp => hp.day === dateStr && hp.habit_id === habit.id)?.progress
    ?? localProgress.find(hp => hp.day === dateStr && hp.habit_id === habit.id)?.progress
    ?? 0

  const fillPercent = habit.goal > 0
    ? Math.min((current / habit.goal) * 100, 100)
    : 0
  const overflowPercent = habit.goal > 0
    ? Math.max(Math.min(((current % habit.goal) / habit.goal) * 100, 100), 0)
    : 0
  const overflowVisible = overflowPercent > 0 && overflowPercent < 100
  const isComplete = current >= habit.goal
  const mainFillHeight = isComplete
    ? 44
    : current > 0 ? Math.max(1, (44 * fillPercent) / 100) : 0
  const overflowHeight = overflowVisible ? Math.max(1, (44 * overflowPercent) / 100) : 0
  const mainFillOpacity = current > 0 || isComplete ? 1 : 0
  const overflowOpacity = overflowVisible ? 1 : 0
  const palette = COLOR_PALETTES[habit.color] ?? COLOR_PALETTES.emerald
  const baseFill = palette.fill
  const overflowFill = isComplete
    ? 'color-mix(in srgb, white 20%, ' + baseFill + ')'
    : baseFill
  const step = getStep(habit)
  const completionMultiplier = habit.goal > 0
    ? Math.max(1, Math.floor(current / habit.goal))
    : 0

  // Show a number label inside the drop while progress exists.
  const showProgressLabel = current > 0
  const progressLabel = habit.type === 'duration' ? `${current}m` : String(current)
  // Switch label color to white once fill passes the midpoint
  const innerLabelClass = fillPercent > 30 ? 'text-white' : palette.text

  const dayLabel = dayName
  const unitSuffix = habit.type === 'duration' ? ' min' : 'x'
  const title = isComplete
    ? `${dayLabel}: ${completionMultiplier}x complete. Click to add another completion. Shift-click fills 100%. Command-click clears.`
    : current > 0
      ? `${dayLabel}: ${current}/${habit.goal}${unitSuffix}. Click to add ${step}${habit.type === 'duration' ? ' min' : ''}. Shift-click fills 100%. Command-click clears.`
      : `${dayLabel}: Not started. Click to log. Shift-click fills 100%. Command-click clears.`
  const dropClipId = `drop-clip-${habit.id}-${dateStr}`.replace(
    /[^a-zA-Z0-9_-]/g,
    '-',
  )

  const updateProgress = (current: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.metaKey) return 0
    if (event.shiftKey) {
      const nextGoal = Math.floor(current / habit.goal + 1) * habit.goal
      return Math.max(habit.goal, nextGoal)
    }

    const step = getStep(habit)
    return current >= habit.goal ? current + step : Math.min(current + step, habit.goal)
  }

  const updateHabitProgress = (event: MouseEvent<HTMLButtonElement>) => {
    const dayProgress = localProgress.find(lp => lp.habit_id === habit.id && lp.day === dateStr)

    if (dayProgress) {
      dayProgress.progress = updateProgress(dayProgress.progress, event)
      saveLocalProgress([...localProgress])
    } else {
      const newHabitProgress: HabitProgress = {
        id: Date.now().toString(),
        habit_id: habit.id,
        day: dateStr,
        progress: updateProgress(0, event)
      }
      saveLocalProgress([...localProgress, newHabitProgress])
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => updateHabitProgress(event)}
      title={title}
      aria-label={title}
      className={`cursor-pointer relative flex h-11 w-11 flex-shrink-0 items-center justify-center border-0 p-0 ${palette.ring} ${
        isComplete ? `drop-shadow-md ${palette.glow}` : ''
      }`}
    >
      <svg
        viewBox="0 0 44 44"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <clipPath id={dropClipId}>
            <rect x="2" y="2" width="40" height="40" rx="4" ry="4" />
          </clipPath>
        </defs>
        <rect
          x="2"
          y="2"
          width="40"
          height="40"
          rx="4"
          ry="4"
          stroke={'var(--line)'}
          strokeWidth="1.5"
          fill="var(--chip-bg)"
        />
        <rect
          x="0"
          y={44 - mainFillHeight}
          width="44"
          height={mainFillHeight}
          fill={baseFill}
          clipPath={`url(#${dropClipId})`}
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: mainFillOpacity }}
        />
        <rect
          x="0"
          y={44 - overflowHeight}
          width="44"
          height={overflowHeight}
          fill={overflowFill}
          clipPath={`url(#${dropClipId})`}
          className="transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ opacity: overflowOpacity }}
        />
      </svg>

      {/* Progress and Multiplier */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {completionMultiplier > 1 ? (
          <span
            key={`${habit.id}-${dateStr}-${completionMultiplier}`}
            className="absolute top-2.5 text-[8px] font-extrabold leading-none text-white animate-[pop_420ms_ease-out]"
          >
            {completionMultiplier}x
          </span>
        ) : null}
        {showProgressLabel ? (
          <span className={`absolute bottom-2 text-[9px] font-bold leading-none ${innerLabelClass}`}>
            {progressLabel}
          </span>
        ) : null}
      </div>
    </button>
  )
}
