<template>
  <ion-page
    id="main"
    class="w-full h-full"
  >
    <ion-header>
      <ion-toolbar>
        <ion-title>Secure storage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :scroll-y="true">
      <div
        class="flex flex-col justify-start items-center w-full ion-padding-top pr-5"
      >
        <ion-item
          v-if="Capacitor.getPlatform() === 'ios'"
          lines="inset"
          class="w-full"
        >
          <ion-label position="stacked">Access</ion-label>
          <ion-select
            v-model="access"
            aria-label="Access"
            placeholder="Select"
          >
            <ion-select-option :value="KeychainAccess.whenUnlocked">
              whenUnlocked
            </ion-select-option>
            <ion-select-option
              :value="KeychainAccess.whenUnlockedThisDeviceOnly"
            >
              whenUnlockedThisDeviceOnly
            </ion-select-option>
            <ion-select-option :value="KeychainAccess.afterFirstUnlock">
              afterFirstUnlock
            </ion-select-option>
            <ion-select-option
              :value="KeychainAccess.afterFirstUnlockThisDeviceOnly"
            >
              afterFirstUnlockThisDeviceOnly
            </ion-select-option>
            <ion-select-option
              :value="KeychainAccess.whenPasscodeSetThisDeviceOnly"
            >
              whenPasscodeSetThisDeviceOnly
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item
          v-if="Capacitor.getPlatform() === 'ios'"
          lines="inset"
          class="w-full"
        >
          <ion-checkbox
            v-model="iCloudSync"
            @ion-change="onSetSync"
          >
            Cloud sync
          </ion-checkbox>
        </ion-item>

        <div class="flex items-end w-full">
          <ion-item
            lines="inset"
            class="w-full"
          >
            <ion-input
              v-model="prefix"
              label="Prefix:"
              type="text"
              class="flex-1"
            />
          </ion-item>

          <ion-button
            size="small"
            class="flex-initial"
            @click="onSetPrefix"
          >
            Set
          </ion-button>
        </div>

        <div class="flex w-full">
          <ion-item
            lines="inset"
            class="flex-1"
          >
            <ion-input
              v-model="key"
              label="Key:"
              type="text"
              required
            />
          </ion-item>
          <ion-item
            v-if="Capacitor.getPlatform() === 'ios'"
            lines="none"
          >
            <ion-checkbox
              v-model="syncItem"
              :indeterminate="useGlobalSync"
              @click="onSyncItemClick"
            >
              Sync
            </ion-checkbox>
          </ion-item>
        </div>

        <ion-item
          lines="inset"
          class="w-full"
        >
          <ion-input
            v-model="data"
            label="Data:"
            required
            @ion-input="onDataChanged"
          />
        </ion-item>
      </div>

      <ion-item
        lines="none"
        class="text-sm"
      >
        {{ dataType || '&nbsp;' }}
      </ion-item>

      <ion-item
        lines="none"
        class="flex items-center w-full pt-6 space-x-5"
      >
        <ion-text>Item:</ion-text>
        <ion-button
          size="default"
          @click="onSet"
        >
          Set
        </ion-button>
        <ion-button
          size="default"
          @click="onGet"
        >
          Get
        </ion-button>
        <ion-button
          size="default"
          @click="onRemove"
        >
          Remove
        </ion-button>
      </ion-item>

      <ion-item
        lines="none"
        class="flex justify-center items-center w-full mt-4 space-x-5"
      >
        <ion-text>Global:</ion-text>
        <ion-button
          size="default"
          @click="onClear"
        >
          Clear
        </ion-button>
        <ion-button
          size="default"
          @click="onShowKeys"
        >
          Keys
        </ion-button>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  type DataType,
  KeychainAccess,
  StorageErrorType,
} from '@aparajita/capacitor-secure-storage'
import {
  SecureStorage,
  StorageError,
} from '@aparajita/capacitor-secure-storage'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'
import type { InputChangeEventDetail, IonInputCustomEvent } from '@ionic/core'
import {
  alertController,
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonicSafeString,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue'
import { onBeforeMount, onMounted, ref } from 'vue'

/*
 * ref
 */
const key = ref('')
const data = ref('')
const dataType = ref('')
const prefix = ref('')
const iCloudSync = ref(false)
const syncItem = ref(false)
const useGlobalSync = ref(true)
const access = ref(KeychainAccess.whenUnlocked)

/*
 * lifecycle
 */
onBeforeMount(async () => {
  prefix.value = await SecureStorage.getKeyPrefix()
})

onMounted(async () => {
  await SplashScreen.hide()
})

/*
 * methods
 */
async function onSetSync(): Promise<void> {
  await SecureStorage.setSynchronize(iCloudSync.value)
}

function onSyncItemClick(): void {
  // We can't change the checkbox state synchronously, do it after the click
  setTimeout(() => {
    // The value of syncItem is BEFORE it is changed.
    // We want to cycle between checked, unchecked, and indeterminate.
    if (useGlobalSync.value) {
      // was indeterminate => checked
      syncItem.value = true
      useGlobalSync.value = false
    } else if (syncItem.value) {
      // was unchecked => indeterminate
      useGlobalSync.value = true
    } else {
      // was checked => unchecked
    }
  }, 0)
}

function onDataChanged(
  event: IonInputCustomEvent<InputChangeEventDetail>
): void {
  try {
    // eslint-disable-next-line
    const [_, type] = parseValue(event.detail.value || '')
    dataType.value = type
  } catch {
    dataType.value = ''
  }
}

function synchronize(): boolean {
  return useGlobalSync.value ? iCloudSync.value : syncItem.value
}

async function onSet(): Promise<void> {
  try {
    const [value, type] = parseValue(data.value)

    if (value !== null) {
      await SecureStorage.set(
        key.value,
        value,
        true,
        synchronize(),
        access.value
      )
      await showAlert(`Item (${type}) stored successfully.`)
    } else {
      await showAlert('null is not a valid DataType.')
    }

    data.value = ''
    dataType.value = ''
  } catch (e) {
    await showErrorAlert(e)
  }
}

function parseValue(value: string): [DataType | null, string] {
  if (!value) {
    throw new SyntaxError('Empty data value')
  }

  if (/^\d{4}-\d{2}-\d{2}/u.test(value)) {
    const date = new Date(value)

    // If the format is not a valid date, the properties will be NaN
    if (!Number.isNaN(date.getFullYear())) {
      return [date, 'date']
    }
  }

  const parsed = JSON.parse(value)
  let type: string = typeof parsed

  if (type === 'object') {
    if (parsed === null) {
      type = 'null'
    } else if (Array.isArray(parsed)) {
      type = 'array'
    }
  }

  return [parsed, type]
}

function getDataType(value: DataType): string {
  const type = typeof value

  if (type === 'object') {
    if (value instanceof Date) {
      return 'date'
    }

    if (Array.isArray(value)) {
      return 'array'
    }

    return 'object'
  }

  return type
}

async function onGet(): Promise<void> {
  try {
    const value = await SecureStorage.get(key.value, true, synchronize())

    if (value === null) {
      data.value = ''
      await showAlert(`There is no item with the key "${key.value}".`)
      return
    }

    if (value instanceof Date) {
      data.value = value.toISOString()
    } else {
      data.value = JSON.stringify(value)
    }

    dataType.value = getDataType(value)
  } catch (e) {
    data.value = ''
    await showErrorAlert(e)
  }
}

async function onRemove(): Promise<void> {
  try {
    const success = await SecureStorage.remove(key.value, synchronize())

    if (success) {
      await showAlert(`Item for key "${key.value}" removed successfully.`)
    } else {
      await showAlert(`There is no item with the key "${key.value}".`)
    }
  } catch (e) {
    await showErrorAlert(e)
  } finally {
    data.value = ''
  }
}

async function onClear(): Promise<void> {
  try {
    await SecureStorage.clear(synchronize())
    key.value = ''
    await showAlert(
      `All items with prefix '${await SecureStorage.getKeyPrefix()}' removed.`
    )
  } catch (e) {
    await showErrorAlert(e)
  } finally {
    data.value = ''
  }
}

async function onSetPrefix(): Promise<void> {
  await SecureStorage.setKeyPrefix(prefix.value)
  await showAlert(`Prefix set to "${prefix.value}".`)
}

async function onShowKeys(): Promise<void> {
  const keys = await SecureStorage.keys(synchronize())
  keys.sort()

  let qty: string

  switch (keys.length) {
    case 0:
      qty = 'are no'
      break

    case 1:
      qty = 'is 1'
      break

    default:
      qty = `are ${keys.length}`
  }

  let msg = `There ${qty} key${keys.length === 1 ? '' : 's'} with the prefix '${
    prefix.value
  }'.`

  if (keys.length > 0) {
    msg += `<br><br>${keys.join('<br>')}`
  }

  await showAlert(msg)
}

async function showErrorAlert(error: unknown): Promise<void> {
  let message: string

  if (error instanceof Error) {
    message = error.message

    if (error instanceof StorageError) {
      message += ` [${StorageErrorType[error.code]}]`
    }
  } else {
    message = String(error)
  }

  await showAlert(`${message}.`)
}

async function showAlert(message: string): Promise<void> {
  const alert = await alertController.create({
    header: `The plugin says:`,
    subHeader: '',
    message: new IonicSafeString(message),
    buttons: ['OK'],
  })
  await alert.present()
}
</script>
