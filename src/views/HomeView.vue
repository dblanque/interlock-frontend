<template>
  <div class="home">
    <!------------------>
    <v-row justify="center"
      :class="'ma-0 pa-2 py-4 text-normal ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
    >
      <h1>{{ domain.toUpperCase() + " | " + realm.toUpperCase() }}</h1>
    </v-row>
    <v-row 
      :dense="!breakpointXS && !breakpointSM"
      :dark="!isThemeDark()" :light="isThemeDark()" 
      :class="'ma-0 pa-2 ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
      style="height: fit-content;">
        <v-col cols="12" md="auto">
          <LanguageSelector :dark="!isThemeDark()" :light="isThemeDark()" class="" @updateTabSliders="refreshNavTabs"/>
        </v-col>
        <v-spacer v-if="this.$vuetify.breakpoint.mdAndUp"/>
        <v-col class="ma-0 pa-0 my-3" v-if="!this.$vuetify.breakpoint.mdAndUp">
          <span class="text-normal">
            Lastname, Firstname | USERNAME
          </span>
        </v-col>
        <v-col class="ma-0 pa-0" cols="12" md="auto">
          <div class="mt-2">
            <span class="text-normal" v-if="this.$vuetify.breakpoint.mdAndUp">
              Lastname, Firstname | USERNAME
            </span>
            <v-btn :dark="!isThemeDark()" :light="isThemeDark()" @click="openLogoutDialog" icon class="mx-2">
              <v-icon>
                mdi-logout
              </v-icon>
            </v-btn>
            <ThemeChanger :dark="!isThemeDark()" :light="isThemeDark()" :buttonIsSmall="true"/>
          </div>
        </v-col>
      </v-row>
    
    <!-- Tabs Bar -->
    <v-toolbar v-if="this.$vuetify.breakpoint.mdAndUp" :dense="!breakpointXS && !breakpointSM" id="tabs-nav-bar" :dark="!isThemeDark()" :light="isThemeDark()" 
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

    <v-tabs-items v-model="active_tab" class="transparent-body">
      <v-tab-item
         v-for="tab in navTabs"
         :key="tab.index">
         <ModularViewContainer :viewTitle="tab.title" :viewIndex="tab.index"/>
      </v-tab-item>
    </v-tabs-items>

    <v-dialog v-model="showLogoutDialog">
      <v-card>
        <v-card-title>
          Logout
        </v-card-title>
        <v-card-actions>
          <v-row class="ma-1 pa-0" justify="center">
            <v-btn @click="logoutAction">Yes</v-btn>
            <v-btn @click="showLogoutDialog = false">No</v-btn>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!------------------>
    <v-row id="home-footer-buttons" justify="end" class="pa-0 ma-0">
      <v-btn small text class="mx-2">{{$t('footer.about')}}</v-btn>
      <!-- <v-btn small text class="mx-2">DONATE</v-btn> -->
    </v-row>
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
import LocalSettings from '@/providers/interlock_backend/local_settings'
import ModularViewContainer from '@/components/ModularViewContainer.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'

export default {
  name: 'HomeView',
  components: {
    ModularViewContainer,
    LanguageSelector,
    ThemeChanger
  },
  data () {
    return {
      domain: LocalSettings.domain,
      realm: LocalSettings.realm,
      snackbarMessage: "",
      snackbarIcon: "",
      snackbarColor: "",
      snackbarClasses: "",
      snackbar: false,
      showLogoutDialog: false,
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
    openLogoutDialog(){
      this.showLogoutDialog = true;
    },
    logoutAction(){
      // TODO - Add logout stuff here
      this.$router.push('/login')
    },
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

#home-footer-buttons{
  min-width: 100%;
  position: fixed;
  bottom: 2.5rem;
  z-index: 2;
}

.transparent-body{
  background: transparent !important;
}
</style>
