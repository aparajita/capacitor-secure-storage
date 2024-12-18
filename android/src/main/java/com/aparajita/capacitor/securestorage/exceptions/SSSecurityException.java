package com.aparajita.capacitor.securestorage.exceptions;

public class SSSecurityException extends Throwable {

  private final Integer mCode;

  /**
   * Constructor.
   *
   * @param message exception message.
   * @param code    error code.
   */
  public SSSecurityException(String message, Integer code) {
    super(message);
    mCode = code;
  }

  /**
   * Get error code.
   *
   * @return error code.
   */
  public Integer getCode() {
    return mCode;
  }

  /**
   * Get PFSecurityError object.
   *
   * @return PFSecurityError from PFSecurityException message and error code.
   */
  public SSSecurityError getError() {
    return new SSSecurityError(getMessage(), getCode());
  }
}
