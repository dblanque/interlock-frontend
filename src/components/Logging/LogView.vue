<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------------- File: LogView.vue ------------------------------->
<template>
  <div>
    <v-data-table
      :headers="dynamicTableHeaders"
      :items="tableData.items"
      :custom-sort="sortNullLast"
      :loading="loading"
			:show-expand="compactTable"
      :expanded.sync="expanded"
      :search="searchString"
      :footer-props="{
        'items-per-page-options': [10, 25, 50, 100, -1]
      }"
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
          <v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end" align="center">
              <refresh-button dense
                :loading="loading"
                @refresh="listLogs"/>
              <v-btn class="pa-2 mx-2" :disabled="loading" color="primary" @click="openResetLogsDialog()">
                <v-icon class="ma-0 pa-0 mr-1">mdi-fire</v-icon>
                {{ $t('actions.delete') + ' ' + $tc('classes.log', 5) }}
              </v-btn>
            </v-row>
        </v-row>
        <!-- Log Truncate Actions -->
        <v-row class="ma-0 pa-0 px-4 mt-4" justify="center" align="center">
          <v-col cols="12" lg="6" class="ma-0 pa-0">
            <v-range-slider v-model="logTruncateRange"
            :disabled="getLogTruncateMax<1"
            :label="$t('section.logs.viewAction.truncate.slider')"
            class="mx-4"
            :min="getLogTruncateMin"
            :max="getLogTruncateMax"
            />
          </v-col>
          <v-col cols="10" lg="3" class="ma-0 pa-0">
            <v-row class="ma-0 pa-0">
              <v-col class="ma-0 pa-0" cols="6">
              <v-text-field class="mx-4"
              :disabled="getLogTruncateMax<1"
              @keypress="isNumber($event)"
              :rules="[validMinimumLog]"
              :label="$t('section.logs.viewAction.truncate.min')"
              v-model="logTruncateRange[0]">
              </v-text-field>
              </v-col>
              <v-col class="ma-0 pa-0" cols="6">
              <v-text-field class="mx-4"
              :disabled="getLogTruncateMax<1"
              @keypress="isNumber($event)"
              :rules="[validMaximumLog]"
              :label="$t('section.logs.viewAction.truncate.max')"
              v-model="logTruncateRange[1]">
              </v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" lg="3" xl="2" class="ma-0 my-4 pa-0">
            <v-btn @click="openTruncateLogsDialog"
            outlined 
            class="mx-4 pa-0 px-2" 
            color="primary">
              <v-icon class="mr-2">
                mdi-content-cut
              </v-icon>
              {{ $t('section.logs.viewAction.truncate.button') }}
            </v-btn>
          </v-col>
        </v-row>
      </template>

			<template v-slot:expanded-item="{ headers, item }">
				<td :colspan="headers.length">
          <v-row
            justify="start"
            class="ma-0 pa-0 my-3 mx-2"
            v-if="item.affectedObject && item.affectedObject.length >= 1">
            {{ $t('section.logs.headers.affectedObject') + ":" }}
          </v-row>
          <v-row
            align="center"
            justify="start"
            class="ma-0 pa-0 my-3 mx-2"
            v-if="item.affectedObject && item.affectedObject.length >= 1">
            {{ item.affectedObject }}
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn small icon @click="copyToClipboard(item.affectedObject)"
                  class="ml-2"
                  color="primary"
                  v-bind="attrs"
                  v-on="on">
                  <v-icon small>
                    mdi-content-copy
                  </v-icon>
                </v-btn>
              </template>
              <span> {{ $t("actions.copyToClipboard") }} </span>
            </v-tooltip>
          </v-row>
          <v-row
            justify="start"
            class="ma-0 pa-0 my-3 mx-2"
            v-if="item.extraMessage && item.extraMessage.length >= 1">
            {{ $t('section.logs.headers.extraMessage') + ":" }}
          </v-row>
          <v-row
            justify="start"
            class="ma-0 pa-0 my-3 mx-2"
            v-if="item.extraMessage && item.extraMessage.length >= 1">
            {{ $t('section.logs.extras.'+ (item.extraMessage.toLowerCase()) ) }}
          </v-row>
				</td>
			</template>

      <template v-slot:[`item.actionType`]="{ item }">
          <v-chip :color="getColorForActionType(item.actionType)[0]" :class="'text-' + (getColorForActionType(item.actionType)[1] || 'inverted')" :text-color="getColorForActionType(item.actionType)[1] || undefined">
              {{ $t("section.logs.actionType." + item.actionType) }}
          </v-chip>
      </template>

      <template v-slot:[`item.date`]="{ item }">
            {{ parseDateToLocalTZ(item.date) }}
      </template>

      <template v-slot:[`item.objectClass`]="{ item }">
          <v-row justify="center" align="center" class="px-6 my-2">
              <v-icon class="mr-2" :small="$vuetify.breakpoint.mdAndDown" :color="getIconForObjectClass(item.objectClass)[1] || undefined">
                  {{ getIconForObjectClass(item.objectClass)[0] }}
              </v-icon>
              <span>
                  {{ $tc('classes.' + getObjectClassTranslationKey(item.objectClass), 1) }}
              </span>
          </v-row>
      </template>

      <template v-slot:[`item.affectedObject`]="{ item }">
        <div class="py-2">
          <v-menu :close-on-content-click="false" 
          top v-if="item.affectedObject && Array.isArray(item.affectedObject) && item.affectedObject.length > 0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on"
              style="min-width: 32px;" elevation="0" text class="pa-0 px-2 pr-3" color="primary">
              <v-icon class="mr-2">
                mdi-information
              </v-icon>
              {{ $t('section.logs.seeDetails') }}
              </v-btn>
            </template>
            <v-list class="pa-2">
              <span v-for="i, k in item.affectedObject" :key="k">
                <v-list-item-title>
                  {{ typeof i === 'object' ? i.name : i }}
                </v-list-item-title>
                <v-list-item-subtitle class="my-2" v-if="typeof i === 'object' && i.old_value">
                  <v-chip outlined class="ml-4">
                    {{ $t("section.logs.prevValue") + ": " + i.old_value }}
                  </v-chip>
                </v-list-item-subtitle>
                <v-list-item-subtitle class="my-2" v-if="typeof i === 'object' && i.new_value">
                  <v-chip outlined class="ml-4">
                    {{ $t("section.logs.newValue") + ": " + i.new_value }}
                  </v-chip>
                </v-list-item-subtitle>
              </span>
            </v-list>
          </v-menu>
          <v-tooltip bottom v-else-if="item.affectedObject && item.affectedObject.length > 0">
              <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    @click="copyToClipboard(item.affectedObject)"
                    v-on="on"
                    v-bind="attrs"
                    class="mx-1"
                    outlined>
                    {{ truncateString(item.affectedObject) }}
                  </v-chip>
              </template>
              <span>{{ item.affectedObject }}</span>
          </v-tooltip>
        </div>
      </template>

      <template v-slot:[`item.extraMessage`]="{ item }">
        <v-chip class="ma-0 pa-0 hide-chip" color="transparent" v-if="item.extraMessage">
          {{ $t('section.logs.extras.'+ (item.extraMessage.toLowerCase()) ) }}
        </v-chip>
      </template>
    </v-data-table>

    <v-dialog v-model="resetDialog" max-width="650px">
        <LogResetDialog
        :logAction="logAction"
        @resetConfirm="resetLogs"
        @truncateConfirm="truncateLogs"
        @closeDialog="resetDialog = false"
        />
    </v-dialog>
  </div>
