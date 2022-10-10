import type { PluginResultError, WebPlugin } from '@capacitor/core'

/**
 * web only
 *
 * Where you would like to store your data on the web.
 */
export enum StorageType {
  sessionStorage,
  localStorage
}

/**
 * If one of the storage functions throws, the error object will
 * have a code property that contains one of these values, and the
 * message property will have a message suitable for debug purposes.
 */
export enum StorageErrorType {
  /**
   * You tried to modify the store on the web without first calling
   * `setEncryptionKey()`.
   */
  encryptionKeyNotSet,

  /**
   * `get()` could not find an item for the given key.
   */
  notFound,

  /**
   * The key is null or empty.
   */
  missingKey,

  /**
   * `get()` found the data, but it is corrupted.
   */
  invalidData,

  /**
   * A system-level error occurred when getting/setting data from/to the store.
   */
  osError,

  /**
   * An unclassified system-level error occurred.
   */
  unknownError
}

/**
 * If an error occurs, the returned `Error` object has a `.code` property
 * which is the string name of a `StorageErrorType`.
 */
export interface StorageResultError extends PluginResultError {
  code: string
}

/**
 * The types of data we can store. Basically anything `JSON.stringify/parse`
 * can deal with, plus `Date` objects.
 */
export type DataType =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | Date
  | null

export interface SecureStoragePlugin extends WebPlugin {
  /**
   * web only
   *
   * Set the storage type used on the web: `sessionStorage` or `localStorage`.
   * Typically you will want to set this before calling any methods that modify
   * the store.
   *
   * @since 2.0.0
   * @default StorageType.localStorage
   * @throws CapacitorException if called on a native platform
   */
  setStorageType: (storageType: StorageType) => Promise<void>

  /**
   * web only
   *
   * The storage type used on the web: `sessionStorage` or `localStorage`.
   * `sessionStorage` is the default. Typically you will want to set this
   * before calling any methods that modify the store.
   *
   * @since 2.0.0
   * @default localStorage
   * @throws CapacitorException if called on a native platform
   */
  getStorageType: () => Promise<StorageType>

  /**
   * web only
   *
   * Set the secret key used to encrypt/decrypt data on the web,
   * using Blowfish/ECB encryption without an IV.
   *
   * If you are not using this plugin on the web (including testing),
   * then you do not need to call this method.
   *
   * If you are using this plugin on the web, this method MUST be called
   * before `set()` or `get()`.
   *
   * If `key` is null or empty, `StorageError(code: encryptionKeyNotSet)`
   * is thrown.
   *
   * @since 2.0.0
   * @throws StorageError if `key` is null or empty
   * @throws CapacitorException if called on a native platform
   */
  setEncryptionKey: (key: string) => Promise<void>

  /**
   * iOS only
   *
   * Set whether or not to synchronize storage with iCloud.
   * A no-op on other platforms.
   *
   * @since 2.0.0
   */
  setSynchronize: (sync: boolean) => Promise<void>

  /**
   * iOS only
   *
   * Get whether or not storage is synchronized with iCloud.
   * A no-op on other platforms.
   *
   * @since 2.0.0
   */
  getSynchronize: () => Promise<boolean>

  /**
   * To prevent possible name clashes, a prefix is added to the key
   * under which items are stored. You may change the prefix by calling
   * this method (an empty prefix is valid). Usually you will always
   * set the prefix before calling any methods that modify the store.
   *
   * @since 2.0.0
   */
  setKeyPrefix: (prefix: string) => Promise<void>

  /**
   * Returns the current key prefix.
   *
   * @since 2.0.0
   * @default 'capacitor-storage_'
   */
  getKeyPrefix: () => Promise<string>

  /**
   * Returns a list of all keys which have the current storage prefix.
   * The returned keys are stripped of the prefix.
   *
   * If `sync` is not `undefined`, it temporarily overrides the value set by
   * `setSynchronize()`. If the resolved sync option is true, on iOS keys
   * from **both** the iCloud and local keychains are returned.
   *
   * @since 1.0.0
   */
  keys: (sync?: boolean) => Promise<string[]>

  /**
   * Retrieves data for a given key from the store.
   *
   * If the retrieved data is in the form of an ISO 8601 date string and
   * `convertDate` is true (the default), it is converted to a `Date`.
   *
   * If `sync` is not `undefined`, it temporarily overrides the value set by
   * `setSynchronize()`.
   *
   * If no item with the given key can be found, `StorageError(code: notFound)`
   * is thrown.
   *
   * On the web, if `setEncryptionKey()` has not been called successfully,
   * `StorageError(code: encryptionKeyNotSet)` is thrown.
   *
   * @since 1.0.0
   * @throws StorageError
   */
  get: (key: string, convertDate?: boolean, sync?: boolean) => Promise<DataType>

  /**
   * Stores `data` under a given key in the store. If `data` is not a string,
   * it is converted to stringified JSON first.
   *
   * If `data` is a `Date` and `convertDate` is true (the default), it is
   * converted to an ISO 8601 string and stored as such. Note that dates
   * within an object or an array are converted to ISO strings by
   * `JSON.stringify`, but will not be converted back to dates by `get()`.
   *
   * If `sync` is not `undefined`, it temporarily overrides the value set by
   * `setSynchronize()`.
   *
   * On the web, if `setEncryptionKey()` has not been called successfully,
   * `StorageError(code: encryptionKeyNotSet)` is thrown.
   *
   * @since 1.0.0
   * @throws StorageError | TypeError
   */
  set: (
    key: string,
    data: DataType,
    convertDate?: boolean,
    sync?: boolean
  ) => Promise<void>

  /**
   * Removes the data for a given key from the store. Returns true if data
   * existed with the given key, false if not.
   *
   * If `sync` is not `undefined`, it temporarily overrides the value set by
   * `setSynchronize()`.
   *
   * @since 1.0.0
   * @throws StorageError if `key` is null or empty, or an OS error occurs
   */
  remove: (key: string, sync?: boolean) => Promise<boolean>

  /**
   * Removes all items from the store with the current key prefix.
   *
   * If `sync` is not `undefined`, it temporarily overrides the value set by
   * `setSynchronize()`.
   *
   * @since 1.0.0
   */
  clear: (sync?: boolean) => Promise<void>
}
