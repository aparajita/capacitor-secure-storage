#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(WSSecureStorage, "WSSecureStorage",
  CAP_PLUGIN_METHOD(setKeyPrefix, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(getKeyPrefix, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(setItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(getItem, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(removeItem, CAPPluginReturnPromise);
)
