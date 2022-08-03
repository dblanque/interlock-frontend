<template>
<v-container class="my-4">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>

  <!-- HOME -->
  <v-container v-if="viewTitle == 'home'">
    <DirtreeView
      ref="DirtreeView"
      :requestRefresh="this.refreshUserDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @createSnackbar="createSnackbar"
      @resetSnackbar="resetSnackbar"
      @refresh="refreshAction"
      @goToUser="goToUser"
      @goToGroup="goToGroup"
    />
  </v-container>

  <!-- USERS -->

  <v-container v-if="viewTitle == 'users'">
    <UserView ref="UserView"
      :requestRefresh="this.refreshUserDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @createSnackbar="createSnackbar"
      @resetSnackbar="resetSnackbar"
      @refresh="refreshAction"
    />
  </v-container>

  <!-- Groups -->
  <v-container v-if="viewTitle == 'groups'">
    <GroupView ref="GroupView"
      :requestRefresh="this.refreshGroupDataTable"
      :viewTitle="viewTitle"
      :snackbarTimeout="this.snackbarTimeout"
      @createSnackbar="createSnackbar"
      @resetSnackbar="resetSnackbar"
      @refresh="refreshAction"
    />
  </v-container>

  <!-- DNS -->
  <v-container v-if="viewTitle == 'dns'">
  </v-container>

  <!-- GPO -->
  <v-container v-if="viewTitle == 'gpo'">
  </v-container>

  <!-- Settings -->
  <v-container v-if="viewTitle == 'settings'">
    <SettingsCard
      :viewTitle="viewTitle"
      class="my-2 mb-4"
      ref="SettingsView"
      @createSnackbar="createSnackbar"
      @resetSnackbar="resetSnackbar"
    />
  </v-container>

  <!-- Logs -->
  <v-container v-if="viewTitle == 'logs'">
    <LogView
      :viewTitle="viewTitle"
      class="my-2 mb-4"
      ref="LogView"
      @createSnackbar="createSnackbar"
      @resetSnackbar="resetSnackbar"
    />
  </v-container>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      class="mb-12"
      :color="snackbarColor"
      >
      <v-fab-transition>
        <v-icon v-if="snackbarColor == 'green' || snackbarColor == 'valid'" class="mr-1">
          mdi-checkbox-marked-circle-outline
        </v-icon>
        <v-icon v-else-if="snackbarColor == 'primary'" class="mr-1">
          mdi-information-outline
        </v-icon>
        <v-icon v-else-if="snackbarColor == 'error' || snackbarColor == 'red'" class="mr-1">
          mdi-close-circle-outline
        </v-icon>
      </v-fab-transition>
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
          icon
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
</v-container>
</template>

<script>
import UserView from '@/components/User/UserView.vue'
import GroupView from '@/components/Group/GroupView.vue'
import DirtreeView from '@/components/Dirtree/DirtreeView.vue'
import SettingsCard from '@/components/Settings/SettingsCard.vue'
import LogView from '@/components/Logging/LogView.vue'

  export default {
    name: 'ModularViewContainer',
    components:{
    UserView,
    GroupView,
    DirtreeView,
    SettingsCard,
    LogView
    },
    props: {
      viewTitle: String,
      viewIndex: Number,
      langChanged: Boolean,
      requestRefresh: String,
    },
    data () {
      return {
        refreshUserDataTable: false,
        refreshGroupDataTable: false,
        refreshOnClose: false,
        userRefreshLoading: false,
        error: false,
        snackbarMessage: "",
        snackbarIcon: "",
        snackbarColor: "",
        snackbarClasses: "",
        snackbar: false,
        snackbarTimeout: 2500,
        dialogs: {
          userDialog: false,
          userDelete: false,
          userAntilockout: false,
          userResetPassword: false,
          userCreate: false,
          group: false,
          dns: false,
          gpo: false
        }
      }
    },
    created() {
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
                this.$refs.DirtreeView.resetDirtree(true)
              }
              break;
            case 'users':
              if (this.$refs.UserView != undefined) {
                console.log("Requested refresh for component "+ newValue)
                this.$refs.UserView.listUserItems()
              }
              break;
            case 'groups':
              if (this.$refs.GroupView != undefined) {
                console.log("Requested refresh for component "+ newValue)
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
                this.$refs.LogView.listLogs()
              }
              break;
            default:
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
        setTimeout(()=>{
          if (!this.snackbar) {
            this.snackbarMessage = ""
            this.snackbarIcon = ""
            this.snackbarColor = ""
            this.snackbarClasses = ""
          }
        }, this.snackbarTimeout + 300)
      },
      // Check if theme is dark
      isThemeDark(){
          if (this.$vuetify.theme.dark == true) {
            return true
          }
          return false
      },
      openDialog(key){
        this.dialogs[key] = true;
      },
      async closeDialog(key){
        this.dialogs[key] = false;
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
