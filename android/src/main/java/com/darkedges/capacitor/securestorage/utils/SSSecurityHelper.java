package com.darkedges.capacitor.securestorage.utils;

import android.content.Context;
import androidx.core.hardware.fingerprint.FingerprintManagerCompat;
import com.darkedges.capacitor.securestorage.exceptions.SSSecurityException;
import com.darkedges.capacitor.securestorage.utils.factory.SSSecurityUtilsFactory;
import java.util.ArrayList;

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
    SSSecurityUtilsFactory.getSSSecurityUtilsInstance();

  private SSSecurityHelper() throws SSSecurityException {}

  private boolean isFingerPrintAvailable(Context context) {
    return FingerprintManagerCompat.from(context).isHardwareDetected();
  }

  private boolean isFingerPrintReady(Context context) {
    return FingerprintManagerCompat.from(context).hasEnrolledFingerprints();
  }

  /**
   * Encode
   *
   * @param context any context.
   * @param alias   alias to use.
   * @param value   to encode.
   * @return encoded string.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public String encode(Context context, String alias, String value)
    throws SSSecurityException {
    return pfSecurityUtils.encode(context, alias, value, false);
  }

  /**
   * Decode
   *
   * @param context any context.
   * @param alias   prefix to use.
   * @param value   to decode.
   * @return decoded string
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public String decode(Context context, String alias, String value)
    throws SSSecurityException {
    return pfSecurityUtils.decode(alias, value);
  }

  /**
   * Delete encryption key.
   *
   * @param alias prefix to delete.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public void deleteKey(String alias) throws SSSecurityException {
    pfSecurityUtils.deleteKey(alias);
  }

  /**
   * Check if prefix encryption key is exist.
   *
   * @param prefix prefix to check.
   *               >>>>>>> refs/remotes/origin/feature/biometric
   * @return true if key exist in KeyStore.
   * @throws SSSecurityException throw exception if something went wrong.
   */
  @Override
  public boolean containsKey(String alias) throws SSSecurityException {
    return pfSecurityUtils.containsKey(alias);
  }

  /**
   * @return list of aliases
   * @throws SSSecurityException
   */
  @Override
  public ArrayList<String> getKeys(String prefix) throws SSSecurityException {
    return pfSecurityUtils.getKeys(prefix);
  }
}
