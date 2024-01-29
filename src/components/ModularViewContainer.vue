<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: ModularViewContainer.vue ---------------------->
<template>
<v-container class="my-4 max-width-change">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>

  <!-- HOME -->
  <v-container v-if="viewTitle == 'home' && initLoad == true" class="max-width-change">
    <DirtreeView
      ref="DirtreeView"
      :requestRefresh="this.refreshUserDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @refresh="refreshAction"
      @goToUser="goToUser"
      @goToGroup="goToGroup"
    />
  </v-container>

  <!-- USERS -->

  <v-container v-if="viewTitle == 'users'" class="max-width-change">
    <UserView ref="UserView"
      :requestRefresh="this.refreshUserDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @refresh="refreshAction"
      @goToGroup="goToGroup"
    />
  </v-container>

  <!-- Groups -->
  <v-container v-if="viewTitle == 'groups'" class="max-width-change">
    <GroupView ref="GroupView"
      :requestRefresh="this.refreshGroupDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @refresh="refreshAction"
    />
  </v-container>

  <!-- DNS -->
  <v-container v-if="viewTitle == 'dns'" class="max-width-change">
    <dnsView ref="dnsView"
      :requestRefresh="this.refreshDNSData"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @refresh="refreshAction"
    />
  </v-container>

  <!-- GPO -->
  <v-container v-if="viewTitle == 'gpo'" class="max-width-change">
  </v-container>

  <!-- Settings -->
  <v-container v-if="viewTitle == 'settings'" class="max-width-change">
    <SettingsCard
      :viewTitle="viewTitle"
      class="my-2 mb-4"
      ref="SettingsView"
    />
  </v-container>

  <!-- Logs -->
  <v-container v-if="viewTitle == 'logs'" class="max-width-change">
    <LogView
      :viewTitle="viewTitle"
      class="my-2 mb-4"
      ref="LogView"
    />
  </v-container>

  <!-- Debugging -->
  <v-container v-if="viewTitle == 'debug'" class="max-width-change">
    <DebugView
      :viewTitle="viewTitle"
      class="my-2 mb-4"
      ref="DebugView"
    />
  </v-container>
</v-container>
</template>

<script>
import UserView from '@/components/User/UserView.vue';
import GroupView from '@/components/Group/GroupView.vue';
import DirtreeView from '@/components/Dirtree/DirtreeView.vue';
import dnsView from '@/components/DNS/dnsView.vue';
import SettingsCard from '@/components/Settings/SettingsCard.vue';
import LogView from '@/components/Logging/LogView.vue';
import DebugView from '@/components/Debug/DebugView.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';

  export default {
    name: 'ModularViewContainer',
    mixins: [ validationMixin ],
    components:{
      UserView,
      GroupView,
      DirtreeView,
      dnsView,
      SettingsCard,
      LogView,
      DebugView
    },
    props: {
      viewTitle: String,
      viewIndex: Number,
      langChanged: Boolean,
      requestRefresh: String,
      initLoad: Boolean
    },
    data () {
      return {
        refreshUserDataTable: false,
        refreshGroupDataTable: false,
        refreshDNSData: false,
        refreshOnClose: false,
        userRefreshLoading: false,
        error: false,
        snackbarMessage: "",
        snackbarIcon: "",
        snackbarColor: "",
        snackbarClasses: "",
        snackbar: false,
        snackbarTimeout: 2500,
      }
    },
    watch:{
      langChanged: {
        handler: function () {
          switch (this.viewTitle) {
            case 'users':
              this.$refs.UserView.reloadDataTableHeaders()
              break;
            case 'groups':
              this.$refs.GroupView.reloadDataTableHeaders()
              break;
            case 'logs':
              this.$refs.LogView.reloadDataTableHeaders()
              break;
            case 'dns':
              this.$refs.dnsView.reloadDataTableHeaders()
              break;
            default:
              break;
          }
        }
      },
      requestRefresh: {
        handler: function (newValue) {
          switch (newValue) {
            case 'home':
              if (this.$refs.DirtreeView != undefined) {
                console.log("Requested refresh for view component "+ newValue)
                this.$refs.DirtreeView.resetSearch()
                this.$refs.DirtreeView.resetDirtree(true)
              }
              break;
            case 'users':
              if (this.$refs.UserView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.UserView.resetSearch()
                this.$refs.UserView.listUserItems()
              }
              break;
            case 'groups':
              if (this.$refs.GroupView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.GroupView.resetSearch()
                this.$refs.GroupView.listGroupItems()
              }
              break;
            case 'settings':
              if (this.$refs.SettingsView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.SettingsView.refreshSettings()
              }
              break;
            case 'logs':
              if (this.$refs.LogView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.LogView.resetSearch()
                this.$refs.LogView.listLogs()
              }
              break;
            case 'dns':
              if (this.$refs.dnsView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.dnsView.getDNSData()
              }
              break;
            case 'debug':
              if (this.$refs.DebugView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.DebugView.refreshAction()
              }
              break;
            default:
              if (newValue)
                console.log("Requested refresh for component "+ newValue)
              break;
          }
        }
      },
    },
    computed: {
    },
    methods: {
      goToUser(user){
        this.$emit('goToUser', user)
      },
      goToGroup(group){
        this.$emit('goToGroup', group)
      },
      async saveData(key, data){
        switch (key) {
          case 'userDialog':
            this.refreshOnClose = true
            break;
          default:
            console.log(key)
            console.log(data)
            break;
        }
      },
      refreshAction() {
        // Reset all filters if refreshing dirtree view
        if (this.viewTitle == 'home')
          Object.keys(this.itemTypes).forEach(key => {
            this.itemTypes[key]['filtered'] = false
          });
        this.$emit('refresh')
        this.userRefreshLoading = false;
        this.refreshOnClose = false
      }
    }
  }
</script>
<style>
.max-width-change {
  max-width: max(90%, 1100px);
}
</style>