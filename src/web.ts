import { Capacitor, registerWebPlugin, WebPlugin } from '@capacitor/core';
import { Blowfish } from 'javascript-blowfish';
import {
  DataType,
  StorageErrorType,
  StorageResultError,
  StorageType,
  WSSecureStoragePlugin,
} from './definitions';
import { native } from 'ws-capacitor-native-decorator';

export class StorageError extends Error implements StorageResultError {
  code: string;

  constructor(message: string, code: StorageErrorType) {
    super(message);
    this.code = StorageErrorType[code];
  }
}

export class WSSecureStorageWeb
  extends WebPlugin
  implements WSSecureStoragePlugin {
  private _blowfish: Blowfish | null = null;
  private _storage: Storage = localStorage;
  private _prefix: string = 'capacitor-storage_';

  constructor() {
    super({
      name: 'WSSecureStorage',
      platforms: ['web', 'ios', 'android'],
    });

    this.storageType = this._storageType;
  }

  private _storageType: StorageType = StorageType.localStorage;

  get storageType(): StorageType {
    return this._storageType;
  }

  set storageType(type: StorageType) {
    this._storageType = type;
    this._storage =
      type === StorageType.sessionStorage ? sessionStorage : localStorage;
  }

  get keyPrefix(): string {
    return this._prefix;
  }

  set keyPrefix(prefix: string) {
    this._prefix = prefix || '';
  }

  private static missingKey(): never {
    throw new StorageError('No key provided', StorageErrorType.missingKey);
  }

  setEncryptionKey(key: string) {
    // This is web-only
    if (Capacitor.isNative) {
      return;
    }

    if (key) {
      this._blowfish = new Blowfish(key);
    } else {
      throw new StorageError(
        'Encryption key must be non-null and non-empty',
        StorageErrorType.encryptionKeyNotSet,
      );
    }
  }

  keys(): Promise<string[]> {
    return this.getKeys();
  }

  set(key: string, data: DataType, convertDate: boolean = true): Promise<void> {
    if (key) {
      if (convertDate && data instanceof Date) {
        data = data.toISOString();
      }

      return this.setItem(this.prefixedKey(key), JSON.stringify(data));
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  get(key: string, convertDate: boolean = true): Promise<DataType> {
    if (key) {
      return this.getItem(this.prefixedKey(key)).then(data => {
        if (convertDate) {
          const date = parseISODate(data);

          if (date) {
            return date;
          }
        }

        return JSON.parse(data);
      });
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  remove(key: string): Promise<boolean> {
    if (key) {
      return this.removeItem(this.prefixedKey(key));
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  clear(): Promise<void> {
    // We use a separate native call because we want to avoid
    // the overhead of a plugin call to removeItem() for every item.
    if (Capacitor.isNative) {
      return this.clearItemsWithPrefix(this._prefix);
    } else {
      this.getPrefixedKeys(this._prefix).then(keys => {
        keys.forEach(key => {
          this._storage.removeItem(key);
        });
      });

      return Promise.resolve();
    }
  }

  @native()
  private setItem(prefixedKey: string, data: string): Promise<void> {
    const encoded = this.encryptData(data);
    this._storage.setItem(prefixedKey, encoded);
    return Promise.resolve();
  }

  @native()
  private getItem(prefixedKey: string): Promise<string> {
    const data = this._storage.getItem(prefixedKey);

    if (data) {
      try {
        return Promise.resolve(this.decryptData(data));
      } catch (e) {
        throw new StorageError(e.message, StorageErrorType.invalidData);
      }
    } else {
      const storage = StorageType[this._storageType];

      throw new StorageError(
        `Data not found for key "${prefixedKey}" in ${storage}`,
        StorageErrorType.notFound,
      );
    }
  }

  @native()
  private removeItem(prefixedKey: string): Promise<boolean> {
    const item = this._storage.getItem(prefixedKey);

    if (item !== null) {
      this._storage.removeItem(prefixedKey);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  @native()
  private clearItemsWithPrefix(_prefix: string): Promise<void> {
    return Promise.resolve();
  }

  private prefixedKey(key: string): string {
    return this._prefix + key;
  }

  private encryptData(data: string): string {
    if (this._blowfish) {
      const json = JSON.stringify(data);
      return this._blowfish.base64Encode(this._blowfish.encryptECB(json));
    } else {
      throw new StorageError(
        'The encryption key has not been set',
        StorageErrorType.encryptionKeyNotSet,
      );
    }
  }

  private decryptData(ciphertext: string): string {
    let json;

    if (this._blowfish) {
      json = this._blowfish.trimZeros(
        this._blowfish.decryptECB(this._blowfish.base64Decode(ciphertext)),
      );
    } else {
      throw new StorageError(
        'The encryption key has not been set',
        StorageErrorType.encryptionKeyNotSet,
      );
    }

    try {
      return JSON.parse(json);
    } catch (e) {
      throw new StorageError(
        'Could not parse data object',
        StorageErrorType.invalidData,
      );
    }
  }

  @native()
  private getPrefixedKeys(prefix: string): Promise<string[]> {
    const keys: string[] = [];

    for (let i = 0; i < this._storage.length; i++) {
      const key = this._storage.key(i);

      if (key?.startsWith(prefix)) {
        keys.push(key);
      }
    }

    return Promise.resolve(keys);
  }

  private getKeys(): Promise<string[]> {
    return this.getPrefixedKeys(this._prefix).then(prefixedKeys => {
      const prefixLength = this._prefix.length;
      return prefixedKeys.map(key => key.slice(prefixLength));
    });
  }
}

// RegExp to match an ISO 8601 date string in the form YYYY-MM-DDTHH:mm:ss.sssZ
const isoDateRE = /^"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}).(\d{3})Z"$/;

function parseISODate(isoDate: string): Date | null {
  const match = isoDateRE.exec(isoDate);

  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // month is zero-based
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = parseInt(match[6], 10);
    const millis = parseInt(match[7], 10);
    const epochTime = Date.UTC(year, month, day, hour, minute, second, millis);
    return new Date(epochTime);
  }

  return null;
}

const WSSecureStorage = new WSSecureStorageWeb();

export { WSSecureStorage };

registerWebPlugin(WSSecureStorage);
