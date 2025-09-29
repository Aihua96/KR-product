/// <reference types="vite/client" />

// Vue Single File Component module shim
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}

// Allow importing JSON with assert { type: 'json' } if needed
declare module '*.json' {
  const value: any
  export default value
}

// Image module declarations
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.svg'
declare module '*.webp'

// Global interface extension for future injected app config (placeholder)
declare interface Window {
  __KR_PRODUCTS_VERSION__?: string
}