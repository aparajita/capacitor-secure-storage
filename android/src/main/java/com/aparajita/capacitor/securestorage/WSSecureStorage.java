package com.aparajita.capacitor.securestorage;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.KeyPairGeneratorSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.spec.AlgorithmParameterSpec;
import java.util.Calendar;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.security.auth.x500.X500Principal;

interface StorageOp {
    void run() throws KeyStoreException;
}

@NativePlugin
public class WSSecureStorage extends Plugin {

    // KeyStore-related stuff
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String SHARED_PREFERENCES = "WSSecureStorageSharedPreferences";
    private static final Character DATA_IV_SEPARATOR = '\u0010';
    private static final int BASE64_FLAGS = Base64.NO_PADDING + Base64.NO_WRAP;

    private KeyStore keyStore;
    private String keyPrefix = "secure-storage_";

    @PluginMethod
    public void setKeyPrefix(final PluginCall call) {
        keyPrefix = call.getString("prefix", "");
    }

    @PluginMethod
    public void getKeyPrefix(final PluginCall call) {
        JSObject result = new JSObject();
        result.put("prefix", keyPrefix);
        call.resolve(result);
    }

    @PluginMethod
    public void setItem(final PluginCall call) {
        String key = getKeyParam(call);

        if (key == null) {
            return;
        }

        String data = getDataParam(call);

        if (data == null) {
            return;
        }

        tryStorageOp(
            call,
            () -> {
                storeDataInKeyStore(data, key);
                call.resolve();
            }
        );
    }

    @PluginMethod
    public void getItem(final PluginCall call) {
        String key = getKeyParam(call);

        if (key == null) {
            return;
        }

        tryStorageOp(
            call,
            () -> {
                String data = getDataFromKeyStore(key);

                JSObject result = new JSObject();
                result.put("data", data);

                call.resolve(result);
            }
        );
    }

    @PluginMethod
    public void removeItem(final PluginCall call) {
        String key = getKeyParam(call);

        if (key == null) {
            return;
        }

        tryStorageOp(
            call,
            () -> {
                boolean success = removeDataFromKeyStore(key);

                JSObject result = new JSObject();
                result.put("success", success);

                call.resolve(result);
            }
        );
    }

    private String getPrefixedKey(String key) {
        return keyPrefix + key;
    }

    private SharedPreferences getPrefs() {
        return getContext().getSharedPreferences(SHARED_PREFERENCES, Context.MODE_PRIVATE);
    }

    private void storeDataInKeyStore(String data, String key) throws KeyStoreException {
        String prefixedKey = getPrefixedKey(key);

        // When we get here, we know that the values are not null
        try {
            getPrefs().edit().putString(prefixedKey, encryptString(data, prefixedKey)).apply();
        } catch (GeneralSecurityException | IOException e) {
            throw new KeyStoreException(KeyStoreException.ErrorKind.osError, e);
        }
    }

    private String getDataFromKeyStore(String key) throws KeyStoreException {
        SharedPreferences sharedPreferences = getPrefs();
        String data;
        String prefixedKey = getPrefixedKey(key);

        try {
            data = sharedPreferences.getString(prefixedKey, null);
        } catch (ClassCastException e) {
            throw new KeyStoreException(KeyStoreException.ErrorKind.invalidData);
        }

        if (data != null) {
            try {
                return decryptString(data, key);
            } catch (GeneralSecurityException | IOException e) {
                throw new KeyStoreException(KeyStoreException.ErrorKind.osError, e);
            }
        } else {
            throw new KeyStoreException(KeyStoreException.ErrorKind.notFound, key);
        }
    }

    private boolean removeDataFromKeyStore(String key) throws KeyStoreException {
        try {
            boolean success = false;
            KeyStore keyStore = getKeyStore();
            String prefixedKey = getPrefixedKey(key);

            if (keyStore.containsAlias(prefixedKey)) {
                getKeyStore().deleteEntry(prefixedKey);
                getPrefs().edit().remove(prefixedKey).apply();
                success = true;
            }

            return success;
        } catch (GeneralSecurityException | IOException e) {
            throw new KeyStoreException(KeyStoreException.ErrorKind.osError, e);
        }
    }

    private void tryStorageOp(PluginCall call, StorageOp op) {
        KeyStoreException exception;

        try {
            op.run();
            return;
        } catch (KeyStoreException e) {
            exception = e;
        } catch (Exception e) {
            exception = new KeyStoreException(KeyStoreException.ErrorKind.unknownError);
        }

        exception.rejectCall(call);
    }

