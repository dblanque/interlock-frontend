<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: HomeView.vue -------------------------------->
<template>
  <div class="home">
    <!------------------>
    <v-row align="center"
      justify="space-between"
      style="background: var(--v-secondary-10-base)"
      class="ma-0 pa-0 px-4 transition-speed-fix">
      <v-img
        max-width="30ch"
        max-height="5em"
        class="my-3"
        contain
        :aspect-ratio="32/9"
        :src="!isThemeDark($vuetify) ? logoLight : logoDark"/>
      <h2 style="color: var(--v-text-background-base)" class="ma-2 my-4 font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      align="center"
      justify="space-between"
      class="ma-0 pa-2 transition-speed-fix"
      style="background: var(--v-secondary-10-base); height: fit-content">
      <v-col cols="12" md="auto">
        <LanguageSelector
          :dark="!isThemeDark($vuetify)"
          :light="isThemeDark($vuetify)"
          class=""
          @updateTabSliders="refreshOnLanguageChange"
        />
      </v-col>
      <v-divider style="border-color: var(--v-primary-base)" class="ma-6" v-if="this.$vuetify.breakpoint.lgAndUp" />
      <v-col
        class="ma-0 pa-0 my-3"
        v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
        <span style="color: var(--v-white-d-base)"
          v-if="last_name && last_name != '' && first_name && first_name != ''">
          {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + "@" + username }}
        </span>
        <span v-else>
          {{ realm.toUpperCase() + "@" + username }}
        </span>
      </v-col>
      <v-col class="ma-0 pa-0" cols="12" md="auto">
        <div class="mt-2 mr-4">
          <UserAccountDropdown 
            extra-classes="mr-3 px-2"
            icon="mdi-account-cog"
            color="primary"
            show-preferences-menu
            @logout="logoutAction"
            @openSettings="openSettings"
            :username="activeUserName"/>
          <ThemeChanger
            :dark="!isThemeDark($vuetify)"
            :light="isThemeDark($vuetify)"
            :buttonIsSmall="true"
          />
          <!-- Remove this in production -->
          <v-btn @click="debugAction" v-if="false"
           outlined class="mx-3" rounded color="red">
            Debug
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Tabs Bar -->
    <v-toolbar
      color="secondary-10"
      v-if="this.$vuetify.breakpoint.mdAndUp"
      dense
      id="tabs-nav-bar"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      style="z-index: 1"
      :class="'sticky-top transition-speed-fix'">
      <v-fade-transition>
        <v-tabs
          v-model="active_tab"
          v-if="showNavTabs"
          color="primary"
          slider-size="4"
          center-active
          centered
          show-arrows
        >
          <v-tab
            class="px-4"
            v-for="tab in getVisibleTabs"
            :key="tab.index"
            @click="updateSelectedTab(tab.index)"
            :disabled="!tab.enabled"
          >
            <v-icon class="hidden-md-and-down mr-2">{{ tab.icon }}</v-icon>
            <span v-if="$vuetify.breakpoint.lg && tab.enableShortName == true">
              {{ $t("category." + tab.title + "_short") }}
            </span>
            <span v-else>
              {{ $t("category." + tab.title) }}
            </span>
          </v-tab>
        </v-tabs>
      </v-fade-transition>
    </v-toolbar>

    <!-- Mobile Nav -->
    <v-toolbar
      v-else
      dense
      id="tabs-nav-bar"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      style="z-index: 1"
      :class="'sticky-top ' +
        (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
    >
      <v-row justify="space-between" :class="$vuetify.breakpoint.xs ? 'mx-0':'mx-12'" align="center">
        <v-btn
          text
          color="primary"
          @click="goToPrevTab"
          :disabled="active_tab == 0">
          <v-icon> mdi-chevron-double-left </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">
            {{ $t("actions.back_short") }}
          </span>
        </v-btn>
        <span>
          <span
            v-if="getVisibleTabs[active_tab].enableShortName == true"
            color="primary"
            class="font-weight-medium">
            {{ $t("category." + getVisibleTabs[active_tab].title + "_short").toUpperCase() }}
          </span>
          <span v-else color="primary" class="font-weight-medium">
            {{ $t("category." + getVisibleTabs[active_tab].title).toUpperCase() }}
          </span>
        </span>
        <v-btn
          text
          color="primary"
          @click="goToNextTab"
          :disabled="active_tab == getVisibleTabs.length - 1">
          <span v-if="$vuetify.breakpoint.smAndUp">
            {{ $t("actions.next") }}
          </span>
          <v-icon> mdi-chevron-double-right </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>

    <v-tabs-items v-model="active_tab" class="transparent-body">
      <v-tab-item v-for="tab in getVisibleTabs" :key="tab.index">
        <ModularViewContainer
          :initLoad="initLoad"
          :viewTitle="tab.title"
          :viewIndex="tab.index"
          ref="ModularViewContainerRef"
          @refresh="setDomainDetails()"
          @goToUser="goToUser"
          @goToGroup="goToGroup"
          :langChanged="langChanged"
          :requestRefresh="requestRefresh"
        />
      </v-tab-item>
    </v-tabs-items>

    <!-- SNACKBAR / NOTIF. BUS -->
    <NotificationBusContainer/>

    <!-- ABOUT DIALOG  -->
    <v-dialog
      max-width="48rem"
      v-model="showAboutDialog">
        <AboutDialog @close='closeAbout'/>
    </v-dialog>

    <!-- SETTINGS DIALOG  -->
    <v-dialog
      max-width="48rem"
      v-model="showSettingsDialog">
        <UserSettings
        ref="UserSettings"
        :username="username"
        :first-name="first_name"
        :last-name="last_name"
        admin-mode
        :domain="domain"
        :realm="realm"
        @close='showSettingsDialog = !showSettingsDialog'/>
    </v-dialog>
  
    <!-- LOGOUT DIALOG  -->
    <v-dialog
      persistent
      content-class=""
      max-width="40rem"
      v-model="showLogoutDialog">
        <LogoutDialog
        @logoutAction="logoutAction(true)"/>
    </v-dialog>

    <!-- REFRESH TOKEN DIALOG  -->
    <v-dialog
      persistent
      eager
      content-class=""
      max-width="40rem"
      v-model="showRefreshTokenDialog">
        <RefreshTokenDialog 
          ref="RefreshTokenDialog"
          :countdown="showRefreshTokenDialog"
          @closeDialog="closeRefreshDialog"
          @logoutAction="logoutAction()"/>
    </v-dialog>

    <!----- ABOUT AND DONATE BUTTONS ------>
    <!-- <v-row id="home-footer-buttons" justify="end" align="center" class="pa-0 ma-0 px-2 mb-2">
    </v-row> -->

    <!-- Footer -->
    <v-footer
      padless
      id="home-footer"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      class="py-1"
    >
      <v-row align="center"
        justify="center"
        :class="'mx-4 my-1 ' + ($vuetify.breakpoint.mdAndDown ? '' : 'text-caption')">
        <!-- <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"/> -->
        {{ $t("footer.copyright") }}
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
        <!-- Donate -->
        <v-btn color="primary"
          small
          id="donateBtn"
          outlined
          href="https://www.paypal.com/donate/?hosted_button_id=FFR7CG7X477NL"
          target="_blank"
          :dark="isThemeDark($vuetify)" 
          :light="!isThemeDark($vuetify)" 
          class="mx-2 mr-1 px-3">
          <v-icon class="mr-1">
            mdi-heart-outline
          </v-icon>
          {{ $t("footer.donate") }}
        </v-btn>

        <!-- About -->
        <v-tooltip top color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="showAboutDialog = true" 
              small 
              class="ma-0 mx-2"
              color="primary"
              v-bind="attrs"
              v-on="on"
              icon
            >
              <v-icon>
                mdi-information
              </v-icon>
            </v-btn>
          </template>
          <span>{{ $t("footer.about").toUpperCase() }}</span>
        </v-tooltip>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import ModularViewContainer from "@/components/ModularViewContainer.vue"
import LanguageSelector from "@/components/LanguageSelector.vue"
import UserAccountDropdown from "@/components/User/UserAccountDropdown.vue"
import UserSettings from "@/components/User/UserSettings.vue"
import ThemeChanger from "@/components/ThemeChanger.vue"
import LogoutDialog from "@/components/LogoutDialog.vue"
import RefreshTokenDialog from "@/components/RefreshTokenDialog.vue"
import AboutDialog from "@/components/AboutDialog.vue"
import User from "@/include/User"
import Test from "@/include/Test"
import Domain from "@/include/Domain"
import NotificationBusContainer from '@/components/NotificationBusContainer.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import { getDomainDetails } from '@/include/utils.js';

export default {
  name: "HomeView",
  mixins: [ validationMixin, utilsMixin ],
  components: {
    ModularViewContainer,
    LanguageSelector,
    UserAccountDropdown,
    UserSettings,
    LogoutDialog,
    RefreshTokenDialog,
    ThemeChanger,
    NotificationBusContainer,
    AboutDialog
  },
  data() {
    return {
      logoLight: 'logo/interlock-logo-wt-dark.svg',
      logoDark: 'logo/interlock-logo-wt-light.svg',
      username: "",
      first_name: "",
      initLoad: false,
      last_name: "",
      email: "",
      domain: "",
      realm: "",
      basedn: "",
      error: false,
      showAboutDialog: false,
      showLogoutDialog: false,
      showRefreshTokenDialog: false,
      showSettingsDialog: false,
      requestRefresh: "",
      selectedTab: 0,
      selectedTabTitle: "",
      showNavTabs: false,
      langChanged: false,
      active_tab: 0,
      tableData: {
        headers: [],
        items: [],
      },
      timeoutId: 0,
      navTabs: [
        {
          index: 0,
          title: "home",
          enabled: true,
          icon: "mdi-home",
          route: "home",
        },
        {
          index: 1,
          title: "users",
          enabled: true,
          icon: "mdi-account",
          route: "users",
        },
        {
          index: 2,
          title: "groups",
          enabled: true,
          icon: "mdi-google-circles-communities",
          route: "groups",
        },
        {
          index: 3,
          title: "dns",
          enabled: true,
          enableShortName: true,
          icon: "mdi-dns",
          route: "dns",
        },
        {
          index: 4,
          title: "gpo",
          enabled: false,
          hidden: false,
          enableShortName: true,
          icon: "mdi-google-circles-extended",
          route: "gpo",
        },
        {
          index: 5,
          title: "settings",
          enabled: true,
          icon: "mdi-cog",
          route: "settings",
        },
        {
          index: 6,
          title: "logs",
          enabled: true,
          icon: "mdi-flag-outline",
          route: "logs",
        },
        {
          index: 7,
          title: "debug",
          enabled: false,
          hidden: true,
          icon: "mdi-xml",
          route: "debug",
        },
      ],
    };
  },
  async created() {
    await new User({}).getCurrentUserData().then((response) => {
      let responseStatus = response.status;
      let admin_allowed = (localStorage.getItem('user.admin_allowed') === 'true')
      response = response.data;

      // If response code is valid
      if (/^20[0-8]|226/.test(responseStatus)) {
        this.username = localStorage.getItem("user.username");
        this.first_name = localStorage.getItem("user.first_name");
        this.last_name = localStorage.getItem("user.last_name");
        this.email = localStorage.getItem("user.email");
        this.access_token_lifetime = localStorage.getItem("auth.access_token_lifetime");
        this.refresh_token_lifetime = localStorage.getItem("auth.refresh_token_lifetime");

        new Domain({}).getDetails().then(() => {
            let domainData = getDomainDetails()
            this.domain = domainData['name']
            this.realm = domainData['realm']
            this.basedn = domainData['basedn']
        })
      }
      // If response code is an HTTP error code
      else {
        this.logoutAction();
        this.showLogoutDialog = true;
      }

      if (!admin_allowed || admin_allowed == false){
        this.logoutAction();
        this.showLogoutDialog = true;
      }
    });

    this.setupTimers();
  },
  async mounted() {
    let currentPath = this.$route.path;
    if (currentPath && currentPath.length > 0) {
      let validRoute = this.navTabs.filter(item => "/" + item.route == currentPath && item.enabled == true)[0]
      if (validRoute) {
        this.selectedTab = validRoute.index;
        this.active_tab = validRoute.index;
      } else {
        this.$router.push("/home")
      }
    }
    setTimeout(() => {
      this.showNavTabs = true;
    }, 250);
    getDomainDetails()
    if (this.domain == "example.com") {
      this.updateSelectedTab(5)
    }
    this.active_tab = this.selectedTab;
    if (this.selectedTab == 0)
      this.initLoad = true
    this.selectedTabTitle = this.navTabs[this.selectedTab].title;
    // ! This refresh is redundant, commented it just in case
    // this.requestRefresh = this.selectedTabTitle
  },
  computed: {
    getVisibleTabs(){
      return this.navTabs.filter(x => !x.hidden)
    },
    breakpointName() {
      return this.$vuetify.breakpoint.name;
    },
    activeUserName() {
        if(	this.last_name && this.last_name.length > 0 &&
            this.first_name && this.first_name.length > 0)
            return this.last_name + ", " + this.first_name + " | " + this.username
            // return this.last_name + ", " + this.first_name + " | " + this.realm.toUpperCase() + "@" + this.username
        return this.realm.toUpperCase() + "@" + this.username
    }
  },
  watch: {
    breakpointName() {
      this.showNavTabs = false;
      setTimeout(() => {
        this.showNavTabs = true;
      }, 250);
    },
  },
  methods: {
    ////////////////////////////////////////////////////////////////////////////
    // General Component Methods
    ////////////////////////////////////////////////////////////////////////////
    openSettings(){
      this.showSettingsDialog = true
      if (this.$refs.UserSettings)
        this.$refs.UserSettings.loadSettings()
    },
    closeAbout(){
      this.showAboutDialog = false
    },
    closeRefreshDialog(){
      this.showRefreshTokenDialog = false
      this.resetTimer()
    },
    goToPrevTab(){
      let counter = this.selectedTab - 1
      this.navTabs.forEach(() => {
        if (this.navTabs[counter].enabled)
          return this.updateSelectedTab(counter)
        else {
          counter -= 1
        }
      });
    },
    goToNextTab(){
      let counter = this.selectedTab + 1
      this.navTabs.forEach(() => {
        if (this.navTabs[counter].enabled)
          return this.updateSelectedTab(counter)
        else {
          counter += 1
        }
      });
    },
    async goToUser(user) {
      // Don't remove this await or the first time the ModularViewContainer
      // mounts it'll break
      await this.updateSelectedTab(1); // Index for Users Tab is 1
      
      this.$refs.ModularViewContainerRef.forEach(refObj => {
        if (Object.hasOwnProperty.call(refObj.$refs, 'UserView'))
          refObj.$refs.UserView.fetchUser(user);
      });
    },
    async goToGroup(group) {
      // Don't remove this await or the first time the ModularViewContainer
      // mounts it'll break
      await this.updateSelectedTab(2); // Index for Groups Tab is 2
      this.$refs.ModularViewContainerRef.forEach(refObj => {
        if (Object.hasOwnProperty.call(refObj.$refs, 'GroupView'))
          refObj.$refs.GroupView.fetchGroup(group);
      });
    },
    async setDomainDetails() {
      let domainData = getDomainDetails()
      this.domain = domainData["name"];
      this.realm = domainData["realm"];
      this.basedn = domainData["basedn"];
    },
    ////////////////////////////////////////////////////////////////////////////
    // Logout Actions
    ////////////////////////////////////////////////////////////////////////////
    async logoutAction(timeout=false) {
      await new User({}).logout(timeout).then(() => {
        localStorage.setItem("auth.logoutMessage", true);
        this.$router.push("/login");
      });
    },
    refreshOnLanguageChange() {
      this.showNavTabs = false;
      this.langChanged = true;
      setTimeout(() => {
        this.showNavTabs = true;
        this.langChanged = false;
      }, 250);
    },
    async updateSelectedTab(index) {
      if (this.selectedTab != index)
        this.selectedTab = index;
      if (this.selectedTab == 0)
        this.initLoad = true
      this.active_tab = index;
      this.selectedTabTitle = this.navTabs[this.selectedTab].title;
      this.requestRefresh = this.selectedTabTitle;
      getDomainDetails();
      let routeToPush = "";
      this.navTabs.forEach((item) => {
        if (item.index == index && item.enabled == true) {
          if (item.route.length > 0) {
            routeToPush = item.route;
          } else {
            routeToPush = "";
          }
        }
      });
      if (this.$route.path != "/" + routeToPush) {
        this.$router.push("/" + routeToPush);
      }
      this.requestRefresh = "";
    },
    ////////////////////////////////////////////////////////////////////////////
    // Refresh Token Timers
    // What happens when the timer stops
    ////////////////////////////////////////////////////////////////////////////
    async handleInactive() {
      const refreshClock = Date.parse(localStorage.getItem("auth.refreshClock"));
      const accessClockLimit = refreshClock + (this.access_token_lifetime * 1000)
      const refreshClockLimit = refreshClock + (this.refresh_token_lifetime * 1000)
      const clockDifference = this.refresh_token_lifetime - this.access_token_lifetime
      if (Date.now() >= accessClockLimit && Date.now() < refreshClockLimit) {
        if (localStorage.getItem('auth.auto_refresh_token') == 'true') {
            await new User({}).getCurrentUserData()
            .then(() => { this.resetTimer() })
            .catch((error) => { console.error(error) })
        } else {
          this.showRefreshTokenDialog = true
          if (this.$refs.RefreshTokenDialog != undefined)
            this.$refs.RefreshTokenDialog.startCountdown()
          this.timeoutId = setTimeout(this.handleInactive, clockDifference * 1000)
        }
      } else if (Date.now() >= refreshClockLimit) {
        this.showLogoutDialog = true
        this.showRefreshTokenDialog = false
      }
      else {
        this.resetTimer()
      }
    },
    startTimer() {
      // setTimeout returns an ID (can be used to start or clear a timer)
      this.timeoutId = setTimeout(this.handleInactive, this.access_token_lifetime * 1000);
    },
    resetTimer() {
      clearTimeout(this.timeoutId);
      this.startTimer();
    },
    setupTimers() {
      this.startTimer();
    },
    async debugAction() {
      console.log('This button should be removed and/or disabled in production')
      await new Test({}).get()
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
    }
  },
};
</script>

<style>
#home-footer {
  min-width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 2;
}

#home-footer-buttons {
  min-width: 100%;
  position: fixed;
  bottom: 2.5rem;
  z-index: 2;
}

.transparent-body {
  background: transparent !important;
}

.rounded-dialog {
  border-radius: 40px !important;
}

.transition-speed-fix {
  transition: background-color var(--base-transition-speed-fast-5) ease-in-out !important;
}

#top-header-div {
  position: absolute;
  margin-top: 3vh;
}

#top-header {
  stroke-width: 3px;
  fill: transparent;
  width: calc((100%)/3);
}

[theme=dark] #top-header {
  stroke: var(--v-accent-base);
}

[theme=light] #top-header {
  stroke: var(--v-primary-base);
}

#donateBtn .v-icon::before {
  transition: color 75ms ease-in-out,
  content 200ms ease-in-out;
}

#donateBtn:hover .v-icon::before {
  content: "\F02D1";
  color: var(--v-error-60-s-base);
}
</style>
