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
          @click="listGroupItems"
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
        <v-btn class="pa-2 mx-2" color="primary" @click="openDialog('groupCreate')">
          <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
          {{ $t('actions.addN') + ' ' + $t('classes.group.single') }}
        </v-btn>
      </v-row>
    </template>

    <!-- GROUP ACTIONS -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading"
            @click="fetchGroup(item)"
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
            @click="fetchGroup(item, true)"
          >
          <v-icon small color="primary">
            mdi-pencil
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.edit') }}</span>
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
          >
          <v-icon small color="red">
            mdi-delete
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.delete') }}</span>
      </v-tooltip>
    </template>
  </v-data-table>

  <!-- USER VIEW/EDIT DIALOG -->
  <!-- <v-dialog eager max-width="1200px" v-model="dialogs['groupDialog']">
    <GroupDialog
      :user="data.userdata"
      :editFlag="this.editableForm"
      :viewKey="'groupDialog'"
      ref="GroupDialog"
      :refreshLoading="loading"
      @closeDialog="closeDialog"
      @save="userSaved"
      @editToggle="setViewToEdit"
      @refreshUser="refreshUser"
      />
  </v-dialog> -->

  <!-- USER DELETE CONFIRM DIALOG -->
  <!-- <v-dialog eager max-width="800px" v-model="dialogs['groupDelete']">
    <GroupDelete
      :groupObject="this.data.selectedUser"
      :viewKey="'groupDelete'"
      ref="GroupDelete"
      @closeDialog="closeDialog"
      @refresh="listUserItems"
    />
  </v-dialog> -->

  <!-- USER CREATE DIALOG -->
  <!-- <v-dialog eager max-width="1200px" v-model="dialogs['groupCreate']">
    <GroupCreate
      :viewKey="'groupCreate'"
      ref="GroupCreate"
      @closeDialog="closeDialog"
      />
  </v-dialog> -->
</div>
</template>

<script>
import Group from '@/include/Group'
// import GroupCreate from '@/components/User/GroupCreate.vue'
// import GroupDialog from '@/components/User/GroupDialog.vue'
// import GroupDelete from '@/components/User/GroupDelete.vue'

export default {
  components: {
    // GroupCreate,
    // GroupDialog,
    // GroupDelete
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
        selectedGroup: {
          "cn": "",
          "dn": ""
        },
        groupdata: {},
      },

      // Dialog States
      dialogs: {
        groupDialog: false,
        groupDelete: false,
        groupCreate: false
      }
    }
  },
  mounted() {
    this.listGroupItems();
  },
  props: {
    viewTitle: String,
    snackbarTimeout: Number,
    requestRefresh: Boolean
  },
  watch: {
    // Watch for parent components requesting a Refresh
    requestRefresh(newValue) {
      if (newValue == false){
        console.log("Refresh")
        this.listGroupItems()
      }
    },
  },
  methods: {
    openDialog(key){
      this.dialogs[key] = true;
      switch (key) {
        case 'groupDialog':
          if (this.$refs.GroupDialog != undefined)
            this.$refs.GroupDialog.goBackToDetails()
            this.$refs.GroupDialog.syncGroup()
          break;
        case 'groupCreate':
          if (this.$refs.GroupCreate != undefined)
            this.$refs.GroupCreate.newGroup()
          break;
        default:
          break;
      }
    },
    async closeDialog(key, refresh=false){
      this.dialogs[key] = false;
      if (refresh)
        this.listGroupItems()
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
    // Group Actions
    async listGroupItems(){
      this.loading = true
      this.error = false
      this.tableData.headers = []
      this.tableData.items = []
      await new Group({}).list()
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
        this.createSnackbar('green', (this.$t("classes.group.plural") + " " + this.$t("words.loaded.plural.m")).toUpperCase() )
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
    openDeleteDialog(groupObject) {
      this.data.selectedGroup = {}
      this.data.selectedGroup = groupObject
      this.openDialog('groupDelete')
    },
    async refreshGroup(item){
      await this.fetchGroup(item, this.editableForm, false);
    },
    userSaved(){
      this.$refs.GroupCreate.newGroup()
      this.listGroupItems()
    },
    // Fetch individual Group
    async fetchGroup(item, isEditable=false, refreshAnim=true){
      if (refreshAnim == true)
        this.loading = true;
      this.data.selectedGroup.cn = item.cn
      this.data.selectedGroup.dn = item.dn
      this.data.userdata = await new Group({})
      await this.data.userdata.fetch(item.cn)
      .then(() => {
        this.openDialog('groupDialog')
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