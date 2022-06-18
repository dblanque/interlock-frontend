<template>
  <div class="home">
    <!------------------>
    <v-toolbar 
      :dense="!breakpointXS && !breakpointSM"
      :dark="!isThemeDark()" :light="isThemeDark()" 
      :class="'ma-0 pa-2 ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
      style="height: fit-content;">
      <v-row class="" justify="space-between">
        <LanguageSelector class="" @updateTabSliders="refreshNavTabs"/>
        <div class="mt-2">
          <span>
            Lastname, Firstname | USERNAME
          </span>
          <v-btn icon class="mx-2">
            <v-icon>
              mdi-logout
            </v-icon>
          </v-btn>
          <ThemeChanger :buttonIsSmall="true"/>
        </div>
      </v-row>
    </v-toolbar>
    
    <!-- Tabs Bar -->
    <v-toolbar :dense="!breakpointXS && !breakpointSM" id="tabs-nav-bar" :dark="!isThemeDark()" :light="isThemeDark()" 
    :class="' ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
        <v-fade-transition>
        <v-tabs 
            v-model="active_tab"
            v-if="showNavTabs"
            color="primary" 
            slider-size="4"
            center-active
            centered
            show-arrows>
                <v-tab class="px-4" v-for="tab in navTabs" :key="tab.index" @click="updateSelectedTab(tab.index)" :disabled="!tab.enabled">
                <v-icon class="hidden-md-and-down mr-2">{{ tab.icon }}</v-icon>
                <span v-if="breakpointXS && tab.enableShortName == true">
                    {{ $t(tab.title + "_short") }}
                </span>
                <span v-else>
                    {{ $t(tab.title) }}
                </span>
            </v-tab>
        </v-tabs>
        </v-fade-transition>
    </v-toolbar>

    <v-tabs-items v-model="active_tab">
      <v-tab-item
         v-for="tab in navTabs"
         :key="tab.index">
         <UsersView v-if="tab.title == 'category.users'"/>
      </v-tab-item>
    </v-tabs-items>

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
import UsersView from '@/components/UsersView.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'

export default {
  name: 'HomeView',
  components: {
    UsersView,
    LanguageSelector,
    ThemeChanger
  },
  data () {
    return {
      snackbarMessage: "",
      snackbarIcon: "",
      snackbarColor: "",
      snackbarClasses: "",
      snackbar: false,
      selectedTab: 0,
      showNavTabs: false,
      active_tab: 0,
      navTabs: [
        {
          index: 0,
          title: "category.home",
          enabled: true,
          icon: "mdi-home",
          route: "home"
        },
        {
          index: 1,
          title: "category.users",
          enabled: true,
          icon: "mdi-account",
          route: "users"
        },
        {
          index: 2,
          title: "category.dns",
          enabled: true,
          enableShortName: true,
          icon: "mdi-dns",
          route: "dns"
        },
        {
          index: 3,
          title: "category.gpo",
          enabled: true,
          enableShortName: true,
          icon: "mdi-google-circles-extended",
          route: "gpo"
        },
        {
          index: 4,
          title: "category.server",
          enabled: true,
          icon: "mdi-server",
          route: "server"
        }
      ],
    }
  },
  mounted: function(){
    var currentPath = this.$route.path
    if (currentPath && currentPath.length > 0) {
      this.navTabs.forEach(item => {
        if ('/' + item.route == this.$route.path) {
          this.selectedTab = item.index;
          this.active_tab = item.index;
        }
      });
    }
    setTimeout(() => {  this.showNavTabs = true; }, 250);
    this.active_tab = this.selectedTab;
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
    refreshNavTabs(){
      this.showNavTabs = false
      setTimeout(() => {  this.showNavTabs = true; }, 250);
    },
    updateSelectedTab(index) {
      if (this.selectedTab != index)
        this.displayBody = false
        this.selectedTab = index
        var routeToPush = ''
        this.navTabs.forEach(item => {
          if (item.index == index) {
            if (item.route.length > 0) {
              routeToPush = item.route
            } else {
              routeToPush = ''
            }
          }
        });
        if (this.$route.path != '/' + routeToPush) {
          this.$router.push('/' + routeToPush)
        }
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
