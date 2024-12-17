package com.aparajita.capacitor.securestorage.exceptions;

public class SSSecurityError {

  private final String mMessage;
  private final Integer mCode;

  /**
   * Constructor.
   * @param message exception message.
   * @param code error code.
   */
  SSSecurityError(String message, Integer code) {
    mMessage = message;
    mCode = code;
  }

  /**
   * Get error message.
   * @return error message.
   */
  public String getMessage() {
    return mMessage;
  }

  /**
   * Get error code.
   * @return error code.
   */
  public Integer getCode() {
    return mCode;
  }
}
