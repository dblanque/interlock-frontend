<template>
<div>
  <v-data-table
    :headers="this.tableData.headers"
    :items="this.tableData.items"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    sort-by="cn"
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
            @click="listGroupItems"
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
          <v-btn class="pa-2 mx-2" :disabled="loading || readonly" color="primary" @click="openDialog('groupCreate')">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.group.single') }}
          </v-btn>
        </v-row>
      </v-row>
    </template>

    <!-- GROUP TYPE -->
    <template v-slot:[`item.groupType`]="{ item }">
      <div class="pt-2">
        <v-chip 
        :class="getColorForGroupType(type)['color'] + ' text-' + getColorForGroupType(type)['text'] + ' mx-1 mb-2'" 
        v-for="type in item.groupType" 
        :key="type">
          {{ $t('section.groups.types.'+type) }}
        </v-chip>
      </div>
    </template>


    <!-- GROUP POPULATION -->
    <template v-slot:[`item.hasMembers`]="{ item }">
        <!-- Group is Populated -->
        <v-tooltip color="primary" bottom v-if="item.hasMembers">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            class="clr-primary">
            mdi-account-multiple
          </v-icon>
        </template>
        <span>{{ $t('section.groups.isPopulated') }}</span>
      </v-tooltip>

      <!-- Group is not populated -->
      <v-tooltip color="secondary" bottom v-else-if="!item.hasMembers">
        <template v-slot:activator="{ on, attrs }">
          <v-icon
            v-bind="attrs"
            v-on="on"
            style="opacity: 0.35;">
            mdi-account-multiple
          </v-icon>
        </template>
        <span>{{ $t('section.groups.isNotPopulated') }}</span>
      </v-tooltip>
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
            :disabled="loading || readonly"
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
            :disabled="loading || readonly"
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
          <v-btn icon v-show="!loading && !readonly && !item.groupType.includes('GROUP_SYSTEM') && !item.cn.startsWith('Domain ')"
            rounded
            v-bind="attrs"
            v-on="on"
            small
            :disabled="loading || readonly || item.groupType.includes('GROUP_SYSTEM') || item.cn.startsWith('Domain ')"
            @click="openDeleteDialog(item)"
          >
          <v-icon small color="red">
            mdi-delete
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.delete') }}</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <span v-bind="attrs" v-on="on"
              v-show="loading || readonly || item.groupType.includes('GROUP_SYSTEM') || item.cn.startsWith('Domain ')">
            <v-btn icon
              rounded
              small
              disabled>
            <v-icon small>
              mdi-delete
            </v-icon>
            </v-btn>
          </span>
        </template>
        <span>{{ $t('section.groups.groupBuiltinCannotDelete') }}</span>
      </v-tooltip>
    </template>
  </v-data-table>

  <!-- GROUP VIEW/EDIT DIALOG -->
  <v-dialog eager max-width="1200px" v-model="dialogs['groupDialog']">
    <GroupDialog
      :group="data.groupdata"
      :editFlag="this.editableForm"
      :viewKey="'groupDialog'"
      ref="GroupDialog"
      :refreshLoading="loading"
      :fetchingData="fetchingData"
      @closeDialog="closeDialog"
      @save="groupSaved"
      @editToggle="setViewToEdit"
      @refreshGroup="refreshGroup"
      />
  </v-dialog>

  <!-- GROUP DELETE CONFIRM DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['groupDelete']">
    <GroupDelete
      :groupObject="this.data.selectedGroup"
      :viewKey="'groupDelete'"
      ref="GroupDelete"
      @closeDialog="closeDialog"
      @refresh="listGroupItems"
    />
  </v-dialog>

  <!-- GROUP CREATE DIALOG -->
  <v-dialog eager max-width="1200px" v-model="dialogs['groupCreate']">
    <GroupCreate
      :viewKey="'groupCreate'"
      ref="GroupCreate"
      @closeDialog="closeDialog"
      />
  </v-dialog>
</div>
</template>

<script>
import Group from '@/include/Group';
import GroupDialog from '@/components/Group/GroupDialog.vue'
import GroupCreate from '@/components/Group/GroupCreate.vue'
import GroupDelete from '@/components/Group/GroupDelete.vue'

export default {
  components: {
    GroupDialog,
    GroupCreate,
    GroupDelete
  },
  data() {
    return {
      readonly: false,
      fetchingData: false,
      expandedRows: [],
      tableData: {
        headers: [],
        items: []
      },
      searchString: "",
      loading: false,
      error: false,
      editableForm: false,

      // Group Data
      data: {
        selectedGroup: {
          "cn": "",
          "distinguishedName": ""
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
  created() {
    this.listGroupItems();
  },
  props: {
    viewTitle: String,
    snackbarTimeout: Number,
  },
  methods: {
    resetSearch(){
      this.searchString = ""
    },
    openDialog(key){
      this.dialogs[key] = true;
      switch (key) {
        case 'groupDialog':
          if (this.$refs.GroupDialog != undefined)
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
    groupSaved(){
      this.$refs.GroupCreate.newGroup()
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
        var groupHeaders = response.headers
        var groups = response.groups
        // Reset Headers Array every time you list to avoid infinite header multiplication
        this.resetDataTable()
        var headerDict = {}
        groupHeaders.forEach(header => {
          headerDict = {}
          headerDict.text = this.$t('ldap.attributes.' + header)
          headerDict.value = header
          if (header == 'hasMembers') {
            headerDict.sortable = false
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
        this.tableData.items = groups
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
      await this.fetchGroup(item, this.editableForm, false).then(()=>{
        this.$refs.GroupDialog.syncGroup()
      });
    },
    // Fetch individual Group
    async fetchGroup(item, isEditable=false, refreshAnim=true){
      if (refreshAnim == true)
        this.loading = true
      this.fetchingData = true
      this.data.selectedGroup.cn = item.cn
      this.data.selectedGroup.distinguishedName = item.distinguishedName
      this.data.groupdata = new Group({})
      await this.data.groupdata.fetch(this.data.selectedGroup.distinguishedName)
      .then(() => {
        this.openDialog('groupDialog')
        if (isEditable == true)
          this.editableForm = true
        setTimeout(() => { 
          this.loading = false 
        }, 300);
        this.fetchingData = false
      })
      .catch(error => {
        console.log(error)
        this.loading = false
        this.fetchingData = false
        this.error = true
      })
    },
    getColorForGroupType(groupType){
      switch (groupType) {
        case 'GROUP_DISTRIBUTION':
          return {
            "color":'orange',
            "text":'black'
            }
        case 'GROUP_SYSTEM':
          return {
            "color":'secondary',
            "text":'white'
            }
        case 'GROUP_GLOBAL':
          return {
            "color":'secondary',
            "text":'white'
            }
        case 'GROUP_DOMAIN_LOCAL':
          return {
            "color":'green',
            "text":'white'
            }
        case 'GROUP_UNIVERSAL':
          return {
            "color":'blue-grey',
            "text":'white'
            }
        default:
          return {
            "color":'primary',
            "text":'white'
            }
      }
    },
  },
}
</script>
