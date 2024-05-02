/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_ENDPOINT: string
  readonly VITE_MGL_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
