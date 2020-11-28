#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(WSSecureStorage, "WSSecureStorage",
  CAP_PLUGIN_METHOD(setItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(getItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(removeItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(clearItemsWithPrefix, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(getPrefixedKeys, CAPPluginReturnPromise);
)
