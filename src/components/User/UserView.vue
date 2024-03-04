<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserView.vue -------------------------------->
<template>
<div>
  <v-data-table
    :headers="tableData.headers"
    :show-select="true"
    item-key="distinguishedName"
    v-model="tableData.selected"
    :items="tableData.items"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    :footer-props="{
      'items-per-page-options': [10, 25, 50, 100, -1]
    }"
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
          <refresh-button dense
            :loading="loading"
            @refresh="listUserItems"/>
          <v-btn class="pa-2 mx-2" :disabled="loading" color="primary" @click="openDialog('userCreate')">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $tc('classes.user', 1) }}
          </v-btn>
        </v-row>
      </v-row>
      <v-row class="ma-0 pa-0 px-4" justify="center">
          <!-- Import Button -->
          <v-btn class="pa-2 mx-2" small
          :dark="!loading && !isThemeDark($vuetify)" 
          :light="!loading && isThemeDark($vuetify)"
          :disabled="loading" 
          @click="openDialog('userImport')">
            <v-icon small class="ma-0 pa-0 mr-1">mdi-file-import</v-icon>
            {{ $t('actions.import') }}
          </v-btn>
          <!-- Mass Enable Button -->
          <v-btn class="pa-2 mx-2" small
          :dark="!actionButtonsDisabled" 
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          color="green" @click="massAccountStatusChange(false)"
          :disabled="loading || tableData.selected.length < 1">
            <v-icon small class="ma-0 pa-0 mr-1">mdi-check</v-icon>
            {{ $t('actions.enable') }}
          </v-btn>
          <!-- Mass Disable Button -->
          <v-btn class="pa-2 mx-2" small
          color="red"
          :dark="!actionButtonsDisabled"
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          @click="massAccountStatusChange(true)"
          :disabled="loading || tableData.selected.length < 1">
            <v-icon small class="ma-0 pa-0 mr-1">mdi-close</v-icon>
            <span :color="actionButtonsDisabled ? 'error' : 'error-70-s'">
              {{ $t('actions.disable') }}
            </span>
          </v-btn>
          <!-- Mass Unlock Button -->
          <v-btn class="pa-2 mx-2" small
          @click="massUnlock()"
          :dark="!actionButtonsDisabled && !isThemeDark($vuetify)" 
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          :disabled="actionButtonsDisabled">
          <span>
            <v-icon small class="ma-0 pa-0 mr-1">mdi-lock-open</v-icon>
            {{ $t('actions.unlock') }}
          </span>
          </v-btn>
          <!-- Mass Edit Button -->
          <v-btn class="pa-2 mx-2" small
          :dark="!actionButtonsDisabled"
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          color="primary" @click="openBulkOperationDialog('userBulkEdit')"
          :disabled="actionButtonsDisabled || true">
            <v-icon small dark :color="actionButtonsDisabled ? undefined : 'white'" class="ma-0 pa-0 mr-1">mdi-pencil</v-icon>
            <span :color="actionButtonsDisabled ? undefined : 'white'">
              {{ $t('actions.edit') }}
            </span>
          </v-btn>
          <!-- Mass Delete Button -->
          <v-btn class="pa-2 mx-2" small
          :dark="!actionButtonsDisabled" 
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          color="red" @click="openBulkOperationDialog('userDelete')"
          :disabled="actionButtonsDisabled">
            <v-icon small dark :color="actionButtonsDisabled ? undefined : 'white'" class="ma-0 pa-0 mr-1">mdi-delete</v-icon>
            <span :color="actionButtonsDisabled ? undefined : 'white'">
              {{ $t('actions.delete') }}
            </span>
          </v-btn>
          <!-- Bulk Change User Permissions Button -->
          <v-btn class="pa-2 mx-2" small v-if="false"
          :dark="!actionButtonsDisabled && !isThemeDark($vuetify)" 
          :light="!actionButtonsDisabled && isThemeDark($vuetify)"
          color="primary" @click="openDialog('bulkUserPermissions')"
          :disabled="actionButtonsDisabled">
            <v-icon small :color="actionButtonsDisabled ? undefined : 'white'"
              class="ma-0 pa-0 mr-1">
              mdi-shield-account
            </v-icon>
            <span :color="actionButtonsDisabled ? undefined : 'white'">
              {{ $t('actions.massChangeUserPerms') }}
            </span>
          </v-btn>
      </v-row>
    </template>
    <!-- USER IS ENABLED STATUS -->
    <template v-slot:[`item.is_enabled`]="{ item }">

        <!-- Same User Icon -->
        <v-tooltip bottom v-if="isLoggedInUser(item.username)">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            color="primary">
            mdi-account
          </v-icon>
        </template>
        <span>{{ $t('section.users.youAreHere') }} 
          <v-icon color="white">mdi-emoticon</v-icon>
        </span>
      </v-tooltip>

      <!-- Enable User Button -->
      <v-tooltip color="red" bottom v-else-if="item.is_enabled">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || isLoggedInUser(item.username)"
            @click="disableUser(item)"
          >
          <v-icon :color="!isLoggedInUser(item.username) ? 'valid-40-s': ''">
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
          <v-icon :color="!isLoggedInUser(item.username) ? 'error-60-s': ''">
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
          <v-btn icon color="secondary-20"
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
            @click="openBulkOperationDialog('userDelete', item)"
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
      @refreshUserList="listUserItems(false)"
      />
  </v-dialog>

  <!-- USER DELETE CONFIRM DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['userDelete']">
    <UserDelete
      :userObject="this.data.selectedUser"
      :userObjectList="tableData.selected"
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

  <!-- USER IMPORT DIALOG -->
  <v-dialog eager persistent max-width="1600px" v-model="dialogs['userImport']">
    <UserImport
      :viewKey="'userImport'"
      ref="UserImport"
      @closeDialog="closeDialog"
      />
  </v-dialog>

  <!-- USER EDIT DIALOG -->
  <v-dialog eager max-width="1600px" v-model="dialogs['userBulkEdit']">
    <UserBulkEdit
      :viewKey="'userBulkEdit'"
      ref="UserBulkEdit"
      :refreshLoading="loading"
      @closeDialog="closeDialog"
      />
  </v-dialog>

  <!-- USER PERMISSION LIST DIALOG -->
  <v-dialog eager max-width="1600px" v-model="dialogs['bulkUserPermissions']">
    <v-card>
      <!-- Title Bar -->
      <v-card-title class="ma-0 pa-0 card-title">
          <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
              <h3 class="pa-0 ma-0 ma-2">
                  bulkUserPermissionsView
              </h3>
              <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
              <v-btn icon color="red" class="ma-2" rounded 
                @click="closeDialog('bulkUserPermissions')">
                  <v-icon>
                      mdi-close
                  </v-icon>
              </v-btn>
          </v-row>
      </v-card-title>
      <UserPermissionList
        :viewKey="'bulkUserPermissions'"
        ref="BulkUserPermissions"
        :editFlag="true"
        @closeDialog="closeDialog"
        />
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import User from '@/include/User.js'
import UserCreate from '@/components/User/UserCreate.vue'
import UserImport from '@/components/User/UserImport.vue'
import UserDialog from '@/components/User/UserDialog.vue'
import UserBulkEdit from '@/components/User/UserBulkEdit.vue';
import UserResetPassword from '@/components/User/UserResetPassword.vue'
import UserPermissionList from '@/components/User/UserPermissionList.vue'
import UserDelete from '@/components/User/UserDelete.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import { notificationBus } from '@/main.js'

