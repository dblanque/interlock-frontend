<template>
  <div class="home">
    <!------------------>
    <v-toolbar 
      :dense="!breakpointXS && !breakpointSM"
      :dark="!isThemeDark()" :light="isThemeDark()" 
      :class="'py-2 ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
      <v-row justify="space-between">
        <LanguageSelector @updateTabSliders="refreshNavTabs"/>
        <ThemeChanger/>
      </v-row>
    </v-toolbar>
    <NavTabs
    :selectedTab="selectedTab" 
    @updateTab="updateSelectedTab"
    ref="NavTabs"
    />

    <!------------------>
    <v-footer padless id="home-footer" :dark="!isThemeDark()" :light="isThemeDark()" class="py-1">
      <v-divider class="mx-4"></v-divider>
      <span :class="'mx-4 ' + (breakpointXS || breakpointSM ? '' : 'text-caption')">
        {{ $t("footer.copyright") }}
      </span>
      <v-divider class="mx-4"></v-divider>
    </v-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import NavTabs from '@/components/NavTabs.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'

export default {
  name: 'HomeView',
  data () {
    return {
      snackbarMessage: "",
      snackbarIcon: "",
      snackbarColor: "",
      snackbarClasses: "",
      snackbar: false,
      selectedTab: 0
    }
  },
  components: {
    NavTabs,
    LanguageSelector,
    ThemeChanger
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
    breakpointMD() {
        if (this.$vuetify.breakpoint.md)
            return true
        else
            return false
    },
    breakpointLG() {
        if (this.$vuetify.breakpoint.lg)
            return true
        else
            return false
    },
    breakpointXL() {
        if (this.$vuetify.breakpoint.xl)
            return true
        else
            return false
    },
  },
  methods: {
    isThemeDark(){
        if (this.$vuetify.theme.dark == true) {
          return true
        }
        return false
    },
    refreshNavTabs() {
      this.$refs.NavTabs.updateTabSliders();
    },
    updateSelectedTab(e) {
      if (this.selectedTab != e)
        this.displayBody = false
        this.selectedTab = e
        var routeToPush = ''
        switch (e) {
          case 1:
            routeToPush = 'users'
            break;
          case 2:
            routeToPush = 'dns'
            break;
          case 3:
            routeToPush = 'gpo'
            break;
          case 4:
            routeToPush = 'server'
            break;
          default:
            routeToPush = 'home'
            break;
        }
        console.log(this.$route.path)
        if (this.$route.path != '/' + routeToPush) {
          this.$router.push('/' + routeToPush)
        }
        setTimeout(() => {  this.displayBody = true }, 500);
    }
  }
}
</script>

<style>
#home-footer{
  min-width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 2;
}
</style>
