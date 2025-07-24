import { SecureStorageBase } from './base.js';
export class SecureStorageWeb extends SecureStorageBase {
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
