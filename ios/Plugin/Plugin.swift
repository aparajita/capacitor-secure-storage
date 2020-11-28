import Foundation
import Capacitor

@objc(WSSecureStorage)
public class WSSecureStorage: CAPPlugin {
  private static let keyOption = "prefixedKey"
  private static let dataOption = "data"
  let keychain = KeychainSwift()

  @objc func setItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call),
          let data = getDataParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      try storeData(data, withKey: key)
      call.resolve()
    })
  }

  @objc func getItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      let data = try getData(withKey: key)
      call.resolve(["data": data])
    })
  }

  @objc func removeItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      let success = try deleteData(withKey: key)
      call.resolve(["success": success])
    })
  }

  @objc func clearItemsWithPrefix(_ call: CAPPluginCall) {
    tryKeychainOp(call, {
      let prefix = call.getString("_prefix") ?? ""
      try clearData(withPrefix: prefix)
      call.resolve()
    })
  }

  @objc func getPrefixedKeys(_ call: CAPPluginCall) {
    let prefix = call.getString("prefix") ?? ""
    call.resolve(["keys": keychain.allKeys.filter { $0.starts(with: prefix) }])
  }

  func getKeyParam(from call: CAPPluginCall) -> String? {
    if let key = call.getString(WSSecureStorage.keyOption),
       !key.isEmpty {
      return key
    }

    KeychainError.reject(call: call, kind: .missingKey)
    return nil
  }

  func getDataParam(from call: CAPPluginCall) -> String? {
    if let value = call.getString(WSSecureStorage.dataOption) {
      return value
    }

    KeychainError.reject(call: call, kind: .invalidData)
    return nil
  }

  func tryKeychainOp(_ call: CAPPluginCall, _ operation: () throws -> Void) {
    var err: KeychainError

    do {
      try operation()
      return
    } catch let error as KeychainError {
      err = error
    } catch {
      err = KeychainError(.unknownError)
    }

    err.rejectCall(call)
  }

  func storeData(_ data: String, withKey key: String) throws {
    let success = keychain.set(data, forKey: key)

    if !success {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }
  }

  func getData(withKey key: String) throws -> String {
    if let data = keychain.get(key) {
      return data
    }

    throw KeychainError(.notFound, key: key)
  }

  func deleteData(withKey key: String) throws -> Bool {
    let success = keychain.delete(key)

    if !success && keychain.lastResultCode != 0 && keychain.lastResultCode != errSecItemNotFound {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }

    return success
  }

  func clearData(withPrefix prefix: String) throws {
    for key in keychain.allKeys {
      if key.starts(with: prefix) {
        // delete() adds the prefix, but keychain.keyPrefix is empty,
        // so we don't need to remove the prefix.
        if !keychain.delete(key) {
          throw KeychainError(.osError, status: keychain.lastResultCode)
        }
      }
    }
  }
}