    private String getKeyParam(PluginCall call) {
        String key = call.getString("key");

        if (key != null && !key.isEmpty()) {
            return key;
        }

        KeyStoreException.reject(call, KeyStoreException.ErrorKind.missingKey);
        return null;
    }

    private String getDataParam(PluginCall call) {
        String value = call.getString("data");

        if (value != null) {
            return value;
        }

        KeyStoreException.reject(call, KeyStoreException.ErrorKind.invalidData);
        return null;
    }

    private String encryptString(String str, String prefixedKey) throws GeneralSecurityException, IOException {
        // Code taken from https://medium.com/@josiassena/using-the-android-keystore-system-to-store-sensitive-information-3a56175a454b
        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(prefixedKey));

        byte[] iv = cipher.getIV();
        byte[] plaintext = str.getBytes(StandardCharsets.UTF_8);

        byte[] encryptedBytes = cipher.doFinal(plaintext);
        String encryptedStr = Base64.encodeToString(encryptedBytes, BASE64_FLAGS);

        // Append the IV
        String ivStr = Base64.encodeToString(iv, BASE64_FLAGS);
        return encryptedStr + DATA_IV_SEPARATOR + ivStr;
    }

    private String decryptString(String ciphertext, String key) throws GeneralSecurityException, IOException, KeyStoreException {
        // Code taken from https://medium.com/@josiassena/using-the-android-keystore-system-to-store-sensitive-information-3a56175a454b

        // Split the ciphertext into data + IV
        String[] parts = ciphertext.split(DATA_IV_SEPARATOR.toString());

        // There must be 2 parts
        if (parts.length != 2) {
            throw new KeyStoreException(KeyStoreException.ErrorKind.invalidData);
        }

        // The first part is the actual data, the second is the IV
        byte[] encryptedData = Base64.decode(parts[0], BASE64_FLAGS);
        byte[] iv = Base64.decode(parts[1], BASE64_FLAGS);

        String prefixedKey = getPrefixedKey(key);
        KeyStore keyStore = getKeyStore();
        KeyStore.SecretKeyEntry secretKeyEntry = (KeyStore.SecretKeyEntry) keyStore.getEntry(prefixedKey, null);

        // Make sure there is an entry in the KeyStore for the given domain
        if (secretKeyEntry == null) {
            throw new KeyStoreException(KeyStoreException.ErrorKind.notFound, key);
        }

        SecretKey secretKey = secretKeyEntry.getSecretKey();
        Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

        byte[] decryptedData = cipher.doFinal(encryptedData);
        return new String(decryptedData, StandardCharsets.UTF_8);
    }

    private SecretKey getSecretKey(String prefixedKey) throws GeneralSecurityException, IOException {
        KeyGenerator keyGenerator = KeyGenerator.getInstance("AES", ANDROID_KEY_STORE);
        KeyStore keyStore = getKeyStore();
        KeyStore.SecretKeyEntry entry = (KeyStore.SecretKeyEntry) keyStore.getEntry(prefixedKey, null);
        SecretKey secretKey;

        if (entry == null) {
            AlgorithmParameterSpec spec;

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                KeyGenParameterSpec.Builder builder = new KeyGenParameterSpec.Builder(
                    prefixedKey,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
                );
                spec =
                    builder
                        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                        .build();
            } else {
                // Let the key pair last for 1 year
                Calendar start = Calendar.getInstance();
                Calendar end = Calendar.getInstance();
                end.add(Calendar.YEAR, 1);

                KeyPairGeneratorSpec.Builder builder = new KeyPairGeneratorSpec.Builder(getContext());
                spec =
                    builder
                        .setAlias(prefixedKey)
                        .setSubject(new X500Principal("CN=" + prefixedKey))
                        .setSerialNumber(BigInteger.ONE)
                        .setStartDate(start.getTime())
                        .setEndDate(end.getTime())
                        .build();
            }

            keyGenerator.init(spec);
            secretKey = keyGenerator.generateKey();
        } else {
            secretKey = entry.getSecretKey();
        }

        return secretKey;
    }

    private KeyStore getKeyStore() throws GeneralSecurityException, IOException {
        if (keyStore == null) {
            keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            keyStore.load(null);
        }

        return keyStore;
    }
}
