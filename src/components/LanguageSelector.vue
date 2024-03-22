<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: LanguageSelector.vue -------------------------->
<template>
    <v-select
    append-icon="mdi-earth"
    :dark="dark"
    :light="light"
    :items="getEnabledLanguages"
    v-model="language"
    @input="changeLanguage()"
    :hide-details="true"
    outlined
    dense
    :style="fullWidth || this.$vuetify.breakpoint.smAndDown ? '' : 'max-width: 25ch;'"
    >
    <template slot="selection" slot-scope="data">
        <!-- HTML that describe how select should render selected items -->

        <span>
            {{ data.item.text + ' (' + data.item.value.toUpperCase() + ')' }}
        </span>
        <!-- <span v-else>
            {{ data.item.value.toUpperCase() }}
        </span> -->
    </template>
    <template slot="item" slot-scope="data">
        <!-- HTML that describe how select should render items when the select is open -->
        <span>
            {{ data.item.text + ' (' + data.item.value.toUpperCase() + ')' }}
        </span>
        <!-- <span v-else>
            {{ data.item.value.toUpperCase() }}
        </span> -->
    </template>
    </v-select>
</template>

<script>
import { supported_locales } from '@/i18n.js';
export default {
    name: 'LanguageSelector',
    props:{
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
                {text: 'English', value:"en"},
                {text: 'Español', value:"es"},
                {text: 'Français', value:"fr"},
            ],
            language: this.$i18n.locale
        }
    },
    async mounted() {
        this.verifyLocale()
    },
    computed:{
        getEnabledLanguages(){
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
        async verifyLocale() {
            let setLang = localStorage.getItem('lang.locale')
            if(setLang == undefined || setLang == null){
                let browserlang = navigator.language.toLowerCase()
                let locale_set = false
                supported_locales.forEach(lang => {
                    if(browserlang.includes(lang.value)) {
                        this.$i18n.locale = lang.value
                        locale_set = true
                    }
                })
                if(!locale_set)
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
        changeLanguage: function(){
            this.$i18n.locale = this.language
            localStorage.setItem('lang.locale', this.language)
            this.$emit('updateTabSliders');
            const html = document.documentElement
            html.setAttribute('lang', this.$i18n.locale)
        },
    }
}
</script>