/**
 * When one of the storage functions throws, the thrown StorageError
 * will have a .code property that contains one of these values.
 *
 * @modified 5.0.0
 */
export var StorageErrorType;
(function (StorageErrorType) {
    /**
     * The key is null or empty.
     */
    StorageErrorType["missingKey"] = "missingKey";
    /**
     * `get()` found the data, but it is corrupted.
     */
    StorageErrorType["invalidData"] = "invalidData";
    /**
     * A system-level error occurred when getting/setting data from/to the store.
     */
    StorageErrorType["osError"] = "osError";
    /**
     * An unclassified system-level error occurred.
     */
    StorageErrorType["unknownError"] = "unknownError";
})(StorageErrorType || (StorageErrorType = {}));
/**
 * iOS only
 *
 * The keychain access option for the storage. The default is
 * `whenUnlocked`. For more information, see:
 * https://developer.apple.com/documentation/security/keychain_services/keychain_items/item_attribute_keys_and_values#1679100
 */
export var KeychainAccess;
(function (KeychainAccess) {
    /**
      The data in the keychain item can be accessed only while the device is
      unlocked by the user.
  
      This is recommended for items that need to be accessible only while the
      application is in the foreground. Items with this attribute migrate to
      a new device when using encrypted backups.
  
      This is the default value for keychain items added without explicitly
      setting an accessibility constant.
     */
    KeychainAccess[KeychainAccess["whenUnlocked"] = 0] = "whenUnlocked";
    /**
      The data in the keychain item can be accessed only while the device is
      unlocked by the user.
  
      This is recommended for items that need to be accessible only while the
      application is in the foreground. Items with this attribute do not migrate
      to a new device. Thus, after restoring from a backup of a different device,
      these items will not be present.
     */
    KeychainAccess[KeychainAccess["whenUnlockedThisDeviceOnly"] = 1] = "whenUnlockedThisDeviceOnly";
    /**
      The data in the keychain item cannot be accessed after a restart until the
      device has been unlocked once by the user.
  
      After the first unlock, the data remains accessible until the next restart.
      This is recommended for items that need to be accessed by background
      applications. Items with this attribute migrate to a new device when using
      encrypted backups.
     */
    KeychainAccess[KeychainAccess["afterFirstUnlock"] = 2] = "afterFirstUnlock";
    /**
      The data in the keychain item cannot be accessed after a restart until
      the device has been unlocked once by the user.
  
      After the first unlock, the data remains accessible until the next restart.
      This is recommended for items that need to be accessed by background
      applications. Items with this attribute do not migrate to a new device.
      Thus, after restoring from a backup of a different device, these items
      will not be present.
     */
    KeychainAccess[KeychainAccess["afterFirstUnlockThisDeviceOnly"] = 3] = "afterFirstUnlockThisDeviceOnly";
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
    KeychainAccess[KeychainAccess["whenPasscodeSetThisDeviceOnly"] = 4] = "whenPasscodeSetThisDeviceOnly";
})(KeychainAccess || (KeychainAccess = {}));
/**
 * If one of the storage functions throws, it will throw a StorageError which
 * will have a .code property that can be tested against StorageErrorType,
 * and a .message property will have a message suitable for debugging purposes.
 *
 * @modified 5.0.0
 */
export class StorageError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'StorageError';
        this.code = code;
    }
}
