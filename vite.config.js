// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// DBLANQUE & BR Consulting S.R.L.
// File: vite.config.js

import { defineConfig } from 'vite';
import { createVuePlugin } from "vite-plugin-vue2";
import { VuetifyResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        createVuePlugin({
            // compilerOptions: { whitespace: 'preserve' }, // Better Debugging
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
        }),
        Components({
            resolvers: [
                VuetifyResolver(),
            ],
            // Needed if we ever use TS and require VueRouter
            types: [{
                from: 'vue-router',
                names: ['RouterLink', 'RouterView'],
            }],
        }),
        // Required to fix strange HMR issue with Vue 2 Router Initialization
        // There is some Circular Dependency Screwing things up.
        // https://github.com/vitejs/vite/issues/3033
        // https://github.com/vitejs/vite/issues/2466
        {
            name: "singleHMR",
            handleHotUpdate({ modules }) {
                modules.map((m) => {
                    m.importedModules = new Set();
                    m.importers = new Set();
                });
                return modules;
            },
        },
    ],
    server: {
        hmr: {
            // protocol: 'ws',
            // host: 'localhost',
            clientPort: 443,
        }
    },
    watch: {
        usePolling: true
    },
    resolve: {
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
        alias: { "@": path.resolve(__dirname, "./src") },
    },
    build: {
        target: 'esnext',
        // sourcemap: true,
        // minify: false,
        // rollupOptions: {
        //     output: {
        //         entryFileNames: `[name]` + random_hash + `.js`,
        //         chunkFileNames: `[name]` + random_hash + `.js`,
        //         assetFileNames: `[name]` + random_hash + `.[ext]`
        //     }
        // }
    },
})