import { getDemoHabits } from "#/pages/Activity/Activity.helpers";
import type { Habit } from "#/pages/Activity/Activity.models";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type LocalHabitsContextType = {
  localHabits: Habit[]
  saveLocalHabits: (habits: Habit[]) => void
};

const LocalHabitsContext = createContext<LocalHabitsContextType | undefined>(undefined);

export const LocalHabitsProvider = ({ children }: { children: ReactNode }) => {
  const [localHabits, setLocalHabits] = useState<Habit[]>([])
  
  // Load from localStorage
  useEffect(() => {
    const saved = window.localStorage.getItem('habits')

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Habit[]
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
  }, [])

  const saveLocalHabits = (habits: Habit[]) => {
    localStorage.setItem("habits", JSON.stringify(habits));
    setLocalHabits(habits);
  };

  return (
    <LocalHabitsContext.Provider value={{ localHabits, saveLocalHabits }}>
      {children}
    </LocalHabitsContext.Provider>
  )
}

export function useLocalHabits() {
  const context = useContext(LocalHabitsContext);

  if (!context) {
    throw new Error(
      "useLocalHabits must be used within LocalHabitsProvider"
    );
  }

  return context;
}
