/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SECURE_STORAGE_ENCRYPTION_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
