import { useState } from "react"

import { useTodos } from "#/hooks/useTodos"
import { supabase } from "#/utils/supabase"

export const About = () => {
  const { data: todos, refetch } = useTodos()
  const [text, setText] = useState('')

  async function addTodo() {
    if (!text.trim()) return

    const { error } = await supabase
      .from('todos')
      .insert({
        text,
      })

    if (error) {
      console.error(error)
      return
    }

    setText('')
    refetch()
  }

  return (
    <main className="page-wrap px-4 py-8">
      <section className="island-shell rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">About</p>
        <h1 className="display-title mb-3 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
          A small starter with room to grow.
        </h1>
        <p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
          TanStack Start gives you type-safe routing, server functions, and
          modern SSR defaults. Use this as a clean foundation, then layer in
          your own routes, styling, and add-ons.
        </p>
      </section>
      <section className="island-shell rounded-2xl p-6 sm:p-8 mt-6">
        <h2>Supabase Test</h2>

      <input
        className="rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-3 text-sm text-[var(--sea-ink)] transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--lagoon-deep)]"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        className="ml-2 cursor-pointer rounded-full bg-[var(--sea-ink)] px-5 py-2 text-sm font-semibold transition dark:bg-[var(--lagoon-deep)] dark:text-[var(--sand)]"
        onClick={addTodo}
      >
        Add
      </button>

      <ul>
        {todos?.map(todo => (
          <li key={todo.id}>
            {todo.text}
          </li>
        ))}
      </ul>
      </section>
    </main>
  )
}
