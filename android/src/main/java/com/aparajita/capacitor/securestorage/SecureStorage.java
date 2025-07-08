package com.aparajita.capacitor.securestorage;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import androidx.security.crypto.EncryptedSharedPreferences;
import androidx.security.crypto.MasterKeys;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.UnrecoverableKeyException;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

import org.json.JSONArray;

@CapacitorPlugin(name = "SecureStorage")
public class SecureStorage extends Plugin {

  private static final String SHARED_PREFERENCES = "WSSecureStorageSharedPreferences";
  private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
  private static final String CIPHER_TRANSFORMATION = "AES/GCM/NoPadding";
  private static final Character DATA_IV_SEPARATOR = '\u0010';
  private static final int BASE64_FLAGS = Base64.NO_PADDING + Base64.NO_WRAP;

  private SharedPreferences sharedPreferences = null;
  private KeyStore keyStore;
  private boolean migrationDone = false;

  @PluginMethod
  public void internalSetItem(final PluginCall call) {
    String key = call.getString("key");
    if (key == null) {
      call.reject("Key parameter is missing");
      return;
    }
    String data = call.getString("data");
    if (data == null) {
      call.reject("Data parameter is missing");
      return;
    }

    tryStorageOp(call, () -> {
      if (isAndroidMOrHigher()) {
        SharedPreferences.Editor editor = getPrefs().edit();
        editor.putString(key, data);
        editor.apply();
      } else {
        storeDataInKeyStore(key, data);
      }
      call.resolve();
    });
  }

  @PluginMethod
  public void internalGetItem(final PluginCall call) {
    String key = call.getString("key");
    if (key == null) {
      call.reject("Key parameter is missing");
      return;
    }

    tryStorageOp(call, () -> {
      String data;
      if (isAndroidMOrHigher()) {
        data = getPrefs().getString(key, null);
      } else {
        data = getDataFromKeyStore(key);
      }
      JSObject result = new JSObject();
      result.put("data", data != null ? data : JSObject.NULL);
      call.resolve(result);
    });
  }

  @PluginMethod
  public void internalRemoveItem(final PluginCall call) {
    String key = call.getString("key");
    if (key == null) {
      call.reject("Key parameter is missing");
      return;
    }

    tryStorageOp(call, () -> {
      if (isAndroidMOrHigher()) {
        SharedPreferences.Editor editor = getPrefs().edit();
        editor.remove(key);
        editor.apply();
      } else {
        removeDataFromKeyStore(key);
      }
      call.resolve();
    });
  }

  @PluginMethod
  public void clearItemsWithPrefix(final PluginCall call) {
    String prefix = call.getString("_prefix", "");
    tryStorageOp(call, () -> {
      if (isAndroidMOrHigher()) {
        Map < String, ? > allEntries = getPrefs().getAll();
        SharedPreferences.Editor editor = getPrefs().edit();
        for (Map.Entry < String, ? > entry : allEntries.entrySet()) {
          if (entry.getKey().startsWith(prefix)) {
            editor.remove(entry.getKey());
          }
        }
        editor.apply();
      } else {
        clearKeyStore(prefix);
      }
      call.resolve();
    });
  }

  @PluginMethod
  public void getPrefixedKeys(final PluginCall call) {
    String prefix = call.getString("prefix", "");
    tryStorageOp(call, () -> {
      ArrayList < String > filteredKeys = new ArrayList < > ();
      if (isAndroidMOrHigher()) {
        Map < String, ? > allEntries = getPrefs().getAll();
        for (Map.Entry < String, ? > entry : allEntries.entrySet()) {
          if (entry.getKey().startsWith(prefix)) {
            filteredKeys.add(entry.getKey());
          }
        }
      } else {
        filteredKeys = getKeysWithPrefix(prefix);
      }

      JSONArray resultArray = new JSONArray(filteredKeys);
      JSObject result = new JSObject();
      result.put("keys", resultArray);
      call.resolve(result);
    });
  }

