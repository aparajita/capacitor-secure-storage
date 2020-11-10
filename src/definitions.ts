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

export interface SetKeyPrefixOptions {
  prefix: string;
}

export interface KeyOption {
  key: string;
}

export interface StoreOptions extends KeyOption {
  data: string;
}

export interface RetrieveResult {
  data: string;
}

export interface ClearResult {
  success: boolean;
}

export interface WSSecureStoragePlugin {
  /**
   * web only
   *
   * Set the storage type used on the web: sessionStorage or localStorage.
   * sessionStorage is the default. Typically you will want to call this method
   * before calling any methods that modify the store.
   *
   * Default: localStorage
   */
  setStorageType(type: StorageType): void;

  /**
   * web only
   *
   * Return the currently set storage type.
   */
  getStorageType(): StorageType;

  /**
   * A prefix is added to the key under which an item is stored.
   * The prefix defaults to "secure-storage_", you may change it with this
   * method (an empty prefix is valid). Typically you will want to call
   * this method before calling any methods that modify the store.
   *
   * Default: 'secure-storage_'
   */
  setKeyPrefix(options: SetKeyPrefixOptions): void;

  /**
   * Return the current storage prefix. (web-only)
   */
  getStoragePrefix(): string;

  /**
   * Set the secret key used to encrypt/decrypt data on the web,
   * using blowfish/ECB encryption without an IV.
   *
   * If you are not using this plugin on the web (including testing),
   * then you do not need to call this method.
   *
   * If you are using this plugin on the web, this method MUST be called
   * before store() or retrieve().
   *
   * If key is null or empty, StorageError(code: encryptionKeyNotSet)
   * is thrown.
   *
   * @throws {StorageError} If key is null or empty
   */
  setEncryptionKey(key: string): void;

  /**
   * Store data under a given key in the secure system store.
   * If setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @param {StoreOptions} options
   * @returns {Promise<void>}
   * @rejects {StorageError}
   */
  store(options: StoreOptions): Promise<void>;

  /**
   * Retrieve the data for a given key from the secure system store.
   * If setEncryptionKey() has not been called successfully,
   * StorageError(code: encryptionKeyNotSet) is thrown.
   *
   * @param {KeyOption} options
   * @returns {Promise<RetrieveResult>}
   * @rejects {StorageError}
   */
  retrieve(options: KeyOption): Promise<RetrieveResult>;

  /**
   * Remove data for a given key from secure storage.
   * If an item exists for the given key in the current storage,
   * true is returned, else false.
   *
   * @param {KeyOption} options
   * @returns {Promise<ClearResult>}
   * @rejects {StorageError} If options.key is null or empty, or an OS error occurs
   */
  clear(options: KeyOption): Promise<ClearResult>;
}
