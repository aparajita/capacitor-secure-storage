import { WebPlugin } from '@capacitor/core';
import type { DataType, SecureStoragePlugin } from './definitions.js';
import { KeychainAccess } from './definitions.js';
export interface SecureStoragePluginNative {
    setSynchronizeKeychain: (options: {
        sync: boolean;
    }) => Promise<void>;
    setDefaultKeychainAccess: (options: {
        access: string;
    }) => Promise<void>;
    internalGetItem: (options: {
        prefixedKey: string;
    }) => Promise<{
        data: string;
    }>;
    internalSetItem: (options: {
        prefixedKey: string;
        data: string;
        access: KeychainAccess;
    }) => Promise<void>;
    internalRemoveItem: (options: {
        prefixedKey: string;
    }) => Promise<{
        success: boolean;
    }>;
    clearItemsWithPrefix: (options: {
        prefix: string;
    }) => Promise<void>;
    getPrefixedKeys: (options: {
        prefix: string;
    }) => Promise<{
        keys: string[];
    }>;
}
export declare abstract class SecureStorageBase extends WebPlugin implements SecureStoragePlugin {
    protected prefix: string;
    protected sync: boolean;
    protected access: KeychainAccess;
    setSynchronize(sync: boolean): Promise<void>;
    getSynchronize(): Promise<boolean>;
    protected abstract setSynchronizeKeychain(options: {
        sync: boolean;
    }): Promise<void>;
    setDefaultKeychainAccess(access: KeychainAccess): Promise<void>;
    protected tryOperation<T>(operation: () => Promise<T>): Promise<T>;
    get(key: string, convertDate?: boolean, sync?: boolean): Promise<DataType | null>;
    getItem(key: string): Promise<string | null>;
    protected abstract internalGetItem(options: {
        prefixedKey: string;
        sync: boolean;
    }): Promise<{
        data: string | null;
    }>;
    set(key: string, data: DataType, convertDate?: boolean, sync?: boolean, access?: KeychainAccess): Promise<void>;
    setItem(key: string, value: string): Promise<void>;
    protected abstract internalSetItem(options: {
        prefixedKey: string;
        data: string;
        sync: boolean;
        access: KeychainAccess;
    }): Promise<void>;
    remove(key: string, sync?: boolean): Promise<boolean>;
    removeItem(key: string): Promise<void>;
    protected abstract internalRemoveItem(options: {
        prefixedKey: string;
        sync: boolean;
    }): Promise<{
        success: boolean;
    }>;
    abstract clear(sync?: boolean): Promise<void>;
    protected abstract clearItemsWithPrefix(options: {
        prefix: string;
        sync: boolean;
    }): Promise<void>;
    keys(sync?: boolean): Promise<string[]>;
    protected abstract getPrefixedKeys(options: {
        prefix: string;
        sync: boolean;
    }): Promise<{
        keys: string[];
    }>;
    getKeyPrefix(): Promise<string>;
    setKeyPrefix(prefix: string): Promise<void>;
    protected prefixedKey(key: string): string;
    protected static missingKey(): never;
}
