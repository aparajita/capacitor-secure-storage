//
//  KeychainError.swift
//  WsCapacitorBiometricAuth
//
//  Created by Aparajita on 11/5/20.
//

import Capacitor

public class KeychainError: Error {
  enum ErrorKind: String {
    case notFound
    case missingKey
    case invalidData
    case osError
    case unknownError
  }

  static let keychainErrorMap: [KeychainError.ErrorKind: String] = [
    .notFound: "Data for the key \"%@\" not found",
    .missingKey: "Empty key",
    .invalidData: "The data in the store is in an invalid format",
    .osError: "An OS error occurred (%d)",
    .unknownError: "An unknown error occurred"
  ]

  var message: String = ""
  var code: String = ""

  init(_ kind: ErrorKind) {
    _init(kind)
  }

  init(_ kind: ErrorKind, status: OSStatus) {
    _init(kind, param: "", status: status)
  }

  init(_ kind: ErrorKind, param: String) {
    _init(kind, param: param)
  }

  init(_ kind: ErrorKind, param: String, status: OSStatus) {
    _init(kind, param: param, status: status)
  }

  private func _init(_ kind: ErrorKind, param: String = "", status: OSStatus = 0) {
    if let message = KeychainError.keychainErrorMap[kind] {
      switch kind {
      case .osError:
        self.message = String(format: message, status)

      case .notFound:
        self.message = String(format: message, param)

      default:
        self.message = message
      }

      self.code = kind.rawValue
    }
  }

  public func rejectCall(_ call: CAPPluginCall) {
    call.reject(message, code)
  }

  static func reject(call: CAPPluginCall, kind: ErrorKind, param: String = "", status: OSStatus = 0) {
    let err = KeychainError(kind, param: param, status: status)
    err.rejectCall(call)
  }
}
