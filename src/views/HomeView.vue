<template>
  <div class="home">
    <!------------------>
    <v-row justify="center"
      :class="'ma-0 pa-2 py-4 text-normal ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
    >
      <h2 class="font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row
      :dark="!isThemeDark()" :light="isThemeDark()" align="center"
      :class="'ma-0 pa-2 ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
      style="height: fit-content;">
        <v-col cols="12" md="auto">
          <LanguageSelector :dark="!isThemeDark()" :light="isThemeDark()" class="" @updateTabSliders="refreshNavTabs"/>
        </v-col>
        <v-divider light class="ma-6" v-if="this.$vuetify.breakpoint.mdAndUp"/>
        <v-col class="ma-0 pa-0 my-3" v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
          <span class="text-normal" v-if="last_name && last_name != '' && first_name && first_name != ''">
            {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username }}
          </span>
          <span class="text-normal" v-else>
            {{ realm.toUpperCase() + '@' + username }}
          </span>
        </v-col>
        <v-col class="ma-0 pa-0" cols="12" md="auto">
          <div class="mt-2 mr-4">
            <span class="text-normal" v-if="this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
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
    <v-toolbar v-if="this.$vuetify.breakpoint.mdAndUp" 
    dense 
    id="tabs-nav-bar" 
    :dark="!isThemeDark()" 
    :light="isThemeDark()"
    style="z-index: 1;"
    :class="'sticky-top ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
        <v-fade-transition>
        <v-tabs 
            v-model="active_tab"
            v-if="showNavTabs"
            color="primary"
            slider-size="4"
            center-active
            centered
            show-arrows>
                <v-tab class="px-4" v-for="tab in navTabs" :key="tab.index" @click="updateSelectedTab(tab.index)" :disabled="!tab.enabled || (disableAllTabs == true && refreshLoading == true)">
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

    <v-tabs-items v-model="active_tab" class="transparent-body">
      <v-tab-item
         v-for="tab in navTabs"
         :key="tab.index">
         <ModularViewContainer :viewTitle="tab.title" :viewIndex="tab.index"
          ref="ModularViewContainerRef"
         @refresh="loadData(selectedTabTitle)"
         @goToUser="goToUser"
         :errorLoading="error"
         :refreshLoading="refreshLoading"
         :tableDataHeaders="tableData.headers"
         :tableDataItems="tableData.items"
         />
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

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      class="mb-12"
      :color="snackbarColor"
      text
      :dark="!isThemeDark()" :light="isThemeDark()"
    >
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          :color="snackbarColor"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <!----- ABOUT AND DONATE BUTTONS ------>
    <v-row id="home-footer-buttons" justify="end" class="pa-0 ma-0">
      <v-btn color="primary" small class="mx-2 mb-1">{{$t('footer.about')}}</v-btn>
      <!-- <v-btn small text class="mx-2">DONATE</v-btn> -->
    </v-row>
    <v-footer padless id="home-footer" :dark="!isThemeDark()" :light="isThemeDark()" class="py-1">
      <v-row justify="center" :class="'mx-4 my-1 ' + ($vuetify.breakpoint.mdAndDown ? '' : 'text-caption')">
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"></v-divider>
        {{ $t("footer.copyright") }}
        <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4 mt-2"></v-divider>
      </v-row>
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
import OrganizationalUnit from '@/include/OrganizationalUnit'

