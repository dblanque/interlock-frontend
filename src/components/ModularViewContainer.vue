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
      class="my-2 mb-4"
      ref="SettingsCardRef"
    />
  </v-container>


    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      class="mb-12"
      :color="snackbarColor"
      :dark="!isThemeDark()" :light="isThemeDark()"
      >
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
import DirtreeView from '@/components/Dirtree/DirtreeView.vue'
import SettingsCard from '@/components/Settings/SettingsCard.vue'

  export default {
    name: 'ModularViewContainer',
    components:{
    UserView,
    DirtreeView,
    SettingsCard
    },
    props: {
      viewTitle: String,
      viewIndex: Number,
      langChanged: Boolean,
      requestRefresh: Boolean
    },
    data () {
      return {
        refreshUserDataTable: false,
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
            default:
              break;
          }
        }
      },
      requestRefresh: {
        handler: function () {
          switch (this.viewTitle) {
            case 'users':
              this.$refs.UserView.listUserItems()
              break;
            case 'home':
              this.$refs.DirtreeView.resetDirtree()
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
