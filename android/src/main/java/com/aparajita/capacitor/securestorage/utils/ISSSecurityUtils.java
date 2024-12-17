package com.aparajita.capacitor.securestorage.utils;

import android.content.Context;
import androidx.annotation.NonNull;
import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;

public interface ISSSecurityUtils {
  String encode(
    @NonNull Context context,
    String alias,
    String input,
    boolean isAuthorizationRequared
  ) throws SSSecurityException;

  String decode(String alias, String encodedString) throws SSSecurityException;

  boolean isKeystoreContainAlias(String alias) throws SSSecurityException;

  void deleteKey(String alias) throws SSSecurityException;
}
