import { useHabitProgress, useHabits } from "#/hooks/useHabits"
import { HabitCard } from "./HabitCard"

export const HabitsList = () => {
  const { habits } = useHabits()
  const { data: progress } = useHabitProgress()

  return (
    <section className="mt-8 space-y-4">
      <h2>New Habits</h2>

      {habits?.map((habit) => <HabitCard key={habit.id} habit={habit} progress={progress} />)}
    </section>
  )
}
