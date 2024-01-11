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
export default {
  name: 'App',
  mounted () {
    const html = document.documentElement
    html.setAttribute('lang', this.$i18n.locale)
  },
}
</script>

<style lang="scss">
#app {
  font-family: Montserrat !important; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--body-bg);
  transition: background-color var(--base-transition-speed);
}

[theme=light] #app {
  color: #2f353b;
}

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
