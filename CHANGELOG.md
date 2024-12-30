# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## 0.1.0 (2024-12-30)


### ⚠ BREAKING CHANGES

* stop supporting API 22
* update to Capacitor 6
* Storage calls that are implemented on the current platform now throw an instance of StorageError. This provides better typing, as you can use `instanceof StorageError` to narrow a caught error to StorageError, then compare error.code against StorageErrorType, which is now a string.
* The plugin now requires Capacitor 5.
* To be consistent with JavaScript's Storage and @capacitor/preferences, the plugin now returns `null` instead of throwing an exception when getting a non-existent item.

Also, the plugin no longer encrypts data on the web, since this plugin is designed for native storage, and including blowfish was unnecessary bloat.
* The API has changed since v1, please see the documentation.

### Features

* add compatibility w/ @vueuse/useStorageAsync ([c4a7c44](https://github.com/darkedges/capacitor-secure-storage/commit/c4a7c4458ee401bfac7600c528b6e1df66e5faa3))
* add JSON convenience methods ([3144588](https://github.com/darkedges/capacitor-secure-storage/commit/314458891221ba7b8f9a4da4e3b6f53e00c2faab))
* add support for keychain access ([eb5866f](https://github.com/darkedges/capacitor-secure-storage/commit/eb5866f5e43cee06a7f7e0f694967888853f8efc))
* big improvements ([c5de91e](https://github.com/darkedges/capacitor-secure-storage/commit/c5de91eeebf298d34149fd7b6ecdf83e95410bc8))
* **biometric:** add biometric ([b0a7176](https://github.com/darkedges/capacitor-secure-storage/commit/b0a71762829993da5fe85d9f73a1a4444df093eb))
* **biometric:** add biometric ([b79e0da](https://github.com/darkedges/capacitor-secure-storage/commit/b79e0da5581d938353a4972787aa99ebd986f97d))
* **biometric:** add biometric ([6e760f6](https://github.com/darkedges/capacitor-secure-storage/commit/6e760f63ce845357a1a3bbdb467e3c4f2f13659d))
* **biometric:** update ([d2250c6](https://github.com/darkedges/capacitor-secure-storage/commit/d2250c6589948da1792888362085ec3ec2cd43cf))
* **biometric:** update ([5654777](https://github.com/darkedges/capacitor-secure-storage/commit/5654777c1b976e4170d5ebc9331b4eaea4608e4d))
* **biometric:** update ([469147f](https://github.com/darkedges/capacitor-secure-storage/commit/469147f594f064ac1d6f39f564c1fd621ac79c36))
* **biometric:** update ([602e949](https://github.com/darkedges/capacitor-secure-storage/commit/602e94937fad760c82a104953a943c90e4f2dbd1))
* **biometric:** update ([31fe15c](https://github.com/darkedges/capacitor-secure-storage/commit/31fe15c471c0eb135ad2cdf5832784687af1fad5))
* **biometric:** update ([603370b](https://github.com/darkedges/capacitor-secure-storage/commit/603370bc1c507b3a92f56eb7dd3ac54750896aa5))
* **biometric:** updated ([0de900b](https://github.com/darkedges/capacitor-secure-storage/commit/0de900b92698f489f537e14da90f039ac0fdfb07))
* **biometric:** updating ([1576f6b](https://github.com/darkedges/capacitor-secure-storage/commit/1576f6ba168fe0db6a6b69b2c3cd68bc9432c2c5))
* **biometric:** updating ([f798ccd](https://github.com/darkedges/capacitor-secure-storage/commit/f798ccd48039d9b7c25902d2fb8f5d4a26827566))
* **biometric:** updating ([60e7037](https://github.com/darkedges/capacitor-secure-storage/commit/60e7037d6c09abbff88211556fad2f96290c7088))
* **biometric:** updating ([9ff50fe](https://github.com/darkedges/capacitor-secure-storage/commit/9ff50fea37ad04c814bdda33309d696f06396c9b))
* no blowfish, return null ([0f2491a](https://github.com/darkedges/capacitor-secure-storage/commit/0f2491ae565571e002d4893ed063da92f8c1a4da))
* overhaul for Cap 4, iCloud sync ([37b1501](https://github.com/darkedges/capacitor-secure-storage/commit/37b15018d723b89eed5ef9d78a3932cea568d0a6))
* reworked API ([8b54c06](https://github.com/darkedges/capacitor-secure-storage/commit/8b54c068dbfd49862969b653ab1f3dc4fa4f9749))
* stop supporting API 22 ([86c2989](https://github.com/darkedges/capacitor-secure-storage/commit/86c2989dfc7067fe0059168f4562698aea7318ec))
* throw StorageError instance from storage ops ([a34dbe3](https://github.com/darkedges/capacitor-secure-storage/commit/a34dbe3f2b0f533e7c0712fa718674ac4e5848bb))
* update Android version ([361de26](https://github.com/darkedges/capacitor-secure-storage/commit/361de26526ae9f1f0c6f709ee33e3fb5f1c481cc))
* update to Capacitor 6 ([bb6c5a8](https://github.com/darkedges/capacitor-secure-storage/commit/bb6c5a8c15729d925fc1c005d22303906d6b0856))
* upgrade to Capacitor 5 ([2386df5](https://github.com/darkedges/capacitor-secure-storage/commit/2386df5a018779e1319ed373dd4409f461547c57))
* use a mutex to ensure no race conditions ([39bc00d](https://github.com/darkedges/capacitor-secure-storage/commit/39bc00d4450df685e37fc029b93962eea9c03ea8))


### Bug Fixes

* clearItemsWithPrefix() was clearing all items ([fa754db](https://github.com/darkedges/capacitor-secure-storage/commit/fa754db336629b0487f7a590decf62638ed83dee))
* naming ([a67d7fb](https://github.com/darkedges/capacitor-secure-storage/commit/a67d7fbcf3c825d8482210f18c73d6618f445486))
* notFound is no longer returned as an error ([31cbfe9](https://github.com/darkedges/capacitor-secure-storage/commit/31cbfe9726e72ea74b00fc46f31ac26fafb396ca))
* possible bugs revealed by strict mode, es6 ([1297fa1](https://github.com/darkedges/capacitor-secure-storage/commit/1297fa199e33de254fbd0113d6649538e96883d8))
* remove debug code ([f1b84a5](https://github.com/darkedges/capacitor-secure-storage/commit/f1b84a5e96e11ee3012a49670f8c2cea3ea166db))
* remove unused cruft ([23b5a36](https://github.com/darkedges/capacitor-secure-storage/commit/23b5a3699c86e73e2c3edbd17c7e25297f168d65))
* return null if entry is missing in KeyStore ([9cf5d4d](https://github.com/darkedges/capacitor-secure-storage/commit/9cf5d4da67a09637e8db2d17c3dac9338f900e83))
* work around deprecation warning ([e7cc3ad](https://github.com/darkedges/capacitor-secure-storage/commit/e7cc3adcb16472a4fecddbefb53198087a5fabb2))


### Maintenance

* clarify data types that can be stored ([4dc99cb](https://github.com/darkedges/capacitor-secure-storage/commit/4dc99cb5f5e34bff8c20ba2bc4a0c6dd4cc4a944))
* dep updates ([9fdfc3f](https://github.com/darkedges/capacitor-secure-storage/commit/9fdfc3f4707184e5c88d24cf7c58f5400d2a2342))
* **deps:** update ([db89e59](https://github.com/darkedges/capacitor-secure-storage/commit/db89e597cf3050f25140731d72bb0c732000b459))
* **deps:** update ([cc93093](https://github.com/darkedges/capacitor-secure-storage/commit/cc93093348c7d1aa41301bf3360db53b360dcd64))
* don’t include test files in the package ([16a0b24](https://github.com/darkedges/capacitor-secure-storage/commit/16a0b2467841f1ce25709d0514ad90d720bbaeb2))
* don’t log name + version at startup ([0f636e9](https://github.com/darkedges/capacitor-secure-storage/commit/0f636e9bb8e3fb463cca58bb1c6618541cb56bff))
* don’t use unimplemented ([da6e0ff](https://github.com/darkedges/capacitor-secure-storage/commit/da6e0ff0c6cd7775012f518100a789bd7fa30d28))
* fix import order ([67d2a7b](https://github.com/darkedges/capacitor-secure-storage/commit/67d2a7b930fc474139269bfae9a661f4b0e78db0))
* fix license ([33f4414](https://github.com/darkedges/capacitor-secure-storage/commit/33f441421f92fd68181802e7c07183f640666131))
* fix package build ([c5a9878](https://github.com/darkedges/capacitor-secure-storage/commit/c5a9878feaf2fc74d5f36cd8843e6ac6a72477b6))
* fix urls ([9f5825d](https://github.com/darkedges/capacitor-secure-storage/commit/9f5825d8d50ad238b86b0c1d184f83f02bb269c4))
* format ([7470d14](https://github.com/darkedges/capacitor-secure-storage/commit/7470d14c2252d2646f95957a2f296a6dfc813eac))
* initial commit ([6a17a9f](https://github.com/darkedges/capacitor-secure-storage/commit/6a17a9fefeb694ab09e5d469a49b8e596e43e9fb))
* lint ([a27271f](https://github.com/darkedges/capacitor-secure-storage/commit/a27271f581520616d3a607f467ba4fccbb030ce3))
* lint ([288a19c](https://github.com/darkedges/capacitor-secure-storage/commit/288a19c3d0cc3a03d7bb710cfde979278f0eb35b))
* lint, separate KeychainSwift files ([2e0f63c](https://github.com/darkedges/capacitor-secure-storage/commit/2e0f63c8feee9e0b0226e81aae196b4eb2d68c14))
* lint/format updates ([1f52391](https://github.com/darkedges/capacitor-secure-storage/commit/1f52391088c95a2c3abc36474bd9de71aa30f4ab))
* must pass object to native calls ([c1e484f](https://github.com/darkedges/capacitor-secure-storage/commit/c1e484f23dcf8c7c83600172a7d2fdfaed741618))
* no more husky ([2986725](https://github.com/darkedges/capacitor-secure-storage/commit/29867255b3e582b674acb90f55ca259c1233de84))
* prettier ([a28f0f0](https://github.com/darkedges/capacitor-secure-storage/commit/a28f0f05e5984f13cfeff68c6e91a277d6d1560f))
* prettier ([4dc4e20](https://github.com/darkedges/capacitor-secure-storage/commit/4dc4e20131d916e9b1cfbebb301ab32f2c0bc28a))
* **release:** 1.0.0 ([d22098c](https://github.com/darkedges/capacitor-secure-storage/commit/d22098c98997c23e0ae6dea16e0878a83bc4945a))
* **release:** 1.0.1 ([1dbab47](https://github.com/darkedges/capacitor-secure-storage/commit/1dbab47a83c298f5918744eee6e7401561b412f5))
* **release:** 1.0.2 ([2c5bf0c](https://github.com/darkedges/capacitor-secure-storage/commit/2c5bf0cfe3ad10c61df5e96d4da9131003b0b283))
* **release:** 1.0.3 ([d7f1832](https://github.com/darkedges/capacitor-secure-storage/commit/d7f18320179b4dcea466836a6be7aba6ba42ac8e))
* **release:** 1.0.4 ([7eac04f](https://github.com/darkedges/capacitor-secure-storage/commit/7eac04fc5432e0582f80ee66cf12c0bc74e00231))
* **release:** 1.0.5 ([635e4df](https://github.com/darkedges/capacitor-secure-storage/commit/635e4df379aa6db60046894187f7469800450bc8))
* **release:** 1.0.6 ([8124bcc](https://github.com/darkedges/capacitor-secure-storage/commit/8124bcc7631ab572b777cb81a24ff9f43b33befe))
* **release:** 1.0.7 ([cd4d144](https://github.com/darkedges/capacitor-secure-storage/commit/cd4d144ffb765ca6c1acf1b5b50d6c0d589110d2))
* **release:** 2.0.0 ([911af18](https://github.com/darkedges/capacitor-secure-storage/commit/911af182f35f40b9f027490ecb74988e9bb93d19))
* **release:** 2.0.1 ([0ee0e9f](https://github.com/darkedges/capacitor-secure-storage/commit/0ee0e9f70377e5b9aa8957bcf400c48244342303))
* **release:** 2.1.0 ([e00b658](https://github.com/darkedges/capacitor-secure-storage/commit/e00b6585f7f0f6eef80e17cd42b430b4eee65ce6))
* **release:** 3.0.0 ([0b11143](https://github.com/darkedges/capacitor-secure-storage/commit/0b1114337ba224a4a99199c3424caa76a7260a2e))
* **release:** 3.0.1 ([925f2e6](https://github.com/darkedges/capacitor-secure-storage/commit/925f2e60932a0ab7d3e26aee8710081d89aadf1b))
* **release:** 3.0.2 ([69b1353](https://github.com/darkedges/capacitor-secure-storage/commit/69b1353f5e60f4bbed69ce00b7c94beb852f87ea))
* **release:** 4.0.0 ([7ece506](https://github.com/darkedges/capacitor-secure-storage/commit/7ece5065831e8e4fb58f4aefde46993d33906456))
* **release:** 5.0.0 ([fb68dd4](https://github.com/darkedges/capacitor-secure-storage/commit/fb68dd44e820340bda319d0ddee1303a1b9dd596))
* **release:** 5.1.0 ([32fc2a9](https://github.com/darkedges/capacitor-secure-storage/commit/32fc2a983f63994c8a94844a072978d09d22f988))
* **release:** 5.2.0 ([4dd6ab8](https://github.com/darkedges/capacitor-secure-storage/commit/4dd6ab8bd4c963719d7a7c452e898bf1b5572f9d))
* **release:** 6.0.0 ([f40f5ca](https://github.com/darkedges/capacitor-secure-storage/commit/f40f5cae7e9a5fac3c387372dfd09c9ea65095e6))
* **release:** 6.0.1 ([f0f6c7c](https://github.com/darkedges/capacitor-secure-storage/commit/f0f6c7c1d2e9e30350ab20dd7327d69ad6e59b60))
* remove the mutex, not necessary ([abdb559](https://github.com/darkedges/capacitor-secure-storage/commit/abdb559626bec8093e4c3a1d27727245b421354d))
* remove unnecessary stuff from package ([d7e8c74](https://github.com/darkedges/capacitor-secure-storage/commit/d7e8c74ad7159ba0ae9c3c1f0f4d198677dc18d5))
* remove unused notFound ([0a2376a](https://github.com/darkedges/capacitor-secure-storage/commit/0a2376a3581199835c02f4210735112850e904d4))
* rename package ([5448784](https://github.com/darkedges/capacitor-secure-storage/commit/5448784064af0193ebc7ff024667e49fc203db1e))
* renamed package ([77a55ea](https://github.com/darkedges/capacitor-secure-storage/commit/77a55ea7229265361afdaace4c1503e5e85fc31e))
* update android deps ([a1a0418](https://github.com/darkedges/capacitor-secure-storage/commit/a1a0418b3ae4dcd4d0f14c5ff53823027c58b27c))
* update deps ([c7adaef](https://github.com/darkedges/capacitor-secure-storage/commit/c7adaefcbeaa70d8d8bca9c66c6632f198c8c571))
* update deps ([4f99ea3](https://github.com/darkedges/capacitor-secure-storage/commit/4f99ea3dc9b67b02ed4b44dd169b5cf7ab0bec44))
* update deps ([6eb5ff4](https://github.com/darkedges/capacitor-secure-storage/commit/6eb5ff4499b622dd29c94e60eca8e4a5df3f97a8))
* update deps ([72dc9c0](https://github.com/darkedges/capacitor-secure-storage/commit/72dc9c06ea50855efd9b3d98609c7d38ae0a98f3))
* update deps ([5bc04db](https://github.com/darkedges/capacitor-secure-storage/commit/5bc04db5c469d46689335f5f0ea3b0cf6964479a))
* update deps ([e3dd686](https://github.com/darkedges/capacitor-secure-storage/commit/e3dd68646cbef4ac1e1a59e752992d3cfde2f94f))
* update deps ([f6f59c5](https://github.com/darkedges/capacitor-secure-storage/commit/f6f59c5fc332bfc8e3fc7c4cdbbcb51c5445b841))
* update deps ([f131624](https://github.com/darkedges/capacitor-secure-storage/commit/f13162475fe9b2465a4f3101ce85ed14311c25ec))
* update deps ([cd989ed](https://github.com/darkedges/capacitor-secure-storage/commit/cd989ed2633bed5a9eb1c0243b7689beb925e10c))
* update deps, scripts, keywords, urls ([af74e61](https://github.com/darkedges/capacitor-secure-storage/commit/af74e61379afbbd286a6169d7795d0f9a5d358fb))
* update dev environment ([19fada5](https://github.com/darkedges/capacitor-secure-storage/commit/19fada5c737780b60224ebbe8fd3c13b9183e3c4))
* update dev environment ([2a026f0](https://github.com/darkedges/capacitor-secure-storage/commit/2a026f014b8da29dd6290acdb6d8d4fa556e3899))
* update Podfile ([451b69c](https://github.com/darkedges/capacitor-secure-storage/commit/451b69cab26f514b4f40df4c270e55aef29b10f9))
* updated deps ([b69f5c5](https://github.com/darkedges/capacitor-secure-storage/commit/b69f5c5e4e1c1a864f284b8b76a678e44a36fc19))
* use pod version of KeychainSwift ([8098367](https://github.com/darkedges/capacitor-secure-storage/commit/80983675923f66a29f9026251171a573b0e116c0))
* write README ([ba9cdf9](https://github.com/darkedges/capacitor-secure-storage/commit/ba9cdf9d8c239e7841e42eeb937f1974f5b83025))
* Xcode project changed ([9eb4353](https://github.com/darkedges/capacitor-secure-storage/commit/9eb4353029c39cbc63a8df50dd52a3eae2620f7f))


### Docs

* add API docs ([0f29212](https://github.com/darkedges/capacitor-secure-storage/commit/0f292122d290fdf73af85e4c41e28ec5b0c23847))
* document notFound error ([08e4b58](https://github.com/darkedges/capacitor-secure-storage/commit/08e4b582691116d805508d7203986058b936467c))
* fix typos, bad links, remove TOC ([8cb7b59](https://github.com/darkedges/capacitor-secure-storage/commit/8cb7b596c4ecbed3589058bb13acad53e539a054))
* note capacitor 2 only ([ac6eeef](https://github.com/darkedges/capacitor-secure-storage/commit/ac6eeef7318c3ca4f613b6d8df53b783f994aa89))
* tweaks ([1a4ed2a](https://github.com/darkedges/capacitor-secure-storage/commit/1a4ed2a7bfb044128a9908148c384a83803fcfe8))
* update docgen to fix method list format ([b4d8372](https://github.com/darkedges/capacitor-secure-storage/commit/b4d8372f375614c3d185190d080a337805f80476))

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
