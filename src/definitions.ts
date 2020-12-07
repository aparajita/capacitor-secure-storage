declare module '@capacitor/core' {
  interface PluginRegistry {
    WSSecureStorage: WSSecureStoragePlugin;
  }
}

import { PluginResultError } from '@capacitor/core';

/**
 * web only
 *
 * Where you would like to store your data on the web.
 */
export enum StorageType {
  sessionStorage,
  localStorage,
}

/**
 * If one of the storage functions throws, the error object will
 * have a code property that contains one of these values, and the
 * message property will have a message suitable for debug purposes.
 */
export enum StorageErrorType {
  /**
   * You tried to modify the store on the web without first calling setEncryptionKey().
   */
  encryptionKeyNotSet,

  /**
   * get() could not find an item for the given key.
   */
  notFound,

  /**
   * The key is null or empty.
   */
  missingKey,

  /**
   * get() found the data, but it is corrupted.
   */
  invalidData,

  /**
   * A system-level error occurred when getting/setting data from/to the store.
   */
  osError,

  /**
   * An unclassified system-level error occurred.
   */
  unknownError,
}

/**
 * If an error occurs, the returned Error object has a .code property
 * which is the string name of a StorageErrorType.
 */
export interface StorageResultError extends PluginResultError {
  code: string;
}

/**
 * The types of data we can store. Basically anything JSON.stringify/parse
 * can deal with, plus Date objects.
 */
export type DataType =
  | string
  | number
  | boolean
  | Object
  | Array<any>
  | Date
  | null;

export interface WSSecureStoragePlugin {
  /**
   * web only
   *
   * The storage type used on the web: sessionStorage or localStorage.
   * sessionStorage is the default. Typically you will want to set this
   * before calling any methods that modify the store.
   *
   * Default: localStorage
   */
  storageType: StorageType;

  /**
   * To prevent possible name clashes, a prefix is added to the key
   * under which items are stored. You may change the prefix by setting
   * this property (an empty prefix is valid). Usually you will always
   * set the prefix before calling any methods that modify the store.
   *
   * Default: 'capacitor-storage_'
   */
  keyPrefix: string;

  /**
   * Return a list of all keys with the current storage prefix.
   * The returned keys do not have the prefix.
   */
  keys(): Promise<string[]>;

  /**
   * web only
   *
   * Set the secret key used to encrypt/decrypt data on the web,
   * using blowfish/ECB encryption without an IV.
   *
   * If you are not using this plugin on the web (including testing),
   * then you do not need to call this method.
   *
   * If you are using this plugin on the web, this method MUST be called
   * before set() or get().
   *
   * If key is null or empty, StorageError(code: encryptionKeyNotSet)
   * is thrown.
   *
   * @throws {StorageError} If key is null or empty
   */
  setEncryptionKey(key: string): void;

  /**
   * Store data under a given key in the store. If data is not a string,
   * it is converted to stringified JSON first. If data is a Date and
   * convertDate is true (the default), it is converted to an ISO 8601 string
   * and stored as such. Note that dates within an object or an array
   * are converted to ISO strings by JSON.stringify, but will not be
   * converted back to dates by get().
   *
   * On the web, if setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @rejects {StorageError | TypeError}
   */
  set(key: string, data: DataType, convertDate?: boolean): Promise<void>;

  /**
   * Retrieve data for a given key from the store. If the retrieved data
   * is in the form of an ISO 8601 date string and convertDate is true
   * (the default), it is converted to a Date.
   *
   * If no item with the given key can be found, StorageError(code: notFound)
   * is thrown.
   *
   * On the web, if setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @rejects {StorageError}
   */
  get(key: string, convertDate?: boolean): Promise<DataType>;

  /**
   * Remove the data for a given key from the store.
   *
   * @returns {Promise<boolean>} true if data existed with the given key, false if not
   * @rejects {StorageError} If key is null or empty, or an OS error occurs
   */
  remove(key: string): Promise<boolean>;

  /**
   * Remove all items from the store with the current key prefix.
   */
  clear(): Promise<void>;
}
