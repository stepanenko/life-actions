import ReactDOM from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from "@tanstack/react-query"

import { LocalHabitsProvider } from "./context/localHabitsContext"
import { queryClient, router } from '#/router'

import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <LocalHabitsProvider>
      <RouterProvider router={router} />
    </LocalHabitsProvider>
  </QueryClientProvider>
)
