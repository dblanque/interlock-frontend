<template>
<v-container class="my-4">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>

  <!-- HOME -->
  <v-container v-if="viewTitle == 'home'">
  <v-row justify="center" class="mb-2">
    <v-card class="pa-2" max-width="1200px">
      <!-- Actions Row -->
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-text-field clearable
          v-model="treeviewSearchString"
          :label="$t('actions.search')"
          class="mx-2"
        ></v-text-field>
        <v-btn 
          class="mx-2 bg-primary" 
          color="white" 
          icon
          elevation="0"
          :loading="refreshLoading"
          @click="refreshAction"
          >
          <v-icon>
            mdi-refresh
          </v-icon>
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
        <v-btn disabled class="pa-2 mx-2" color="primary" @click="openDialog('userCreate')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') }}
        </v-btn>
      </v-row>
  
      <!-- Item Legends -->
      <v-card flat outlined class="ma-1 pa-2">
        <v-col cols="12">
          <h4>{{ $t('words.legend') }}</h4>
        </v-col>
        <v-row class="px-4 ma-1" justify="center">
          <v-col v-for="(item, key) in itemTypes" :key="item.id" cols="12" md="auto" lg="auto">
            <v-chip 
            @click="setFilter(key)"
            :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark" 
            :color="item.filtered == true ? 'primary' : ''">
              <v-icon>
                {{ item.icon }}
              </v-icon>
              <span class="text-overline ml-1">
                {{ $t('classes.' + key + '.single') }}
              </span>
            </v-chip>
          </v-col>
        </v-row>
        <v-progress-linear 
        :indeterminate="refreshLoading" size="100" width="7"
        :color="!this.tableDataItems.length && this.errorLoading == true && !this.refreshLoading ? 'red' : 'primary'"/>
      </v-card>
  
      <!-- Tree View -->
      <v-card class="ma-1" flat outlined>
      <v-expand-transition>
            <v-treeview v-if="!refreshLoading"
              :items="this.tableDataItems"
              dense
              :search="treeviewSearchString"
              hoverable
              >
              <template v-slot:prepend="{ item, open }">
                  <v-icon v-if="item.type == 'Organizational-Unit'">
                    {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Computer'">
                    mdi-monitor
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Person' || item.type == 'User'">
                    mdi-account
                  </v-icon>
                  <v-icon v-else-if="item.type == 'Group'">
                    mdi-google-circles-communities
                  </v-icon>
                  <v-icon v-else>
                    mdi-at
                  </v-icon>
              </template>
              <template v-slot:label="{item}">
              <v-row align="start">
                <v-col cols="11" md="auto">
                  {{ item.name }}
                </v-col>
              </v-row>
              </template>
              <template v-slot:append="{item}">
                  <!-- User Buttons -->
                  <span v-if="(item.type == 'User' || item.type=='Person')">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="goToUser(item.username)"
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>
                            mdi-arrow-right-bold
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.goTo') + ' ' + $t('classes.user.single') }}</span>
                    </v-tooltip>
                  </span>
  
                  <!-- Group Buttons -->
                  <span>
                    <v-tooltip bottom v-if="item.type == 'Group'">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn disabled
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>
                            mdi-arrow-right-bold
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.goTo') + ' ' + $t('classes.group.single') }}</span>
                    </v-tooltip>
                  </span>

                  <!-- General Buttons -->
                  <span v-if="item.builtin != true">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn disabled
                          color="primary"
                          icon
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>
                            mdi-folder-move
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('actions.move') }}</span>
                    </v-tooltip>
                  </span>
              </template>
            </v-treeview>
      </v-expand-transition>
      <v-fab-transition>
        <v-icon class="ma-12" v-if="!this.tableDataItems.length && this.errorLoading == true && !this.refreshLoading" size="82" color="red">
          mdi-close-circle
        </v-icon>
      </v-fab-transition>
      </v-card>
    </v-card>
  </v-row>
  </v-container>

  <!-- USERS -->
  <v-dialog eager max-width="1200px" v-model="dialogs['userDialog']" v-if="viewTitle == 'users'">
    <UserDialog
      :user="data.userdata"
      :editFlag="this.editableForm"
      :viewKey="'userDialog'"
      ref="UserDialog"
      :refreshLoading="userRefreshLoading"
      @closeDialog="closeDialog"
      @save="saveData"
      @editToggle="setViewToEdit"
      @refreshUser="refreshUser(data.selectedUser)"
      />
  </v-dialog>

  <v-dialog eager max-width="800px" v-model="dialogs['userConfirm']" v-if="viewTitle == 'users'">
    <ConfirmDialog/>
  </v-dialog>

  <v-dialog eager max-width="1200px" v-model="dialogs['userCreate']" v-if="viewTitle == 'users'">
    <UserCreate
      :viewKey="'userCreate'"
      ref="UserCreate"
      @closeDialog="closeDialog"
      />
  </v-dialog>
  <v-container v-if="viewTitle == 'users'">
    <v-data-table
      :headers="this.tableDataHeaders"
      :items="this.tableDataItems"
      :custom-sort="sortNullLast"
      :loading="refreshLoading"
      :search="dataTableSearchString"
      sort-by="sn"
      class="py-3 px-2">
      <!-- Table Header -->
      <template v-slot:top>
        <v-row align="center" class="px-2 mx-1 py-0 my-0">
          <v-text-field
            v-model="dataTableSearchString"
            clearable
            :label="$t('actions.search')"
            class="mx-2"
          ></v-text-field>
          <v-btn 
            class="mx-2 bg-primary" 
            color="white" 
            icon
            elevation="0"
            :loading="refreshLoading"
            @click="refreshAction"
            >
            <v-icon>
              mdi-refresh
            </v-icon>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
          <v-btn class="pa-2 mx-2" color="primary" @click="openDialog('userCreate')">
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
              :disabled="userRefreshLoading"
              @click="disableUser(item.username)"
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
              :disabled="userRefreshLoading"
              @click="enableUser(item.username)"
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
        <v-btn elevation="0" icon small @click="fetchUser(item.username)">
          <v-icon class="clr-primary" small>
            mdi-eye
          </v-icon>
        </v-btn>
        <v-btn color="primary" elevation="0" icon small @click="fetchUser(item.username, true)">
          <v-icon small>
            mdi-pencil
          </v-icon>
        </v-btn>

        <!-- RESET PASSWORD BUTTON -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon
              rounded
              v-bind="attrs"
              v-on="on"
              small
              :disabled="userRefreshLoading"
              @click="changeUserPassword(item.username)"
            >
            <v-icon small color="red">
              mdi-key-variant
            </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('actions.changePassword') }}</span>
        </v-tooltip>

        <v-btn disabled color="red" elevation="0" icon small>
          <v-icon small>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
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

  <!-- Server -->
  <v-container v-if="viewTitle == 'server'">
  </v-container>