export default {
  name: 'UserView',
  mixins: [ validationMixin, utilsMixin ],
  components: {
    UserCreate,
    UserImport,
    UserDialog,
    UserResetPassword,
    UserPermissionList,
    UserDelete,
    RefreshButton
  },
  data() {
    return {
      tableData: {
        headers: [],
        items: [],
        selected: []
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
        userImport: false,
        userDelete: false,
        userResetPassword: false,
        userCreate: false,
        bulkUserPermissions: false,
        userBulkEdit: false
      }
    }
  },
  created() {
    this.listUserItems();
  },
  computed: {
    actionButtonsDisabled() {
      return this.loading || this.tableData.selected.length < 1
    }
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
        case 'userResetPassword':
          if (this.$refs.UserResetPassword != undefined)
            this.$refs.UserResetPassword.clearUser()
          break;
        case 'userImport':
          if (this.$refs.UserImport != undefined)
            this.$refs.UserImport.clearData()
          break;
        case 'bulkUserPermissions':
          if (this.$refs.BulkUserPermissions != undefined)
            this.$refs.BulkUserPermissions.init()
          break;
        default:
          break;
      }
    },
    async closeDialog(key, refresh=false){
      this.dialogs[key] = false;
      if (refresh) {
        var emitNotif
        switch (key) {
          case 'userResetPassword':
              emitNotif = false
              this.createSnackbar({
                message: this.$t("actions.passwordChanged").toUpperCase(), 
                type: 'success'
              })
            break;
          case 'userImport':
              emitNotif = false
              this.createSnackbar({
                message: this.$t('section.users.import.bulkImportSuccess').toUpperCase(), 
                type: 'success'
              })
            break;
          case 'userDelete':
              emitNotif = false
              this.createSnackbar({
                message: this.$t('section.users.deleteUser.success').toUpperCase(), 
                type: 'info'
              })
            break;
          default:
              emitNotif = true
            break;
        }
        await this.listUserItems(emitNotif)
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
      this.tableData.selected = []
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
        for (let i = 0; i < this.tableData.items.length; i++) {
          const user = this.tableData.items[i];
          if (user.username == localStorage.getItem('username') ||
              user.username == 'Administrator' && localStorage.getItem('username') == 'admin') {
            this.tableData.items[i]["isSelectable"] = false
            break
          }
        }
        this.loading = false
        this.error = false
        if (emitNotif == true)
          this.createSnackbar({message: (this.$tc("classes.user", users.length) + " " + this.$tc("words.loaded.m", users.length)).toUpperCase(), type: 'success'})
      })
      .catch(error => {
        console.error(error)
        this.loading = false
        this.error = true
        this.errorMsg = this.getMessageForCode(error)
        notificationBus.$emit('createNotification', 
            {message: this.errorMsg.toUpperCase(), type: 'error'}
        )
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
        console.error(error)
        this.loading = false
        this.error = true
        this.createSnackbar({message: this.$t("section.users.errorUserUnlock").toUpperCase(), type: 'error'})
      })
    },
    isLoggedInUser(username){
      if (username == localStorage.getItem('username') || username == 'Administrator' && localStorage.getItem('username') == 'admin' )
        return true
      return false
    },
    async changeUserPassword(userObject) {
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      this.openDialog('userResetPassword')
    },
    openBulkOperationDialog(dialogRef, userObject) {
      this.data.selectedUser = {}
      if (userObject) {
        this.tableData.selected = []
        this.data.selectedUser = userObject
      }
      if (this.data.selectedUser || this.tableData.selected.length > 0)
        this.openDialog(dialogRef)
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
            message: (this.$tc("classes.user", 1) + " " + this.$t("words.enabled")).toUpperCase(), 
            type: 'success'
          }
        );
      })
      .catch(error => {
        console.error(error)
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
          this.errorMsg = ""
          this.listUserItems(false);
          notificationBus.$emit('createNotification', 
            {
              message: (this.$tc("classes.user", 1) + " " + this.$t("words.disabled")).toUpperCase(), 
              type: 'warning'
            }
          );
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.error = true
          this.errorMsg = this.getMessageForCode(error)
          notificationBus.$emit('createNotification', 
              {message: this.errorMsg.toUpperCase(), type: 'error'}
          )
        })
      }
    },
    async refreshUser(item){
      await this.fetchUser(item, this.editableForm, false);
      this.$refs.UserDialog.syncUser()
    },
    async massAccountStatusChange(disable){
      this.loading = true
      this.error = false
      this.errorMsg = ""
      const current_user = localStorage.getItem('username')
      const actionMsg = disable ? this.$t("words.disabled") : this.$t("words.enabled")
      const actionType = disable ? 'warning' : 'success'
      if (this.tableData.selected.find(v => v == current_user)) {
        this.openDialog('userAntilockout');
      }
      else {
        await new User({}).bulkAccountStatusChange({
          "disable": disable,
          "users": this.tableData.selected
        })
        .then(() => {
          this.loading = false
          this.error = false
          this.errorMsg = ""
          this.listUserItems(false);
          notificationBus.$emit('createNotification', 
            {
              message: (this.$tc("classes.user", this.tableData.selected.length) + " " + actionMsg).toUpperCase(), 
              type: actionType
            }
          );
        })
        .catch(error => {
          console.error(error)
          this.loading = false
          this.error = true
          this.errorMsg = this.getMessageForCode(error)
          this.listUserItems(false);
          notificationBus.$emit('createNotification', 
              {message: this.errorMsg.toUpperCase(), type: 'error'}
          )
        })
      }
    },
    async massUnlock(){
      this.loading = true
      this.error = false
      this.errorMsg = false
      await new User({}).bulkUnlock(this.tableData.selected)
      .then(() => {
        this.loading = false
        this.error = false
        this.errorMsg = false
        this.listUserItems(false);
        notificationBus.$emit('createNotification', 
          {
            message: (this.$tc("classes.user", this.tableData.selected.length) + " " + this.$tc("words.unlocked.n", this.tableData.selected.length).toUpperCase()).toUpperCase(),
            icon: 'mdi-lock-open',
            type: 'info'
          }
        );
      })
      .catch(error => {
        console.error(error)
        this.loading = false
        this.error = true
        this.errorMsg = this.getMessageForCode(error)
        notificationBus.$emit('createNotification', 
            {message: this.errorMsg.toUpperCase(), type: 'error'}
        )
        this.listUserItems(false);
      })
    },
    openPermChangeDialog(){
      console.log('Permissions Change WIP')
    },
    userSaved(){
      this.listUserItems(false)
      this.$refs.UserDialog.syncUser()
      this.createSnackbar({message: (this.$tc("classes.user", 1) + " " + this.$tc("words.saved.m", 1)).toUpperCase(), type: 'success'})
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
        console.error(error)
        this.errorMsg = this.getMessageForCode(error)
        notificationBus.$emit('createNotification', 
            {message: this.errorMsg.toUpperCase(), type: 'error'}
        )
        this.loading = false
        this.fetchingData = false
        this.error = true;
      })
    },
  },
}
</script>
