import { registerPlugin } from '@capacitor/core'
import type { SecureStoragePlugin, NativeBiometricPlugin } from './definitions'

const proxy = registerPlugin<SecureStoragePlugin>('SecureStorage', {
  web: async () =>
    import('./web').then((module) => new module.SecureStorageWeb()),
  ios: async () =>
    import('./native').then((module) => new module.SecureStorageNative(proxy)),
  android: async () =>
    import('./native').then((module) => new module.SecureStorageNative(proxy)),
})

const nativeBiometric = registerPlugin<NativeBiometricPlugin>(
  'NativeBiometric',
  {
    web: async () => import('./web').then((m) => new m.NativeBiometricWeb()),
  },
)

export * from './definitions'
export { proxy as SecureStorage, nativeBiometric as NativeBiometric }
