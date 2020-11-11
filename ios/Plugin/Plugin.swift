import Foundation
import Capacitor


@objc(WSSecureStorage)
public class WSSecureStorage: CAPPlugin {
  private static let keyOption = "key"
  private static let dataOption = "data"
  let keychain = KeychainSwift()

  override public func load() {
    keychain.keyPrefix = "secure-storage_"
  }

  @objc func setKeyPrefix(_ call: CAPPluginCall) {
    keychain.keyPrefix = call.getString("prefix") ?? ""
  }

  @objc func getKeyPrefix(_ call: CAPPluginCall) {
    call.resolve(["prefix": keychain.keyPrefix])
  }

  @objc func setItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call),
          let data = getDataParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      try storeDataInKeychain(data, forKey: key)
      call.resolve()
    })
  }

  @objc func getItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      let data = try getDataFromKeychain(key)
      call.resolve(["data": data])
    })
  }

  @objc func removeItem(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      let success = try deleteDataFromKeychain(key)
      call.resolve(["success": success])
    })
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

  func storeDataInKeychain(_ data: String, forKey key: String) throws {
    let success = keychain.set(data, forKey: key)

    if !success {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }
  }

  func getDataFromKeychain(_ key: String) throws -> String {
    if let data = keychain.get(key) {
      return data
    }

    throw KeychainError(.notFound, key: key)
  }

  func deleteDataFromKeychain(_ key: String) throws -> Bool {
    let success = keychain.delete(key)

    if !success && keychain.lastResultCode != 0 && keychain.lastResultCode != errSecItemNotFound {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }

    return success
  }
}
