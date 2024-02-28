package com.aparajita.capacitor.securestorage;

import androidx.annotation.Nullable;
import com.getcapacitor.PluginCall;
import java.util.HashMap;

public class KeyStoreException extends Throwable {

  private static final HashMap<ErrorKind, String> errorMap;

  static {
    errorMap = new HashMap<>();
    errorMap.put(ErrorKind.missingKey, "Empty key or missing key param");
    errorMap.put(
      ErrorKind.invalidData,
      "The data in the store is in an invalid format"
    );
    errorMap.put(ErrorKind.osError, "An OS error occurred (%s)");
    errorMap.put(ErrorKind.unknownError, "An unknown error occurred: %s");
  }

  private String message = "";
  private String code = "";

  KeyStoreException(ErrorKind kind) {
    init(kind, null);
  }

  KeyStoreException(ErrorKind kind, Throwable osException) {
    init(kind, osException);
  }

  public static void reject(PluginCall call, ErrorKind kind) {
    reject(call, kind, null);
  }

  public static void reject(
    PluginCall call,
    ErrorKind kind,
    @Nullable Throwable osException
  ) {
    KeyStoreException ex = new KeyStoreException(kind, osException);
    call.reject(ex.message, ex.code);
  }

  void init(ErrorKind kind, @Nullable Throwable osException) {
    String message = errorMap.get(kind);

    if (message != null) {
      switch (kind) {
        case osError, unknownError -> {
          if (osException != null) {
            this.message = String.format(
              message,
              osException.getClass().getSimpleName()
            );
          }
        }
        default -> this.message = message;
      }

      this.code = kind.toString();
    }
  }

  public String getMessage() {
    return this.message;
  }

  public String getCode() {
    return this.code;
  }

  public void rejectCall(PluginCall call) {
    call.reject(this.message, this.code);
  }

  public enum ErrorKind {
    missingKey,
    invalidData,
    osError,
    unknownError,
  }
}
