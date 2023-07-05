import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "auth" | "default" | "front" | "redirect"
declare module "/Users/maheshvagicherla/Downloads/upwork/sometraffic/sometraffic-frontend/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}