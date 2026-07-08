import { Plus } from "lucide-react"

type HeroHeaderProps = {
  onAddHabit: () => void
}

export function HeroHeader({ onAddHabit }: HeroHeaderProps) {
  return (
    <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.2),transparent_66%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.12),transparent_66%)]" />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="display-title m-0 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
            Daily Activity
          </h1>
          <p className="mt-2 mb-0 max-w-xl text-sm text-[var(--sea-ink-soft)]">
            Build tiny habits that compound over time. Check off completions,
            monitor streaks, and hit your daily goals.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddHabit}
          className="cursor-pointer inline-flex items-center justify-center gap-2 self-start rounded-full bg-[var(--lagoon-deep)] px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-[0_8px_20px_rgba(23,58,64,0.25)] dark:bg-[var(--lagoon-deep)] dark:text-[var(--sand)] dark:hover:shadow-[0_8px_20px_rgba(96,215,207,0.15)] sm:self-auto"
        >
          <Plus size={16} />
          <span>New Habit</span>
        </button>
      </div>
    </section>
  )
}
