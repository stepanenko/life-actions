import { AlertCircle, X } from "lucide-react"

import { CATEGORIES, COLOR_PALETTES, HABIT_TYPE_CONFIG } from "#/pages/Activity/Activity.constants"
import type { HabitType } from "#/pages/Activity/Activity.models"

type EditHabitModalProps = {
  isOpen: boolean
  title: string
  name: string
  category: keyof typeof CATEGORIES
  color: string
  type: HabitType
  goal: number
  errorMessage: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onNameChange: (value: string) => void
  onCategoryChange: (value: keyof typeof CATEGORIES) => void
  onColorChange: (value: string) => void
  onTypeChange: (value: HabitType) => void
  onGoalChange: (value: number) => void
}

export function EditHabitModal({
  isOpen,
  title,
  name,
  category,
  color,
  type,
  goal,
  errorMessage,
  onClose,
  onSubmit,
  onNameChange,
  onCategoryChange,
  onColorChange,
  onTypeChange,
  onGoalChange,
}: EditHabitModalProps) {
  if (!isOpen) return null

  const goalLabel = type === "duration" ? "minutes" : "times"
  const goalHelperText =
    type === "duration"
      ? `Each click logs ${Math.max(5, Math.min(15, Math.round(goal / 4)))} min · ${Math.max(1, Math.ceil(goal / Math.max(5, Math.min(15, Math.round(goal / 4)))))} clicks to complete`
      : `${goal} click${goal !== 1 ? "s" : ""} to complete`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,27,31,0.6)] px-4 py-6 backdrop-blur-sm">
      <div className="island-shell relative w-full max-w-2xl rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-[0_24px_80px_rgba(23,58,64,0.24)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="mb-5 pr-10 text-lg font-bold text-[var(--sea-ink)]">
          {title}
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="habitName"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink)]"
            >
              Habit Name
            </label>
            <input
              id="habitName"
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="e.g. Morning run, Drink water, Read articles…"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)]/50 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--lagoon-deep)]"
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink)]">
              Habit Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(HABIT_TYPE_CONFIG) as [HabitType, (typeof HABIT_TYPE_CONFIG)[HabitType]][]).map(([habitType, cfg]) => {
                const Icon = cfg.icon
                const isSelected = type === habitType
                return (
                  <button
                    key={habitType}
                    type="button"
                    onClick={() => onTypeChange(habitType)}
                    className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition ${
                      isSelected
                        ? "border-[var(--lagoon-deep)] bg-[var(--lagoon-deep)]/10 text-[var(--lagoon-deep)]"
                        : "border-[var(--line)] bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] hover:border-[var(--lagoon-deep)]/40 hover:text-[var(--sea-ink)]"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
            <p className="mt-1.5 text-xs text-[var(--sea-ink-soft)]">
              {HABIT_TYPE_CONFIG[type].description}
            </p>
          </div>

          <div>
            <label
              htmlFor="habitGoal"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink)]"
            >
              Daily Goal ({goalLabel})
            </label>
            <input
              id="habitGoal"
              type="number"
              min={1}
              max={type === "duration" ? 480 : 100}
              value={goal}
              onChange={(e) => onGoalChange(Math.max(1, Number(e.target.value)))}
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink)] transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--lagoon-deep)]"
            />
            <p className="mt-1.5 text-xs text-[var(--sea-ink-soft)]">{goalHelperText}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="habitCategory"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink)]"
              >
                Category
              </label>
              <select
                id="habitCategory"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value as keyof typeof CATEGORIES)}
                className="w-full cursor-pointer rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink)] transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--lagoon-deep)]"
              >
                {Object.entries(CATEGORIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--sea-ink)]">
                Color
              </p>
              <div className="flex items-center gap-3 py-2">
                {Object.entries(COLOR_PALETTES).map(([name, pal]) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onColorChange(name)}
                    title={name}
                    className={`h-7 w-7 cursor-pointer rounded-full transition-all ${pal.bg} ${
                      color === name
                        ? "scale-110 ring-4 ring-[var(--lagoon-deep)] ring-offset-2"
                        : "opacity-60 hover:scale-105 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-xs font-semibold text-rose-500">
              <AlertCircle size={14} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border border-[var(--line)] bg-transparent px-5 py-2 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--link-bg-hover)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-full bg-[var(--sea-ink)] px-5 py-2 text-sm font-semibold text-white transition hover:shadow-[0_8px_20px_rgba(23,58,64,0.25)] dark:bg-[var(--lagoon-deep)] dark:text-[var(--sand)]"
            >
              {title.startsWith("Edit") ? "Save Changes" : "Create Habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
