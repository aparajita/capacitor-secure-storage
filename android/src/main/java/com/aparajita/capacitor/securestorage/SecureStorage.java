package com.aparajita.capacitor.securestorage;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

import com.aparajita.capacitor.securestorage.exceptions.KeyStoreException;
import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;
import com.aparajita.capacitor.securestorage.utils.factory.SSSecurityUtilsFactory;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONArray;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;

interface StorageOp {
    void run() throws KeyStoreException, GeneralSecurityException, IOException;
}

@CapacitorPlugin(name = "SecureStorage")
public class SecureStorage extends Plugin {
    // KeyStore-related stuff
    private static final String SHARED_PREFERENCES = "WSSecureStorageSharedPreferences";

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

        tryStorageOp(call, () -> {
            storeDataInPreferences(key, data);
            call.resolve();
        });
    }

    @PluginMethod
    public void internalGetItem(final PluginCall call) {
        String key = getKeyParam(call);

        if (key == null) {
            return;
        }

        tryStorageOp(call, () -> {
            String data = getDataFromPreferences(key);
            JSObject result = new JSObject();
            result.put("data", data != null ? data : JSObject.NULL);
            call.resolve(result);
        });
    }

    @PluginMethod
    public void internalRemoveItem(final PluginCall call) {
        String key = getKeyParam(call);

        if (key == null) {
            return;
        }

        tryStorageOp(call, () -> {
            boolean success = removeDataFromPreferences(key);
            JSObject result = new JSObject();
            result.put("success", success);
            call.resolve(result);
        });
    }

    @PluginMethod
    public void clearItemsWithPrefix(final PluginCall call) {
        tryStorageOp(call, () -> {
            String prefix = call.getString("_prefix", "");
            clearKeyStore(prefix);
            call.resolve();
        });
    }

    @PluginMethod
    public void getPrefixedKeys(final PluginCall call) {
        tryStorageOp(call, () -> {
            String prefix = call.getString("prefix", "");
            ArrayList<String> keys = getKeys(prefix);
            JSONArray array = new JSONArray(keys);

            JSObject result = new JSObject();
            result.put("keys", array);
            call.resolve(result);
        });
    }

    private SharedPreferences getPrefs() {
        return getContext()
                .getSharedPreferences(SHARED_PREFERENCES, Context.MODE_PRIVATE);
    }

    private void storeDataInPreferences(String prefixedKey, String data)
            throws GeneralSecurityException, IOException {
        // When we get here, we know that the values are not null
        getPrefs()
                .edit()
                .putString(prefixedKey, encryptString(data, prefixedKey))
                .apply();
    }

    private String getDataFromPreferences(String prefixedKey) throws KeyStoreException, GeneralSecurityException, IOException {
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

    private boolean removeDataFromPreferences(String prefixedKey) throws GeneralSecurityException, IOException {
        try {
            SSSecurityUtilsFactory.getSSSecurityUtilsInstance().deleteKey(prefixedKey);
        } catch (SSSecurityException e) {
            throw new GeneralSecurityException(e);
        }
        getPrefs().edit().remove(prefixedKey).apply();
        return true;
    }

    private ArrayList<String> getKeys(String prefix) throws GeneralSecurityException, IOException {
        try {
            return SSSecurityUtilsFactory.getSSSecurityUtilsInstance().getKeys(prefix);
        } catch (SSSecurityException e) {
            throw new GeneralSecurityException(e);
        }
    }

    private void clearKeyStore(String prefix) throws GeneralSecurityException, IOException {
        ArrayList<String> keys = getKeys(prefix);
        Log.d("TAG", "prefix: " + prefix);

        for (String key : keys) {
            Log.d("TAG", "key:" + key);
            try {
                SSSecurityUtilsFactory.getSSSecurityUtilsInstance().deleteKey(key);
            } catch (SSSecurityException e) {
                throw new GeneralSecurityException(e);
            }
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
            exception = new KeyStoreException(
                    KeyStoreException.ErrorKind.unknownError,
                    e
            );
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

    private String encryptString(String str, String prefixedKey)
            throws GeneralSecurityException, IOException {
        try {
            return SSSecurityUtilsFactory.getSSSecurityUtilsInstance().encode(getContext(), prefixedKey, str, false);
        } catch (SSSecurityException e) {
            throw new GeneralSecurityException(e);
        }
    }

    private String decryptString(String ciphertext, String prefixedKey)
            throws GeneralSecurityException, IOException, KeyStoreException {
        try {
            return SSSecurityUtilsFactory.getSSSecurityUtilsInstance().decode(prefixedKey, ciphertext);
        } catch (SSSecurityException e) {
            throw new GeneralSecurityException(e);
        }
    }
}