</template>

<script>
import RefreshButton from '@/components/RefreshButton.vue'
import { notificationBus } from '@/main.js'
import Log from '@/include/Log.js';
import LogResetDialog from '@/components/Logging/LogResetDialog.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
  name: 'LogView',
  mixins: [ validationMixin, utilsMixin ],
  components: {
    LogResetDialog,
    RefreshButton
  },
  data() {
    return {
      expanded: [],
      logTruncateRange: [0, 0],
      logAction: "",
      readonly: false,
      fetchingData: false,
      resetDialog: false,
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
  computed: {
    getLogTruncateMin(){
      if (this.tableData.items.length < 1)
        return 0
      let ids = this.tableData.items.map(log => {
        return log.id;
      });
      return ids.sort((a, b) => a > b)[0]
    },
    getLogTruncateMax(){
      if (this.tableData.items.length < 1)
        return 0
      let ids = this.tableData.items.map(log => {
        return log.id;
      });
      ids = ids.sort((a, b) => a > b)
      return ids[ids.length - 1]
    },
    compactTable(){
      return this.$vuetify.breakpoint.lgAndDown
    },
    dynamicTableHeaders(){
      let _excluded = [
        "affectedObject",
        "extraMessage",
      ]
      if (this.compactTable) {
        return this.tableData.headers.filter( h => (!(_excluded.includes(h.value))) )
      }
      else {
        this.expanded = [];
        return this.tableData.headers
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
    copyToClipboard(v){
      if (typeof v !== 'string') {
        console.error("Cannot copy non-string value to clipboard")
        return
      }
      navigator.clipboard.writeText(v);
      notificationBus.$emit('createNotification', {
        message: this.$t("actions.copiedToClipboard").toUpperCase(),
        type: 'info',
      });
    },
    truncateString(s, len=32){
      if (typeof s !== 'string') {
        console.error(`s must be of type String (type: ${typeof s})`);
        return ""
      }
      if (s.length <= len) return s
      return s.slice(0, len) + " (...)"
    },
    validMinimumLog(v){
      if (isNaN(v)) return false
      return v >= this.getLogTruncateMin
    },
    validMaximumLog(v){
      if (isNaN(v)) return false
      return v <= this.getLogTruncateMax
    },
    parseDateToLocalTZ(dateStr){
      var dateObject = new Date(dateStr)
      var dateString = ""
      dateString += dateObject.toLocaleDateString(this.$i18n.locale, {day: 'numeric'}).padStart(2, '0') + "-"
      dateString += dateObject.toLocaleDateString(this.$i18n.locale, {month: 'numeric'}).padStart(2, '0') + "-"
      dateString += dateObject.toLocaleDateString(this.$i18n.locale, {year: 'numeric'}) + " "
      dateString += dateObject.toLocaleTimeString(this.$i18n.locale, {hour12: false})
      dateString += " UTC" + (dateObject.getTimezoneOffset() / 60) * -1
      return dateString
    },
    createSnackbar(notifObj){
      notificationBus.$emit('createNotification', notifObj);
    },
    resetSearch(){
      this.searchString = ""
    },
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
            case 'DNSZ':
                return 'dns.zone'
            case 'DNSR':
                return 'dns.record'
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
                return ['secondary-s','white']
            default:
                return ['secondary-s','white']
        }
    },
    getIconForObjectClass(objectClass){
        switch (objectClass) {
            case 'USER':
                return ['mdi-account', 'primary']
            case 'GROUP':
                return ['mdi-account-multiple', 'primary-30']
            case 'OU':
                return ['mdi-folder', 'secondary']
            case 'DOM':
                return ['mdi-dns']
            case 'GPO':
                return ['mdi-google-circles-extended']
            case 'CONN':
                return ['mdi-web', 'orange']
            case 'SET':
                return ['mdi-cog', 'orange']
            case 'DNSZ':
                return ['mdi-google-circles', 'orange']
            case 'DNSR':
                return ['mdi-google-circles-group', 'orange']
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
        if (tableHeader.value != undefined)
          tableHeader.text = this.$t('section.logs.headers.' + tableHeader.value)
      });
    },
    // Reset Data Table variables
    resetDataTable(){
      this.tableData.headers = []
      this.tableData.items = []
    },
    // Log Actions
    async listLogs(emitNotif = true){
      this.loading = true
      this.error = false
      this.tableData.headers = []
      this.tableData.items = []
      await new Log({}).list()
      .then(response => {
        let logHeaders = response.headers
        let logs = response.logs
        // Reset Headers Array every time you list to avoid infinite header multiplication
        this.resetDataTable()
        let headerDict = {}
        logHeaders.forEach(header => {
          headerDict = {}
          headerDict.text = this.$t('section.logs.headers.' + header)
          headerDict.value = header
          if (header == 'actionType' || header == 'objectClass') {
            headerDict.align = 'center'
          }
          this.tableData.headers.push(headerDict)
        });
        this.tableData.items = logs
        this.loading = false
        this.error = false
        if (emitNotif)
          this.createSnackbar({
            message: (this.$tc("classes.log", logs.length) + " " + this.$tc("words.loaded.m", logs.length)).toUpperCase(),
            type: 'success'
          })
        this.logTruncateRange = [ this.getLogTruncateMin, this.getLogTruncateMax ]
      })
      .catch(error => {
        console.error(error)
        this.loading = false
        this.error = true
        this.createSnackbar({message: this.getMessageForCode(error), type: 'error'})
      })
      this.$emit('done')
    },
    openResetLogsDialog(){
      this.resetDialog = true
      this.logAction = 'reset'
    },
    openTruncateLogsDialog(){
      this.resetDialog = true
      this.logAction = 'truncate'
    },
    async resetLogs(){
      await new Log({}).reset()
      .then(() => {
        this.resetDialog = false
        this.logAction = ""
        this.listLogs()
      })
      .catch(error => {
        console.error(error)
        this.resetDialog = false
        this.logAction = ""
      })
    },
    async truncateLogs() {
      var data = {}
      data['min'] = this.logTruncateRange[0]
      data['max'] = this.logTruncateRange[1]
      await new Log({}).truncate(data)
      .then(() => {
        this.resetDialog = false
        this.logAction = ""
        this.listLogs()
      })
      .catch(error => {
        console.error(error)
        this.resetDialog = false
        this.logAction = ""
      })
    }
  },
}
</script>

<style>
.hide-chip.v-chip:hover::before {
  background-color: transparent !important;
}
</style>