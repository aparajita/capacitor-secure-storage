import { registerPlugin } from '@capacitor/core';
const proxy = registerPlugin('SecureStorage', {
    web: async () => {
        const module = await import('./web.js');
        return new module.SecureStorageWeb();
    },
    ios: async () => {
        const module = await import('./native.js');
        return new module.SecureStorageNative(proxy);
    },
    android: async () => {
        const module = await import('./native.js');
        return new module.SecureStorageNative(proxy);
    },
});
export * from './definitions.js';
export { proxy as SecureStorage };
