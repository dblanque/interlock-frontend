<template>
<div>
  <v-data-table
    :headers="this.tableData.headers"
    :items="this.tableData.items"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    sort-by="date"
    :sort-desc="true"
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
          @click="listLogs"
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
      </v-row>
    </template>

    <template v-slot:[`item.actionType`]="{ item }">
        <v-chip :color="getColorForActionType(item.actionType)[0]" :class="'text-' + (getColorForActionType(item.actionType)[1] || 'inverted')" :text-color="getColorForActionType(item.actionType)[1] || undefined">
            {{ $t("section.logs.actionType." + item.actionType) }}
        </v-chip>
    </template>

    <template v-slot:[`item.objectClass`]="{ item }">
        <v-row justify="center" align="center" class="pr-6">
            <v-icon class="mr-1" :color="getIconForObjectClass(item.objectClass)[1] || undefined">
                {{ getIconForObjectClass(item.objectClass)[0] }}
            </v-icon>
            <span>
                {{ $t('classes.' + getObjectClassTranslationKey(item.objectClass) + '.single') }}
            </span>
        </v-row>
    </template>
  </v-data-table>

</div>
</template>

<script>
import Log from '@/include/Log';

export default {
  components: {
  },
  data() {
    return {
      readonly: false,
      fetchingData: false,
      tableData: {
        headers: [],
        items: []
      },
      searchString: "",
      loading: false,
      error: false,

      // Dialog States
      dialogs: {
        logDelete: false
      }
    }
  },
  mounted() {
    this.listLogs();
  },
  props: {
    viewTitle: String
  },
  methods: {
    getObjectClassTranslationKey(objectClass){
        switch (objectClass) {
            case 'USER':
                return 'user'
            case 'GROUP':
                return 'group'
            case 'OU':
                return 'organizational-unit'
            case 'DOM':
                return 'domain-entry'
            case 'GPO':
                return 'group-policy-object'
            case 'CONN':
                return 'connection'
            case 'SET':
                return 'setting'
            default:
                return 'ldap'
        }
    },
    getColorForActionType(actionType){
        switch (actionType) {
            // First color is Chip BG, second is text color
            case 'CREATE':
                return ['green','white']
            case 'READ':
                return ['primary','white']
            case 'UPDATE':
                return ['orange','white']
            case 'DELETE':
                return ['secondary','white']
            default:
                return ['white','black']
        }
    },
    getIconForObjectClass(objectClass){
        switch (objectClass) {
            case 'USER':
                return ['mdi-account', 'primary']
            case 'GROUP':
                return ['mdi-account-multiple', 'blue']
            case 'OU':
                return ['mdi-folder']
            case 'DOM':
                return ['mdi-dns']
            case 'GPO':
                return ['mdi-google-circles-extended']
            case 'CONN':
                return ['mdi-web', 'orange']
            case 'SET':
                return ['mdi-cog', 'orange']
            default:
                return ['mdi-group']
        }
    },
    openDialog(key){
      this.dialogs[key] = true;
      switch (key) {
        default:
          break;
      }
    },
    async closeDialog(key, refresh=false){
      this.dialogs[key] = false;
      if (refresh)
        this.listLogs()
    },
    // Reload Data Table Header Labels
    reloadDataTableHeaders(){
      this.tableData.headers.forEach(tableHeader => {
        if (tableHeader.value == "actions") {
          tableHeader.text = this.$t('actions.label')
        } else {
          tableHeader.text = this.$t('section.logs.headers.' + tableHeader.value)
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
    // Log Actions
    async listLogs(){
      this.loading = true
      this.error = false
      this.tableData.headers = []
      this.tableData.items = []
      await new Log({}).list()
      .then(response => {
        var logHeaders = response.headers
        var logs = response.logs
        console.log(logs)
        // Reset Headers Array every time you list to avoid infinite header multiplication
        this.resetDataTable()
        var headerDict = {}
        logHeaders.forEach(header => {
          headerDict = {}
          headerDict.text = this.$t('section.logs.headers.' + header)
          headerDict.value = header
          if (header == 'actionType' || header == 'objectClass') {
            headerDict.align = 'center'
          }
          this.tableData.headers.push(headerDict)
        });
        headerDict = {}
        // Add header for actions
        // headerDict.text = this.$t('actions.label')
        // headerDict.value = 'actions'
        // headerDict.align = 'center'
        // headerDict.sortable = false
        this.tableData.headers.push(headerDict)
        this.tableData.items = logs
        this.loading = false
        this.error = false
        this.resetSnackbar();
        this.createSnackbar('green', (this.$t("classes.log.plural") + " " + this.$t("words.loaded.plural.m")).toUpperCase() )
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
    openDeleteDialog() {
    },
  },
}
</script>
