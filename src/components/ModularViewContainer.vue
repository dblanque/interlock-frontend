<template>
<v-container class="my-4">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>

  <!-- HOME -->
  <v-container v-if="viewTitle == 'home'">
  <v-card class="pa-2">
    <v-row align="center" class="px-2 mx-1 py-0 my-0">
      <v-text-field
        v-model="searchString"
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
        {{ $t('actions.addN') }}
      </v-btn>
    </v-row>
    <v-card flat outlined class="ma-2 pa-2">
      <v-col cols="12">
        <h4>{{ $t('words.legend') }}</h4>
      </v-col>
      <!-- Item Legends -->
      <v-row class="px-4 ma-1" justify="center">
        <v-col v-for="item, key in itemTypes" :key="item" cols="12" md="auto" lg="auto">
          <v-chip :light="$vuetify.theme.dark" :dark="!$vuetify.theme.dark" color="">
            <v-icon>
              {{ item.icon }}
            </v-icon>
            <span class="text-overline ml-1">
              {{ $t('classes.' + key + '.single') }}
            </span>
          </v-chip>
        </v-col>
      </v-row>
    </v-card>
    <v-treeview 
      :items="this.tableDataItems"
      dense
      :search="searchString"
      hoverable
      open-on-click
      rounded
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
    </v-treeview>
  </v-card>
  </v-container>

  <!-- USERS -->
  <v-dialog eager max-width="1200px" v-model="dialogs['user']" v-if="viewTitle == 'users'">
    <UserView
      :user="data.userdata"
      :editFlag="this.editableForm"
      :viewKey="'user'"
      ref="UserView"
      :refreshLoading="userRefreshLoading"
      @closeDialog="closeDialog"
      @save="saveData"
      @editToggle="setViewToEdit"
      @refreshUser="fetchUser(data.selectedUser)"
      />
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
      :search="searchString"
      sort-by="sn"
      class="py-3 px-2">
      <!-- Table Header -->
      <template v-slot:top>
        <v-row align="center" class="px-2 mx-1 py-0 my-0">
          <v-text-field
            v-model="searchString"
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
        <div elevation="0" v-if="item.is_enabled">
          <v-icon class="clr-valid clr-lig-40">
            mdi-check
          </v-icon>
        </div>
        <div elevation="0" icon rounded v-else>
          <v-icon class="clr-error">
            mdi-close
          </v-icon>
        </div>
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
import UserView from '@/components/User/UserView.vue'
import UserCreate from '@/components/User/UserCreate.vue'

  export default {
    name: 'ModularViewContainer',
    components:{
    UserView,
    UserCreate
},
    props: {
      viewTitle: String,
      viewIndex: Number,
      tableDataHeaders: Array,
      tableDataItems: Array,
      refreshLoading: Boolean
    },
    data () {
      return {
        searchString: "",
        userRefreshLoading: false,
        error: false,
        editableForm: false,
        itemTypes: {
          "container":{
            "icon":"mdi-at"
          },
          "person":{
            "icon":"mdi-account"
          },
          "group":{
            "icon":"mdi-google-circles-communities"
          },
          "user":{
            "icon":"mdi-account"
          },
          "computer":{
            "icon":"mdi-monitor"
          },
          "organizational-unit":{
            "icon":"mdi-folder"
          },
        },
        data: {
          selectedUser: "",
          userdata: {},
        },
        dialogs: {
          user: false,
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
            // For every dialog type
            for (let key in newValue) {
              // When dialog[key] CLOSES, the code below executes
              if (newValue[key] == false) {
                switch (key) {
                  case 'user':
                    setTimeout(() => {  
                      this.data.selectedUser = ""
                      this.data.userdata = new User({})
                      this.editableForm = false
                    }, 100);
                    break;
                  case 'userCreate':
                    if (this.$refs.UserCreate != undefined)
                      setTimeout(() => {  
                        this.$refs.UserCreate.newUser()
                      }, 100);
                    break;
                  default:
                    break;
                }
              } 
              // When dialog[key] OPENS, the code below executes
              else {
                switch (key) {
                  case 'user':
                    if (this.$refs.UserView != undefined)
                      this.$refs.UserView.goBackToDetails()
                      this.$refs.UserView.syncUser()
                    break;
                  case 'userCreate':
                    if (this.$refs.UserCreate != undefined)
                      this.$refs.UserCreate.newUser()
                    break;
                  default:
                    break;
                }
              }
            }
        },
        deep: true
      }
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
      saveData(key, data){
        switch (key) {
          case 'user':
            break;
          default:
            console.log(key)
            console.log(data)
            break;
        }
        this.closeDialog(key)
      },
      // Fetch individual User
      async fetchUser(username, isEditable=false){
        this.userRefreshLoading = true;
        this.data.selectedUser = username
        this.data.userdata = await new User({})
        await this.data.userdata.fetch(username)
        .catch(error => {
          console.log(error)
          this.userRefreshLoading = false;
          this.error = true;
        })
        this.openDialog('user')
        if (isEditable == true)
          this.editableForm = true
        setTimeout(() => { this.userRefreshLoading = false }, 300);
        this.$refs.UserView.syncUser()
      },
      refreshAction() {
        this.$emit('refresh')
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
