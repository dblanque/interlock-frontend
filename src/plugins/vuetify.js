// INTERLOCK IS LICENSED UNDER GNU AGPLv3
// ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L.
// File: vuetify.js

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

// MDI Pack Import
import '@mdi/font/css/materialdesignicons.css';
import "@fontsource/material-icons"
import "@fontsource/material-icons-outlined"
import "@fontsource/material-icons-rounded"
import "@fontsource/material-icons-sharp"

// Roboto Font Import
import '@fontsource/roboto/index.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';
import '@fontsource/roboto/100-italic.css';
import '@fontsource/roboto/300-italic.css';
import '@fontsource/roboto/400-italic.css';
import '@fontsource/roboto/500-italic.css';
import '@fontsource/roboto/700-italic.css';
import '@fontsource/roboto/900-italic.css';

// Montserrat Font Import
import '@fontsource/montserrat/index.css';
import '@fontsource/montserrat/100.css';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/montserrat/100-italic.css';
import '@fontsource/montserrat/300-italic.css';
import '@fontsource/montserrat/400-italic.css';
import '@fontsource/montserrat/500-italic.css';
import '@fontsource/montserrat/700-italic.css';
import '@fontsource/montserrat/900-italic.css';

// Ripple fix
import Ripple from 'vuetify/lib/directives/ripple';
import { parseVueColors } from './colors';

const colors = parseVueColors()

Vue.use(Vuetify, {
    directives: {
        Ripple,
    },
});

export default new Vuetify({
    icons: {
        iconfont: 'mdi', // default - only for display purposes
    },
    theme: {
        options: {
            customProperties: true, // Enable Color Variables in CSS
            variations: false // Handled manually
        },
        dark: false,
        themes: {
            light: colors.light,
            dark: colors.dark
        },
    },
});
