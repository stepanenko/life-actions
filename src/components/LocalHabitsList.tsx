import { useLocalHabits } from "#/context/localHabitsContext";
import { EmptyHabitsState } from "./EmptyHabitsState"
import { HabitCard } from "./HabitCard"

export const LocalHabitsList = () => {
  const { localHabits } = useLocalHabits();

  console.log("local habits", localHabits);

  return (
    <section className="mt-8 space-y-4">
      <h2>Local Habits</h2>

      {localHabits.length === 0 ? (
        <EmptyHabitsState />
        ) : (
          localHabits.map((habit) => <HabitCard key={habit.id} habit={habit} />
        )
      )}
    </section>
  )
}
