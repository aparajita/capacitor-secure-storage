package com.darkedges.capacitor.biometric.util;

import com.darkedges.capacitor.securestorage.utils.SSSecurityUtils;

public class BiometricUtil implements IBiometricUtil {

  private static final BiometricUtil ourInstance = new BiometricUtil();

  public static BiometricUtil getInstance() {
    return ourInstance;
  }

  private BiometricUtil() {}
}
