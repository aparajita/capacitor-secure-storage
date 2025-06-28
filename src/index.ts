import { registerPlugin } from '@capacitor/core'

import type { SecureStoragePlugin } from './definitions'

const proxy = registerPlugin<SecureStoragePlugin>('SecureStorage', {
  web: async () => {
    const module = await import('./web')
    return new module.SecureStorageWeb()
  },
  ios: async () => {
    const module = await import('./native')
    return new module.SecureStorageNative(proxy)
  },
  android: async () => {
    const module = await import('./native')
    return new module.SecureStorageNative(proxy)
  },
})

export * from './definitions'
export { proxy as SecureStorage }
