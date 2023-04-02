package com.aparajita.capacitor.securestorage;

import android.content.Context;
import android.content.SharedPreferences;
import android.security.KeyPairGeneratorSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.UnrecoverableKeyException;
import java.security.spec.AlgorithmParameterSpec;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Enumeration;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.security.auth.x500.X500Principal;

interface StorageOp {
  void run() throws KeyStoreException, GeneralSecurityException, IOException;
}

@CapacitorPlugin(name = "SecureStorage")
public class SecureStorage extends Plugin {

  // KeyStore-related stuff
  private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
  private static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding";
  private static final String SHARED_PREFERENCES = "WSSecureStorageSharedPreferences";
  private static final Character DATA_IV_SEPARATOR = '\u0010';
  private static final int BASE64_FLAGS = Base64.NO_PADDING + Base64.NO_WRAP;

  private KeyStore keyStore;

  @PluginMethod
  public void internalSetItem(final PluginCall call) {
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
          storeDataInKeyStore(key, data);
          call.resolve();
        }
    );
  }

  @PluginMethod
  public void internalGetItem(final PluginCall call) {
    String key = getKeyParam(call);

    if (key == null) {
      return;
    }

    tryStorageOp(
        call,
        () -> {
          String data = getDataFromKeyStore(key);
          JSObject result = new JSObject();
          result.put("data", data != null ? data : JSObject.NULL);
          call.resolve(result);
        }
    );
  }

  @PluginMethod
  public void internalRemoveItem(final PluginCall call) {
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

  @PluginMethod
  public void clearItemsWithPrefix(final PluginCall call) {
    tryStorageOp(
        call,
        () -> {
          String prefix = call.getString("_prefix", "");
          clearKeyStore(prefix);
          call.resolve();
        }
    );
  }

  @PluginMethod
  public void getPrefixedKeys(final PluginCall call) {
    tryStorageOp(
        call,
        () -> {
          String prefix = call.getString("prefix", "");
          ArrayList<String> keys = getKeysWithPrefix(prefix);
          JSONArray array = new JSONArray(keys);

          JSObject result = new JSObject();
          result.put("keys", array);
          call.resolve(result);
        }
    );
  }

  private SharedPreferences getPrefs() {
    return getContext().getSharedPreferences(SHARED_PREFERENCES, Context.MODE_PRIVATE);
  }

  private void storeDataInKeyStore(String prefixedKey, String data) throws GeneralSecurityException, IOException {
    // When we get here, we know that the values are not null
    getPrefs().edit().putString(prefixedKey, encryptString(data, prefixedKey)).apply();
  }

  private String getDataFromKeyStore(String prefixedKey) throws KeyStoreException, GeneralSecurityException, IOException {
    SharedPreferences sharedPreferences = getPrefs();
    String data;

    try {
      data = sharedPreferences.getString(prefixedKey, null);
    } catch (ClassCastException e) {
      throw new KeyStoreException(KeyStoreException.ErrorKind.invalidData);
    }

    if (data != null) {
      return decryptString(data, prefixedKey);
    } else {
      return null;
    }
  }

  private boolean removeDataFromKeyStore(String prefixedKey) throws GeneralSecurityException, IOException {
    KeyStore keyStore = getKeyStore();
    return removeAlias(keyStore, prefixedKey);
  }

  private boolean removeAlias(KeyStore keyStore, String alias) throws java.security.KeyStoreException {
    if (keyStore.containsAlias(alias)) {
      keyStore.deleteEntry(alias);
      getPrefs().edit().remove(alias).apply();
      return true;
    }

    return false;
  }

  private ArrayList<String> getKeysWithPrefix(String prefix) throws GeneralSecurityException, IOException {
    ArrayList<String> keys = new ArrayList<>();
    KeyStore keyStore = getKeyStore();

    for (Enumeration<String> aliases = keyStore.aliases(); aliases.hasMoreElements(); ) {
      String alias = aliases.nextElement();

      if (alias.startsWith(prefix)) {
        keys.add(alias);
      }
    }

    return keys;
  }

  private void clearKeyStore(String prefix) throws GeneralSecurityException, IOException {
    ArrayList<String> keys = getKeysWithPrefix(prefix);
    KeyStore keyStore = getKeyStore();

    for (String key : keys) {
      removeAlias(keyStore, key);
    }
  }

  private void tryStorageOp(PluginCall call, StorageOp op) {
    KeyStoreException exception;

    try {
      op.run();
      return;
    } catch (KeyStoreException e) {
      exception = e;
    } catch (GeneralSecurityException | IOException e) {
      exception = new KeyStoreException(KeyStoreException.ErrorKind.osError, e);
    } catch (Exception e) {
      exception = new KeyStoreException(KeyStoreException.ErrorKind.unknownError);
    }

    exception.rejectCall(call);
  }

  private String getKeyParam(PluginCall call) {
    String key = call.getString("prefixedKey");

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

  private String decryptString(String ciphertext, String prefixedKey) throws GeneralSecurityException, IOException, KeyStoreException {
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

    KeyStore keyStore = getKeyStore();
    KeyStore.SecretKeyEntry secretKeyEntry = (KeyStore.SecretKeyEntry) keyStore.getEntry(prefixedKey, null);

    // Make sure there is an entry in the KeyStore for the given domain
    if (secretKeyEntry == null) {
      throw new KeyStoreException(KeyStoreException.ErrorKind.notFound, prefixedKey);
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
    KeyStore.SecretKeyEntry entry = null;

    try {
      entry = (KeyStore.SecretKeyEntry) keyStore.getEntry(prefixedKey, null);
    } catch (UnrecoverableKeyException e) {
      // We haven't yet generated a secret key for prefixedKey, generate one
    }

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
