import { Capacitor, CapacitorException, WebPlugin } from '@capacitor/core'
import type {
  DataType,
  SecureStoragePlugin,
  NativeBiometricPlugin,
  AvailableResult,
  BiometricOptions,
  GetCredentialOptions,
  SetCredentialOptions,
  DeleteCredentialOptions,
  Credentials,
} from './definitions'
import { KeychainAccess, StorageError, StorageErrorType } from './definitions'

function isStorageErrorType(
  value: string | undefined,
): value is keyof typeof StorageErrorType {
  return value !== undefined && Object.keys(StorageErrorType).includes(value)
}

// This interface is used internally to model native plugin calls
// that are not visible to the user.
// noinspection JSUnusedGlobalSymbols
export interface SecureStoragePluginNative {
  setSynchronizeKeychain: (options: { sync: boolean }) => Promise<void>

  setDefaultKeychainAccess: (options: { access: string }) => Promise<void>

  internalGetItem: (options: {
    prefixedKey: string
  }) => Promise<{ data: string }>

  internalSetItem: (options: {
    prefixedKey: string
    data: string
    access: KeychainAccess
  }) => Promise<void>

  internalRemoveItem: (options: {
    prefixedKey: string
  }) => Promise<{ success: boolean }>

  clearItemsWithPrefix: (options: { prefix: string }) => Promise<void>

  getPrefixedKeys: (options: { prefix: string }) => Promise<{ keys: string[] }>
}

export abstract class SecureStorageBase
  extends WebPlugin
  implements SecureStoragePlugin
{
  protected prefix = 'capacitor-storage_'
  protected sync = false
  protected access = KeychainAccess.whenUnlocked

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

  async setDefaultKeychainAccess(access: KeychainAccess): Promise<void> {
    this.access = access
    return Promise.resolve()
  }

  protected async tryOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      // Ensure that only one operation is in progress at a time.
      return await operation()
    } catch (e) {
      // Native calls which reject will throw a CapacitorException with a code.
      // We want to convert these to StorageErrors.
      if (e instanceof CapacitorException && isStorageErrorType(e.code)) {
        throw new StorageError(e.message, e.code)
      }

      throw e
    }
  }

  async get(
    key: string,
    convertDate = true,
    sync?: boolean,
  ): Promise<DataType | null> {
    if (key) {
      const { data } = await this.tryOperation(async () =>
        this.internalGetItem({
          prefixedKey: this.prefixedKey(key),
          sync: sync ?? this.sync,
        }),
      )

      if (data === null) {
        return null
      }

      if (convertDate) {
        const date = parseISODate(data)

        if (date) {
          return date
        }
      }

      try {
        return JSON.parse(data) as DataType
      } catch (e) {
        throw new StorageError('Invalid data', StorageErrorType.invalidData)
      }
    }

    return SecureStorageBase.missingKey()
  }

  async getItem(key: string): Promise<string | null> {
    if (key) {
      const { data } = await this.tryOperation(async () =>
        this.internalGetItem({
          prefixedKey: this.prefixedKey(key),
          sync: this.sync,
        }),
      )

      return data
    }

    return null
  }

  // @native
  protected abstract internalGetItem(options: {
    prefixedKey: string
    sync: boolean
  }): Promise<{ data: string | null }>

  async set(
    key: string,
    data: DataType,
    convertDate = true,
    sync?: boolean,
    access?: KeychainAccess,
  ): Promise<void> {
    if (key) {
      let convertedData = data

      if (convertDate && data instanceof Date) {
        convertedData = data.toISOString()
      }

      return this.tryOperation(async () =>
        this.internalSetItem({
          prefixedKey: this.prefixedKey(key),
          data: JSON.stringify(convertedData),
          sync: sync ?? this.sync,
          access: access ?? this.access,
        }),
      )
    }

    return SecureStorageBase.missingKey()
  }

  async setItem(key: string, value: string): Promise<void> {
    if (key) {
      return this.tryOperation(async () =>
        this.internalSetItem({
          prefixedKey: this.prefixedKey(key),
          data: value,
          sync: this.sync,
          access: this.access,
        }),
      )
    }

    return SecureStorageBase.missingKey()
  }

  // @native
  protected abstract internalSetItem(options: {
    prefixedKey: string
    data: string
    sync: boolean
    access: KeychainAccess
  }): Promise<void>

  async remove(key: string, sync?: boolean): Promise<boolean> {
    if (key) {
      const { success } = await this.tryOperation(async () =>
        this.internalRemoveItem({
          prefixedKey: this.prefixedKey(key),
          sync: sync ?? this.sync,
        }),
      )

      return success
    }

    return SecureStorageBase.missingKey()
  }

  async removeItem(key: string): Promise<void> {
    if (key) {
      await this.tryOperation(async () =>
        this.internalRemoveItem({
          prefixedKey: this.prefixedKey(key),
          sync: this.sync,
        }),
      )

      return
    }

    SecureStorageBase.missingKey()
  }

  // @native
  protected abstract internalRemoveItem(options: {
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
    const { keys } = await this.tryOperation(async () =>
      this.getPrefixedKeys({
        prefix: this.prefix,
        sync: sync ?? this.sync,
      }),
    )

    const prefixLength = this.prefix.length
    return keys.map((key) => key.slice(prefixLength))
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

/* eslint-disable */
export class NativeBiometricWeb
  extends WebPlugin
  implements NativeBiometricPlugin
{
  async isAvailable(): Promise<AvailableResult> {
    throw new Error('Method not implemented.')
  }

  async verifyIdentity(_options?: BiometricOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getCredentials(_options: GetCredentialOptions): Promise<Credentials> {
    throw new Error('Method not implemented.')
  }

  async setCredentials(_options: SetCredentialOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async deleteCredentials(_options: DeleteCredentialOptions): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
/* eslint-enable */
