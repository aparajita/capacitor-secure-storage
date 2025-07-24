import { SecureStorageBase } from './base.js';
import type { KeychainAccess, SecureStoragePlugin } from './definitions.js';
export declare class SecureStorageNative extends SecureStorageBase {
    constructor(capProxy: SecureStoragePlugin);
    protected setSynchronizeKeychain(_options: {
        sync: boolean;
    }): Promise<void>;
    protected internalGetItem(_options: {
        prefixedKey: string;
        sync: boolean;
    }): Promise<{
        data: string;
    }>;
    protected internalSetItem(_options: {
        prefixedKey: string;
        data: string;
        sync: boolean;
        access: KeychainAccess;
    }): Promise<void>;
    protected internalRemoveItem(_options: {
        prefixedKey: string;
        sync: boolean;
    }): Promise<{
        success: boolean;
    }>;
    clear(sync?: boolean): Promise<void>;
    protected clearItemsWithPrefix(_options: {
        prefix: string;
        sync: boolean;
    }): Promise<void>;
    protected getPrefixedKeys(_options: {
        prefix: string;
        sync: boolean;
    }): Promise<{
        keys: string[];
    }>;
}
