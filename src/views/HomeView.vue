<!------------------ INTERLOCK IS LICENSED UNDER GNU GPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: HomeView.vue -------------------------------->
<template>
  <div class="home">
    <!------------------>
    <v-row
      justify="center"
      :class="'ma-0 pa-2 py-4 text-normal transition-speed-fix ' + (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
      <h2 class="font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      align="center"
      :class="'ma-0 pa-2 transition-speed-fix ' + (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
      style="height: fit-content">
      <v-col cols="12" md="auto">
        <LanguageSelector
          :dark="!isThemeDark($vuetify)"
          :light="isThemeDark($vuetify)"
          class=""
          @updateTabSliders="refreshOnLanguageChange"
        />
      </v-col>
      <v-divider light class="ma-6" v-if="this.$vuetify.breakpoint.mdAndUp" />
      <v-col
        class="ma-0 pa-0 my-3"
        v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
        <span
          class="text-normal"
          v-if="last_name && last_name != '' && first_name && first_name != ''">
          {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + "@" + username }}
        </span>
        <span class="text-normal" v-else>
          {{ realm.toUpperCase() + "@" + username }}
        </span>
      </v-col>
      <v-col class="ma-0 pa-0" cols="12" md="auto">
        <div class="mt-2 mr-4">
          <span
            class="text-normal"
            v-if="this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
            <span
              class="text-normal"
              v-if="last_name && last_name != '' && first_name && first_name != ''">
              {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + "@" + username }}
            </span>
            <span class="text-normal" v-else>
              {{ realm.toUpperCase() + "@" + username }}
            </span>
          </span>
          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                @click="logoutAction"
                icon
                class="mx-2"
                v-bind="attrs"
                v-on="on">
                <v-icon> mdi-logout </v-icon>
              </v-btn>
            </template>
            <span>{{ $t("misc.logoutTooltip") }}</span>
          </v-tooltip>
          <ThemeChanger
            :dark="!isThemeDark($vuetify)"
            :light="isThemeDark($vuetify)"
            :buttonIsSmall="true"
          />
          <!-- Remove this in production -->
          <!-- <v-btn @click="debugAction"
           outlined class="mx-3" rounded color="red">
            Debug
          </v-btn> -->
        </div>
      </v-col>
    </v-row>

    <!-- Tabs Bar -->
    <v-toolbar
      v-if="this.$vuetify.breakpoint.mdAndUp"
      dense
      id="tabs-nav-bar"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      style="z-index: 1"
      :class="'sticky-top transition-speed-fix ' + (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
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
            v-for="tab in navTabs"
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

    <v-toolbar
      v-else
      dense
      id="tabs-nav-bar"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      style="z-index: 1"
      :class="
        'sticky-top ' +
        (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')
      "
    >
      <v-row justify="space-between" class="mx-12" align="center">
        <v-btn
          text
          color="primary"
          @click="goToPrevTab"
          :disabled="active_tab == 0">
          <v-icon> mdi-chevron-double-left </v-icon>
          <span>
            {{ $t("actions.back_short") }}
          </span>
        </v-btn>
        <span>
          <span
            v-if="navTabs[active_tab].enableShortName == true"
            class="font-weight-medium clr-primary">
            {{ $t("category." + navTabs[active_tab].title + "_short").toUpperCase() }}
          </span>
          <span class="font-weight-medium clr-primary">
            {{ $t("category." + navTabs[active_tab].title).toUpperCase() }}
          </span>
        </span>
        <v-btn
          text
          color="primary"
          @click="goToNextTab"
          :disabled="active_tab == navTabs.length - 1">
          <span>
            {{ $t("actions.next") }}
          </span>
          <v-icon> mdi-chevron-double-right </v-icon>
        </v-btn>
      </v-row>
    </v-toolbar>

    <v-tabs-items v-model="active_tab" class="transparent-body">
      <v-tab-item v-for="tab in navTabs" :key="tab.index">
        <ModularViewContainer
          :initLoad="initLoad"
          :viewTitle="tab.title"
          :viewIndex="tab.index"
          ref="ModularViewContainerRef"
          @refresh="loadDomainData()"
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

    <!-- LOGOUT DIALOG  -->
    <v-dialog
      persistent
      content-class="rounded-dialog"
      max-width="40rem"
      v-model="showLogoutDialog">
        <LogoutDialog
        @logoutAction="logoutAction"/>
    </v-dialog>

    <!----- ABOUT AND DONATE BUTTONS ------>
    <v-row id="home-footer-buttons" justify="end" align="center" class="pa-0 ma-0 px-2 mb-2">
      <!-- About -->
      <v-tooltip left color="primary">
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
      <!-- Donate -->
      <!-- <v-btn small
        :dark="!isThemeDark($vuetify)" 
        :light="isThemeDark($vuetify)" 
        class="mx-2">
        {{ $t("footer.donate") }}
      </v-btn> -->
    </v-row>
    <!-- Footer -->
    <v-footer
      padless
      id="home-footer"
      :dark="!isThemeDark($vuetify)"
      :light="isThemeDark($vuetify)"
      class="py-1"
    >
      <v-row
        justify="center"
        :class="
          'mx-4 my-1 ' + ($vuetify.breakpoint.mdAndDown ? '' : 'text-caption')">
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"/>
        {{ $t("footer.copyright") }}
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"/>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
// @ is an alias to /src
import ModularViewContainer from "@/components/ModularViewContainer.vue"
import LanguageSelector from "@/components/LanguageSelector.vue"
import ThemeChanger from "@/components/ThemeChanger.vue"
import LogoutDialog from "@/components/LogoutDialog.vue"
import AboutDialog from "@/components/AboutDialog.vue"
import User from "@/include/User"
import Test from "@/include/Test"
import Domain from "@/include/Domain"
import NotificationBusContainer from '@/components/NotificationBusContainer.vue'
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin'

export default {
  name: "HomeView",
  mixins: [ validationMixin, utilsMixin ],
  components: {
    ModularViewContainer,
    LanguageSelector,
    LogoutDialog,
    ThemeChanger,
    NotificationBusContainer,
    AboutDialog
  },
  data() {
    return {
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
      timeoutInS: 900,
    //   timeoutInS: 1, // For testing
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
      ],
    };
  },
  async created() {
    await new User({}).getCurrentUserData().then((response) => {
      var responseStatus = response.status;
      var token = localStorage.getItem('token')
      var admin_allowed = (localStorage.getItem('admin_allowed') === 'true')
      response = response.data;

      // If response code is valid
      if (/^20[0-8]|226/.test(responseStatus)) {
        this.username = localStorage.getItem("username");
        this.first_name = localStorage.getItem("first_name");
        this.last_name = localStorage.getItem("last_name");
        this.email = localStorage.getItem("email");

        new Domain({}).getDetails().then(() => {
          this.domain = localStorage.getItem("domain");
          this.realm = localStorage.getItem("realm");
          this.basedn = localStorage.getItem("basedn");
        });
      }
      // If response code is an HTTP error code
      else {
        token = localStorage.getItem("token");
        if ( !token || token == null || token == "null" ){
          this.logoutAction();
          this.showLogoutDialog = true;
        }
      }

      if (!admin_allowed || admin_allowed == false){
        this.logoutAction();
        this.showLogoutDialog = true;
      }
    });

    this.setupTimers();
  },
  mounted() {
    var currentPath = this.$route.path;
    if (currentPath && currentPath.length > 0) {
      this.navTabs.forEach((item) => {
        if ("/" + item.route == this.$route.path) {
          this.selectedTab = item.index;
          this.active_tab = item.index;
        }
      });
    }
    setTimeout(() => {
      this.showNavTabs = true;
    }, 250);
    this.active_tab = this.selectedTab;
    if (this.selectedTab == 0)
      this.initLoad = true
    this.selectedTabTitle = this.navTabs[this.selectedTab].title;
    this.requestRefresh = this.selectedTabTitle
    this.loadDomainData();
  },
  computed: {
    breakpointName() {
      return this.$vuetify.breakpoint.name;
    },
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
    closeAbout(){
      this.showAboutDialog = false
    },
    goToPrevTab(){
      var counter = this.selectedTab - 1
      this.navTabs.forEach(() => {
        if (this.navTabs[counter].enabled)
          return this.updateSelectedTab(counter)
        else {
          counter -= 1
        }
      });
    },
    goToNextTab(){
      var counter = this.selectedTab + 1
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
    async loadDomainData() {
      if (!this.domain || !this.realm) {
        await new Domain({}).getDetails().then(() => {
          this.domain = localStorage.getItem("domain");
          this.realm = localStorage.getItem("realm");
          this.basedn = localStorage.getItem("basedn");
        });
      }
    },
    ////////////////////////////////////////////////////////////////////////////
    // Logout Actions
    ////////////////////////////////////////////////////////////////////////////
    openLogoutDialog() {
      this.showLogoutDialog = true;
      console.log("openlogout")
    },
    async logoutAction() {
      await new User({}).logout().then(() => {
        localStorage.setItem("logoutMessage", true);
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
      await this.loadDomainData();
      var routeToPush = "";
      this.navTabs.forEach((item) => {
        if (item.index == index) {
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
    handleInactive() {
      var refreshClock = Date.parse(localStorage.getItem("refreshClock"));
      var refreshClockLimit = refreshClock + this.timeoutInS * 1000;
      if (Date.now() >= refreshClockLimit) {
        this.openLogoutDialog();
      } else {
        this.resetTimer();
      }
    },
    startTimer() {
      // setTimeout returns an ID (can be used to start or clear a timer)
      this.timeoutId = setTimeout(this.handleInactive, this.timeoutInS * 1000);
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
        console.log(error)
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
</style>
