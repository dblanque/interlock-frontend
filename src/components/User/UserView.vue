<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserView.vue -------------------------------->
<template>
<div>
  <v-data-table
    :headers="this.tableData.headers"
    :items="this.tableData.items"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    sort-by="sn"
    class="py-3 px-2 mt-2 mb-2">
    <!-- Table Header -->
    <template v-slot:top>
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-text-field
          v-model="searchString"
          clearable
          :label="$t('actions.search')"
          class="mx-2"
        ></v-text-field>
        <v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
          <v-btn 
            class="mx-2 bg-primary" 
            color="white" 
            icon
            elevation="0"
            :loading="loading"
            @click="listUserItems"
            >
            <v-icon>
              mdi-refresh
            </v-icon>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
          <v-btn class="pa-2 mx-2" :disabled="loading" color="primary" @click="openDialog('userCreate')">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.user.single') }}
          </v-btn>
        </v-row>
      </v-row>
    </template>
    <!-- USER IS ENABLED STATUS -->
    <template v-slot:[`item.is_enabled`]="{ item }">

        <!-- Enable User Button -->
        <v-tooltip color="red" bottom v-if="item.is_enabled">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || isLoggedInUser(item.username)"
            @click="disableUser(item)"
          >
          <v-icon :class="!isLoggedInUser(item.username) ? 'clr-valid clr-lig-40': ''">
            mdi-check
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.disable') + " " + item.username }}</span>
      </v-tooltip>

      <!-- Disable User Button -->
      <v-tooltip color="green" bottom v-else-if="!item.is_enabled">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || isLoggedInUser(item.username)"
            @click="enableUser(item)"
          >
          <v-icon :class="!isLoggedInUser(item.username) ? 'clr-error clr-lig-40': ''">
            mdi-close
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.enable') + " " + item.username }}</span>
      </v-tooltip>
    </template>

    <!-- USER ACTIONS -->
    <template v-slot:[`item.actions`]="{ item }">
      
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="fetchUser(item, false)"
          >
          <v-icon small color="primary">
            mdi-eye
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.view') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="fetchUser(item, true)"
          >
          <v-icon small color="primary">
            mdi-pencil
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.edit') }}</span>
      </v-tooltip>

      <!-- RESET PASSWORD BUTTON -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="changeUserPassword(item)"
          >
          <v-icon small color="primary">
            mdi-key-variant
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.changePassword') }}</span>
      </v-tooltip>

      <!-- UNLOCK USER BUTTON -->
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            class="clr-secondary clr-lig-20"
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="unlockUser(item)"
          >
          <v-icon small>
            mdi-lock-open
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.unlock') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="openDeleteDialog(item)"
            v-if="!isLoggedInUser(item.username)"
          >
          <v-icon small color="red">
            mdi-delete
          </v-icon>
          </v-btn>
          <v-btn 
          v-else 
            disabled
            elevation="0" 
            icon 
            small>
            <v-icon small>
              mdi-delete
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.delete') }}</span>
      </v-tooltip>
    </template>
  </v-data-table>

  <!-- USER VIEW/EDIT DIALOG -->
  <v-dialog eager max-width="1200px" v-model="dialogs['userDialog']">
    <UserDialog
      :user="data.userdata"
      :editFlag="this.editableForm"
      :viewKey="'userDialog'"
      ref="UserDialog"
      :refreshLoading="loading"
      :fetchingData="fetchingData"
      @closeDialog="closeDialog"
      @save="userSaved"
      @goToGroup="goToGroup"
      @editToggle="setViewToEdit"
      @refreshUser="refreshUser"
      />
  </v-dialog>

  <!-- USER DELETE CONFIRM DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['userDelete']">
    <UserDelete
      :userObject="this.data.selectedUser"
      :viewKey="'userDelete'"
      ref="UserDelete"
      @closeDialog="closeDialog"
      @refresh="listUserItems"
    />
  </v-dialog>

  <!-- USER RESET PASSWORD DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['userResetPassword']">
    <UserResetPassword
      :userObject="this.data.selectedUser"
      :viewKey="'userResetPassword'"
      ref="UserResetPassword"
      @closeDialog="closeDialog"
    />
  </v-dialog>

  <!-- USER CREATE DIALOG -->
  <v-dialog eager max-width="1200px" v-model="dialogs['userCreate']">
    <UserCreate
      :viewKey="'userCreate'"
      ref="UserCreate"
      @closeDialog="closeDialog"
      />
  </v-dialog>
