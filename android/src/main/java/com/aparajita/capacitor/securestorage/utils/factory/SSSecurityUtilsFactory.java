package com.aparajita.capacitor.securestorage.utils.factory;

import com.aparajita.capacitor.securestorage.exceptions.SSSecurityException;
import com.aparajita.capacitor.securestorage.utils.ISSSecurityUtils;
import com.aparajita.capacitor.securestorage.utils.SSSecurityUtils;
import com.aparajita.capacitor.securestorage.utils.constants.SSSecurityUtilsErrorCodes;

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