</v-container>
</template>

<script>
import User from '@/include/User'
import UserCreate from '@/components/User/UserCreate.vue'
import UserDialog from '@/components/User/UserDialog.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

  export default {
    name: 'ModularViewContainer',
    components:{
    UserCreate,
    UserDialog,
    ConfirmDialog
},
    props: {
      viewTitle: String,
      viewIndex: Number,
      tableDataHeaders: Array,
      tableDataItems: Array,
      errorLoading: Boolean,
      refreshLoading: Boolean
    },
    data () {
      return {
        dataTableSearchString: "",
        treeviewSearchString: "",
        userRefreshLoading: false,
        error: false,
        editableForm: false,
        itemTypes: {
          "container":{
            "filtered": false,
            "icon":"mdi-at"
          },
          "person":{
            "filtered": false,
            "icon":"mdi-account"
          },
          "group":{
            "filtered": false,
            "icon":"mdi-google-circles-communities"
          },
          "user":{
            "filtered": false,
            "icon":"mdi-account"
          },
          "computer":{
            "filtered": false,
            "icon":"mdi-monitor"
          },
          "organizational-unit":{
            "filtered":false,
            "icon":"mdi-folder"
          },
        },
        data: {
          selectedUser: "",
          userdata: {},
        },
        dialogsOld:{
          userDialog: false,
          userConfirm: false,
          userCreate: false,
          group: false,
          dns: false,
          gpo: false
        },
        dialogs: {
          userDialog: false,
          userConfirm: false,
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
      // Dialog Watcher
      // We want to handle what happens when a dialog closes here as the user 
      // might close it by clicking outside instead of clicking the close button
      dialogs: {
        handler: function (newValue) {
            var oldValue = this.dialogsOld
            // For every dialog type
            for (let key in newValue) {
              // console.log("Dialog value for "+key+": "+newValue[key])
              // console.log("Previous value for "+key+": "+oldValue[key])
              // When dialog[key] CLOSES, the code below executes
              if (oldValue[key] != newValue[key] && newValue[key] == false) {
                // console.log("Dialog closed for "+key+" - Current value: "+newValue[key])
                // console.log("Previous value for "+key+": "+oldValue[key])
                switch (key) {
                  case 'userDialog':
                    setTimeout(() => {
                      this.data.selectedUser = ""
                      this.data.userdata = new User({})
                      if (this.editableForm == true)
                        this.refreshAction();
                      this.editableForm = false
                    }, 100);
                    break;
                  case 'userCreate':
                    if (this.$refs.UserCreate != undefined)
                      setTimeout(() => {  
                        this.$refs.UserCreate.newUser()
                    }, 100);
                    this.refreshAction();
                    break;
                  default:
                    break;
                }
              } 
              // When dialog[key] OPENS, the code below executes
              else if (oldValue[key] != newValue[key] && newValue[key] == true) {
                // console.log("Dialog opened for "+key+" - Current value: "+newValue[key])
                // console.log("Previous value for "+key+": "+oldValue[key])
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
              }
              this.dialogsOld[key] = newValue[key]
            }
        },
        deep: true
      }
    },
    computed: {
    },
    methods: {
      setViewToEdit(value){
        this.editableForm = value;
      },
      openDialog(key){
        this.dialogs[key] = true;
      },
      closeDialog(key){
        this.dialogs[key] = false;
      },
      async saveData(key, data){
        switch (key) {
          case 'userDialog':
            break;
          default:
            console.log(key)
            console.log(data)
            break;
        }
        // this.closeDialog(key)
      },
      async refreshUser(username){
        await this.fetchUser(username, this.editableForm, false);
      },
      // Fetch individual User
      async fetchUser(username, isEditable=false, refreshAnim=true){
        if (refreshAnim == true)
          this.userRefreshLoading = true;
        this.data.selectedUser = username
        this.data.userdata = await new User({})
        await this.data.userdata.fetch(username)
        .then(() => {
          this.openDialog('userDialog')
          if (isEditable == true)
            this.editableForm = true
          setTimeout(() => { this.userRefreshLoading = false }, 300);
          this.$refs.UserDialog.syncUser()
        })
        .catch(error => {
          console.log(error)
          this.userRefreshLoading = false;
          this.error = true;
        })
      },
      setFilter(key){
        // this.itemTypes[key]['filtered'] = !this.itemTypes[key]['filtered']
        console.log('Feature not enabled, filter for ' + key.toUpperCase() + ' objects should toggle')
      },
      goToUser(username){
        this.$emit('goToUser', username)
      },
      refreshAction() {
        // Reset all filters if refreshing dirtree view
        if (this.viewTitle == 'home')
          Object.keys(this.itemTypes).forEach(key => {
            this.itemTypes[key]['filtered'] = false
          });
        this.$emit('refresh')
        this.userRefreshLoading = false;
      },
      async enableUser(username){
        this.userRefreshLoading = true;
        this.data.selectedUser = username
        this.data.userdata = await new User({})
        await this.data.userdata.enable(username)
        .then(() => {
          this.refreshAction();
        })
        .catch(error => {
          console.log(error)
          this.userRefreshLoading = false;
          this.error = true;
        })
      },
      async disableUser(username){
        this.userRefreshLoading = true;
        this.data.selectedUser = username
        this.data.userdata = await new User({})
        await this.data.userdata.disable(username)
        .then(() => {
          this.refreshAction();
        })
        .catch(error => {
          console.log(error)
          this.userRefreshLoading = false;
          this.error = true;
        })
      },
      async changeUserPassword(username) {
        console.log(username)
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
      }
    }
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
