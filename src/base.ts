import { Capacitor, WebPlugin } from '@capacitor/core'
import type {
  DataType,
  SecureStoragePlugin,
  StorageResultError,
  StorageType
} from './definitions'
import { StorageErrorType } from './definitions'

export class StorageError extends Error implements StorageResultError {
  code: string

  constructor(message: string, code: StorageErrorType) {
    super(message)
    this.code = StorageErrorType[code]
  }
}

// This interface is used internally to model native plugin calls
// that are not visible to the user.
export interface SecureStoragePluginNative {
  setSynchronizeKeychain: (options: { sync: boolean }) => Promise<void>

  getItem: (options: { prefixedKey: string }) => Promise<{ data: string }>

  setItem: (options: { prefixedKey: string; data: string }) => Promise<void>

  removeItem: (options: {
    prefixedKey: string
  }) => Promise<{ success: boolean }>

  clearItemsWithPrefix: (options: { prefix: string }) => Promise<void>

  getPrefixedKeys: (options: { prefix: string }) => Promise<{ keys: string[] }>
}

// eslint-disable-next-line import/prefer-default-export
export abstract class SecureStorageBase
  extends WebPlugin
  implements SecureStoragePlugin
{
  protected prefix = 'capacitor-storage_'
  protected sync = false

  async setSynchronize(sync: boolean): Promise<void> {
    this.sync = sync

    if (Capacitor.getPlatform() === 'ios') {
      return this.setSynchronizeKeychain({ sync })
    }

    // no-op on other platforms
    return Promise.resolve()
  }

  async getSynchronize(): Promise<boolean> {
    return Promise.resolve(this.sync)
  }

  // @native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected abstract setSynchronizeKeychain(options: {
    sync: boolean
  }): Promise<void>

  abstract getStorageType(): Promise<StorageType>

  abstract setStorageType(type: DataType): Promise<void>

  abstract setEncryptionKey(key: string): Promise<void>

  async get(
    key: string,
    convertDate = true,
    sync?: boolean
  ): Promise<DataType> {
    if (key) {
      const { data } = await this.getItem({
        prefixedKey: this.prefixedKey(key),
        sync: sync ?? this.sync
      })

      if (convertDate) {
        const date = parseISODate(data)

        if (date) {
          return Promise.resolve(date)
        }
      }

      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      return Promise.resolve(JSON.parse(data) as DataType)
    }

    return SecureStorageBase.missingKey()
  }

  // @native
  protected abstract getItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ data: string }>

  async set(
    key: string,
    data: DataType,
    convertDate = true,
    sync?: boolean
  ): Promise<void> {
    if (key) {
      let convertedData = data

      if (convertDate && data instanceof Date) {
        convertedData = data.toISOString()
      }

      return this.setItem({
        prefixedKey: this.prefixedKey(key),
        data: JSON.stringify(convertedData),
        sync: sync ?? this.sync
      })
    }

    return SecureStorageBase.missingKey()
  }

  // @native
  protected abstract setItem(options: {
    prefixedKey: string
    data: string
    sync: boolean
  }): Promise<void>

  async remove(key: string, sync?: boolean): Promise<boolean> {
    if (key) {
      const { success } = await this.removeItem({
        prefixedKey: this.prefixedKey(key),
        sync: sync ?? this.sync
      })
      return Promise.resolve(success)
    }

    return SecureStorageBase.missingKey()
  }

  // @native
  protected abstract removeItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ success: boolean }>

  abstract clear(sync?: boolean): Promise<void>

  // @native
  protected abstract clearItemsWithPrefix(options: {
    prefix: string
    sync: boolean
  }): Promise<void>

  async keys(sync?: boolean): Promise<string[]> {
    const { keys } = await this.getPrefixedKeys({
      prefix: this.prefix,
      sync: sync ?? this.sync
    })
    const prefixLength = this.prefix.length
    return Promise.resolve(keys.map((key) => key.slice(prefixLength)))
  }

  // @native
  protected abstract getPrefixedKeys(options: {
    prefix: string
    sync: boolean
  }): Promise<{ keys: string[] }>

  async getKeyPrefix(): Promise<string> {
    return Promise.resolve(this.prefix)
  }

  async setKeyPrefix(prefix: string): Promise<void> {
    this.prefix = prefix
    return Promise.resolve()
  }

  protected prefixedKey(key: string): string {
    return this.prefix + key
  }

  protected static missingKey(): never {
    throw new StorageError('No key provided', StorageErrorType.missingKey)
  }
}

// RegExp to match an ISO 8601 date string in the form YYYY-MM-DDTHH:mm:ss.sssZ
const isoDateRE =
  /^"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z"$/u

function parseISODate(isoDate: string): Date | null {
  const match = isoDateRE.exec(isoDate)

  if (match) {
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1 // month is zero-based
    const day = parseInt(match[3], 10)
    const hour = parseInt(match[4], 10)
    const minute = parseInt(match[5], 10)
    const second = parseInt(match[6], 10)
    const millis = parseInt(match[7], 10)
    const epochTime = Date.UTC(year, month, day, hour, minute, second, millis)
    return new Date(epochTime)
    /* eslint-enable */
  }

  return null
}
