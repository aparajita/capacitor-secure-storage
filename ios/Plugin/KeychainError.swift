//
//  KeychainError.swift
//  @aparajita/capacitor-secure-storage
//

import Capacitor

public class KeychainError: Error {
  enum ErrorKind: String {
    case missingKey
    case invalidData
    case osError
    case unknownError
  }

  private static let errorMap: [KeychainError.ErrorKind: String] = [
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
    _init(kind, status: status)
  }

  private func _init(_ kind: ErrorKind, status: OSStatus = 0) {
    if let message = KeychainError.errorMap[kind] {
      switch kind {
      case .osError:
        self.message = String(format: message, status)

      default:
        self.message = message
      }

      self.code = kind.rawValue
    }
  }

  public func rejectCall(_ call: CAPPluginCall) {
    call.reject(message, code)
  }

  static func reject(call: CAPPluginCall, kind: ErrorKind, status: OSStatus = 0) {
    let err = KeychainError(kind, status: status)
    err.rejectCall(call)
  }
}
