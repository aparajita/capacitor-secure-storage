'use strict';

var core = require('@capacitor/core');

/**
 * When one of the storage functions throws, the thrown StorageError
 * will have a .code property that contains one of these values.
 *
 * @modified 5.0.0
 */
exports.StorageErrorType = void 0;
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
})(exports.StorageErrorType || (exports.StorageErrorType = {}));
/**
 * iOS only
 *
 * The keychain access option for the storage. The default is
 * `whenUnlocked`. For more information, see:
 * https://developer.apple.com/documentation/security/keychain_services/keychain_items/item_attribute_keys_and_values#1679100
 */
exports.KeychainAccess = void 0;
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
})(exports.KeychainAccess || (exports.KeychainAccess = {}));
/**
 * If one of the storage functions throws, it will throw a StorageError which
 * will have a .code property that can be tested against StorageErrorType,
 * and a .message property will have a message suitable for debugging purposes.
 *
 * @modified 5.0.0
 */
class StorageError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'StorageError';
        this.code = code;
    }
}

const proxy = core.registerPlugin('SecureStorage', {
    web: async () => {
        const module = await Promise.resolve().then(function () { return web; });
        return new module.SecureStorageWeb();
    },
    ios: async () => {
        const module = await Promise.resolve().then(function () { return native; });
        return new module.SecureStorageNative(proxy);
    },
    android: async () => {
        const module = await Promise.resolve().then(function () { return native; });
        return new module.SecureStorageNative(proxy);
    },
});

/* eslint-disable @typescript-eslint/require-await */
function isStorageErrorType(value) {
    return value !== undefined && Object.keys(exports.StorageErrorType).includes(value);
}
class SecureStorageBase extends core.WebPlugin {
    constructor() {
        super(...arguments);
        this.prefix = 'capacitor-storage_';
        this.sync = false;
        this.access = exports.KeychainAccess.whenUnlocked;
    }
    async setSynchronize(sync) {
        this.sync = sync;
        if (core.Capacitor.getPlatform() === 'ios') {
            return this.setSynchronizeKeychain({ sync });
        }
        // no-op on other platforms
    }
    async getSynchronize() {
        return this.sync;
    }
    async setDefaultKeychainAccess(access) {
        this.access = access;
    }
    async tryOperation(operation) {
        try {
            // Ensure that only one operation is in progress at a time.
            return await operation();
        }
        catch (error) {
            // Native calls which reject will throw a CapacitorException with a code.
            // We want to convert these to StorageErrors.
            if (error instanceof core.CapacitorException &&
                isStorageErrorType(error.code)) {
                throw new StorageError(error.message, error.code);
            }
            throw error;
        }
    }
    async get(key, convertDate = true, sync) {
        if (key) {
            const { data } = await this.tryOperation(async () => this.internalGetItem({
                prefixedKey: this.prefixedKey(key),
                sync: sync !== null && sync !== void 0 ? sync : this.sync,
            }));
            if (data === null) {
                return null;
            }
            if (convertDate) {
                const date = parseISODate(data);
                if (date) {
                    return date;
                }
            }
            try {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                return JSON.parse(data);
            }
            catch (_a) {
                throw new StorageError('Invalid data', exports.StorageErrorType.invalidData);
            }
        }
        return SecureStorageBase.missingKey();
    }
    async getItem(key) {
        if (key) {
            const { data } = await this.tryOperation(async () => this.internalGetItem({
                prefixedKey: this.prefixedKey(key),
                sync: this.sync,
            }));
            return data;
        }
        return null;
    }
    async set(key, data, convertDate = true, sync, access) {
        if (key) {
            let convertedData = data;
            if (convertDate && data instanceof Date) {
                convertedData = data.toISOString();
            }
            return this.tryOperation(async () => this.internalSetItem({
                prefixedKey: this.prefixedKey(key),
                data: JSON.stringify(convertedData),
                sync: sync !== null && sync !== void 0 ? sync : this.sync,
                access: access !== null && access !== void 0 ? access : this.access,
            }));
        }
        return SecureStorageBase.missingKey();
    }
    async setItem(key, value) {
        if (key) {
            return this.tryOperation(async () => this.internalSetItem({
                prefixedKey: this.prefixedKey(key),
                data: value,
                sync: this.sync,
                access: this.access,
            }));
        }
        return SecureStorageBase.missingKey();
    }
    async remove(key, sync) {
        if (key) {
            const { success } = await this.tryOperation(async () => this.internalRemoveItem({
                prefixedKey: this.prefixedKey(key),
                sync: sync !== null && sync !== void 0 ? sync : this.sync,
            }));
            return success;
        }
        return SecureStorageBase.missingKey();
    }
    async removeItem(key) {
        if (key) {
            await this.tryOperation(async () => this.internalRemoveItem({
                prefixedKey: this.prefixedKey(key),
                sync: this.sync,
            }));
            return;
        }
        SecureStorageBase.missingKey();
    }
    async keys(sync) {
        const { keys } = await this.tryOperation(async () => this.getPrefixedKeys({
            prefix: this.prefix,
            sync: sync !== null && sync !== void 0 ? sync : this.sync,
        }));
        const prefixLength = this.prefix.length;
        return keys.map((key) => key.slice(prefixLength));
    }
    async getKeyPrefix() {
        return this.prefix;
    }
    async setKeyPrefix(prefix) {
        this.prefix = prefix;
    }
    prefixedKey(key) {
        return this.prefix + key;
    }
    static missingKey() {
        throw new StorageError('No key provided', exports.StorageErrorType.missingKey);
    }
}
// RegExp to match an ISO 8601 date string in the form YYYY-MM-DDTHH:mm:ss.sssZ
const isoDateRE = /^"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z"$/u;
function parseISODate(isoDate) {
    const match = isoDateRE.exec(isoDate);
    if (match) {
        const year = Number.parseInt(match[1], 10);
        const month = Number.parseInt(match[2], 10) - 1; // month is zero-based
        const day = Number.parseInt(match[3], 10);
        const hour = Number.parseInt(match[4], 10);
        const minute = Number.parseInt(match[5], 10);
        const second = Number.parseInt(match[6], 10);
        const millis = Number.parseInt(match[7], 10);
        const epochTime = Date.UTC(year, month, day, hour, minute, second, millis);
        return new Date(epochTime);
    }
    return null;
}
/* eslint-enable @typescript-eslint/require-await */

