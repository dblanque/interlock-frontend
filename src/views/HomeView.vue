<template>
  <div class="home">
    <!------------------>
    <NavTabs class="" 
    :selectedTab="selectedTab" 
    @updateTab="updateSelectedTab"
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

export default {
  name: 'HomeView',
  components: {
    NavTabs
  },
  methods: {
    isThemeDark(){
        if (this.$vuetify.theme.dark == true) {
          return true
        }
        return false
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
        if (this.selectedTab == 0) {
          this.loadHeroImage()
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
