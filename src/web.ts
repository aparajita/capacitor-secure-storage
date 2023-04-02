import { SecureStorageBase } from './base'

// eslint-disable-next-line import/prefer-default-export
export class SecureStorageWeb extends SecureStorageBase {
  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async setSynchronizeKeychain(options: {
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async internalGetItem(options: {
    prefixedKey: string
  }): Promise<{ data: string | null }> {
    return { data: localStorage.getItem(options.prefixedKey) }
  }

  // @native
  protected async internalSetItem(options: {
    prefixedKey: string
    data: string
  }): Promise<void> {
    localStorage.setItem(options.prefixedKey, options.data)
    return Promise.resolve()
  }

  // @native
  protected async internalRemoveItem(options: {
    prefixedKey: string
  }): Promise<{ success: boolean }> {
    const item = localStorage.getItem(options.prefixedKey)

    if (item !== null) {
      localStorage.removeItem(options.prefixedKey)
      return Promise.resolve({ success: true })
    }

    return Promise.resolve({ success: false })
  }

  async clear(): Promise<void> {
    const { keys } = await this.getPrefixedKeys({ prefix: this.prefix })
    keys.forEach((key) => {
      localStorage.removeItem(key)
    })

    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  protected async clearItemsWithPrefix(options: {
    prefix: string
  }): Promise<void> {
    this.unimplemented('clearItemsWithPrefix is native only')
  }

  // @native
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

    return Promise.resolve({ keys })
  }
}
