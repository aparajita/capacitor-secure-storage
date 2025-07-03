# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [7.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v6.0.1...v7.0.0) (2025-07-03)


### ⚠ BREAKING CHANGES

* This plugin now requires Capacitor 7+. Update your Capacitor dependencies to ^7.0.0 and follow the Capacitor 7 migration guide.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

### Features

* better release flow from git standpoint ([64ef611](https://github.com/aparajita/capacitor-secure-storage/commit/64ef611bc888e5f70ddf07fee796fde86a052eb7))
* build plugin before running non-dev demo ([4266186](https://github.com/aparajita/capacitor-secure-storage/commit/4266186066df5fa4a03d27a0cf6c4b806681ecf0))
* integrate demo into workspace and exclude from main linting ([a3a966f](https://github.com/aparajita/capacitor-secure-storage/commit/a3a966fe2da06394eaeec140a5abc1bfc24b4bf0))
* ran simple-git-ignore, it creates this ([eff7423](https://github.com/aparajita/capacitor-secure-storage/commit/eff74238439c40f51c5e16a4e9a6d2035094b6ab))
* sync demo version with plugin ([61a667b](https://github.com/aparajita/capacitor-secure-storage/commit/61a667b0547eb37bc0432f56bec8409d8c9389f1))
* update claude permission ([dd62b42](https://github.com/aparajita/capacitor-secure-storage/commit/dd62b42646552cd42994c76f38b87c33f117fccb))
* update config files to ESM ([8fd80fe](https://github.com/aparajita/capacitor-secure-storage/commit/8fd80fecc50ef065273a069dd3c6f0c3bfb3cd6f))
* upgrade demo to ESLint 9 flat config with ES modules ([657a500](https://github.com/aparajita/capacitor-secure-storage/commit/657a500ea72561b6a9c0bd579218eee8999d1556))
* upgrade ESLint to v9 with flat config ([09ebb68](https://github.com/aparajita/capacitor-secure-storage/commit/09ebb688523aab18e97dca216bee6b65a5bb08ab))
* upgrade to Capacitor 7 ([f658787](https://github.com/aparajita/capacitor-secure-storage/commit/f658787a63591083bde2d016e23ab9f0e62474dc))
* upgrade to Capacitor 7 ([f7c50c9](https://github.com/aparajita/capacitor-secure-storage/commit/f7c50c93cc1792d2efd31b74b6ff6c0a4cc85036))
* use ESM ([322a6c5](https://github.com/aparajita/capacitor-secure-storage/commit/322a6c598bcab796ac9f5e48c81f4d74a56db4d4))


### Bug Fixes

* keep demo version in sync with plugin version ([30b4a66](https://github.com/aparajita/capacitor-secure-storage/commit/30b4a66b470bf407a3e9f6009406ac5d0b834b3a))
* linting from main directory should ignore demo ([8d49373](https://github.com/aparajita/capacitor-secure-storage/commit/8d49373baeaa0fb564d7ee4749efbc4e86b0e321))
* revert to v6 for plugin and demo ([36635ee](https://github.com/aparajita/capacitor-secure-storage/commit/36635eee70556dd6a2053b48ea7934f6742a40ea))

## [6.0.1](https://github.com/aparajita/capacitor-secure-storage/compare/v6.0.0...v6.0.1) (2024-07-17)


### Bug Fixes

* work around deprecation warning ([e7cc3ad](https://github.com/aparajita/capacitor-secure-storage/commit/e7cc3adcb16472a4fecddbefb53198087a5fabb2))


### Maintenance

* update android deps ([a1a0418](https://github.com/aparajita/capacitor-secure-storage/commit/a1a0418b3ae4dcd4d0f14c5ff53823027c58b27c))

## [6.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v5.2.0...v6.0.0) (2024-04-21)


### ⚠ BREAKING CHANGES

* stop supporting API 22
* update to Capacitor 6

### Features

* stop supporting API 22 ([86c2989](https://github.com/aparajita/capacitor-secure-storage/commit/86c2989dfc7067fe0059168f4562698aea7318ec))
* update to Capacitor 6 ([bb6c5a8](https://github.com/aparajita/capacitor-secure-storage/commit/bb6c5a8c15729d925fc1c005d22303906d6b0856))


### Maintenance

* prettier ([a28f0f0](https://github.com/aparajita/capacitor-secure-storage/commit/a28f0f05e5984f13cfeff68c6e91a277d6d1560f))
* remove the mutex, not necessary ([abdb559](https://github.com/aparajita/capacitor-secure-storage/commit/abdb559626bec8093e4c3a1d27727245b421354d))

## [5.2.0](https://github.com/aparajita/capacitor-secure-storage/compare/v5.1.0...v5.2.0) (2024-03-18)


### Features

* use a mutex to ensure no race conditions ([39bc00d](https://github.com/aparajita/capacitor-secure-storage/commit/39bc00d4450df685e37fc029b93962eea9c03ea8))


### Maintenance

* update deps ([c7adaef](https://github.com/aparajita/capacitor-secure-storage/commit/c7adaefcbeaa70d8d8bca9c66c6632f198c8c571))
* use pod version of KeychainSwift ([8098367](https://github.com/aparajita/capacitor-secure-storage/commit/80983675923f66a29f9026251171a573b0e116c0))

## [5.1.0](https://github.com/aparajita/capacitor-secure-storage/compare/v5.0.0...v5.1.0) (2024-02-28)


### Features

* add support for keychain access ([eb5866f](https://github.com/aparajita/capacitor-secure-storage/commit/eb5866f5e43cee06a7f7e0f694967888853f8efc))


### Maintenance

* don’t use unimplemented ([da6e0ff](https://github.com/aparajita/capacitor-secure-storage/commit/da6e0ff0c6cd7775012f518100a789bd7fa30d28))
* lint/format updates ([1f52391](https://github.com/aparajita/capacitor-secure-storage/commit/1f52391088c95a2c3abc36474bd9de71aa30f4ab))
* update deps ([4f99ea3](https://github.com/aparajita/capacitor-secure-storage/commit/4f99ea3dc9b67b02ed4b44dd169b5cf7ab0bec44))

## [5.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v4.0.0...v5.0.0) (2023-12-08)


### ⚠ BREAKING CHANGES

* Storage calls that are implemented on the current platform now throw an instance of StorageError. This provides better typing, as you can use `instanceof StorageError` to narrow a caught error to StorageError, then compare error.code against StorageErrorType, which is now a string.

### Features

* throw StorageError instance from storage ops ([a34dbe3](https://github.com/aparajita/capacitor-secure-storage/commit/a34dbe3f2b0f533e7c0712fa718674ac4e5848bb))


### Bug Fixes

* notFound is no longer returned as an error ([31cbfe9](https://github.com/aparajita/capacitor-secure-storage/commit/31cbfe9726e72ea74b00fc46f31ac26fafb396ca))
* return null if entry is missing in KeyStore ([9cf5d4d](https://github.com/aparajita/capacitor-secure-storage/commit/9cf5d4da67a09637e8db2d17c3dac9338f900e83))


### Maintenance

* prettier ([4dc4e20](https://github.com/aparajita/capacitor-secure-storage/commit/4dc4e20131d916e9b1cfbebb301ab32f2c0bc28a))
* remove unused notFound ([0a2376a](https://github.com/aparajita/capacitor-secure-storage/commit/0a2376a3581199835c02f4210735112850e904d4))
* update deps ([6eb5ff4](https://github.com/aparajita/capacitor-secure-storage/commit/6eb5ff4499b622dd29c94e60eca8e4a5df3f97a8))
* update deps ([72dc9c0](https://github.com/aparajita/capacitor-secure-storage/commit/72dc9c06ea50855efd9b3d98609c7d38ae0a98f3))

## [4.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v3.0.2...v4.0.0) (2023-06-15)


### ⚠ BREAKING CHANGES

* The plugin now requires Capacitor 5.

### Features

* upgrade to Capacitor 5 ([2386df5](https://github.com/aparajita/capacitor-secure-storage/commit/2386df5a018779e1319ed373dd4409f461547c57))


### Maintenance

* don’t log name + version at startup ([0f636e9](https://github.com/aparajita/capacitor-secure-storage/commit/0f636e9bb8e3fb463cca58bb1c6618541cb56bff))
* no more husky ([2986725](https://github.com/aparajita/capacitor-secure-storage/commit/29867255b3e582b674acb90f55ca259c1233de84))
* update dev environment ([19fada5](https://github.com/aparajita/capacitor-secure-storage/commit/19fada5c737780b60224ebbe8fd3c13b9183e3c4))

## [3.0.2](https://github.com/aparajita/capacitor-secure-storage/compare/v3.0.1...v3.0.2) (2023-05-03)


### Bug Fixes

* clearItemsWithPrefix() was clearing all items ([fa754db](https://github.com/aparajita/capacitor-secure-storage/commit/fa754db336629b0487f7a590decf62638ed83dee))


### Maintenance

* update deps ([5bc04db](https://github.com/aparajita/capacitor-secure-storage/commit/5bc04db5c469d46689335f5f0ea3b0cf6964479a))

## [3.0.1](https://github.com/aparajita/capacitor-secure-storage/compare/v3.0.0...v3.0.1) (2023-04-02)

## [3.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v2.1.0...v3.0.0) (2023-04-02)


### ⚠ BREAKING CHANGES

* To be consistent with JavaScript's Storage and @capacitor/preferences, the plugin now returns `null` instead of throwing an exception when getting a non-existent item.

Also, the plugin no longer encrypts data on the web, since this plugin is designed for native storage, and including blowfish was unnecessary bloat.

### Features

* no blowfish, return null ([0f2491a](https://github.com/aparajita/capacitor-secure-storage/commit/0f2491ae565571e002d4893ed063da92f8c1a4da))


### Maintenance

* updated deps ([b69f5c5](https://github.com/aparajita/capacitor-secure-storage/commit/b69f5c5e4e1c1a864f284b8b76a678e44a36fc19))

## [2.1.0](https://github.com/aparajita/capacitor-secure-storage/compare/v2.0.1...v2.1.0) (2023-02-17)


### Features

* add compatibility w/ @vueuse/useStorageAsync ([c4a7c44](https://github.com/aparajita/capacitor-secure-storage/commit/c4a7c4458ee401bfac7600c528b6e1df66e5faa3))


### Maintenance

* update deps ([e3dd686](https://github.com/aparajita/capacitor-secure-storage/commit/e3dd68646cbef4ac1e1a59e752992d3cfde2f94f))

### [2.0.1](https://github.com/aparajita/capacitor-secure-storage/compare/v2.0.0...v2.0.1) (2022-10-24)


### Bug Fixes

* remove unused cruft ([23b5a36](https://github.com/aparajita/capacitor-secure-storage/commit/23b5a3699c86e73e2c3edbd17c7e25297f168d65))


### Maintenance

* clarify data types that can be stored ([4dc99cb](https://github.com/aparajita/capacitor-secure-storage/commit/4dc99cb5f5e34bff8c20ba2bc4a0c6dd4cc4a944))

## [2.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.7...v2.0.0) (2022-10-10)


### ⚠ BREAKING CHANGES

* The API has changed since v1, please see the documentation.

### Features

* overhaul for Cap 4, iCloud sync ([37b1501](https://github.com/aparajita/capacitor-secure-storage/commit/37b15018d723b89eed5ef9d78a3932cea568d0a6))

### [1.0.7](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.6...v1.0.7) (2021-04-02)


### Maintenance

* remove unnecessary stuff from package ([d7e8c74](https://github.com/aparajita/capacitor-secure-storage/commit/d7e8c74ad7159ba0ae9c3c1f0f4d198677dc18d5))

### [1.0.6](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.5...v1.0.6) (2021-04-01)


### Maintenance

* fix license ([33f4414](https://github.com/aparajita/capacitor-secure-storage/commit/33f441421f92fd68181802e7c07183f640666131))

### [1.0.5](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.4...v1.0.5) (2021-04-01)


### Docs

* tweaks ([1a4ed2a](https://github.com/aparajita/capacitor-secure-storage/commit/1a4ed2a7bfb044128a9908148c384a83803fcfe8))


### Maintenance

* fix urls ([9f5825d](https://github.com/aparajita/capacitor-secure-storage/commit/9f5825d8d50ad238b86b0c1d184f83f02bb269c4))
* update deps ([f6f59c5](https://github.com/aparajita/capacitor-secure-storage/commit/f6f59c5fc332bfc8e3fc7c4cdbbcb51c5445b841))

### [1.0.4](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.3...v1.0.4) (2021-03-26)


### Maintenance

* dep updates ([9fdfc3f](https://github.com/aparajita/capacitor-secure-storage/commit/9fdfc3f4707184e5c88d24cf7c58f5400d2a2342))
* lint ([a27271f](https://github.com/aparajita/capacitor-secure-storage/commit/a27271f581520616d3a607f467ba4fccbb030ce3))
* rename package ([5448784](https://github.com/aparajita/capacitor-secure-storage/commit/5448784064af0193ebc7ff024667e49fc203db1e))
* renamed package ([77a55ea](https://github.com/aparajita/capacitor-secure-storage/commit/77a55ea7229265361afdaace4c1503e5e85fc31e))
* update deps ([f131624](https://github.com/aparajita/capacitor-secure-storage/commit/f13162475fe9b2465a4f3101ce85ed14311c25ec))


### Docs

* add API docs ([0f29212](https://github.com/aparajita/capacitor-secure-storage/commit/0f292122d290fdf73af85e4c41e28ec5b0c23847))
* note capacitor 2 only ([ac6eeef](https://github.com/aparajita/capacitor-secure-storage/commit/ac6eeef7318c3ca4f613b6d8df53b783f994aa89))
* update docgen to fix method list format ([b4d8372](https://github.com/aparajita/capacitor-secure-storage/commit/b4d8372f375614c3d185190d080a337805f80476))

### [1.0.3](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.2...v1.0.3) (2020-12-07)


### Docs

* document notFound error ([08e4b58](https://github.com/aparajita/capacitor-secure-storage/commit/08e4b582691116d805508d7203986058b936467c))

### [1.0.2](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.1...v1.0.2) (2020-12-04)

* update to capacitor-native-decorator v1.1.0. Native calls must receive an object. Public API of this plugin did not change.

### [1.0.1](https://github.com/aparajita/capacitor-secure-storage/compare/v1.0.0...v1.0.1) (2020-11-30)


### Bug Fixes

* possible bugs revealed by strict mode, es6 ([1297fa1](https://github.com/aparajita/capacitor-secure-storage/commit/1297fa199e33de254fbd0113d6649538e96883d8))
* remove debug code ([f1b84a5](https://github.com/aparajita/capacitor-secure-storage/commit/f1b84a5e96e11ee3012a49670f8c2cea3ea166db))

## [1.0.0](https://github.com/aparajita/capacitor-secure-storage/compare/v0.8.0...v1.0.0) (2020-11-28)

Initial public release.
