# CLAUDE.md

## Development Commands

- `pnpm build` - Clean build with linting, type checking, and compilation
- `pnpm build.dev` - Build with source maps for debugging
- `pnpm watch` - Auto-rebuild on file changes
- `pnpm lint` - Run ESLint, Prettier, and TypeScript compiler checks
- `pnpm clean` - Remove dist directory

## Tooling Preferences

- Use Serena's semantic tools for code exploration and symbol lookups:
    - `jet_brains_find_symbol` - Find symbol definitions
    - `jet_brains_find_referencing_symbols` - Find references
    - `jet_brains_get_symbols_overview` - Get symbol overviews
- Do not use TypeScript LSP for symbol lookups

## Demo Commands

Two demo variants share web source from `demo-shared/` via symlinks: `demo-pods` (CocoaPods) and `demo-spm` (SPM). Commands follow the pattern `pnpm demo.{pods|spm}.{browser|build|ios|ios.dev|android|android.dev|open.ios|open.android}`.

- `pnpm sync-demos` - Sync native files between demo variants

## Linting and Code Quality

- Strict TypeScript: explicit return types required, `any` discouraged
- Limits: 70 line functions, 270 line files, 4 params, 4 nesting levels

## Code Style

- Single quotes, no semicolons, trailing commas, 2-space indent, 80 char width
- `for...of` over `.forEach()`, prefer default exports, `node:` protocol for Node imports

## Verification

- `pnpm verify` - Run all (iOS CocoaPods + SPM + Android)
- `pnpm verify.ios` / `pnpm verify.pods.ios` / `pnpm verify.spm.ios` / `pnpm verify.android`

## Architecture

Capacitor 7+ plugin providing secure storage: iOS keychain, Android KeyStore, web localStorage. Supports iCloud sync (iOS), multiple data types, and configurable key prefixes.

- **TypeScript**: `src/` — `index.ts` (exports), `definitions.ts` (API types), `native.ts` (native proxy), `web.ts` (web impl), `base.ts` (shared)
- **iOS**: `ios/Sources/SecureStoragePlugin/Plugin.swift` — SPM (`Package.swift` at root) or CocoaPods (`.podspec`)
- **Android**: `android/src/main/java/com/aparajita/capacitor/securestorage/SecureStorage.java`
- **Build output**: `dist/esm/` (also bundled to CJS/UMD via Rollup)

## Git Workflow

Git Flow: `main` is release-only, `develop` is the primary development branch. Feature branches from `develop`, merge back to `develop`, then `develop` to `main` for release.

- Never commit directly to `main`
- `pnpm release` handles versioning, tagging, and publishing (from `main`)
