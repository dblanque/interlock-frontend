<template>
    <v-select
    append-icon="mdi-earth"
    :items="languages"
    v-model="language"
    @input="changeLanguage()"
    :hide-details="true"
    outlined
    dense
    :style="breakpointSM || breakpointXS ? '' : 'max-width: 25ch;'"
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
export default {
    data() {
        return {
            languages: [
                {text: 'English', value:"en"},
                {text: 'Español', value:"es"},
            ],
            language: this.$i18n.locale,
            themes: [
                {text: this.$t("themeToggle.dark"), value:"dark"},
                {text: this.$t("themeToggle.light"), value:"light"}
            ],
        }
    },
    async created() {
        this.verifyLocale()
    },
    computed:{
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
            var setLang = localStorage.getItem('locale')
            if(setLang == undefined || setLang == null){
            var browserlang = navigator.language.toLowerCase()
            if(browserlang.includes('es'))
                this.$i18n.locale = 'es'
            else{
                this.$i18n.locale = 'en'
            }
            this.language = this.$i18n.locale
            console.log(this.language);
            localStorage.setItem('locale', this.$i18n.locale)
            }
            else {
            this.language = setLang
            this.$i18n.locale = setLang
            }
        },
        changeLanguage: function(){
            this.$i18n.locale = this.language
            localStorage.setItem('locale', this.language)
            this.$emit('updateTabSliders');
        },
    }
}
</script>