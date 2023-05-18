import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = "admin" | "auth" | "guest" | "redirect" | "server-middleware"
declare module "C:/Users/pavilion/Documents/Projects/Upwork projects/Otto/sometraffic_frontend_0.33/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}