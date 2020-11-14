//
//  KeychainError.swift
//  WsCapacitorSecureStorage
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

  private static let errorMap: [KeychainError.ErrorKind: String] = [
    .notFound: "Item for the key \"%@\" not found",
    .missingKey: "Empty key",
    .invalidData: "The data is in an invalid format",
    .osError: "An OS error occurred (%d)",
    .unknownError: "An unknown error occurred"
  ]

  var message: String = ""
  var code: String = ""

  init(_ kind: ErrorKind) {
    _init(kind)
  }

  init(_ kind: ErrorKind, status: OSStatus) {
    _init(kind, key: "", status: status)
  }

  init(_ kind: ErrorKind, key: String) {
    _init(kind, key: key)
  }

  init(_ kind: ErrorKind, key: String, status: OSStatus) {
    _init(kind, key: key, status: status)
  }

  private func _init(_ kind: ErrorKind, key: String = "", status: OSStatus = 0) {
    if let message = KeychainError.errorMap[kind] {
      switch kind {
      case .osError:
        self.message = String(format: message, status)

      case .notFound:
        self.message = String(format: message, key)

      default:
        self.message = message
      }

      self.code = kind.rawValue
    }
  }

  public func rejectCall(_ call: CAPPluginCall) {
    call.reject(message, code)
  }

  static func reject(call: CAPPluginCall, kind: ErrorKind, key: String = "", status: OSStatus = 0) {
    let err = KeychainError(kind, key: key, status: status)
    err.rejectCall(call)
  }
}
