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
          <v-icon class="clr-valid clr-lig-40">
            mdi-check
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.disable') }}</span>
      </v-tooltip>

      <!-- Disable User Button -->
      <v-tooltip color="green" bottom v-if="!item.is_enabled">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || isLoggedInUser(item.username)"
            @click="enableUser(item)"
          >
          <v-icon class="clr-error clr-lig-40">
            mdi-close
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.enable') }}</span>
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
            @click="fetchUser(item)"
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
      @closeDialog="closeDialog"
      @save="userSaved"
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

export default {
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
      error: false,
      editableForm: false,

      // User Data
      data: {
        selectedUser: {
          "username": "",
          "dn": ""
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
  mounted() {
    this.listUserItems();
  },
  props: {
    viewTitle: String,
    snackbarTimeout: Number,
    requestRefresh: Boolean
  },
  watch: {
    // Watch for parent components requesting a Refresh
    requestRefresh(newValue) {
      if (newValue == true)
        this.listUserItems
    },
  },
  methods: {
    openDialog(key){
      this.dialogs[key] = true;
      switch (key) {
        case 'userDialog':
          if (this.$refs.UserDialog != undefined)
            this.$refs.UserDialog.goBackToDetails()
            this.$refs.UserDialog.syncUser()
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
      if (refresh)
        this.listUserItems()
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
    resetSnackbar(){
      this.$emit('resetSnackbar')
    },
    createSnackbar(color, string){
      this.$emit('createSnackbar', color, string)
    },
    // User Actions
    async listUserItems(){
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
        this.resetSnackbar();
        this.createSnackbar('green', (this.$t("classes.user.plural") + " " + this.$t("words.loaded.plural.m")).toUpperCase() )
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
      .catch(error => {
        console.log(error)
        this.loading = false
        this.error = true
        this.resetSnackbar();
        this.createSnackbar('red', this.$t("error.unableToLoad").toUpperCase() + " " + this.viewTitle.toUpperCase())
        setTimeout(() => {  this.resetSnackbar() }, this.snackbarTimeout);
      })
    },
    sortNullLast(items, index, isDesc) {
      items.sort((a, b) => {
        if (a[index] === b[index]) { // equal items sort equally
          return 0;
        } else if (a[index] === null || a[index] === '') { // nulls sort after anything else
          return 1;
        } else if (b[index] === null || b[index] === '') {
          return -1;
        } else if (!isDesc[0]) { // otherwise, if we're ascending, lowest sorts first
          return a[index] < b[index] ? -1 : 1;
        } else { // if descending, highest sorts first
          return a[index] < b[index] ? 1 : -1;
        }
      });
      return items;
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
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      this.data.userdata = await new User({})
      await this.data.userdata.enable(this.data.selectedUser.username)
      .then(() => {
        this.listUserItems();
      })
      .catch(error => {
        console.log(error)
      })
    },
    async disableUser(userObject){
      this.data.selectedUser = {}
      this.data.selectedUser = userObject
      if (localStorage.getItem('username') == this.data.selectedUser.username) {
        this.openDialog('userAntilockout');
      }
      else {
        this.data.userdata = await new User({})
        await this.data.userdata.disable(this.data.selectedUser.username)
        .then(() => {
          this.listUserItems();
        })
        .catch(error => {
          console.log(error)
        })
      }
    },
    async refreshUser(item){
      await this.fetchUser(item, this.editableForm, false);
    },
    userSaved(){
      this.$refs.UserCreate.newUser()
      this.listUserItems()
    },
    // Fetch individual User
    async fetchUser(item, isEditable=false, refreshAnim=true){
      if (refreshAnim == true)
        this.loading = true;
      this.data.selectedUser.username = item.username
      this.data.selectedUser.dn = item.dn
      this.data.userdata = await new User({})
      await this.data.userdata.fetch(item.username)
      .then(() => {
        this.openDialog('userDialog')
        if (isEditable == true)
          this.editableForm = true
        setTimeout(() => { this.loading = false }, 300);
      })
      .catch(error => {
        console.log(error)
        this.loading = false;
        this.error = true;
      })
    },
  },
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>