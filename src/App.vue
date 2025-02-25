<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: App.vue ------------------------------------->
<template>
  <v-app id="app">
    <title>{{ $t("indexTitle") }}</title>
    <router-view/>
  </v-app>
</template>

<script>
import semver from 'semver';
import { supported_locales } from '@/i18n.js';

export default {
  name: 'App',
  mounted() {
    const html = document.documentElement
    html.setAttribute('lang', this.$i18n.locale)
    setTimeout(()=>{
      this.verifyLocale()
    }, 1)
    // Version based localStorage Cleanup
    if (!localStorage.getItem('interlock.version')) {
      console.error("No Interlock version found, clearing old localStorage Variables.")
      localStorage.clear()
    }
    else {
      this.localStorageSemverCleanup()
    }
  },
  methods:{
    async verifyLocale() {
        let setLang = localStorage.getItem('lang.locale')
        if(setLang == undefined || setLang == null){
            let browserlang = navigator.language.toLowerCase()
            let locale_set = false
            supported_locales.forEach(lang => {
                console.log(lang)
                if(browserlang.includes(lang.value)) {
                    this.$i18n.locale = lang.value
                    locale_set = true
                }
            })
            if(!locale_set)
                this.$i18n.locale = "en"
            localStorage.setItem('lang.locale', this.$i18n.locale)
        }
        else this.$i18n.locale = setLang
    },
    localStorageSemverCleanup(){
      const i7kVersion = semver.clean(localStorage.getItem('interlock.version'))
      const versions = {
        "0.94.1":[
          "auth.access_token_lifetime",
          "auth.refresh_token_lifetime",
          "user.access_token_lifetime",
          "user.refresh_token_lifetime",
        ]
      }
      for (const v in versions) {
        if ( !i7kVersion || semver.gte(i7kVersion, semver.clean(v)) )
          versions[v].forEach(deprecated_key => {
            localStorage.removeItem(deprecated_key)
          });
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  font-family: Montserrat !important; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: var(--v-gray-90-base);
  // background-color: var(--body-bg);
  transition: background-color var(--base-transition-speed-5);
}

// [theme=light] #app {
//   color: #2f353b;
// }

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
