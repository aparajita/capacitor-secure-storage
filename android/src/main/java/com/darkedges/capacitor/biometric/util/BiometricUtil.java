package com.darkedges.capacitor.biometric.util;

public class BiometricUtil implements IBiometricUtil {

  private static final BiometricUtil ourInstance = new BiometricUtil();

  private BiometricUtil() {}

  public static BiometricUtil getInstance() {
    return ourInstance;
  }
}
