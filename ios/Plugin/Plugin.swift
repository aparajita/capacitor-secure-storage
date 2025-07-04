import Capacitor
import Foundation
import KeychainSwift

@objc(SecureStorage)
public class SecureStorage: CAPPlugin, CAPBridgedPlugin {
  public let identifier = "SecureStorage"
  public let jsName = "SecureStorage"
  public let pluginMethods: [CAPPluginMethod] = [
    .init(#selector(setSynchronizeKeychain)),
    .init(#selector(internalSetItem)),
    .init(#selector(internalGetItem)),
    .init(#selector(internalRemoveItem)),
    .init(#selector(clearItemsWithPrefix)),
    .init(#selector(getPrefixedKeys))
  ]

  let kKeyOption = "prefixedKey"
  let kDataOption = "data"
  let kSyncOption = "sync"
  let kAccessOption = "access"
  let keychain = KeychainSwift()

  @objc func setSynchronizeKeychain(_ call: CAPPluginCall) {
    keychain.synchronizable = getSyncParam(from: call)
    call.resolve()
  }

  @objc func internalSetItem(_ call: CAPPluginCall) {
    // The getters will reject the call if the param is missing.
    guard let key = getKeyParam(from: call),
          let data = getDataParam(from: call) else {
      return
    }

    let access = getAccessParam(from: call)

    tryKeychainOp(call, getSyncParam(from: call)) {
      try storeData(data, withKey: key, access: access)
      call.resolve()
    }
  }

  @objc func internalGetItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, getSyncParam(from: call)) {
      let data = getData(withKey: key)
      call.resolve(["data": data])
    }
  }

  @objc func internalRemoveItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, getSyncParam(from: call)) {
      let success = try deleteData(withKey: key)
      call.resolve(["success": success])
    }
  }

  @objc func clearItemsWithPrefix(_ call: CAPPluginCall) {
    tryKeychainOp(call, getSyncParam(from: call)) {
      let prefix = call.getString("prefix") ?? ""
      try clearData(withPrefix: prefix)
      call.resolve()
    }
  }

  @objc func getPrefixedKeys(_ call: CAPPluginCall) {
    tryKeychainOp(call, getSyncParam(from: call)) {
      let prefix = call.getString("prefix") ?? ""
      call.resolve(["keys": keychain.allKeys.filter { $0.starts(with: prefix) }])
    }
  }

  func getKeyParam(from call: CAPPluginCall) -> String? {
    if let key = call.getString(kKeyOption),
       !key.isEmpty {
      return key
    }

    KeychainError.reject(call: call, kind: .missingKey)
    return nil
  }

  func getDataParam(from call: CAPPluginCall) -> String? {
    if let value = call.getString(kDataOption) {
      return value
    }

    KeychainError.reject(call: call, kind: .invalidData)
    return nil
  }

  func getSyncParam(from call: CAPPluginCall) -> Bool {
    if let value = call.getBool(kSyncOption) {
      return value
    }

    return keychain.synchronizable
  }

  func getAccessParam(from call: CAPPluginCall) -> KeychainSwiftAccessOptions? {
    if let value = call.getInt(kAccessOption) {
      switch value {
      case 0:
        return KeychainSwiftAccessOptions.accessibleWhenUnlocked

      case 1:
        return KeychainSwiftAccessOptions.accessibleWhenUnlockedThisDeviceOnly

      case 2:
        return KeychainSwiftAccessOptions.accessibleAfterFirstUnlock

      case 3:
        return KeychainSwiftAccessOptions.accessibleAfterFirstUnlockThisDeviceOnly

      case 4:
        return KeychainSwiftAccessOptions.accessibleWhenPasscodeSetThisDeviceOnly

      default:
        return nil
      }
    }

    return nil
  }

  func tryKeychainOp(_ call: CAPPluginCall, _ sync: Bool, _ operation: () throws -> Void) {
    var err: KeychainError?

    let saveSync = keychain.synchronizable
    keychain.synchronizable = sync

    do {
      try operation()
    } catch let error as KeychainError {
      err = error
    } catch {
      err = KeychainError(.unknownError)
    }

    keychain.synchronizable = saveSync

    if let err = err {
      err.rejectCall(call)
    }
  }

  func storeData(_ data: String, withKey key: String, access: KeychainSwiftAccessOptions?) throws {
    let success = keychain.set(data, forKey: key, withAccess: access)

    if !success {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }
  }

  func getData(withKey key: String) -> Any {
    keychain.get(key) as Any
  }

  func deleteData(withKey key: String) throws -> Bool {
    let success = keychain.delete(key)

    if !success && keychain.lastResultCode != 0 && keychain.lastResultCode != errSecItemNotFound {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }

    return success
  }

  func clearData(withPrefix prefix: String) throws {
    for key in keychain.allKeys where key.starts(with: prefix) {
      // delete() adds the prefix, but keychain.keyPrefix is empty,
      // so we don't need to remove the prefix.
      if !keychain.delete(key) {
        throw KeychainError(.osError, status: keychain.lastResultCode)
      }
    }
  }
}
