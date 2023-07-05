import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "admin" | "auth" | "guest" | "redirect" | "server-middleware"
declare module "/Users/maheshvagicherla/Downloads/upwork/sometraffic/sometraffic-frontend/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}