package com.aparajita.capacitor.securestorage.utils;

import android.content.Context;
import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;

public interface ISSSecurityHelper {
  /**
   * Encode
   * @param context any context.
   * @param prefix prefix to use.
   * @param value to encode.
   * @return encoded string.
   * @throws SSSecurityException  throw exception if something went wrong.
   */
  String encode(Context context, String prefix, String value)
    throws SSSecurityException;

  /**
   * Decode
   * @param context any context.
   * @param prefix prefix to use.
   * @param value to decode.
   * @return decoded string
   * @throws SSSecurityException  throw exception if something went wrong.
   */
  String decode(Context context, String prefix, String value)
    throws SSSecurityException;

  /**
   * Delete prefix encryption key.
   * @param prefix prefix to delete.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  void deletePrefixEncryptionKey(String prefix) throws SSSecurityException;

  /**
   * Check if prefix encryption key is exist.
   * @param prefix prefix to check.
   * @return true if key exist in KeyStore.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  boolean isPrefixEncryptionKeyExist(String prefix) throws SSSecurityException;
}