class SecureStorageWeb extends SecureStorageBase {
    // @native
    /* eslint-disable @typescript-eslint/class-methods-use-this */
    async setSynchronizeKeychain(_options) {
        // Web implementation - no-op
    }
    // @native
    // eslint-disable-next-line @typescript-eslint/require-await
    async internalGetItem(options) {
        return { data: localStorage.getItem(options.prefixedKey) };
    }
    // @native
    // eslint-disable-next-line @typescript-eslint/require-await
    async internalSetItem(options) {
        localStorage.setItem(options.prefixedKey, options.data);
    }
    // @native
    // eslint-disable-next-line @typescript-eslint/require-await
    async internalRemoveItem(options) {
        const item = localStorage.getItem(options.prefixedKey);
        if (item !== null) {
            localStorage.removeItem(options.prefixedKey);
            return { success: true };
        }
        return { success: false };
    }
    async clear() {
        const { keys } = await this.getPrefixedKeys({ prefix: this.prefix });
        for (const key of keys) {
            localStorage.removeItem(key);
        }
    }
    // @native
    // eslint-disable-next-line @typescript-eslint/require-await
    async clearItemsWithPrefix(_options) {
        console.warn('clearItemsWithPrefix is native only');
    }
    // @native
    // eslint-disable-next-line @typescript-eslint/require-await
    async getPrefixedKeys(options) {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key === null || key === void 0 ? void 0 : key.startsWith(options.prefix)) {
                keys.push(key);
            }
        }
        return { keys };
    }
}

var web = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SecureStorageWeb: SecureStorageWeb
});

/* eslint-disable @typescript-eslint/require-await */
class SecureStorageNative extends SecureStorageBase {
    constructor(capProxy) {
        super();
        // capProxy is a proxy of an instance of this class, so it is safe
        // to cast it to this class.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        const proxy = capProxy;
        /* eslint-disable @typescript-eslint/unbound-method */
        this.setSynchronizeKeychain = proxy.setSynchronizeKeychain;
        this.internalGetItem = proxy.internalGetItem;
        this.internalSetItem = proxy.internalSetItem;
        this.internalRemoveItem = proxy.internalRemoveItem;
        this.clearItemsWithPrefix = proxy.clearItemsWithPrefix;
        this.getPrefixedKeys = proxy.getPrefixedKeys;
        /* eslint-enable @typescript-eslint/unbound-method */
    }
    // @native
    /* eslint-disable @typescript-eslint/class-methods-use-this */
    async setSynchronizeKeychain(_options) {
        // Native implementation
    }
    // @native
    async internalGetItem(_options) {
        return { data: '' };
    }
    // @native
    async internalSetItem(_options) {
        // Native implementation
    }
    // @native
    async internalRemoveItem(_options) {
        return { success: true };
    }
    async clear(sync) {
        return this.tryOperation(async () => this.clearItemsWithPrefix({
            prefix: this.prefix,
            sync: sync !== null && sync !== void 0 ? sync : this.sync,
        }));
    }
    // @native
    async clearItemsWithPrefix(_options) {
        // Native implementation
    }
    // @native
    async getPrefixedKeys(_options) {
        return { keys: [] };
    }
}
/* eslint-enable @typescript-eslint/require-await */

var native = /*#__PURE__*/Object.freeze({
  __proto__: null,
  SecureStorageNative: SecureStorageNative
});

exports.SecureStorage = proxy;
exports.StorageError = StorageError;
