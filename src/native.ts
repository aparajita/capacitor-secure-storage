import { SecureStorageBase } from './base'
import type { SecureStoragePlugin } from './definitions'

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
    this.internalGetItem = proxy.internalGetItem
    this.internalSetItem = proxy.internalSetItem
    this.internalRemoveItem = proxy.internalRemoveItem
    this.clearItemsWithPrefix = proxy.clearItemsWithPrefix
    this.getPrefixedKeys = proxy.getPrefixedKeys
    /* eslint-enable */
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async setSynchronizeKeychain(options: {
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async internalGetItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ data: string }> {
    return Promise.resolve({ data: '' })
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async internalSetItem(options: {
    prefixedKey: string
    data: string
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async internalRemoveItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ success: boolean }> {
    return Promise.resolve({ success: true })
  }

  async clear(sync?: boolean): Promise<void> {
    return this.clearItemsWithPrefix({
      prefix: this.prefix,
      sync: sync ?? this.sync,
    })
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async clearItemsWithPrefix(options: {
    prefix: string
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getPrefixedKeys(options: {
    prefix: string
    sync: boolean
  }): Promise<{ keys: string[] }> {
    return Promise.resolve({ keys: [] })
  }
}
