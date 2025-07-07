/* eslint-disable @typescript-eslint/require-await */
import { SecureStorageBase } from './base'
import type { KeychainAccess, SecureStoragePlugin } from './definitions'

export class SecureStorageNative extends SecureStorageBase {
  constructor(capProxy: SecureStoragePlugin) {
    super()
    // capProxy is a proxy of an instance of this class, so it is safe
    // to cast it to this class.

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const proxy = capProxy as SecureStorageNative

    /* eslint-disable @typescript-eslint/unbound-method */
    this.setSynchronizeKeychain = proxy.setSynchronizeKeychain
    this.internalGetItem = proxy.internalGetItem
    this.internalSetItem = proxy.internalSetItem
    this.internalRemoveItem = proxy.internalRemoveItem
    this.clearItemsWithPrefix = proxy.clearItemsWithPrefix
    this.getPrefixedKeys = proxy.getPrefixedKeys
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  // @native
  /* eslint-disable @typescript-eslint/class-methods-use-this */
  protected async setSynchronizeKeychain(_options: {
    sync: boolean
  }): Promise<void> {
    // Native implementation
  }

  // @native
  protected async internalGetItem(_options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ data: string }> {
    return { data: '' }
  }

  // @native
  protected async internalSetItem(_options: {
    prefixedKey: string
    data: string
    sync: boolean
    access: KeychainAccess
  }): Promise<void> {
    // Native implementation
  }

  // @native
  protected async internalRemoveItem(_options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ success: boolean }> {
    return { success: true }
  }

  async clear(sync?: boolean): Promise<void> {
    return this.tryOperation(async () =>
      this.clearItemsWithPrefix({
        prefix: this.prefix,
        sync: sync ?? this.sync,
      }),
    )
  }

  // @native
  protected async clearItemsWithPrefix(_options: {
    prefix: string
    sync: boolean
  }): Promise<void> {
    // Native implementation
  }

  // @native
  protected async getPrefixedKeys(_options: {
    prefix: string
    sync: boolean
  }): Promise<{ keys: string[] }> {
    return { keys: [] }
  }
  /* eslint-enable @typescript-eslint/class-methods-use-this */
}
/* eslint-enable @typescript-eslint/require-await */
