package com.aparajita.capacitor.securestorage.utils;

import com.aparajita.capacitor.securestorage.exceptions.SSSecurityError;

public class SSResult<T> {

    private SSSecurityError mError = null;
    private T mResult = null;

    public SSResult(SSSecurityError mError) {
        this.mError = mError;
    }

    public SSResult(T result) {
        mResult = result;
    }

    public SSSecurityError getError() {
        return mError;
    }

    public T getResult() {
        return mResult;
    }
}
