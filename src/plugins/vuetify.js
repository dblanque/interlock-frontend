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

Vue.use(Vuetify);

export default new Vuetify({
    options: {
        customProperties: true
        },
        icons: {
        iconfont: 'mdi', // default - only for display purposes
        },
        theme: {
        dark: false,
        themes: {
            light: {
            // Please don't comment these, I want to avoid overriding unnecessary classes - Dylan
            primary: '#528dcc',
            primary_strong: '#2077d3',
            text_normal: '#000000',
            text_inverted: '#FFFFFF',
            accent: '#ffc389',
            accent_alt: '#Efb379',
            secondary: "#32363a",
            secondary_alt: "#4e535c",
            valid: "#21ae67",
            background: "#FFFFFF",
            background_alt: "#f7fbff",
            error: "#E01111",
            cancel: "#ff1616"
            },
            dark: {
            text_normal: '#FFFFFF',
            text_inverted: '#000000',
            primary: '#528dcc',
            primary_strong: '#5895d6',
            accent: '#ffc389',
            accent_alt: '#Efb379',
            secondary: "#32363a",
            secondary_alt: "#4e535c",
            valid: "#21ae67",
            background: "#32363a",
            background_alt: "#42474d",
            error: "#E01111",
            cancel: "#ff1616"
            }
        },
    },
});
