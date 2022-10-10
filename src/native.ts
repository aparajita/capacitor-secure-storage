import { SecureStorageBase } from './base'
import type { SecureStoragePlugin, StorageType } from './definitions'

// eslint-disable-next-line import/prefer-default-export
export class SecureStorageNative extends SecureStorageBase {
  constructor(capProxy: SecureStoragePlugin) {
    super()
    // capProxy is a proxy of an instance of this class, so it is safe
    // to cast it to this class.
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const proxy = capProxy as SecureStorageNative

    /* eslint-disable @typescript-eslint/unbound-method */
    this.setSynchronizeKeychain = proxy.setSynchronizeKeychain
    this.getItem = proxy.getItem
    this.setItem = proxy.setItem
    this.removeItem = proxy.removeItem
    this.clearItemsWithPrefix = proxy.clearItemsWithPrefix
    this.getPrefixedKeys = proxy.getPrefixedKeys
    /* eslint-enable */
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setSynchronizeKeychain(options: { sync: boolean }): Promise<void> {
    return Promise.resolve()
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  async setEncryptionKey(key: string): Promise<void> {
    throw this.unimplemented('setEncryptionKey is web only')
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  async setStorageType(type: StorageType): Promise<void> {
    throw this.unimplemented('setStorageType is web only')
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getStorageType(): Promise<StorageType> {
    throw this.unimplemented('getStorageType is web only')
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ data: string }> {
    return Promise.resolve({ data: '' })
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async setItem(options: {
    prefixedKey: string
    data: string
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true })
  }

  async clear(sync?: boolean): Promise<void> {
    return this.clearItemsWithPrefix({
      prefix: this.prefix,
      sync: sync ?? this.sync
    })
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async clearItemsWithPrefix(options: {
    prefix: string
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPrefixedKeys(options: {
    prefix: string
    sync: boolean
  }): Promise<{ keys: string[] }> {
    return Promise.resolve({ keys: [] })
  }
}
