/* eslint-disable @typescript-eslint/require-await */
import { Capacitor, CapacitorException, WebPlugin } from '@capacitor/core';
import { KeychainAccess, StorageError, StorageErrorType, } from './definitions.js';
function isStorageErrorType(value) {
    return value !== undefined && Object.keys(StorageErrorType).includes(value);
}
export class SecureStorageBase extends WebPlugin {
    constructor() {
        super(...arguments);
        this.prefix = 'capacitor-storage_';
        this.sync = false;
        this.access = KeychainAccess.whenUnlocked;
    }
    async setSynchronize(sync) {
        this.sync = sync;
        if (Capacitor.getPlatform() === 'ios') {
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
            if (error instanceof CapacitorException &&
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
                throw new StorageError('Invalid data', StorageErrorType.invalidData);
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
        throw new StorageError('No key provided', StorageErrorType.missingKey);
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
