import { registerPlugin } from '@capacitor/core'

import type { SecureStoragePlugin } from './definitions.js'

const proxy = registerPlugin<SecureStoragePlugin>('SecureStorage', {
  web: async () => {
    const module = await import('./web.js')
    return new module.SecureStorageWeb()
  },
  ios: async () => {
    const module = await import('./native.js')
    return new module.SecureStorageNative(proxy)
  },
  android: async () => {
    const module = await import('./native.js')
    return new module.SecureStorageNative(proxy)
  },
})

export * from './definitions.js'
export { proxy as SecureStorage }
