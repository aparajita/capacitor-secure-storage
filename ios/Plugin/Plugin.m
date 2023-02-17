#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(SecureStorage, "SecureStorage",
  CAP_PLUGIN_METHOD(setSynchronizeKeychain, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(internalSetItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(internalGetItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(internalRemoveItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(clearItemsWithPrefix, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(getPrefixedKeys, CAPPluginReturnPromise);
)