  private SharedPreferences getPrefs() {
    if (sharedPreferences == null) {
      SharedPreferences oldPrefs = getContext().getSharedPreferences(SHARED_PREFERENCES, Context.MODE_PRIVATE);
      if (isAndroidMOrHigher && !migrationDone) {
        try {
          String masterKeyAlias = MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC);
          sharedPreferences = EncryptedSharedPreferences.create(
            SHARED_PREFERENCES,
            masterKeyAlias,
            getContext(),
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM);

          // Migrate data if needed
          if (needsMigration(oldPrefs)) {
            SharedPreferences.Editor editor = sharedPreferences.edit();
            Map < String, ? > entries = oldPrefs.getAll();
            for (Map.Entry < String, ? > entry : entries.entrySet()) {
              String key = entry.getKey();
              Object value = entry.getValue();
              if (value instanceof String) {
                String decryptedValue = decryptString((String) value, key);
                editor.putString(key, decryptedValue);
              }
            }
            editor.apply();
            oldPrefs.edit().clear().apply();
          }
          migrationDone = true;
        } catch (GeneralSecurityException | IOException e) {
          e.printStackTrace();
        }
      } else {
        sharedPreferences = oldPrefs;
      }
    }
    return sharedPreferences;
  }

  private boolean needsMigration(SharedPreferences prefs) {
    return prefs.getAll().size() > 0;
  }

  private KeyStore getKeyStore() throws GeneralSecurityException, IOException {
    if (keyStore == null) {
      keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
      keyStore.load(null);
    }
    return keyStore;
  }

  private void storeDataInKeyStore(String prefixedKey, String data) throws GeneralSecurityException, IOException {
    // When we get here, we know that the values are not null
    getPrefs()
      .edit()
      .putString(prefixedKey, encryptString(data, prefixedKey))
      .apply();
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

  private void removeDataFromKeyStore(String prefixedKey) throws GeneralSecurityException, IOException {
    KeyStore keyStore = getKeyStore();
    return removeAlias(keyStore, prefixedKey);
  }

  private void clearKeyStore(String prefix) throws GeneralSecurityException, IOException {
    ArrayList < String > keys = getKeysWithPrefix(prefix);
    KeyStore keyStore = getKeyStore();

    for (String key: keys) {
      removeAlias(keyStore, key);
    }
  }

  private ArrayList < String > getKeysWithPrefix(String prefix) throws GeneralSecurityException, IOException {
    ArrayList < String > keys = new ArrayList < > ();
    KeyStore keyStore = getKeyStore();

    for (
      Enumeration < String > aliases = keyStore.aliases(); aliases.hasMoreElements();
    ) {
      String alias = aliases.nextElement();

      if (alias.startsWith(prefix)) {
        keys.add(alias);
      }
    }

    return keys;
  }

  private boolean removeAlias(KeyStore keyStore, String alias)
    throws java.security.KeyStoreException {
    if (keyStore.containsAlias(alias)) {
      keyStore.deleteEntry(alias);
      getPrefs().edit().remove(alias).apply();
      return true;
    }

    return false;
  }

  private String encryptString(String str, String prefixedKey)
    throws GeneralSecurityException, IOException {
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

  private String decryptString(String ciphertext, String prefixedKey)
    throws GeneralSecurityException, IOException, KeyStoreException {
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
    KeyStore.SecretKeyEntry secretKeyEntry =
      (KeyStore.SecretKeyEntry) keyStore.getEntry(prefixedKey, null);

    // Make sure there is an entry in the KeyStore for the given domain
    if (secretKeyEntry == null) {
      return null;
    }

    SecretKey secretKey = secretKeyEntry.getSecretKey();
    Cipher cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
    GCMParameterSpec spec = new GCMParameterSpec(128, iv);
    cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

    byte[] decryptedData = cipher.doFinal(encryptedData);
    return new String(decryptedData, StandardCharsets.UTF_8);
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
      exception = new KeyStoreException(
        KeyStoreException.ErrorKind.unknownError,
        e
      );
    }
    exception.rejectCall(call);
  }

  // EncryptedSharedPreferences >= Android 6.0 Marshmallow
  private boolean isAndroidMOrHigher() {
    return Build.VERSION.SDK_INT >= Build.VERSION_CODES.M;
  }
}
