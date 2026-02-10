# capacitor-secure-storage demo (CocoaPods variant)

This Ionic/Vue app demonstrates all of the features of the [capacitor-secure-storage plugin](https://github.com/aparajita/capacitor-secure-storage/#readme).

This variant uses CocoaPods for iOS dependency management.

## Installation

First clone the main repo locally:

```shell
git clone https://github.com/aparajita/capacitor-secure-storage
cd capacitor-secure-storage
```

Install dependencies (this will install both the main plugin and demo dependencies):

```shell
pnpm install
```

## Running

From the root directory, you can run the demo using:

iOS:

```shell
pnpm demo.pods.ios
```

Android:

```shell
pnpm demo.pods.android
```

Web:

```shell
pnpm demo.pods.browser
```

You can also run commands from within the demo-pods directory:

```shell
cd demo-pods
pnpm ios
pnpm android
pnpm dev
```

## Usage

#### Sync to iCloud Keychain (iOS only)

On iOS, an "iCloud sync" checkbox appears at the top. Checking/unchecking this turns on/off iCloud sync globally.

In addition, a "Sync" checkbox appears to the right of the "Key" field which controls iCloud sync. By default, it is in an indeterminate state, which means the global sync setting is used. Tapping the "Sync" checkbox cycles between indeterminate => checked => unchecked. If the "Sync" checkbox is checked or unchecked, that overrides the global sync checkbox.

When the resolved sync setting is on, any operations (other than setting the prefix) affect the iCloud keychain instead of the local keychain.

#### Set the prefix

To change the key prefix, edit the "Prefix" field and press "Set".

#### Save a value

To save a key/value item to storage, enter the key in the "Key" field and a JSON-parseable value in the "Data" field. As you type in the "Data" field, if it is a valid value, the data type is displayed below the field.

You may store any valid JSON value: string, number, boolean, array, object, or null. In addition, if the "Data" field looks like an ISO 8601 datetime (begins with YYYY-MM-DD), it is parsed as such, and if successfully parsed the type will be shown as "date". Note that the time and milliseconds are optional. So, for example, these are all parsed as a valid date:

```
2020-08-27
2020-08-27T13:27:07
2020-08-27T13:27:07.413Z
```

#### Get a value

To get a value from storage, enter the key and press "Get".

#### Remove an item

To remove an item from storage, enter the key and press "Remove".

#### Clear all items

To remove all items with the current prefix from storage, press "Clear".

#### View all keys

To view all of the keys with the current prefix in storage, press "Keys". Note that if the resolved sync setting is true on iOS, keys from **both** the iCloud keychain and the local keychain will be displayed.
