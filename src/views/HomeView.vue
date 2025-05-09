<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: HomeView.vue -------------------------------->
<template>
  <div class="home ma-0 pa-0 align-stretch flex-column d-flex" style="height: 100%;" v-if="showView">
    <!------------------>
    <v-system-bar
      height="min"
      id="main-system-bar"
      ref="mainSystemBar"
      style="background: var(--v-secondary-15-base)"
      class="ma-0 pa-0 px-4 transition-speed-fix">
      <v-row align="center" justify="space-between">
        <v-img
          max-width="30ch"
          max-height="5em"
          class="my-3"
          contain
          :aspect-ratio="32 / 9"
          :src="!isThemeDark($vuetify) ? logoLight : logoDark" />
        <h2 style="color: var(--v-text-background-base)" class="ma-2 my-4 font-weight-medium">{{
          domain.toUpperCase() }}</h2>
      </v-row>
    </v-system-bar>
    <v-app-bar
      id="main-app-bar"
      ref="mainAppBar"
      flat
      height="min"
      clipped-left
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      class="ma-0 pa-2 transition-speed-fix"
      style="background: var(--v-secondary-15-base); height: fit-content">
      <v-row class="ma-0 pa-0" align="center" justify="space-between">
        <v-col cols="12" md="auto">
          <LanguageSelector
            :dark="!isThemeDark($vuetify)"
            :light="isThemeDark($vuetify)"
            class=""
            @updateTabSliders="refreshOnLanguageChange" />
        </v-col>
        <v-divider style="border-color: var(--v-primary-base)" class="ma-6"
          v-if="this.$vuetify.breakpoint.lgAndUp" />
        <v-col
          class="ma-0 pa-0 my-3"
          v-if="!this.$vuetify.breakpoint.mdAndUp && realm !== null && realm !== undefined && realm !== ''">
          <span class="text--white">
            {{ activeUserName }}
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
              :username="activeUserName" />
            <ThemeChanger
              :dark="!isThemeDark($vuetify)"
              :light="isThemeDark($vuetify)"
              :buttonIsSmall="true" />
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  :dark="!isThemeDark($vuetify)"
                  :disabled="disableDomainDetailsButton"
                  :light="isThemeDark($vuetify)"
                  @click="fetchDomainDetails()"
                  class="ml-3"
                  icon
                  v-bind="attrs"
                  v-on="on">
                  <v-icon>
                    mdi-cog-sync
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("nav.tooltip.fetchDomainDetails") }}</span>
            </v-tooltip>
            <!-- Open NavDrawer -->
            <v-tooltip
              bottom
              v-if="drawerIsMobile">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  small
                  :dark="!isThemeDark($vuetify)"
                  :light="isThemeDark($vuetify)"
                  class="ml-3"
                  @click="toggleDrawerState()"
                  icon
                  v-bind="attrs"
                  v-on="on">
                  <v-icon>
                    mdi-menu
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("nav.menu") }}</span>
            </v-tooltip>

            <!-- This does not appear in production -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="accent-60-s" class="ml-1"
                  v-show="initLoad && enableDebug"
                  :dark="!isThemeDark($vuetify)"
                  :light="isThemeDark($vuetify)"
                  :disabled="!enableDebug"
                  @click="debugAction()"
                  icon
                  v-bind="attrs"
                  v-on="on">
                  <v-icon>
                    mdi-code-brackets
                  </v-icon>
                </v-btn>
              </template>
              <span>{{ $t("nav.tooltip.debugAction") }}</span>
            </v-tooltip>
          </div>
        </v-col>
      </v-row>
    </v-app-bar>

    <NavigationDrawer
      ref="navigationDrawerMobile"
      v-if="drawerIsMobile"
      :lockNavTabs="lockNavTabs"
      :selectedTabTitle="selectedTabTitle"
      :selectedTab="selectedTab"
      :navGroups="navGroups"
      :topTabs="getVisibleTabsInGroup('_top')"
      :bottomTabs="getVisibleTabsInGroup('_bot')"
      :getVisibleTabsInGroup="getVisibleTabsInGroup"
      @updateSelectedTab="updateSelectedTab"
      mobile />
    <v-row no-gutters
      class="justify-center align-stretch flex-nowrap pb-10"
      style="position: relative; height: 100%;">
      <NavigationDrawer
        ref="navigationDrawerDesktop"
        v-if="drawerIsDesktop"
        :lockNavTabs="lockNavTabs"
        expanded-on-create
        :selectedTabTitle="selectedTabTitle"
        :selectedTab="selectedTab"
        :navGroups="navGroups"
        :topTabs="getVisibleTabsInGroup('_top')"
        :bottomTabs="getVisibleTabsInGroup('_bot')"
        :getVisibleTabsInGroup="getVisibleTabsInGroup"
        @updateSelectedTab="updateSelectedTab" />
      <v-col class="ma-0 pa-0">
        <v-tabs-items
          v-model="activeTab"
          class="transparent-body">
          <v-tab-item
            v-for="tab in navTabs"
            :key="tab.index">
            <ModularViewContainer
              :mobile="drawerIsMobile"
              :initLoad="initLoad"
              :viewTitle="tab.title"
              :viewIndex="tab.index"
              ref="ModularViewContainerRef"
              @refresh="setDomainDetails()"
              @refreshDomain="fetchDomainDetails()"
              @goToUser="goToUser"
              @goToGroup="goToGroup"
              @done="setInitLoad"
              :langChanged="langChanged"
              :requestRefresh="requestRefresh" />
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>

    <!-- SNACKBAR / NOTIF. BUS -->
    <NotificationBusContainer />

    <!-- ABOUT DIALOG  -->
    <v-dialog
      max-width="48rem"
      v-model="showAboutDialog">
      <AboutDialog @close='closeAbout' />
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
        @close='showSettingsDialog = !showSettingsDialog' />
    </v-dialog>

    <!-- LOGOUT DIALOG  -->
    <v-dialog
      persistent
      content-class=""
      max-width="40rem"
      v-model="showLogoutDialog">
      <LogoutDialog @logoutAction="logoutAction()" />
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
        @logoutAction="logoutAction()" />
    </v-dialog>

    <!----- ABOUT AND DONATE BUTTONS ------>
    <!-- <v-row id="home-footer-buttons" justify="end" align="center" class="pa-0 ma-0 px-2 mb-2">
    </v-row> -->

    <!-- Footer -->
    <v-footer
      color="secondary-15"
      padless
      id="home-footer"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      class="py-1">
      <v-row
        align="center"
        justify="center"
        :class="'mx-4 my-1 ' + ($vuetify.breakpoint.mdAndDown ? '' : 'text-caption')">
        <!-- <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"/> -->
        {{ $t("footer.copyright") }}
        <v-divider
          v-if="$vuetify.breakpoint.mdAndUp"
          class="mx-4" />
        <!-- Donate -->
        <v-btn
          color="primary"
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
        <v-tooltip
          top
          color="primary">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="showAboutDialog = true"
              small
              class="ma-0 mx-2"
              color="primary"
              v-bind="attrs"
              v-on="on"
              icon>
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
import NavigationDrawer from "@/components/NavigationDrawer.vue"
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
  mixins: [validationMixin, utilsMixin],
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
      showView: false,
      logoLight: 'logo/interlock-logo-wt-dark.svg',
      logoDark: 'logo/interlock-logo-wt-light.svg',
      username: "",
      first_name: "",
      initLoad: true,
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
      fetchingDomainDetails: false,
      disableDomainDetailsButton: false,
      requestRefresh: "",
      selectedTab: 0,
      selectedTabTitle: "",
      lockNavTabs: false,
      langChanged: false,
      enableDebug: false,
      activeTab: 0,
      tableData: {
        headers: [],
        items: [],
      },
      timeoutId: 0,
      navGroups: {
        "local": {
          enabled: true,
          icon: "mdi-database",
        },
        "ldap": {
          enabled: true,
          icon: "mdi-server-security",
        },
      },
      navTabs: [
        {
          title: "home",
          enabled: true,
          icon: "mdi-home",
          route: "home",
          group: "_top",
        },
        {
          title: "applications",
          enabled: true,
          icon: "mdi-application-cog",
          route: "applications",
          group: "_top",
        },
        {
          title: "django-users",
          enabled: true,
          icon: "mdi-account",
          route: "django-users",
          group: "local",
        },
        {
          title: "application-groups",
          enabled: true,
          icon: "mdi-google-circles-communities",
          route: "application-groups",
          group: "local",
        },
        {
          title: "ldap-dirtree",
          enabled: true,
          icon: "mdi-family-tree",
          route: "ldap-dirtree",
          group: "ldap",
        },
        {
          title: "ldap-users",
          enabled: true,
          icon: "mdi-account-network",
          route: "ldap-users",
          group: "ldap",
        },
        {
          title: "ldap-groups",
          enabled: true,
          icon: "mdi-google-circles-group",
          route: "ldap-groups",
          group: "ldap",
        },
        {
          title: "ldap-dns",
          enabled: true,
          enableShortName: true,
          icon: "mdi-dns",
          route: "ldap-dns",
          group: "ldap",
        },
        {
          title: "ldap-gpo",
          enabled: false,
          hidden: true,
          enableShortName: true,
          icon: "mdi-google-circles-extended",
          route: "ldap-gpo",
          group: "ldap",
        },
        {
          title: "settings",
          enabled: true,
          icon: "mdi-cog",
          route: "settings",
          group: "_bot",
        },
        {
          title: "logs",
          enabled: true,
          icon: "mdi-flag-outline",
          route: "logs",
          group: "_bot",
        },
        {
          title: "debug",
          enabled: false,
          hidden: true,
          icon: "mdi-xml",
          route: "debug",
          group: "_bot",
        },
      ],
    };
  },
  async created() {
    let tabIndex = 0
    if (this.$vuetify.breakpoint.mdAndUp)
      this.navDrawerKeepOpen = true;
    this.navTabs.forEach(t => {
      t.index = tabIndex
      tabIndex++
    })
    await new User({}).selfInfo().then((response) => {
      let responseStatus = response.status;
      let admin_allowed = (localStorage.getItem('user.admin_allowed') === 'true')
      response = response.data;

      // If response code is valid
      if (/^20[0-8]|226/.test(responseStatus)) {
        this.username = localStorage.getItem("user.username");
        this.first_name = localStorage.getItem("user.first_name");
        this.last_name = localStorage.getItem("user.last_name");
        this.email = localStorage.getItem("user.email");
        this.refreshTokenExpiryData()
        this.fetchDomainDetails()
        this.showView = true
      }
      // If response code is an HTTP error code
      else {
        this.logoutAction();
        this.showLogoutDialog = true;
      }

      if (!admin_allowed || admin_allowed == false) {
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
        this.activeTab = validRoute.index;
      } else {
        this.$router.push("/home")
      }
    }

    getDomainDetails();
    this.activeTab = this.selectedTab;
    this.selectedTabTitle = this.navTabs[this.selectedTab].title;
    // ! This refresh is redundant, commented it just in case
    // this.requestRefresh = this.selectedTabTitle
  },
  computed: {
    ldapBackendDisabled() {
      return [this.domain, this.realm, this.basedn].some(
        v => v === undefined || v === null || v.length <= 0
      )
    },
    drawerIsDesktop() {
      return this.$vuetify.breakpoint.lgAndUp
    },
    drawerIsMobile() {
      return !this.drawerIsDesktop
    },
    breakpointName() {
      return this.$vuetify.breakpoint.name;
    },
    getRealmDisplayName() {
      if (this.realm !== undefined && this.realm !== null && this.realm !== "")
        return `${this.realm.toUpperCase()}@`
      return ""
    },
    activeUserName() {
      if (this.last_name && this.last_name.length > 0 &&
        this.first_name && this.first_name.length > 0)
        return `${this.last_name}, ${this.first_name} | ${this.username}`
      return this.getRealmDisplayName + this.username
    },
  },
  methods: {
    ////////////////////////////////////////////////////////////////////////////
    // General Component Methods
    ////////////////////////////////////////////////////////////////////////////
    setInitLoad(){
      if (this.initLoad !== true)
        return
      this.initLoad = false
      console.log("Initial Load Flag Set.")
    },
    toggleDrawerState() {
      if (this.drawerIsDesktop)
        this.$refs.navigationDrawerDesktop.toggle()
      else
        this.$refs.navigationDrawerMobile.toggle()
    },
    getTabIndex(name) {
      return this.navTabs.findIndex(v => name == v.title)
    },
    getVisibleTabsInGroup(group = null) {
      if (group !== null)
        return this.navTabs.filter(x => x.group == group && !x.hidden)
      return this.navTabs.filter(x => (!("group" in x) || x.group === null) && !x.hidden)
    },
    openSettings() {
      this.showSettingsDialog = true
      if (this.$refs.UserSettings)
        this.$refs.UserSettings.loadSettings()
    },
    closeAbout() {
      this.showAboutDialog = false
    },
    closeRefreshDialog() {
      this.showRefreshTokenDialog = false
      this.resetTimer()
    },
    refreshTokenExpiryData() {
      this.access_expire = parseInt(localStorage.getItem("auth.access_expire"));
      this.refresh_expire = parseInt(localStorage.getItem("auth.refresh_expire"));
    },
    async goToUser(user) {
      // Don't remove this await or the first time the ModularViewContainer
      // mounts it'll break
      await this.updateSelectedTab(this.getTabIndex("ldap-users")); // Index for Users Tab is 1
      setTimeout(() => {
        this.$refs.ModularViewContainerRef.forEach(refObj => {
          // console.log(refObj.$refs)
          if (Object.hasOwnProperty.call(refObj.$refs, 'UserView'))
            refObj.$refs.UserView.fetchUser(user);
        });
      }, 0.1)
    },
    async goToGroup(group) {
      // Don't remove this await or the first time the ModularViewContainer
      // mounts it'll break
      await this.updateSelectedTab(this.getTabIndex("ldap-groups")); // Index for Groups Tab is 2
      setTimeout(() => {
        this.$refs.ModularViewContainerRef.forEach(refObj => {
          if (Object.hasOwnProperty.call(refObj.$refs, 'GroupView'))
            refObj.$refs.GroupView.fetchGroup(group);
        });
      }, 0.1)
    },
    async setDomainDetails() {
      let domainData = getDomainDetails()
      this.domain = domainData["name"];
      this.realm = domainData["realm"];
      this.basedn = domainData["basedn"];
    },
    setLDAPBackendStatus() {
      if (this.ldapBackendDisabled) {
        this.navGroups["ldap"].enabled = false
        this.navGroups.ldap.tooltip = this.$t("navgroup.ldap_hint")
        if (this.selectedTabTitle.startsWith("ldap-"))
          this.updateSelectedTab(this.getTabIndex("home"))
        if (this.$refs?.navigationDrawerDesktop)
          this.$refs.navigationDrawerDesktop.closeAllNavGroups()
      } else {
        this.navGroups["ldap"].enabled = true
        delete this.navGroups.ldap.tooltip
      }
    },
    async fetchDomainDetails() {
      this.fetchingDomainDetails = true
      this.disableDomainDetailsButton = true
      await new Domain({}).getDetails().then(() => {
        let domainData = getDomainDetails()
        this.domain = domainData['name']
        this.realm = domainData['realm']
        this.basedn = domainData['basedn']
        this.setLDAPBackendStatus()
        this.fetchingDomainDetails = false
        if ('debug' in domainData)
          this.enableDebug = (domainData['debug'] === "true")
        else this.enableDebug = false
        setTimeout(() => { this.disableDomainDetailsButton = false }, 0.5e3)
      })
        .catch(e => {
          this.setLDAPBackendStatus()
          console.error(e)
          this.fetchingDomainDetails = false
          setTimeout(() => { this.disableDomainDetailsButton = false }, 0.5e3)
        })
    },
    ////////////////////////////////////////////////////////////////////////////
    // Logout Actions
    ////////////////////////////////////////////////////////////////////////////
    async logoutAction() {
      await new User({}).logout()
        .then(() => {
          localStorage.setItem("auth.logoutMessage", true);
          this.$router.push("/login");
        })
        .catch(e => {
          console.error(e)
        });
    },
    refreshOnLanguageChange() {
      this.langChanged = true;
      setTimeout(() => {
        this.langChanged = false;
      }, 300);
    },
    async updateSelectedTab(index) {
      if (this.selectedTab != index)
        this.selectedTab = index;
      this.activeTab = index;
      this.selectedTabTitle = this.navTabs[this.selectedTab].title;
      this.requestRefresh = this.selectedTabTitle;
      this.lockNavTabs = true;
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
      // Wait for watch to register requestRefresh prop change
      setTimeout(() => {
        this.requestRefresh = "";
        this.lockNavTabs = false;
      }, 1e2)
    },
    ////////////////////////////////////////////////////////////////////////////
    // Refresh Token Timers
    // What happens when the timer stops
    ////////////////////////////////////////////////////////////////////////////
    async handleInactive() {
      // ! Dates in EPOCH - Milliseconds
      const accessClockLimit = this.access_expire;
      const refreshClockLimit = this.refresh_expire;
      const clockDifference = refreshClockLimit - accessClockLimit;
      if (Date.now() >= accessClockLimit && Date.now() < refreshClockLimit) {
        if (localStorage.getItem('auth.auto_refresh_token') == 'true') {
          await new User({}).selfInfo()
            .then(() => { this.resetTimer() })
            .catch((error) => { console.error(error) })
        } else if (!this.showRefreshTokenDialog) {
          this.timeoutId = setTimeout(this.handleInactive, clockDifference)
          this.showRefreshTokenDialog = true
          if (this.$refs.RefreshTokenDialog != undefined)
            this.$refs.RefreshTokenDialog.startCountdown()
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
      this.refreshTokenExpiryData()
      const refreshClock = Date.parse(localStorage.getItem("auth.refreshClock"));
      const accessClockLimit = this.access_expire;
      const clockDifference = accessClockLimit - refreshClock;
      // setTimeout returns an ID (can be used to start or clear a timer)
      this.timeoutId = setTimeout(this.handleInactive, clockDifference);
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

<style lang="scss">
:root {
  --home-footer-z-index: 6;
}

#home-footer {
  min-width: 100%;
  position: fixed;
  bottom: 0;
  z-index: var(--home-footer-z-index);
}

#home-footer-buttons {
  min-width: 100%;
  position: fixed;
  bottom: 2.5rem;
  z-index: var(--home-footer-z-index);
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

.v-list-group--disabled:before {
  opacity: 0 !important;
}

.v-list-group--disabled .v-ripple__container {
  opacity: 0 !important;
}
</style>
