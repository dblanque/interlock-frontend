<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: LanguageSelector.vue -------------------------->
<template>
    <v-select
        id="v-select_language_selector"
        append-icon="mdi-earth"
        :dark="dark"
        :light="light"
        :items="getEnabledLanguages"
        v-model="language"
        @input="changeLanguage()"
        :hide-details="true"
        outlined
        dense
        :style="fullWidth || this.$vuetify.breakpoint.smAndDown ? '' : 'max-width: 25ch;'">
        <template slot="selection" slot-scope="data">
            <!-- HTML that describes how select should render the selected item -->
            <v-row class="ma-0 pa-0" align="center">
                {{ data.item.text + ' (' + data.item.value.toUpperCase() + ')' }}
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="accent-45-s" v-bind="attrs" v-on="on" class="ml-1"
                            v-if="!localeIsComplete(data.item.value)">
                            mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t('locale.incomplete.' + data.item.value) }}</span>
                </v-tooltip>
            </v-row>
        </template>
        <template
            slot="item"
            slot-scope="data">
            <!-- HTML that describes how select should render items when the select is open -->
            <v-row class="ma-0 pa-0" align="center">
                {{ data.item.text + ' (' + data.item.value.toUpperCase() + ')' }}
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="accent-45-s" v-bind="attrs" v-on="on" class="ml-1"
                            v-if="!localeIsComplete(data.item.value)">
                            mdi-alert-circle
                        </v-icon>
                    </template>
                    <span>{{ $t('locale.incomplete.' + data.item.value) }}</span>
                </v-tooltip>
            </v-row>
        </template>
    </v-select>
</template>

<script>
import { supported_locales, incomplete_locales } from '@/i18n.js';
export default {
    name: 'LanguageSelector',
    props: {
        dark: Boolean,
        light: Boolean,
        fullWidth: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            languages: [
                { text: 'English', value: "en" },
                { text: 'Español', value: "es" },
                { text: 'Français', value: "fr" },
            ],
            language: this.$i18n.locale
        }
    },
    async mounted() {
        this.verifyLocale()
    },
    computed: {
        getEnabledLanguages() {
            let r = []
            this.languages.forEach(locale => {
                if (supported_locales.includes(locale.value))
                    r.push(locale)
            })
            return r
        },
        breakpointXS() {
            if (this.$vuetify.breakpoint.xs)
                return true
            else
                return false
        },
        breakpointSM() {
            if (this.$vuetify.breakpoint.sm)
                return true
            else
                return false
        },
    },
    methods: {
        localeIsComplete(locale) {
            return !incomplete_locales.includes(locale)
        },
        async verifyLocale() {
            let setLang = localStorage.getItem('lang.locale')
            if (setLang == undefined || setLang == null) {
                let browserlang = navigator.language.toLowerCase()
                let locale_set = false
                supported_locales.forEach(lang => {
                    if (browserlang.includes(lang.value)) {
                        this.$i18n.locale = lang.value
                        locale_set = true
                    }
                })
                if (!locale_set)
                    this.$i18n.locale = "en"
                this.language = this.$i18n.locale
                console.log("Using locale: " + this.language);
                localStorage.setItem('lang.locale', this.$i18n.locale)
            }
            else {
                this.language = setLang
                this.$i18n.locale = setLang
            }
        },
        changeLanguage: function () {
            this.$i18n.locale = this.language
            localStorage.setItem('lang.locale', this.language)
            this.$emit('updateTabSliders');
            const html = document.documentElement
            html.setAttribute('lang', this.$i18n.locale)
        },
    }
}
</script>

<style>
.v-select:not(.v-autocomplete) .v-select__slot input {
    visibility: hidden
}
</style>