export default {
  name: 'HomeView',
  components: {
    ModularViewContainer,
    LanguageSelector,
    ThemeChanger
  },
  data () {
    return {
      disableAllTabs: false,
      username: "",
      first_name: "",
      last_name: "",
      domain: "",
      realm: "",
      basedn: "",
      error: false,
      snackbarMessage: "",
      snackbarIcon: "",
      snackbarColor: "",
      snackbarClasses: "",
      snackbar: false,
      snackbarTimeout: 2500,
      showLogoutDialog: false,
      selectedTab: 0,
      selectedTabTitle: '',
      showNavTabs: false,
      refreshLoading: false,
      active_tab: 0,
      tableData: {
        headers:[],
        items:[]
      },
      timeoutInS: 1800,
      // timeoutInS: 5, // For testing
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
          enabled: false,
          icon: "mdi-group",
          route: "groups"
        },
        {
          index: 3,
          title: "dns",
          enabled: false,
          enableShortName: true,
          icon: "mdi-dns",
          route: "dns"
        },
        {
          index: 4,
          title: "gpo",
          enabled: false,
          enableShortName: true,
          icon: "mdi-google-circles-extended",
          route: "gpo"
        },
        {
          index: 5,
          title: "settings",
          enabled: true,
          icon: "mdi-cog",
          route: "settings"
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

        new Domain({}).getDetails().then(() => {
          this.domain = localStorage.getItem('domain')
          this.realm = localStorage.getItem('realm')
          this.basedn = localStorage.getItem('basedn')
        })
      }
      // If response code is an HTTP error code
      else {
        var token = localStorage.getItem('token')
        console.log(token)
        if (!token || token == null || token == 'null') {
          localStorage.removeItem('username')
          localStorage.removeItem('first_name')
          localStorage.removeItem('last_name')
          localStorage.removeItem('token')
          localStorage.removeItem('refresh')
          // console.log('login-null')
          // this.$router.push('/login')
        }
        this.showLogoutDialog = true;
      }
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
    this.selectedTabTitle = this.navTabs[this.selectedTab].title
    this.loadData(this.selectedTabTitle)
  },
  methods: {
    // Home (DirTree) View Actions
    async fetchOUs(){
      this.tableData.headers = []
      this.tableData.items = []
      await new OrganizationalUnit({}).dirtree()
      .then(response => {
        this.tableData.headers = []
        this.tableData.items = response.data.ou_list
        this.error = false;
        this.refreshLoading = false;
        this.resetSnackbar();
        this.createSnackbar('green', (this.$t("category.header.home") + " " + this.$t("words.loaded.single.m")).toUpperCase() )
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
      .catch(error => {
        console.log(error)
        this.refreshLoading = false;
        this.error = true;
        this.resetSnackbar();
        this.createSnackbar('red', this.$t("error.unableToLoad").toUpperCase() + " " + this.selectedTabTitle.toUpperCase())
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
    },
    // User Actions
    async listUserItems(){
      this.tableData.headers = []
      this.tableData.items = []
      await new User({}).list()
      .then(response => {
        var userHeaders = response.headers
        var users = response.users
        // Reset Headers Array every time you list to avoid infinite header multiplication
        this.resetDataTable()
        var headerDict = {}
        userHeaders.forEach(header => {
          headerDict = {}
          headerDict.text = this.$t('section.users.attributes.' + header)
          headerDict.value = header
          if (header == 'is_enabled') {
            headerDict.align = 'center'
          }
          this.tableData.headers.push(headerDict)
        });
        headerDict = {}
        headerDict.text = this.$t('actions.label')
        headerDict.value = 'actions'
        headerDict.align = 'center'
        headerDict.sortable = false
        this.tableData.headers.push(headerDict)
        this.tableData.items = users
        this.error = false;
        this.refreshLoading = false;
        this.resetSnackbar();
        this.createSnackbar('green', (this.$t("classes.user.plural") + " " + this.$t("words.loaded.plural.m")).toUpperCase() )
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
      .catch(error => {
        console.log(error)
        this.refreshLoading = false;
        this.error = true;
        this.resetSnackbar();
        this.createSnackbar('red', this.$t("error.unableToLoad").toUpperCase() + " " + this.selectedTabTitle.toUpperCase())
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
    },
    async goToUser(username){
      // Don't remove this await or the first time the ModularViewContainer
      // mounts it'll break
      await this.updateSelectedTab(1) // Index for Users Tab is 1
      // Had to get always the last element in array 
      this.$refs.ModularViewContainerRef[this.$refs.ModularViewContainerRef.length - 1].fetchUser(username)
    },
    createSnackbar(color, string){
      if (!color) {
        color = "primary"
      }
      this.snackbarColor = color;
      this.snackbarMessage = string;
      this.snackbar = true;
    },
    // Reset Snackbar values
    resetSnackbar(){
      this.snackbar = false
      this.snackbarMessage = ""
      this.snackbarIcon = ""
      this.snackbarColor = ""
      this.snackbarClasses = ""
    },
    // Reset Data Table variables
    resetDataTable(){
      this.tableData.headers = []
      this.tableData.items = []
    },
    // Reload Data Table Header Labels
    reloadDataTableHeaders(){
      this.tableData.headers.forEach(tableHeader => {
        switch (this.selectedTabTitle) {
          case 'users':
            if (tableHeader.value == "actions") {
              tableHeader.text = this.$t('actions.label')
            } else {
              tableHeader.text = this.$t('section.users.attributes.' + tableHeader.value)
            }
            break;
          default:
            break;
        }
      });
    },
    async loadData(viewTitle){
      if (!this.domain || !this.realm) {
        await new Domain({}).getDetails().then(() => {
          this.domain = localStorage.getItem('domain')
          this.realm = localStorage.getItem('realm')
          this.basedn = localStorage.getItem('basedn')
        })
      }
      this.disableAllTabs = true
      switch (viewTitle) {
        case 'users':
          this.refreshLoading = true;
          await this.listUserItems();
          this.disableAllTabs = false
          break;
        case 'home':
          this.refreshLoading = true;
          await this.fetchOUs();
          this.disableAllTabs = false
          break;
        default:
          break;
      }
    },
    // Logout Actions
    openLogoutDialog(){
      this.showLogoutDialog = true;
    },
    async logoutAction() {
      await new User({}).logout()
      localStorage.setItem('logoutMessage', true)
      this.$router.push('/login')
    },
    // Check if theme is dark
    isThemeDark(){
        if (this.$vuetify.theme.dark == true) {
          return true
        }
        return false
    },
    refreshNavTabs(){
      this.showNavTabs = false
      setTimeout(() => {  this.showNavTabs = true; }, 250);
      this.reloadDataTableHeaders()
    },
    async updateSelectedTab(index) {
      if (this.selectedTab != index)
        this.selectedTab = index
        this.active_tab = index
        this.selectedTabTitle = this.navTabs[this.selectedTab].title
        await this.loadData(this.selectedTabTitle)
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
    // Refresh Token Timers
    // What happens when the timer stops
    handleInactive() {
      var refreshClock = Date.parse(localStorage.getItem('refreshClock'))
      var refreshClockLimit = refreshClock + (this.timeoutInS * 1000)
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
    setupTimers () {
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
