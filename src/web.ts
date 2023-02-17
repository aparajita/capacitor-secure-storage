import { Blowfish } from 'javascript-blowfish'
import { SecureStorageBase, StorageError } from './base'
import { StorageErrorType, StorageType } from './definitions'

// eslint-disable-next-line import/prefer-default-export
export class SecureStorageWeb extends SecureStorageBase {
  private blowfish: Blowfish | null = null
  private encryptionKey = ''
  private storage: Storage = localStorage
  private storageType: StorageType = StorageType.localStorage

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async setSynchronizeKeychain(options: {
    sync: boolean
  }): Promise<void> {
    return Promise.resolve()
  }

  async setEncryptionKey(key: string): Promise<void> {
    if (key) {
      this.blowfish = new Blowfish(key)
      this.encryptionKey = key
      return Promise.resolve()
    }

    throw new StorageError(
      'Encryption key must be non-null and non-empty',
      StorageErrorType.encryptionKeyNotSet
    )
  }

  async getStorageType(): Promise<StorageType> {
    return Promise.resolve(this.storageType)
  }

  async setStorageType(type: StorageType): Promise<void> {
    this.storageType = type
    this.storage =
      type === StorageType.sessionStorage ? sessionStorage : localStorage
    return Promise.resolve()
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/require-await
  protected async internalGetItem(options: {
    prefixedKey: string
  }): Promise<{ data: string }> {
    const data = this.storage.getItem(options.prefixedKey)

    if (data) {
      try {
        return { data: this.decryptData(data) }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unknown error occurred'
        throw new StorageError(message, StorageErrorType.invalidData)
      }
    } else {
      const storage = StorageType[this.storageType]

      throw new StorageError(
        `Data not found for key "${options.prefixedKey}" in ${storage}`,
        StorageErrorType.notFound
      )
    }
  }

  // @native
  protected async internalSetItem(options: {
    prefixedKey: string
    data: string
  }): Promise<void> {
    const encoded = this.encryptData(options.data)
    this.storage.setItem(options.prefixedKey, encoded)
    return Promise.resolve()
  }

  // @native
  protected async internalRemoveItem(options: {
    prefixedKey: string
  }): Promise<{ success: boolean }> {
    const item = this.storage.getItem(options.prefixedKey)

    if (item !== null) {
      this.storage.removeItem(options.prefixedKey)
      return Promise.resolve({ success: true })
    }

    return Promise.resolve({ success: false })
  }

  async clear(): Promise<void> {
    const { keys } = await this.getPrefixedKeys({ prefix: this.prefix })
    keys.forEach((key) => {
      this.storage.removeItem(key)
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

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i)

      if (key?.startsWith(options.prefix)) {
        keys.push(key)
      }
    }

    return Promise.resolve({ keys })
  }

  private encryptData(data: string): string {
    if (this.blowfish) {
      const json = JSON.stringify(data)
      return this.blowfish.base64Encode(this.blowfish.encryptECB(json))
    }

    throw new StorageError(
      'The encryption key has not been set',
      StorageErrorType.encryptionKeyNotSet
    )
  }

  private decryptData(ciphertext: string): string {
    let json

    if (this.blowfish) {
      json = this.blowfish.trimZeros(
        this.blowfish.decryptECB(this.blowfish.base64Decode(ciphertext))
      )
    } else {
      throw new StorageError(
        'The encryption key has not been set',
        StorageErrorType.encryptionKeyNotSet
      )
    }

    try {
      return String(JSON.parse(json))
    } catch (e) {
      throw new StorageError(
        'Could not parse data object',
        StorageErrorType.invalidData
      )
    }
  }
}
