import { createHashHistory } from '@tanstack/history'
import { createRouter } from '@tanstack/react-router'
import { QueryClient } from "@tanstack/react-query"

import { routeTree } from './routeTree.gen'

export const queryClient = new QueryClient()

const history = createHashHistory()

export const router = createRouter({
  routeTree,
  context: { queryClient },
  history,
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
