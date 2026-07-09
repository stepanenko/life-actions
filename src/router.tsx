import { createHashHistory } from '@tanstack/history'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

const history = createHashHistory()

export const router = createRouter({
  routeTree,
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
