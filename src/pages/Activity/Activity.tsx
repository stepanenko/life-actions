import { useEffect, useState } from "react"
import { EditHabitModal } from "#/components/EditHabitModal"
import { EmptyHabitsState } from "#/components/EmptyHabitsState"
import { HabitCard } from "#/components/HabitCard"
import { HabitHistoryCalendar } from "#/components/HabitHistoryCalendar"
import { HeroHeader } from "#/components/HeroHeader"
import { StatsRow } from "#/components/StatsRow"
import { calculateStreak, getDayName, getDayNum, getDemoHabits, getLocalDateString, getStep } from "./Activity.helpers"

export function ActivityPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitCategory, setNewHabitCategory] = useState<Habit['category']>('health')
  const [newHabitColor, setNewHabitColor] = useState('emerald')
  const [newHabitType, setNewHabitType] = useState<HabitType>('count')
  const [newHabitGoal, setNewHabitGoal] = useState(3)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [selectedHistoryHabit, setSelectedHistoryHabit] = useState<Habit | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Load from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem('habits')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Habit[]
        setHabits(parsed)
      } catch {
        const defaults = getDemoHabits()
        setHabits(defaults)
        window.localStorage.setItem('habits', JSON.stringify(defaults))
      }
    } else {
      const defaults = getDemoHabits()
      setHabits(defaults)
      window.localStorage.setItem('habits', JSON.stringify(defaults))
    }
  }, [])

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated)
    window.localStorage.setItem('habits', JSON.stringify(updated))
  }

  const updateProgress = (
    habit: Habit,
    dateStr: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const current = habit.completionData[dateStr] ?? 0
    // console.log("curr", current);
    
    if (event.metaKey) return 0
    if (event.shiftKey) {
      const nextGoal = Math.floor(current / habit.goal + 1) * habit.goal
      return Math.max(habit.goal, nextGoal)
    }

    const step = getStep(habit)
    return current >= habit.goal ? current + step : Math.min(current + step, habit.goal)
  }

  const updateHabitProgress = (
    habitId: string,
    dateStr: string,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    saveHabits(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit
        const next = updateProgress(habit, dateStr, event)
        const newData = { ...habit.completionData }
        if (next === 0) {
          delete newData[dateStr]
        } else {
          newData[dateStr] = next
        }
        return { ...habit, completionData: newData }
      }),
    )
  }

  const resetHabitForm = () => {
    setNewHabitName('')
    setNewHabitCategory('health')
    setNewHabitColor('emerald')
    setNewHabitType('count')
    setNewHabitGoal(3)
    setShowAddForm(false)
    setEditingHabitId(null)
    setErrorMessage('')
  }

  const openAddHabitForm = () => {
    resetHabitForm()
    setShowAddForm(true)
  }

  const openEditHabitForm = (habit: Habit) => {
    setNewHabitName(habit.name)
    setNewHabitCategory(habit.category)
    setNewHabitColor(habit.color)
    setNewHabitType(habit.type)
    setNewHabitGoal(habit.goal)
    setEditingHabitId(habit.id)
    setShowAddForm(true)
    setErrorMessage('')
  }

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabitName.trim()) {
      setErrorMessage('Habit name cannot be empty!')
      return
    }
    if (newHabitGoal < 1) {
      setErrorMessage('Goal must be at least 1.')
      return
    }

    if (editingHabitId) {
      saveHabits(
        habits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                name: newHabitName.trim(),
                category: newHabitCategory,
                color: newHabitColor,
                type: newHabitType,
                goal: newHabitGoal,
              }
            : habit,
        ),
      )
    } else {
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        category: newHabitCategory,
        color: newHabitColor,
        createdAt: getLocalDateString(0),
        type: newHabitType,
        goal: newHabitGoal,
        completionData: {},
      }
      saveHabits([newHabit, ...habits])
    }

    resetHabitForm()
  }

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      saveHabits(habits.filter((h) => h.id !== id))
    }
  }

  // 7-day timeline (oldest -> today)
  const dateTimeline = [6, 5, 4, 3, 2, 1, 0].map((offset) => ({
    dateStr: getLocalDateString(offset),
    dayName: getDayName(offset),
    dayNum: getDayNum(offset),
    isToday: offset === 0,
  }))

  const todayStr = getLocalDateString(0)

  // Dashboard stats
  const habitsCount = habits.length
  const completedTodayCount = habits.filter(
    (h) => (h.completionData[todayStr] ?? 0) >= h.goal,
  ).length
  const todayProgressPercent =
    habitsCount > 0
      ? Math.round((completedTodayCount / habitsCount) * 100)
      : 0
  const maxStreak =
    habitsCount > 0
      ? Math.max(
          ...habits.map((h) => calculateStreak(h.completionData, h.goal)),
        )
      : 0
  const totalCompletionsAllTime = habits.reduce(
    (acc, h) =>
      acc +
      Object.values(h.completionData).filter((v) => v >= h.goal).length,
    0,
  )

  return (
    <main className="page-wrap px-4 pb-14 pt-8">
      <HeroHeader onAddHabit={openAddHabitForm} />

      <StatsRow
        completedTodayCount={completedTodayCount}
        habitsCount={habitsCount}
        todayProgressPercent={todayProgressPercent}
        maxStreak={maxStreak}
        totalCompletionsAllTime={totalCompletionsAllTime}
      />

      <EditHabitModal
        isOpen={showAddForm}
        title={editingHabitId ? 'Edit Habit' : 'Add a New Habit'}
        name={newHabitName}
        category={newHabitCategory}
        color={newHabitColor}
        type={newHabitType}
        goal={newHabitGoal}
        errorMessage={errorMessage}
        onClose={resetHabitForm}
        onSubmit={handleSaveHabit}
        onNameChange={setNewHabitName}
        onCategoryChange={(value) => setNewHabitCategory(value)}
        onColorChange={setNewHabitColor}
        onTypeChange={(value) => {
          setNewHabitType(value)
          setNewHabitGoal(value === 'duration' ? 20 : 3)
        }}
        onGoalChange={setNewHabitGoal}
      />

      {selectedHistoryHabit && (
        <HabitHistoryCalendar
          habit={selectedHistoryHabit}
          isOpen={true}
          onClose={() => setSelectedHistoryHabit(null)}
        />
      )}

      {/* ── Habits list ── */}
      <section className="mt-8 space-y-4">
        {habitsCount === 0 ? (
          <EmptyHabitsState onAddHabit={openAddHabitForm} />
        ) : (
          habits.map((habit) => {
            const streak = calculateStreak(habit.completionData, habit.goal)
            const totalCompletions = Object.values(habit.completionData).filter(
              (v) => v >= habit.goal,
            ).length
            const todayProgress = habit.completionData[todayStr] ?? 0
            const todayComplete = todayProgress >= habit.goal

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={streak}
                totalCompletions={totalCompletions}
                todayProgress={todayProgress}
                todayComplete={todayComplete}
                dateTimeline={dateTimeline}
                onEdit={openEditHabitForm}
                onDelete={handleDeleteHabit}
                onViewHistory={(habit) => setSelectedHistoryHabit(habit)}
                onCycle={(habitId, dateStr, event) =>
                  updateHabitProgress(habitId, dateStr, event)
                }
              />
            )
          })
        )}
      </section>
    </main>
  )
}
