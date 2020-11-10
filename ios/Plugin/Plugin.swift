import Foundation
import Capacitor

private let kKeyParam = "key"
private let kDataParam = "data"

@objc(WSSecureStorage)
public class WSSecureStorage: CAPPlugin {
  let keychain = KeychainSwift()

  @objc func setKeyPrefix(_ call: CAPPluginCall) {
    keychain.keyPrefix = call.getString("prefix") ?? ""
  }

  @objc func store(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call),
          let data = getDataParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      try storeDataInKeychain(data, forKey: key)
      call.resolve()
    })
  }

  @objc func retrieve(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      KeychainError.reject(call: call, kind: .missingKey)
      return
    }

    tryKeychainOp(call, {
      let data = try getDataFromKeychain(key)
      call.resolve(["data": data])
    })
  }

  @objc func clear(_ call: CAPPluginCall) {
    guard let key = getKeyParam(from: call) else {
      return
    }

    tryKeychainOp(call, {
      let success = try deleteDataFromKeychain(key)
      call.resolve(["success": success])
    })
  }

  func getKeyParam(from call: CAPPluginCall) -> String? {
    if let key = call.getString(kKeyParam),
       !key.isEmpty {
      return key
    } else {
      KeychainError.reject(call: call, kind: .missingKey)
      return nil
    }
  }

  func getDataParam(from call: CAPPluginCall) -> String? {
    if let value = call.getString(kDataParam) {
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

    throw KeychainError(.notFound, param: key)
  }

  func deleteDataFromKeychain(_ key: String) throws -> Bool {
    let success = keychain.delete(key)

    if keychain.lastResultCode != 0 && keychain.lastResultCode != errSecItemNotFound {
      throw KeychainError(.osError, status: keychain.lastResultCode)
    }

    return success
  }

  func checkStatus(_ status: OSStatus, _ domain: String) throws {
    guard status != errSecItemNotFound else {
      throw KeychainError(.notFound, param: domain)
    }

    guard status == errSecSuccess else {
      throw KeychainError(.osError, status: status)
    }
  }
}
