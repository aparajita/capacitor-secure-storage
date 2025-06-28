# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Build**: `pnpm build` - Clean build with linting, type checking, and compilation
- **Development build**: `pnpm build.dev` - Build with source maps for debugging
- **Watch mode**: `pnpm watch` - Auto-rebuild on file changes
- **Lint**: `pnpm lint` - Run ESLint, Prettier, and TypeScript compiler checks
- **Clean**: `pnpm clean` - Remove dist directory

## Linting and Code Quality

- Dual linting setup with oxlint (fast) and eslint (comprehensive)
- Uses neostandard (StandardJS) style as base
- Enforces strict TypeScript rules including explicit function return types
- No `any` types discouraged but allowed when necessary
- Maximum function length: 70 lines, maximum file length: 270 lines
- Maximum function parameters: 4
- Maximum nesting depth: 4 levels

## Code Style Preferences

- Single quotes for strings
- No semicolons
- Trailing commas required
- 2-space indentation
- Line width: 80 characters
- Use `for (const item of array)` instead of `array.forEach()`
- Prefer default exports
- Use node: protocol for Node.js imports

## Testing & Verification

- **iOS verification**: `pnpm verify.ios` - Install pods and build iOS plugin
- **Android verification**: `pnpm verify.android` - Clean build and test Android plugin
- **Full verification**: `pnpm verify` - Run both iOS and Android verification

## Project Architecture

This is a Capacitor 6+ plugin that provides secure storage across iOS, Android, and web platforms:

### Core Structure

- **`src/index.ts`**: Main plugin registration and exports
- **`src/definitions.ts`**: TypeScript interfaces, types, and error definitions for the plugin API
- **`src/native.ts`**: Native platform implementation proxy
- **`src/web.ts`**: Web platform implementation (uses localStorage, unencrypted)
- **`src/base.ts`**: Shared base functionality

### Platform-Specific Code

- **iOS**: Swift implementation in `ios/Plugin/Plugin.swift` with keychain integration
- **Android**: Java implementation in `android/src/main/java/com/aparajita/capacitor/securestorage/SecureStorage.java` using Android KeyStore and SharedPreferences

### Key Features

- **Cross-platform secure storage**: iOS keychain, Android KeyStore, web localStorage
- **iCloud sync support**: iOS-specific feature for syncing data across devices
- **TypeScript-first**: Comprehensive type definitions in `definitions.ts`
- **Data type support**: Strings, numbers, booleans, objects, arrays, and Date objects
- **Configurable key prefixes**: Namespace storage keys to avoid conflicts

### Plugin Architecture

Uses Capacitor's plugin registration system with platform-specific implementations loaded dynamically. The plugin proxy handles routing calls to the appropriate platform implementation.

## Build System

- **TypeScript compilation**: Outputs to `dist/esm/`
- **Rollup bundling**: Creates multiple output formats (ESM, CJS, UMD)
- **Source maps**: Available in development builds via `SOURCE_MAP` env var
- **Linting**: ESLint with TypeScript, Prettier formatting, and strict TypeScript compilation

## Git Workflow

This project uses **Git Flow** branching strategy:

### Branch Structure
- **`main`**: Production-ready releases only. Always stable and deployable.
- **`develop`**: Primary development branch. All feature development happens here.
- **Feature branches**: Branch from `develop`, merge back to `develop` when complete.

### Development Workflow
1. **Feature development**: Create feature branches from `develop`
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```
2. **Complete features**: Merge back to `develop`
   ```bash
   git checkout develop
   git merge feature/your-feature-name
   git branch -d feature/your-feature-name
   ```
3. **Release preparation**: When ready for release, merge `develop` → `main`

### Branch Guidelines
- **Never commit directly to `main`** - it's release-only
- **All development happens on `develop`** or feature branches
- **Feature branches should be short-lived** and focused on single features
- **Clean up merged branches** to keep repository tidy

## Release Process

- **Version bumping**: Uses `commit-and-tag-version` package
- **Pre-release checks**: Ensures clean working directory and successful build
- **Automated release**: `pnpm release` handles versioning, tagging, and publishing
- **Release from `main`**: Only release from the `main` branch after merging from `develop`
