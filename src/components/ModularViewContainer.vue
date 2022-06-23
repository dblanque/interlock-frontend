<template>
<v-container class="my-4">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>

  <!-- USERS -->
  <v-dialog eager max-width="1200px" v-model="dialogs['user']" v-if="viewTitle == 'users'">
    <UserView
      :user="data.userdata"
      :editFlag="false"
      :viewKey="'user'"
      ref="UserView"
      :refreshLoading="userRefreshLoading"
      @closeDialog="closeDialog"
      @refreshUser="fetchUser(data.selectedUser)"
      />
  </v-dialog>
  <v-container v-if="viewTitle == 'users'">
    <v-data-table
      :headers="this.tableDataHeaders"
      :items="this.tableDataItems"
      :custom-sort="sortNullLast"
      :loading="false"
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
          <v-btn disabled class="pa-2 mx-2" color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.user.single') }}
          </v-btn>
        </v-row>
      </template>
      <!-- USER IS ENABLED STATUS -->
      <template v-slot:[`item.is_enabled`]="{ item }">
        <div elevation="0" v-if="item.is_enabled">
          <v-icon class="clr-valid">
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
        <v-btn disabled color="primary" elevation="0" icon small>
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

  export default {
    name: 'ModularViewContainer',
    components:{
      UserView
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
        data: {
          selectedUser: "",
          userdata: {}
        },
        dialogs: {
          user: false,
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
                    this.data.selectedUser = ""
                    this.data.userdata = new User({})
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
                      this.$refs.UserView.syncUser()
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
      openDialog(key){
        this.dialogs[key] = true;
      },
      closeDialog(key){
        this.dialogs[key] = false;
      },
      async fetchUser(username){
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
        setTimeout(() => { this.userRefreshLoading = false }, 200);
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
