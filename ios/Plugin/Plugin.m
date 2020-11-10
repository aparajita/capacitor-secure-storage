#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(WSSecureStorage, "WSSecureStorage",
  CAP_PLUGIN_METHOD(setKeyPrefix, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(store, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(retrieve, CAPPluginReturnPromise);
  CAP_PLUGIN_METHOD(clear, CAPPluginReturnPromise);
)
