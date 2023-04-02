import type { PluginResultError, WebPlugin } from '@capacitor/core'

/**
 * If one of the storage functions throws, the error object will
 * have a code property that contains one of these values, and the
 * message property will have a message suitable for debug purposes.
 */
export enum StorageErrorType {
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

export interface SecureStoragePlugin extends WebPlugin {
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
   * If no item with the given key can be found, null is returned.
   *
   * @since 1.0.0
   * @throws StorageError
   */
  get: (
    key: string,
    convertDate?: boolean,
    sync?: boolean
  ) => Promise<DataType | null>

  /**
   * Gets a string value from storage, or `null` if the key does not exist.
   * This is a low level method meant to conform with the @vueuse
   * StorageLikeAsync interface.
   *
   * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
   */
  getItem: (key: string) => Promise<string | null>

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
   * Puts a string value into storage. This is a low level method meant
   * to conform with the @vueuse StorageLikeAsync interface.
   *
   * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
   */
  setItem: (key: string, value: string) => Promise<void>

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
   * Removes a value from storage. This is a low level method meant
   * to conform with the @vueuse StorageLikeAsync interface.
   *
   * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
   */
  removeItem: (key: string) => Promise<void>

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
