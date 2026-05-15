/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-google-login' {
  import type { DefineComponent, App } from 'vue'
  export const GoogleLogin: DefineComponent<any, any, any>
  export const decodeCredential: any
  const plugin: {
    install: (app: App, options?: any) => void
  }
  export default plugin
}