package com.darkedges.capacitor.securestorage.utils.factory;

import com.darkedges.capacitor.securestorage.exceptions.SSSecurityException;
import com.darkedges.capacitor.securestorage.utils.ISSSecurityUtils;
import com.darkedges.capacitor.securestorage.utils.SSSecurityUtils;
import com.darkedges.capacitor.securestorage.utils.constants.SSSecurityUtilsErrorCodes;

public class SSSecurityUtilsFactory {

  public static ISSSecurityUtils getSSSecurityUtilsInstance()
    throws SSSecurityException {
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      return SSSecurityUtils.getInstance();
    } else {
      throw new SSSecurityException(
        "Android Build Version not supported:" +
        android.os.Build.VERSION.SDK_INT,
        SSSecurityUtilsErrorCodes.ERROR_VERSION_NOT_SUPPORTED
      );
    }
  }
}
