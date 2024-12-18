package com.aparajita.capacitor.securestorage.utils;

import android.content.Context;
import androidx.annotation.NonNull;
import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;
import java.util.ArrayList;

public interface ISSSecurityUtils {
  String encode(
    @NonNull Context context,
    String alias,
    String input,
    boolean isAuthorizationRequired
  ) throws SSSecurityException;

  String decode(String alias, String encodedString) throws SSSecurityException;

  boolean containsKey(String alias) throws SSSecurityException;

  void deleteKey(String alias) throws SSSecurityException;

  ArrayList<String> getKeys(String prefix) throws SSSecurityException;
}