</div>
</template>

<script>
import User from '@/include/User'
import UserCreate from '@/components/User/UserCreate.vue'
import UserDialog from '@/components/User/UserDialog.vue'
import UserResetPassword from '@/components/User/UserResetPassword.vue'
import UserDelete from '@/components/User/UserDelete.vue'
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin'
import { notificationBus } from '@/main.js'

export default {
  mixins: [ validationMixin, utilsMixin ],
  components: {
    UserCreate,
    UserDialog,
    UserResetPassword,
    UserDelete
  },
  data() {
    return {
      tableData: {
        headers: [],
        items: []
      },
      searchString: "",
      loading: false,
      fetchingData: false,
      error: false,
      errorMsg: "",
      editableForm: false,

      // User Data
      data: {
        selectedUser: {
          "username": "",
          "distinguishedName": ""
        },
        userdata: {},
      },

      // Dialog States
      dialogs: {
        userDialog: false,
        userDelete: false,
        userResetPassword: false,
        userCreate: false,
      }
    }
  },
  created() {
    this.listUserItems();
  },
  props: {
    viewTitle: String,
    snackbarTimeout: Number
  },
  methods: {
    createSnackbar(notifObj){
      notificationBus.$emit('createNotification', notifObj);
    },
    resetSearch(){
      this.searchString = ""
    },
    goToGroup(groupDn){
      this.$emit('goToGroup', groupDn)
      this.closeDialog('userDialog')
    },
    openDialog(key){
      this.dialogs[key] = true;
      switch (key) {
        case 'userDialog':
          if (this.$refs.UserDialog != undefined)
            this.$refs.UserDialog.goBackToDetails()
          break;
        case 'userCreate':
          if (this.$refs.UserCreate != undefined)
            this.$refs.UserCreate.newUser()
          break;
        default:
          break;
      }
    },
    async closeDialog(key, refresh=false){
      this.dialogs[key] = false;
      if (refresh) {
        await this.listUserItems()
        if (key == 'userResetPassword')
          this.createSnackbar({message: this.$t("actions.passwordChanged").toUpperCase(), type: 'success'})
      }
    },
    setViewToEdit(value){
      this.editableForm = value;
    },
    // Reload Data Table Header Labels
    reloadDataTableHeaders(){
      this.tableData.headers.forEach(tableHeader => {
        if (tableHeader.value == "actions") {
          tableHeader.text = this.$t('actions.label')
        } else {
          tableHeader.text = this.$t('ldap.attributes.' + tableHeader.value)
        }
      });
    },
    // Reset Data Table variables
    resetDataTable(){
      this.tableData.headers = []
      this.tableData.items = []
    },
    // User Actions
    async listUserItems(emitNotif=true){
      this.loading = true
      this.error = false
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
          headerDict.text = this.$t('ldap.attributes.' + header)
          headerDict.value = header
          if (header == 'is_enabled') {
            headerDict.align = 'center'
            headerDict.sortable = false
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
        this.loading = false
        this.error = false
        if (emitNotif == true)
          this.createSnackbar({message: (this.$t("classes.user.plural") + " " + this.$t("words.loaded.plural.m")).toUpperCase(), type: 'success'})
      })
      .catch(error => {
        console.log(error)
        this.loading = false
        this.error = true
        this.createSnackbar({message: this.$t("error.unableToLoad").toUpperCase() + " " + this.viewTitle.toUpperCase(), type: 'error'})
      })
    },
    async unlockUser(userObject){
      await new User({}).unlock(userObject.username)
      .then(() => {
        this.loading = false
        this.error = false
        this.createSnackbar({message: this.$t("section.users.userUnlocked").toUpperCase(), type: 'success'})
      })
      .catch(error => {
        console.log(error)
        this.loading = false
        this.error = true
        this.createSnackbar({message: this.$t("section.users.errorUserUnlock").toUpperCase(), type: 'error'})
      })
    },
    isLoggedInUser(username){
      if (username == localStorage.getItem('username'))
        return true
      return false
    },
    async changeUserPassword(userObject) {
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      this.openDialog('userResetPassword')
    },
    openDeleteDialog(userObject) {
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      this.openDialog('userDelete')
    },
    async enableUser(userObject){
      this.loading = true
      this.error = false
      this.errorMsg = false
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      this.data.userdata = await new User({})
      await this.data.userdata.enable(this.data.selectedUser.username)
      .then(() => {
        this.loading = false
        this.error = false
        this.errorMsg = false
        this.listUserItems(false);
        notificationBus.$emit('createNotification', 
          {
            message: (this.$t("classes.user.single") + " " + this.$t("words.enabled")).toUpperCase(), 
            type: 'success'
          }
        );
      })
      .catch(error => {
        console.log(error)
        this.loading = false
        this.error = true
        this.errorMsg = this.getMessageForCode(error)
      })
    },
    async disableUser(userObject){
      this.loading = true
      this.error = false
      this.errorMsg = false
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      if (localStorage.getItem('username') == this.data.selectedUser.username) {
        this.openDialog('userAntilockout');
      }
      else {
        this.data.userdata = await new User({})
        await this.data.userdata.disable(this.data.selectedUser.username)
        .then(() => {
          this.loading = false
          this.error = false
          this.errorMsg = false
          this.listUserItems(false);
          notificationBus.$emit('createNotification', 
            {
              message: (this.$t("classes.user.single") + " " + this.$t("words.disabled")).toUpperCase(), 
              type: 'warning'
            }
          );
        })
        .catch(error => {
          console.log(error)
          this.loading = false
          this.error = true
          this.errorMsg = this.getMessageForCode(error)
        })
      }
    },
    async refreshUser(item){
      await this.fetchUser(item, this.editableForm, false);
      this.$refs.UserDialog.syncUser()
    },
    userSaved(){
      this.listUserItems(false)
      this.$refs.UserDialog.syncUser()
      this.createSnackbar({message: (this.$t("classes.user.single") + " " + this.$t("words.saved.single.m")).toUpperCase(), type: 'success'})
    },
    // Fetch individual User
    async fetchUser(item, isEditable=false, refreshAnim=true){
      if (refreshAnim == true)
        this.loading = true
      this.fetchingData = true
      this.data.selectedUser.username = item.username
      this.data.selectedUser.distinguishedName = item.distinguishedName
      this.data.userdata = new User({})
      await this.data.userdata.fetch(this.data.selectedUser.username)
      .then(() => {
        if (!this.dialogs.userDialog) {
          this.openDialog('userDialog')
          this.$refs.UserDialog.syncUser()
          this.$refs.UserDialog.setupExclude()
        }
        if (isEditable == true)
          this.editableForm = true
        else
          this.editableForm = false
        setTimeout(() => {
          this.loading = false
        }, 300);
        this.fetchingData = false
      })
      .catch(error => {
        console.log(error)
        if (error.response.data.code) {
            switch (error.response.data.code) {
                case 'user_group_fetch_error':
                    this.errorMsg = this.$t("error.codes.users.couldNotFetchGroups")
                    break;
                default:
                    this.errorMsg = this.$t("error.unknown_short")
                    break;
            }
        } else {
            this.errorMsg = this.$t("error.unknown_short")
        }
        this.loading = false
        this.fetchingData = false
        this.error = true;
      })
    },
  },
}
</script>
