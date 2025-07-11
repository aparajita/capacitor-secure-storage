import { SecureStorageBase } from './base'

export class SecureStorageWeb extends SecureStorageBase {
  // @native

  /* eslint-disable @typescript-eslint/class-methods-use-this */

  protected async setSynchronizeKeychain(_options: {
    sync: boolean
  }): Promise<void> {
    // Web implementation - no-op
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async internalGetItem(options: {
    prefixedKey: string
  }): Promise<{ data: string | null }> {
    return { data: localStorage.getItem(options.prefixedKey) }
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async internalSetItem(options: {
    prefixedKey: string
    data: string
  }): Promise<void> {
    localStorage.setItem(options.prefixedKey, options.data)
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async internalRemoveItem(options: {
    prefixedKey: string
  }): Promise<{ success: boolean }> {
    const item = localStorage.getItem(options.prefixedKey)

    if (item !== null) {
      localStorage.removeItem(options.prefixedKey)
      return { success: true }
    }

    return { success: false }
  }

  async clear(): Promise<void> {
    const { keys } = await this.getPrefixedKeys({ prefix: this.prefix })

    for (const key of keys) {
      localStorage.removeItem(key)
    }
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async clearItemsWithPrefix(_options: {
    prefix: string
  }): Promise<void> {
    console.warn('clearItemsWithPrefix is native only')
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async getPrefixedKeys(options: {
    prefix: string
  }): Promise<{ keys: string[] }> {
    const keys: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key?.startsWith(options.prefix)) {
        keys.push(key)
      }
    }

    return { keys }
  }
  /* eslint-enable @typescript-eslint/class-methods-use-this */
}
