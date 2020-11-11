import { Capacitor, registerWebPlugin, WebPlugin } from '@capacitor/core';
import { Blowfish } from 'javascript-blowfish';
import {
  StorageError,
  StorageErrorType,
  StorageType,
  WSSecureStoragePlugin,
} from './definitions';
import { native } from 'ws-capacitor-native-decorator';

export class WSSecureStorageWeb
  extends WebPlugin
  implements WSSecureStoragePlugin {
  private _blowfish: Blowfish;
  private _storageType: StorageType = StorageType.localStorage;
  private _storage: Storage;
  private _prefix: string = 'secure-storage_';

  constructor() {
    super({
      name: 'WSSecureStorage',
      platforms: ['web', 'ios', 'android'],
    });

    this.storageType = this._storageType;
  }

  private static missingKey() {
    throw new StorageError('No key provided', StorageErrorType.missingKey);
  }

  set storageType(type: StorageType) {
    this._storageType = type;
    this._storage =
      type === StorageType.sessionStorage ? sessionStorage : localStorage;
  }

  get storageType(): StorageType {
    return this._storageType;
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

  @native()
  setKeyPrefix(prefix: string): Promise<void> {
    this._prefix = prefix || '';
    return Promise.resolve();
  }

  @native()
  getKeyPrefix(): Promise<string> {
    return Promise.resolve(this._prefix);
  }

  @native()
  setItem(key: string, data: string): Promise<void> {
    this.checkForEncryptionKey();

    if (key) {
      const encoded = this.encryptData(data);
      this._storage.setItem(this._prefix + key, encoded);
      return Promise.resolve();
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  @native()
  getItem(key: string): Promise<string> {
    this.checkForEncryptionKey();

    if (key) {
      const data = this._storage.getItem(this._prefix + key);

      if (data) {
        try {
          return Promise.resolve(this.decryptData(data));
        } catch (e) {
          throw new StorageError(e.message, StorageErrorType.invalidData);
        }
      } else {
        const storage = StorageType[this._storageType];

        throw new StorageError(
          `Data not found for key "${key}" in ${storage}`,
          StorageErrorType.notFound,
        );
      }
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  @native()
  removeItem(key: string): Promise<boolean> {
    if (key) {
      const item = this._storage.getItem(this._prefix + key);

      if (item !== null) {
        this._storage.removeItem(this._prefix + key);
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    } else {
      WSSecureStorageWeb.missingKey();
    }
  }

  private checkForEncryptionKey() {
    if (!Capacitor.isNative && !this._blowfish) {
      throw new StorageError(
        'The encryption key has not been set',
        StorageErrorType.encryptionKeyNotSet,
      );
    }
  }

  private encryptData(data: string): string {
    const json = JSON.stringify(data);
    return this._blowfish.base64Encode(this._blowfish.encryptECB(json));
  }

  private decryptData(ciphertext: string): string {
    const json = this._blowfish.trimZeros(
      this._blowfish.decryptECB(this._blowfish.base64Decode(ciphertext)),
    );

    try {
      return JSON.parse(json);
    } catch (e) {
      throw new StorageError(
        'Could not parse data object',
        StorageErrorType.invalidData,
      );
    }
  }
}

const WSSecureStorage = new WSSecureStorageWeb();

export { WSSecureStorage };

registerWebPlugin(WSSecureStorage);
