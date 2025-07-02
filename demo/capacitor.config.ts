// / <reference types="@capacitor/splash-screen" />

import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.aparajita.capacitor.securestoragedemo',
  appName: 'Storage',
  loggingBehavior: 'debug',
  server: {
    androidScheme: 'http',
  },
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
}

export default config
