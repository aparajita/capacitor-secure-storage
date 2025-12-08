// swift-tools-version: 5.9

import PackageDescription

let package = Package(
    name: "AparajitaCapacitorSecureStorage",
    platforms: [
        .iOS(.v14),
    ],
    products: [
        .library(
            name: "AparajitaCapacitorSecureStorage",
            targets: ["AparajitaCapacitorSecureStorage"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0"),
        .package(name: "KeychainSwift", url: "https://github.com/evgenyneu/keychain-swift.git", from: "24.0.0")
    ],
    targets: [
        .target(
            name: "AparajitaCapacitorSecureStorage",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "KeychainSwift", package: "KeychainSwift")
            ],
            path: "ios/Plugin"),
    ]
)
