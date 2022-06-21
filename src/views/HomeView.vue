<template>
  <div class="home">
    <!------------------>
    <v-row justify="center"
      :class="'ma-0 pa-2 py-4 text-normal ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
    >
      <h2 class="font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row 
      :dense="!breakpointXS && !breakpointSM"
      :dark="!isThemeDark()" :light="isThemeDark()" 
      :class="'ma-0 pa-2 ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
      style="height: fit-content;">
        <v-col cols="12" md="auto">
          <LanguageSelector :dark="!isThemeDark()" :light="isThemeDark()" class="" @updateTabSliders="refreshNavTabs"/>
        </v-col>
        <v-divider light class="ma-6" v-if="this.$vuetify.breakpoint.mdAndUp"/>
        <v-col class="ma-0 pa-0 my-3" v-if="!this.$vuetify.breakpoint.mdAndUp">
          <span class="text-normal" v-if="last_name && last_name != '' && first_name && first_name != ''">
            {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username }}
          </span>
          <span class="text-normal" v-else>
            {{ realm.toUpperCase() + '@' + username }}
          </span>
        </v-col>
        <v-col class="ma-0 pa-0" cols="12" md="auto">
          <div class="mt-2">
            <span class="text-normal" v-if="this.$vuetify.breakpoint.mdAndUp">
              <span class="text-normal" v-if="last_name && last_name != '' && first_name && first_name != ''">
                {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username }}
              </span>
              <span class="text-normal" v-else>
                {{ realm.toUpperCase() + '@' + username }}
              </span>
            </span>
            <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :dark="!isThemeDark()" :light="isThemeDark()"
                @click="logoutAction"
                icon
                class="mx-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>
                  mdi-logout
                </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("misc.logoutTooltip") }}</span>
            </v-tooltip>
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
                <span v-if="breakpointMD && tab.enableShortName == true">
                    {{ $t("category." + tab.title + "_short") }}
                </span>
                <span v-else>
                    {{ $t("category." + tab.title) }}
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

    <!-- LOGOUT DIALOG  -->
    <v-dialog persistent content-class="rounded-dialog" max-width="40rem" v-model="showLogoutDialog">
      <v-card class="pa-6">
        <v-card-title>
          <v-row justify="center">
            {{ $t('misc.logoutForbiddenMsg') }}
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-icon class="mt-4" large>mdi-emoticon-sad</v-icon>
        </v-card-text>
        <v-card-actions class="">
          <v-row class="ma-1 pa-0" justify="center">
            <v-btn class="ma-2 clr-valid" rounded @click="logoutAction">{{ $t('actions.back') }}</v-btn>
            <!-- <v-btn class="ma-2 clr-error" rounded @click="showLogoutDialog = false">{{ $t('actions.no') }}</v-btn> -->
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!----- ABOUT AND DONATE BUTTONS ------>
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
import ModularViewContainer from '@/components/ModularViewContainer.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'
import User from '@/include/User'
import Domain from '@/include/Domain'

export default {
  name: 'HomeView',
  components: {
    ModularViewContainer,
    LanguageSelector,
    ThemeChanger
  },
  data () {
    return {
      username: "",
      first_name: "",
      last_name: "",
      domain: "",
      realm: "",
      snackbarMessage: "",
      snackbarIcon: "",
      snackbarColor: "",
      snackbarClasses: "",
      snackbar: false,
      showLogoutDialog: false,
      selectedTab: 0,
      showNavTabs: false,
      active_tab: 0,
      timeoutInMS: 3600000,
      timeoutId: 0,
      navTabs: [
        {
          index: 0,
          title: "home",
          enabled: true,
          icon: "mdi-home",
          route: "home"
        },
        {
          index: 1,
          title: "users",
          enabled: true,
          icon: "mdi-account",
          route: "users"
        },
        {
          index: 2,
          title: "groups",
          enabled: true,
          icon: "mdi-group",
          route: "groups"
        },
        {
          index: 3,
          title: "dns",
          enabled: true,
          enableShortName: true,
          icon: "mdi-dns",
          route: "dns"
        },
        {
          index: 4,
          title: "gpo",
          enabled: true,
          enableShortName: true,
          icon: "mdi-google-circles-extended",
          route: "gpo"
        },
        {
          index: 5,
          title: "server",
          enabled: true,
          icon: "mdi-server",
          route: "server"
        }
      ],
    }
  },
  async created() {
    await new User({}).getCurrentUserData().then(response => {
      var responseStatus = response.status
      // var token = localStorage.getItem('token')
      response = response.data

      // If response code is valid
      if (/^20[0-8]|226/.test(responseStatus)) {
        this.username = localStorage.getItem('username')
        this.first_name = localStorage.getItem('first_name')
        this.last_name = localStorage.getItem('last_name')
      } 
      // If response code is an HTTP error code
      else {
        localStorage.removeItem('username')
        localStorage.removeItem('first_name')
        localStorage.removeItem('last_name')
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        this.showLogoutDialog = true;
      }
    })

    await new Domain({}).getDetails().then(response => {
      this.domain = response.data.details.name
      this.realm = response.data.details.realm
      localStorage.setItem('domain',this.name)
      localStorage.setItem('realm',this.realm)
    })
    
    this.setupTimers();
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
      new User({}).logout()
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
    },
    handleInactive() {
      this.openLogoutDialog();
    },
    startTimer() { 
        // setTimeout returns an ID (can be used to start or clear a timer)
        this.timeoutId = setTimeout(this.handleInactive, this.timeoutInMS);
    },
    resetTimer() { 
        clearTimeout(this.timeoutId);
        this.startTimer();
    },
    setupTimers () {
        document.addEventListener("keypress", this.resetTimer, false);
        document.addEventListener("mousemove", this.resetTimer, false);
        document.addEventListener("mousedown", this.resetTimer, false);
        document.addEventListener("touchmove", this.resetTimer, false);
        
        this.startTimer();
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

.rounded-dialog{
  border-radius: 40px !important;
}

</style>
