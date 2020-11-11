declare module '@capacitor/core' {
  interface PluginRegistry {
    WSSecureStorage: WSSecureStoragePlugin;
  }
}

import { PluginResultError } from '@capacitor/core';

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
  encryptionKeyNotSet, // web-only
  notFound,
  missingKey,
  invalidData,
  osError,
  unknownError,
}

export interface StorageResultError extends PluginResultError {
  code: string;
}

export class StorageError extends Error implements StorageResultError {
  code: string;

  constructor(message: string, code: StorageErrorType) {
    super(message);
    this.code = StorageErrorType[code];
  }
}

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
   * under which items are stored. You may change the prefix with this
   * method (an empty prefix is valid). Typically you will want to call
   * this method before calling any methods that modify the store.
   *
   * Default: 'secure-storage_'
   */
  setKeyPrefix(prefix: string): Promise<void>;

  /**
   * Return the current storage prefix.
   */
  getKeyPrefix(): Promise<string>;

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
   * before setItem() or getItem().
   *
   * If key is null or empty, StorageError(code: encryptionKeyNotSet)
   * is thrown.
   *
   * @throws {StorageError} If key is null or empty
   */
  setEncryptionKey(key: string): void;

  /**
   * Store data under a given key in the store.
   *
   * On the web, if setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @rejects {StorageError}
   */
  setItem(key: string, data: string): Promise<void>;

  /**
   * Retrieve data for a given key from the store.
   *
   * On the web, if setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @rejects {StorageError}
   */
  getItem(key: string): Promise<string>;

  /**
   * Remove the data for a given key from the store.
   *
   * @returns {Promise<boolean>} true if data existed with the given key, false if not
   * @rejects {StorageError} If key is null or empty, or an OS error occurs
   */
  removeItem(key: string): Promise<boolean>;
}
