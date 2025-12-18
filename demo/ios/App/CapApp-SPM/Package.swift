// swift-tools-version: 5.9
import PackageDescription

// DO NOT MODIFY THIS FILE - managed by Capacitor CLI commands
let package = Package(
    name: "CapApp-SPM",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapApp-SPM",
            targets: ["CapApp-SPM"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", exact: "7.4.3"),
        .package(name: "AparajitaCapacitorSecureStorage", path: "../../../.."),
        .package(name: "CapacitorApp", path: "../../../../node_modules/.pnpm/@capacitor+app@7.1.0_@capacitor+core@7.4.3/node_modules/@capacitor/app"),
        .package(name: "CapacitorHaptics", path: "../../../../node_modules/.pnpm/@capacitor+haptics@7.0.2_@capacitor+core@7.4.3/node_modules/@capacitor/haptics"),
        .package(name: "CapacitorKeyboard", path: "../../../../node_modules/.pnpm/@capacitor+keyboard@7.0.3_@capacitor+core@7.4.3/node_modules/@capacitor/keyboard"),
        .package(name: "CapacitorSplashScreen", path: "../../../../node_modules/.pnpm/@capacitor+splash-screen@7.0.3_@capacitor+core@7.4.3/node_modules/@capacitor/splash-screen")
    ],
    targets: [
        .target(
            name: "CapApp-SPM",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm"),
                .product(name: "AparajitaCapacitorSecureStorage", package: "AparajitaCapacitorSecureStorage"),
                .product(name: "CapacitorApp", package: "CapacitorApp"),
                .product(name: "CapacitorHaptics", package: "CapacitorHaptics"),
                .product(name: "CapacitorKeyboard", package: "CapacitorKeyboard"),
                .product(name: "CapacitorSplashScreen", package: "CapacitorSplashScreen")
            ]
        )
    ]
)
