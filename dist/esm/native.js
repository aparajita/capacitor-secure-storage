/* eslint-disable @typescript-eslint/require-await */
import { SecureStorageBase } from './base.js';
export class SecureStorageNative extends SecureStorageBase {
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
