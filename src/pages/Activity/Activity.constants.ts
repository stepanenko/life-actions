import { Heart, BookOpen, Flame, Sparkles, Timer, Hash, House } from "lucide-react"
import type { HabitType } from "./Activity.models";

// ─── Category config ──────────────────────────────────────────────────────────

export const CATEGORIES = {
  health: {
    label: "Health",
    icon: Heart,
    defaultBg:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  learning: {
    label: "Learning",
    icon: BookOpen,
    defaultBg:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  work: {
    label: "Work",
    icon: Flame,
    defaultBg:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  house: {
    label: "House",
    icon: House,
    defaultBg:
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  other: {
    label: "Other",
    icon: Sparkles,
    defaultBg:
      "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
} as const

// ─── Color palettes ───────────────────────────────────────────────────────────

export const COLOR_PALETTES: Record<
  string,
  { bg: string; text: string; ring: string; glow: string; fill: string }
> = {
  emerald: {
    bg: "bg-emerald-500",
    text: "text-emerald-500",
    ring: "focus:ring-emerald-500",
    glow: "shadow-emerald-500/25",
    fill: "#10b981",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-500",
    ring: "focus:ring-purple-500",
    glow: "shadow-purple-500/25",
    fill: "#a855f7",
  },
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-500",
    ring: "focus:ring-blue-500",
    glow: "shadow-blue-500/25",
    fill: "#3b82f6",
  },
  amber: {
    bg: "bg-amber-500",
    text: "text-amber-500",
    ring: "focus:ring-amber-500",
    glow: "shadow-amber-500/25",
    fill: "#f59e0b",
  },
  rose: {
    bg: "bg-rose-500",
    text: "text-rose-500",
    ring: "focus:ring-rose-500",
    glow: "shadow-rose-500/25",
    fill: "#f43f5e",
  },
}

// ─── Habit type config ────────────────────────────────────────────────────────

export const HABIT_TYPE_CONFIG: Record<
  HabitType,
  { label: string; icon: typeof Timer; description: string }
> = {
  count: {
    label: "Count",
    icon: Hash,
    description: "Number of times to do it per day",
  },
  duration: {
    label: "Duration",
    icon: Timer,
    description: "Number of minutes to spend per day",
  },
}
