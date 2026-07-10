import { useEffect, useState } from "react"

import { EditHabitModal } from "#/components/EditHabitModal"
import { EmptyHabitsState } from "#/components/EmptyHabitsState"
import { HabitCard } from "#/components/HabitCard"
import { HabitHistoryCalendar } from "#/components/HabitHistoryCalendar"
import { HeroHeader } from "#/components/HeroHeader"
import { StatsRow } from "#/components/StatsRow"

import { calculateStreak, getDayName, getDayNum, getDemoHabits, getLocalDateString, getStep } from "./Activity.helpers"
import type { Category, CreateHabitInput, Habit, HabitType } from "./Activity.models"
import { supabase } from "#/utils/supabase"
import { useHabits } from "#/hooks/useHabits"

export function ActivityPage() {
  const [oldHabits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState('')
  const [habitCategory, setHabitCategory] = useState<Category>('health')
  const [habitColor, setHabitColor] = useState('emerald')
  const [habitType, setHabitType] = useState<HabitType>('count')
  const [habitGoal, setHabitGoal] = useState(3)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [selectedHistoryHabit, setSelectedHistoryHabit] = useState<Habit | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const { data: habits } = useHabits()

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
      oldHabits.map((habit) => {
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
    setHabitName('')
    setHabitCategory('health')
    setHabitColor('emerald')
    setHabitType('count')
    setHabitGoal(3)
    setShowAddForm(false)
    setEditingHabitId(null)
    setErrorMessage('')
  }

  const openAddHabitForm = () => {
    resetHabitForm()
    setShowAddForm(true)
  }

  const openEditHabitForm = (habit: Habit) => {
    setHabitName(habit.name)
    setHabitCategory(habit.category)
    setHabitColor(habit.color)
    setHabitType(habit.type)
    setHabitGoal(habit.goal)
    setEditingHabitId(habit.id)
    setShowAddForm(true)
    setErrorMessage('')
  }

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!habitName.trim()) {
      setErrorMessage('Habit name cannot be empty!')
      return
    }
    if (habitGoal < 1) {
      setErrorMessage('Goal must be at least 1.')
      return
    }

    if (editingHabitId) {
      saveHabits(
        oldHabits.map((habit) =>
          habit.id === editingHabitId
            ? {
                ...habit,
                name: habitName.trim(),
                category: habitCategory,
                color: habitColor,
                type: habitType,
                goal: habitGoal,
              }
            : habit,
        ),
      )
    } else {
      // save to localstorage
      const newHabit: Habit = {
        id: Date.now().toString(),
        name: habitName.trim(),
        category: habitCategory,
        color: habitColor,
        createdAt: getLocalDateString(0),
        type: habitType,
        goal: habitGoal,
        completionData: {},
      }
      saveHabits([newHabit, ...oldHabits])

      // save to Supabase
      const habit: CreateHabitInput = {
        name: habitName.trim(),
        category: habitCategory,
        color: habitColor,
        type: habitType,
        goal: habitGoal,
      }
      createHabit(habit);
    }

    resetHabitForm()
  }

  async function createHabit(habit: CreateHabitInput) {
    const { error } = await supabase
      .from('habits')
      .insert(habit)

    if (error) {
      console.error("Error inserting habit:", error);
    } else {
      console.log("New habit inserted");
    }
  }

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      saveHabits(oldHabits.filter((h) => h.id !== id))
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
  const habitsCount = oldHabits.length
  const completedTodayCount = oldHabits.filter(
    (h) => (h.completionData[todayStr] ?? 0) >= h.goal,
  ).length
  const todayProgressPercent =
    habitsCount > 0
      ? Math.round((completedTodayCount / habitsCount) * 100)
      : 0
  const maxStreak =
    habitsCount > 0
      ? Math.max(
          ...oldHabits.map((h) => calculateStreak(h.completionData, h.goal)),
        )
      : 0
  const totalCompletionsAllTime = oldHabits.reduce(
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
        name={habitName}
        category={habitCategory}
        color={habitColor}
        type={habitType}
        goal={habitGoal}
        errorMessage={errorMessage}
        onClose={resetHabitForm}
        onSubmit={handleSaveHabit}
        onNameChange={setHabitName}
        onCategoryChange={(value) => setHabitCategory(value)}
        onColorChange={setHabitColor}
        onTypeChange={(value) => {
          setHabitType(value)
          setHabitGoal(value === 'duration' ? 20 : 3)
        }}
        onGoalChange={setHabitGoal}
      />

      {selectedHistoryHabit && (
        <HabitHistoryCalendar
          habit={selectedHistoryHabit}
          isOpen={true}
          onClose={() => setSelectedHistoryHabit(null)}
        />
      )}

      {/* ── Old habits list ── */}
      <section className="mt-8 space-y-4">
        <h2>Old Habits</h2>

        {habitsCount === 0 ? (
          <EmptyHabitsState onAddHabit={openAddHabitForm} />
        ) : (
          oldHabits.map((habit) => {
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

      {/* ── New habits list ── */}
      <section className="mt-8 space-y-4">
        <h2>New Habits</h2>

        {habitsCount === 0 ? (
          <EmptyHabitsState onAddHabit={openAddHabitForm} />
        ) : (
          habits?.map((habit) => {
            const streak = calculateStreak(habit.completionData, habit.goal)
            // TODO: fix commented variables
            // const totalCompletions = Object.values(habit.completionData).filter(
            //   (v) => v >= habit.goal,
            // ).length
            // const todayProgress = habit.completionData[todayStr] ?? 0
            // const todayComplete = todayProgress >= habit.goal

            return (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={streak}
                totalCompletions={1}
                todayProgress={1}
                todayComplete={true}
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
