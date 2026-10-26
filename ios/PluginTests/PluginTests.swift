import Testing
@testable import Plugin

struct PluginTests {
  @Test func prefixValidationPreservesNonblankWhitespace() {
    #expect(SecureStorage.validatedPrefix(" prefix ") == " prefix ")
    #expect(SecureStorage.validatedPrefix(" \t\n") == nil)
  }
}
