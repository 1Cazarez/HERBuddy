// swift-tools-version: 6.1
import PackageDescription

let package = Package(
    name: "HERBuddy",
    platforms: [
        .iOS(.v16),
        .macOS(.v13)
    ],
    products: [
        .executable(name: "HERBuddy", targets: ["HERBuddy"])
    ],
    targets: [
        .executableTarget(
            name: "HERBuddy"
        )
    ]
)
