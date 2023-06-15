# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
