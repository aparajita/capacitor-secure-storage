import type { WebPlugin } from '@capacitor/core';
/**
 * When one of the storage functions throws, the thrown StorageError
 * will have a .code property that contains one of these values.
 *
 * @modified 5.0.0
 */
export declare enum StorageErrorType {
    /**
     * The key is null or empty.
     */
    missingKey = "missingKey",
    /**
     * `get()` found the data, but it is corrupted.
     */
    invalidData = "invalidData",
    /**
     * A system-level error occurred when getting/setting data from/to the store.
     */
    osError = "osError",
    /**
     * An unclassified system-level error occurred.
     */
    unknownError = "unknownError"
}
/**
 * iOS only
 *
 * The keychain access option for the storage. The default is
 * `whenUnlocked`. For more information, see:
 * https://developer.apple.com/documentation/security/keychain_services/keychain_items/item_attribute_keys_and_values#1679100
 */
export declare enum KeychainAccess {
    /**
      The data in the keychain item can be accessed only while the device is
      unlocked by the user.
  
      This is recommended for items that need to be accessible only while the
      application is in the foreground. Items with this attribute migrate to
      a new device when using encrypted backups.
  
      This is the default value for keychain items added without explicitly
      setting an accessibility constant.
     */
    whenUnlocked = 0,
    /**
      The data in the keychain item can be accessed only while the device is
      unlocked by the user.
  
      This is recommended for items that need to be accessible only while the
      application is in the foreground. Items with this attribute do not migrate
      to a new device. Thus, after restoring from a backup of a different device,
      these items will not be present.
     */
    whenUnlockedThisDeviceOnly = 1,
    /**
      The data in the keychain item cannot be accessed after a restart until the
      device has been unlocked once by the user.
  
      After the first unlock, the data remains accessible until the next restart.
      This is recommended for items that need to be accessed by background
      applications. Items with this attribute migrate to a new device when using
      encrypted backups.
     */
    afterFirstUnlock = 2,
    /**
      The data in the keychain item cannot be accessed after a restart until
      the device has been unlocked once by the user.
  
      After the first unlock, the data remains accessible until the next restart.
      This is recommended for items that need to be accessed by background
      applications. Items with this attribute do not migrate to a new device.
      Thus, after restoring from a backup of a different device, these items
      will not be present.
     */
    afterFirstUnlockThisDeviceOnly = 3,
    /**
      The data in the keychain can only be accessed when the device is unlocked.
      Only available if a passcode is set on the device.
  
      This is recommended for items that only need to be accessible while the
      application is in the foreground. Items with this attribute never migrate
      to a new device. After a backup is restored to a new device, these items
      are missing. No items can be stored in this class on devices without a
      passcode. Disabling the device passcode causes all items in this class to
      be deleted.
     */
    whenPasscodeSetThisDeviceOnly = 4
}
/**
 * If one of the storage functions throws, it will throw a StorageError which
 * will have a .code property that can be tested against StorageErrorType,
 * and a .message property will have a message suitable for debugging purposes.
 *
 * @modified 5.0.0
 */
export declare class StorageError extends Error {
    code: StorageErrorType;
    constructor(message: string, code: StorageErrorType);
}
/**
 * The types of data we can store. Basically anything `JSON.stringify/parse`
 * can deal with, plus `Date` objects.
 */
export type DataType = string | number | boolean | Record<string, unknown> | unknown[] | Date;
export interface SecureStoragePlugin extends WebPlugin {
    /**
     * iOS only
     *
     * Set whether or not to synchronize storage with iCloud.
     * A no-op on other platforms.
     *
     * @since 2.0.0
     */
    setSynchronize: (sync: boolean) => Promise<void>;
    /**
     * iOS only
     *
     * Get whether or not storage is synchronized with iCloud.
     * A no-op on other platforms.
     *
     * @since 2.0.0
     */
    getSynchronize: () => Promise<boolean>;
    /**
     * iOS only
     *
     * Set the default keychain access option for items added to storage.
     * A no-op on other platforms.
     */
    setDefaultKeychainAccess: (access: KeychainAccess) => Promise<void>;
    /**
     * To prevent possible name clashes, a prefix is added to the key
     * under which items are stored. You may change the prefix by calling
     * this method (an empty prefix is valid). Usually you will always
     * set the prefix before calling any methods that modify the store.
     *
     * @since 2.0.0
     */
    setKeyPrefix: (prefix: string) => Promise<void>;
    /**
     * Returns the current key prefix.
     *
     * @since 2.0.0
     * @default 'capacitor-storage_'
     */
    getKeyPrefix: () => Promise<string>;
    /**
     * Returns a list of all keys which have the current storage prefix.
     * The returned keys are stripped of the prefix.
     *
     * If `sync` is not `undefined`, it temporarily overrides the value set by
     * `setSynchronize()`. If the resolved sync option is true, on iOS keys
     * from **both** the iCloud and local keychains are returned.
     *
     * @since 1.0.0
     * @throw StorageError
     */
    keys: (sync?: boolean) => Promise<string[]>;
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
     * @throw StorageError
     */
    get: (key: string, convertDate?: boolean, sync?: boolean) => Promise<DataType | null>;
    /**
     * Gets a string value from storage, or `null` if the key does not exist.
     * This is a low level method meant to conform with the @vueuse
     * StorageLikeAsync interface.
     *
     * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
     *
     * @throw StorageError
     */
    getItem: (key: string) => Promise<string | null>;
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
     * If `access` is not `undefined`, it temporarily overrides the current
     * default keychain access option.
     *
     * @since 1.0.0
     * @throw StorageError | TypeError
     */
    set: (key: string, data: DataType, convertDate?: boolean, sync?: boolean, access?: KeychainAccess) => Promise<void>;
    /**
     * Puts a string value into storage. This is a low level method meant
     * to conform with the @vueuse StorageLikeAsync interface.
     *
     * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
     */
    setItem: (key: string, value: string) => Promise<void>;
    /**
     * Removes the data for a given key from the store. Returns true if data
     * existed with the given key, false if not.
     *
     * If `sync` is not `undefined`, it temporarily overrides the value set by
     * `setSynchronize()`.
     *
     * @since 1.0.0
     * @throw StorageError if `key` is null or empty, or an OS error occurs
     */
    remove: (key: string, sync?: boolean) => Promise<boolean>;
    /**
     * Removes a value from storage. This is a low level method meant
     * to conform with the @vueuse StorageLikeAsync interface.
     *
     * https://github.com/vueuse/vueuse/blob/main/packages/core/ssr-handlers.ts#L3
     *
     * @throw StorageError
     */
    removeItem: (key: string) => Promise<void>;
    /**
     * Removes all items from the store with the current key prefix.
     *
     * If `sync` is not `undefined`, it temporarily overrides the value set by
     * `setSynchronize()`.
     *
     * @since 1.0.0
     * @throw StorageError
     */
    clear: (sync?: boolean) => Promise<void>;
}
