package com.aparajita.capacitor.securestorage.utils;

import android.content.Context;
import androidx.core.hardware.fingerprint.FingerprintManagerCompat;
import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;
import com.aparajita.capacitor.securestorage.utils.factory.SSSecurityUtilsFactory;

public class SSSecurityHelper implements ISSSecurityHelper {

  private static final SSSecurityHelper ourInstance;

  static {
    try {
      ourInstance = new SSSecurityHelper();
    } catch (SSSecurityException e) {
      throw new RuntimeException(e);
    }
  }

  public static SSSecurityHelper getInstance() {
    return ourInstance;
  }

  private final ISSSecurityUtils pfSecurityUtils =
    SSSecurityUtilsFactory.getPFSecurityUtilsInstance();

  private SSSecurityHelper() throws SSSecurityException {}

  private boolean isFingerPrintAvailable(Context context) {
    return FingerprintManagerCompat.from(context).isHardwareDetected();
  }

  private boolean isFingerPrintReady(Context context) {
    return FingerprintManagerCompat.from(context).hasEnrolledFingerprints();
  }

  /**
   * Encode
   * @param context any context.
   * @param prefix prefix to use.
   * @param value to encode.
   * @return encoded string.
   * @throws SSSecurityException  throw exception if something went wrong.
   */
  @Override
  public String encode(Context context, String prefix, String value)
    throws SSSecurityException {
    return pfSecurityUtils.encode(context, prefix, value, false);
  }

  /**
   * Decode
   * @param context any context.
   * @param prefix prefix to use.
   * @param value to decode.
   * @return decoded string
   * @throws SSSecurityException  throw exception if something went wrong.
   */
  @Override
  public String decode(Context context, String prefix, String value)
    throws SSSecurityException {
    return pfSecurityUtils.decode(prefix, value);
  }

  /**
   * Delete prefix encryption key.
   * @param prefix prefix to delete.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public void deletePrefixEncryptionKey(String prefix)
    throws SSSecurityException {
    pfSecurityUtils.deleteKey(prefix);
  }

  /**
   * Check if prefix encryption key is exist.
   * @param prefix prefix to check.
   * @return true if key exist in KeyStore.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public boolean isPrefixEncryptionKeyExist(String prefix)
    throws SSSecurityException {
    return pfSecurityUtils.isKeystoreContainAlias(prefix);
  }
}
