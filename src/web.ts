import { registerWebPlugin, WebPlugin } from '@capacitor/core';
import {
  ClearResult,
  KeyOption,
  RetrieveResult,
  SetKeyPrefixOptions,
  StorageError,
  StorageErrorType,
  StorageType,
  StoreOptions,
  WSSecureStoragePlugin,
} from './definitions';
import { Blowfish } from 'javascript-blowfish';

export class WSSecureStorageWeb
  extends WebPlugin
  implements WSSecureStoragePlugin {
  private blowfish: Blowfish;
  private storageType: StorageType = StorageType.localStorage;
  private storage: Storage;
  private prefix: string = 'secure-storage_';

  constructor() {
    super({
      name: 'WSSecureStorage',
      platforms: ['web'],
    });

    this.setStorageType(this.storageType);
  }

  setStorageType(type: StorageType) {
    this.storageType = type;
    this.storage =
      type === StorageType.sessionStorage ? sessionStorage : localStorage;
  }

  getStorageType(): StorageType {
    return this.storageType;
  }

  setEncryptionKey(key: string) {
    if (key) {
      this.blowfish = new Blowfish(key);
    } else {
      throw new StorageError(
        'Encryption key must be non-null and non-empty',
        StorageErrorType.encryptionKeyNotSet,
      );
    }
  }

  setKeyPrefix(options: SetKeyPrefixOptions) {
    this.prefix = options.prefix || '';
  }

  getStoragePrefix(): string {
    return this.prefix;
  }

  checkForEncryptionKey() {
    if (!this.blowfish) {
      throw new StorageError(
        'The encryption key has not been set',
        StorageErrorType.encryptionKeyNotSet,
      );
    }
  }

  store(options: StoreOptions): Promise<void> {
    this.checkForEncryptionKey();

    if (options.key) {
      const encoded = this.encryptData(options.data);
      this.storage.setItem(this.prefix + options.key, encoded);
      return Promise.resolve();
    } else {
      this.missingKey();
    }
  }

  retrieve({ key }: KeyOption): Promise<RetrieveResult> {
    this.checkForEncryptionKey();

    if (key) {
      const data = this.storage.getItem(this.prefix + key);

      if (data) {
        try {
          return Promise.resolve({ data: this.decryptData(data) });
        } catch (e) {
          throw new StorageError(e.message, StorageErrorType.invalidData);
        }
      } else {
        const storage = StorageType[this.storageType];

        throw new StorageError(
          `Data not found for key "${key}" in ${storage}`,
          StorageErrorType.notFound,
        );
      }
    } else {
      this.missingKey();
    }
  }

  clear({ key }: KeyOption): Promise<ClearResult> {
    if (key) {
      const item = this.storage.getItem(this.prefix + key);

      if (item !== null) {
        this.storage.removeItem(this.prefix + key);
        return Promise.resolve({ success: true });
      }

      return Promise.resolve({ success: false });
    } else {
      this.missingKey();
    }
  }

  private encryptData(data: string): string {
    const json = JSON.stringify(data);
    return this.blowfish.base64Encode(this.blowfish.encryptECB(json));
  }

  private decryptData(ciphertext: string): string {
    const json = this.blowfish.trimZeros(
      this.blowfish.decryptECB(this.blowfish.base64Decode(ciphertext)),
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

  private missingKey() {
    throw new StorageError('No key provided', StorageErrorType.missingKey);
  }
}

const WSSecureStorage = new WSSecureStorageWeb();

export { WSSecureStorage };

registerWebPlugin(WSSecureStorage);
