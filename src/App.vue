<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: App.vue ------------------------------------->
<template>
  <v-app id="app">
    <title>{{ $t("indexTitle") }}</title>
    <!-- <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/login">Login</router-link>
    </nav> -->
    <router-view/>
  </v-app>
</template>

<script>
export default {
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

// #app {
//   font-family: Avenir, Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
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
