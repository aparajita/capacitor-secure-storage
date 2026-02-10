<div class="markdown-body">

# Plan: Shared Demo Structure + CocoaPods Backward Compatibility

## Status Dashboard

| Phase | Description                                                                        | Status      | Sub-plan |
| ----- | ---------------------------------------------------------------------------------- | ----------- | -------- |
| 1     | [Create demo-shared from demo](#1--create-demo-shared-from-current-demo)           | ✅ Complete | —        |
| 2     | [Rename demo to demo-spm and slim down](#2--rename-demo-to-demo-spm-and-slim-down) | ✅ Complete | —        |
| 3     | [Create demo-pods CocoaPods variant](#3--create-demo-pods-new-cocoapods-variant)   | ✅ Complete | —        |
| 4     | [Create sync-demos.sh script](#4--create-scriptssync-demossh)                      | ✅ Complete | —        |
| 5     | [Create verify-build.sh script](#5--create-scriptsverify-buildsh)                  | ✅ Complete | —        |
| 6     | [Update pnpm-workspace.yaml](#6--update-root-pnpm-workspaceyaml)                   | ✅ Complete | —        |
| 7     | [Update root package.json](#7--update-root-packagejson)                            | ✅ Complete | —        |
| 8     | [Update .gitignore](#8--update-gitignore)                                          | ✅ Complete | —        |
| 9     | [Update CLAUDE.md](#9--update-claudemd)                                            | ✅ Complete | —        |

## Context

The capacitor-secure-storage plugin was upgraded to Capacitor 8 and SPM. This plan adds CocoaPods backward compatibility and restructures the demo app into the shared demo pattern from `@aparajita/capacitor-biometric-auth` -- with `demo-shared` (web source), `demo-pods` (CocoaPods iOS variant), and `demo-spm` (SPM iOS variant).

The current `demo/` uses SPM. We rename it to `demo-spm` (preserving its SPM iOS setup), extract the web source into `demo-shared`, and create `demo-pods` fresh with CocoaPods.

## Steps

### 1. ✅ Create `demo-shared/` from current `demo/`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Move these files from `demo/` to `demo-shared/`:

- `src/` (entire directory)
- `public/` (entire directory)
- `index.html`
- `postcss.config.mjs`
- `tailwind.config.mjs`
- `tsconfig.json` (adapt as base config, remove variant-specific paths/includes)
- `tsconfig.config.json`

Create new files in `demo-shared/`:

- **`package.json`**: name `demo-shared`, version `8.0.0`, dependencies = current demo's web deps (Vue, Ionic, @capacitor/core, @capacitor/app, @capacitor/haptics, @capacitor/keyboard, @capacitor/splash-screen, plugin workspace ref, ionicons, vue-router), devDependencies = build tooling (Vite, @vitejs/plugin-vue, tailwind, postcss, autoprefixer, typescript, @vue/compiler-sfc, @vue/tsconfig, @types/node, terser, @aparajita/tailwind-ionic). No `@capacitor/ios`, `@capacitor/android`, or `@ionic/cli`.
- **`capacitor.config.ts`**: Base config with empty `appId`/`appName`, `webDir: 'dist'`, same plugin config as current demo. Modeled on `../capacitor-biometric-auth/demo-shared/capacitor.config.ts`.
- **`vite.config.mjs`**: Current demo's vite config, adapted to set explicit `outDir` to `dist` within demo-shared. Modeled on `../capacitor-biometric-auth/demo-shared/vite.config.mjs`.

### 2. ✅ Rename `demo/` to `demo-spm/` and slim down

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Use `git mv demo demo-spm`.

**Remove from demo-spm** (now in demo-shared):

- `src/`, `public/`, `index.html`
- `postcss.config.mjs`, `tailwind.config.mjs`
- `tsconfig.json`, `tsconfig.config.json`

**Create symlinks in demo-spm:**

- `src -> ../demo-shared/src`
- `index.html -> ../demo-shared/index.html`
- `public -> ../demo-shared/public`

**Create config re-exports in demo-spm:**

- `postcss.config.mjs`: `export { default } from 'demo-shared/postcss.config.mjs'`
- `tailwind.config.mjs`: `export { default } from 'demo-shared/tailwind.config.mjs'`
- `tsconfig.json`: Extends `../demo-shared/tsconfig.json`, adds `@/*` path alias
- `tsconfig.config.json`: Extends `../demo-shared/tsconfig.config.json`

**Update demo-spm files:**

- **`package.json`**: name `demo-spm`, add `"demo-shared": "workspace:*"` dep, keep `@capacitor/ios` and plugin workspace ref. Remove web-only deps that moved to demo-shared. Remove `@capacitor/android` (following biometric-auth pattern). Add `@ionic/cli` as devDep.
- **`capacitor.config.ts`**: Rewrite to import base from `demo-shared/capacitor.config`, spread, set `appId: 'com.aparajita.capacitor.securestoragedemo'`, `appName: 'Storage'`, `webDir: '../demo-shared/dist'`.
- **`vite.config.mjs`**: Rewrite to import shared config, merge with `BUILD_VARIANT: 'SPM'` and root set to demo-shared dir.
- **`ionic.config.json`**: Keep as-is.

**iOS stays as-is** -- already has CapApp-SPM setup.

**Remove leftover CocoaPods artifacts from demo-spm:**

- `ios/App/Pods/` directory (if committed)

### 3. ✅ Create `demo-pods/` (new CocoaPods variant)

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

**Copy native platform dirs from demo-spm:**

- `ios/` (then convert to CocoaPods)
- `android/` (as-is)

**Create files in demo-pods (same pattern as demo-spm):**

- Symlinks: `src`, `index.html`, `public` -> demo-shared
- Config re-exports: `postcss.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`, `tsconfig.config.json`
- **`package.json`**: name `demo-pods`, deps include `@capacitor/ios`, `@capacitor/android`, plugin workspace ref, `demo-shared` workspace ref. Same scripts as demo-spm.
- **`capacitor.config.ts`**: Same as demo-spm (same appId/appName/webDir).
- **`vite.config.mjs`**: Same as demo-spm but `BUILD_VARIANT: 'CocoaPods'`.
- **`ionic.config.json`**: Same as demo-spm.

**Set up CocoaPods for demo-pods iOS:**

- Remove `ios/App/CapApp-SPM/` directory
- Create `demo-pods/ios/App/Podfile` modeled on `../capacitor-biometric-auth/demo-pods/ios/App/Podfile`:
  - `require_relative` to Capacitor pods_helpers (via node_modules/.pnpm path)
  - `platform :ios, '15.0'`, `use_frameworks!`
  - Pods: Capacitor, CapacitorCordova, AparajitaCapacitorSecureStorage (`../../..`), CapacitorApp, CapacitorHaptics, CapacitorKeyboard, CapacitorSplashScreen
- Run `pod install` in `demo-pods/ios/App/` to generate workspace

### 4. ✅ Create `scripts/sync-demos.sh`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Copy from `../capacitor-biometric-auth/scripts/sync-demos.sh`. No adaptation needed -- it's already generic with configurable VARIANTS, VARIANT_PLATFORMS, and SYNC_PATHS arrays.

### 5. ✅ Create `scripts/verify-build.sh`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Copy from `../capacitor-biometric-auth/scripts/verify-build.sh`. It's entirely generic.

### 6. ✅ Update root `pnpm-workspace.yaml`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

```yaml
packages:
  - demo-pods
  - demo-shared
  - demo-spm
```

### 7. ✅ Update root `package.json`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

**Scripts:** Replace current `demo.*` scripts:

```
demo.pods.browser  -> pnpm --filter demo-pods dev
demo.pods.build    -> pnpm --filter demo-pods build
demo.pods.ios      -> pnpm --filter demo-pods ios
demo.pods.ios.dev  -> pnpm --filter demo-pods ios.dev
demo.pods.open.ios -> pnpm --filter demo-pods open.ios
demo.pods.android      -> pnpm --filter demo-pods android
demo.pods.android.dev  -> pnpm --filter demo-pods android.dev
demo.pods.open.android -> pnpm --filter demo-pods open.android
demo.spm.browser   -> pnpm --filter demo-spm dev
demo.spm.build     -> pnpm --filter demo-spm build
demo.spm.ios       -> pnpm --filter demo-spm ios
demo.spm.ios.dev   -> pnpm --filter demo-spm ios.dev
demo.spm.open.ios  -> pnpm --filter demo-spm open.ios
demo.spm.android       -> pnpm --filter demo-spm android
demo.spm.android.dev   -> pnpm --filter demo-spm android.dev
demo.spm.open.android  -> pnpm --filter demo-spm open.android
sync-demos -> ./scripts/sync-demos.sh
```

**Update `verify.ios`:** Split into `verify.pods.ios` and `verify.spm.ios`:

```
verify.pods.ios: ./scripts/verify-build.sh iOS-CocoaPods bash -c 'cd ios && pod install && cd .. && xcodebuild -quiet -workspace ios/Plugin.xcworkspace -scheme Plugin -destination generic/platform=iOS build'
verify.spm.ios: ./scripts/verify-build.sh iOS-SPM bash -c 'cd demo-spm/ios/App && xcodebuild -quiet -scheme App -destination generic/platform=iOS build'
verify.ios: pnpm verify.pods.ios && pnpm verify.spm.ios
```

**Update `lint.swift`:** Update paths:

```
swiftly --fix ios/Sources/**/*.swift && swiftly --fix demo-pods/ios/App/App/**/*.swift && swiftly --fix demo-spm/ios/App/App/**/*.swift
```

**Update `commit-and-tag-version.bumpFiles`:** Replace `demo/package.json` with `demo-pods/package.json` and add `demo-spm/package.json`.

### 8. ✅ Update `.gitignore`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Root `.gitignore` uses glob patterns for demo artifacts:

```
# Demo build artifacts
demo*/dist/
demo*/node_modules/
demo*/.eslintcache
```

Note: `android/build/` and `ios/App/Pods/` are handled by subdirectory `.gitignore` files in `demo-pods/android/.gitignore`, `demo-pods/ios/.gitignore`, `demo-spm/android/.gitignore`, and `demo-spm/ios/.gitignore`.

### 9. ✅ Update `CLAUDE.md`

**Status:** Complete <br>
**BlockedBy:** — <br>
**Testing:** TBD <br>

Updated demo commands section to document both CocoaPods and SPM demo variants, updated verification commands to reflect both iOS verification methods, and added Demo Structure section to explain the shared source pattern with demo-shared, demo-pods, and demo-spm.

## Critical files (reference templates from biometric-auth)

| biometric-auth file                         | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `demo-shared/package.json`                  | Package structure for shared web app    |
| `demo-shared/capacitor.config.ts`           | Base capacitor config pattern           |
| `demo-shared/vite.config.mjs`               | Shared vite config with explicit outDir |
| `demo-pods/package.json`                    | Package structure for CocoaPods variant |
| `demo-pods/capacitor.config.ts`             | Config import + override pattern        |
| `demo-pods/vite.config.mjs`                 | Config merge + BUILD_VARIANT pattern    |
| `demo-pods/ios/App/Podfile`                 | CocoaPods dependency declaration        |
| `demo-spm/package.json`                     | Package structure for SPM variant       |
| `demo-spm/ios/App/CapApp-SPM/Package.swift` | SPM dependency declaration              |
| `scripts/sync-demos.sh`                     | Native file sync script                 |
| `scripts/verify-build.sh`                   | Build verification wrapper              |

## Verification

1. `pnpm install` -- workspace resolution works for all 3 demo packages
2. `pnpm demo.pods.build` -- web build works through demo-pods -> demo-shared
3. `pnpm demo.spm.build` -- web build works through demo-spm -> demo-shared
4. `pnpm verify.pods.ios` -- CocoaPods iOS build (pod install + xcodebuild)
5. `pnpm verify.spm.ios` -- SPM iOS build
6. `pnpm verify.android` -- Android build
7. `pnpm lint` -- linting passes with updated paths
8. `./scripts/sync-demos.sh --dry-run` -- sync script detects correct files

</div>
