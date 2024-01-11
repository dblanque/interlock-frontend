// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// DBLANQUE & BR Consulting S.R.L.
// File: vite.config.js

import { defineConfig } from 'vite'
import { createVuePlugin as vue } from "vite-plugin-vue2";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    transpileDependencies: [
      'vuetify'
    ],
  
    pluginOptions: {
      i18n: {
        locale: 'en',
        fallbackLocale: 'en',
        localeDir: 'locales',
        enableInSFC: false,
        enableBridge: false
      }
    }
  })],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  build: {
    target: 'esnext'
  }
})