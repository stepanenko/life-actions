import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getDemoHabits } from "#/pages/Activity/Activity.helpers";
import type { Habit, HabitProgress } from "#/pages/Activity/Activity.models";

type LocalHabitsContextType = {
  localHabits: Habit[]
  localProgress: HabitProgress[]
  saveLocalHabits: (habits: Habit[]) => void
  saveLocalProgress: (habits: HabitProgress[]) => void
};

const LocalHabitsContext = createContext<LocalHabitsContextType | undefined>(undefined)

export const LocalHabitsProvider = ({ children }: { children: ReactNode }) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>([])
  const [localProgress, setLocalProgress] = useState<HabitProgress[]>([])
  
  // Load from localStorage
  useEffect(() => {
    const savedHabits = window.localStorage.getItem('habits')
    const savedProgress = window.localStorage.getItem('progress')

    if (savedHabits) {
      try {
        const parsed = JSON.parse(savedHabits) as Habit[]
        setLocalHabits(parsed)
      } catch {
        const defaults = getDemoHabits()
        setLocalHabits(defaults)
        window.localStorage.setItem('habits', JSON.stringify(defaults))
      }
    } else {
      const defaults = getDemoHabits()
      setLocalHabits(defaults)
      window.localStorage.setItem('habits', JSON.stringify(defaults))
    }

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress) as HabitProgress[]
        setLocalProgress(parsed)
      } catch {
        setLocalProgress([])
        window.localStorage.setItem('progress', JSON.stringify([]))
      }
    }
  }, [])

  const saveLocalHabits = (habits: Habit[]) => {
    localStorage.setItem("habits", JSON.stringify(habits))
    setLocalHabits(habits)
  }

  const saveLocalProgress = (progress: HabitProgress[]) => {
    localStorage.setItem("progress", JSON.stringify(progress))
    setLocalProgress(progress)
  }

  return (
    <LocalHabitsContext.Provider value={{ localHabits, saveLocalHabits, localProgress, saveLocalProgress }}>
      {children}
    </LocalHabitsContext.Provider>
  )
}

export function useLocalHabits() {
  const context = useContext(LocalHabitsContext)

  if (!context) {
    throw new Error(
      "useLocalHabits must be used within LocalHabitsProvider"
    );
  }

  return context
}
