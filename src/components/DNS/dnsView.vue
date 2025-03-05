<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!---------------------------- File: dnsView.vue ------------------------------>
<template>
<v-card>
  <v-data-table
    :headers="dns.headers"
    :items="filteredData"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    :custom-filter="searchDnsTable"
    :footer-props="{
      'items-per-page-options': [10, 25, 50, 100, -1]
    }"
    show-expand
    show-select
    v-model="selectedRecords"
    :single-expand="singleExpand"
    item-key="id"
    :expanded.sync="expanded"
    sort-by="type"
    class="py-3 px-2 mt-2 mb-2">
    <!-- Table Header -->
    <template v-slot:top>
      <!-- Zone selection and operations -->
    <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-select v-model="zoneFilter['dnsZone']" @change="getDNSData(undefined, true)" :items="dns.zones" class="mx-2"/>
        <v-btn class="pa-2 mx-2" @click="showZoneAdd = !showZoneAdd" color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $tc('classes.dns.zone', 1) }}
        </v-btn>
        <v-btn 
        class="pa-2 mx-2"
        :dark="!(loading || zoneFilter.dnsZone == 'Root DNS Servers' || zoneFilter.dnsZone == ldap.name)"
        @click="openDeleteDialog(null, 'zone')"
        :disabled="loading || zoneFilter.dnsZone == 'Root DNS Servers' || zoneFilter.dnsZone == ldap.name" color="red">
            <v-icon class="ma-0 pa-0">mdi-delete</v-icon>
            {{ $t('actions.delete') + ' ' + $tc('classes.dns.zone', 1) }}
        </v-btn>
    </v-row>
    <v-form ref="zoneCreateForm" @submit.prevent>
    <v-expand-transition>
        <v-row v-show="showZoneAdd" align="center" class="px-2 mx-6 py-0 my-0">
                <v-text-field
                v-model="zoneToCreate"
                :rules="[fieldRules(zoneToCreate, 'ldap_website')]"
                :label="$t('section.dns.zoneToAddName')"
                class="mx-2"
                ></v-text-field>
            <v-btn class="pa-2 mx-2" color="primary" outlined @click="createZone" :disabled="zoneToCreate.length == 0 || loading">
                {{ $t('section.dns.confirmZoneCreation') }}
                <v-icon color="primary" class="ml-1">
                    mdi-check-all
                </v-icon>
            </v-btn>
        </v-row>
    </v-expand-transition>
    </v-form>
    <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-text-field
            v-model="searchString"
            clearable
            :label="$t('actions.search')"
            class="mx-2">
            <template slot="append">
                <v-menu 
                    offset-y left 
                    nudge-bottom="1rem" 
                    :close-on-content-click="false" 
                    v-model="searchFilterListOpen">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn v-bind="attrs" v-on="on" small elevation="0" icon>
                            <v-icon>
                                mdi-filter
                            </v-icon>
                        </v-btn>
                    </template>
                    <v-list class="ma-0 pa-0" dense :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)">
                        <v-list-item class="ma-0 pa-0 mx-2" dense>
                            <v-btn @click="allColumnFilters(true)"
                                	class="mx-1"
                                    small
                                    color="primary">
                                <v-icon small>
                                    mdi-filter
                                </v-icon>
                                {{ $tc('words.all.m', 1) }}
                            </v-btn>
                            <v-btn @click="allColumnFilters(false)"
                                class="mx-1"
                                small
                                :dark="isThemeDark($vuetify)"
                                :light="!isThemeDark($vuetify)">
                                <v-icon small>
                                    mdi-filter-outline
                                </v-icon>
                                {{ $tc('words.none.m', 1) }}
                            </v-btn>
                        </v-list-item>
                        <v-list-item class="ma-0 pa-0 mx-2" v-for="v, k in searchFilterColumns" :key="k" dense @click="searchFilterColumns[k] = !searchFilterColumns[k]">
                                <v-list-item-action class="ma-0 pa-0 mr-2">
                                    <v-checkbox on-icon="mdi-checkbox-marked" color="green" v-model="searchFilterColumns[k]" class="ma-0 pa-0" dense/>
                                </v-list-item-action>
                                <v-list-item-title class="font-weight-medium">
                                    <v-row class="ma-0 pa-0" align="center" v-if="k == 'address'">
                                        {{ $t('dns.attributes.ipv4Address') }}
                                    </v-row>
                                    <v-row class="ma-0 pa-0" align="center" v-else>
                                        {{ $t('dns.attributes.' + k) }}
                                    </v-row>
                                </v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
        </v-text-field>
        <v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
            <refresh-button dense
                :loading="loading"
                @refresh="getDNSData(undefined, true)"/>
            <v-btn @click="openDialog('recordDialog')"
             class="pa-2 mx-2" :disabled="loading || zoneFilter['dnsZone'] == 'Root DNS Servers'" color="primary">
                <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
                {{ $t('actions.addN') + ' ' + $tc('classes.dns.record', 1) }}
            </v-btn>
            <v-btn @click="openDialog('recordMassAction')"
             class="pa-2 mr-2" color="red"
             :dark="!(selectedRecords.length < 1 || loading || zoneFilter['dnsZone'] == 'Root DNS Servers')"
             :disabled="selectedRecords.length < 1 || loading || zoneFilter['dnsZone'] == 'Root DNS Servers'">
                <v-icon class="ma-0 pa-0">mdi-delete</v-icon>
                {{ $t('actions.delete') + ' ' + $t('words.selected') }}
            </v-btn>
            <v-menu offset-y left nudge-bottom="1rem" :close-on-content-click="false" v-model="filterListOpen">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on"
                    style="min-width: 32px;" class="pa-0 px-2 pr-1" :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)">
                    {{ $t("actions.filter") }}
                    <v-icon id="filterListButton" :class="filterListOpen == true  ? 'active' : ''">
                        mdi-chevron-down
                    </v-icon>
                    </v-btn>
                </template>
                <v-list dense :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)">
                    <v-list-item>
                        <v-btn @click="filterAllRecordTypes" class="mx-1" color="primary">
                            <v-icon>
                                mdi-filter
                            </v-icon>
                            {{ $tc('words.all.m', 1) }}
                        </v-btn>
                        <v-btn @click="filterNoRecordTypes" class="mx-1"
                            :dark="isThemeDark($vuetify)"
                            :light="!isThemeDark($vuetify)">
                            <v-icon>
                                mdi-filter-outline
                            </v-icon>
                            {{ $tc('words.none.m', 1) }}
                        </v-btn>
                    </v-list-item>
                    <v-list-item v-for="enabled, key in enabledRecordTypes" :key="key">
                            <v-list-item-action class="ma-0 pa-0 mr-2">
                                <v-checkbox on-icon="mdi-checkbox-marked" color="green" v-model="enabledRecordTypes[key]" class="ma-0 pa-0" dense/>
                            </v-list-item-action>
                            <v-list-item-title class="font-weight-medium">
                                <v-row class="ma-0 pa-0" align="center">
                                    {{ key }}
                                </v-row>
                            </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-row>
    </v-row>
    <v-divider class="mx-12 my-3"/>
    </template>

    <template v-slot:header="props">
    <thead>
        <tr>
            <template v-for="header in props.props.headers">
            <th :class="($vuetify.breakpoint.mdAndUp ? '':'text-center') + ' py-2 px-0'"
            :key="header.value">
                <v-btn class="py-4"
                x-small text color="primary" v-if="header.groupable == true"
                @click.stop="props.on.group(header.value)">
                    <v-icon :class="$vuetify.breakpoint.mdAndUp ? 'mr-2':''">flip_to_back</v-icon>
                    <span v-if="$vuetify.breakpoint.mdAndUp">
                        {{ $t('actions.groupBy') + " " + header.text }}
                    </span>
                </v-btn>
            </th>
            </template>
        </tr>
    </thead>
    </template>

    <template v-slot:[`group.header`]="{ group, groupBy, headers, toggle, isOpen, remove }">
    <td :colspan="headers.length">
        <v-btn @click="toggle" x-small icon :ref="group">
            <v-icon v-if="!isOpen">mdi-chevron-down</v-icon>
            <v-icon v-else>mdi-chevron-up</v-icon>
        </v-btn>
        <span class="mx-5 font-weight-bold">{{ $t("dns.attributes." + groupBy) + ": " + group }}</span>
        <v-btn color="red" @click="remove" icon x-small>
            <v-icon>
                mdi-close
            </v-icon>
        </v-btn>
    </td>
    </template>

    <template v-slot:[`item.nameTarget`]="{ item }">
        {{ item.nameTarget == '' || !item.nameTarget ? '@' : item.nameTarget }}
    </template>

    <template v-slot:[`item.ttl`]="{ item }">
        {{ item.ttl == 0 ? $t('dns.attributes.infiniteTtl') : item.ttl }}
    </template>

    <template v-slot:[`item.value`]="{ item }">
        <span v-if="item.typeName == 'MX'">
            {{ item.nameExchange }}
        </span>
        <span v-else-if="item.typeName == 'TXT'">
            {{ item.stringData }}
        </span>
        <span v-else-if="item.typeName == 'NS' || item.typeName == 'CNAME'">
            {{ item.nameNode }}
        </span>
        <span v-else-if="item.typeName == 'SOA'">
            {{ item.namePrimaryServer + " " + item.zoneAdminEmail + " " + item.dwSerialNo + " " + item.dwRefresh + " " + item.dwRetry + " " + item.dwExpire + " " + item.dwMinimumTtl }}
        </span>
        <span v-else-if="item.typeName == 'A'">
            {{ item.address }}
        </span>
        <span v-else-if="item.typeName == 'AAAA'">
            {{ item.ipv6Address }}
        </span>
        <v-divider class="mx-10" v-else/>
    </template>
    
    <!-- ZONE IS TOMBSTONED STATUS -->
    <template v-slot:[`item.ts`]="{ item }">

        <!-- Enable Record Button -->
        <v-tooltip color="primary" bottom v-if="item.ts == true">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || true"
          >
          <v-icon color="valid-40">
            mdi-check
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + ' ' + $t('actions.enable') + ' ' + $tc('classes.dns.record', 1) }}</span>
      </v-tooltip>

      <!-- Disable Record Button -->
      <v-tooltip color="red" bottom v-else>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || true"
          >
          <v-icon color="error">
            mdi-close
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.disable') + ' ' + $tc('classes.dns.record', 1) }}</span>
      </v-tooltip>
    </template>

    <!-- DNS RECORD ACTIONS -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon :disabled="loading || zoneFilter['dnsZone'] == 'Root DNS Servers'"
            rounded
            v-bind="attrs"
            v-on="on"
            small
            @click="editRecord(item)"
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
          <v-btn icon @click="openDeleteDialog(item)" :disabled="loading || zoneFilter['dnsZone'] == 'Root DNS Servers'"
            rounded
            v-bind="attrs"
            v-on="on"
            small
          >
          <v-icon small color="red">
            mdi-delete
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.delete') }}</span>
      </v-tooltip>
    </template>

    <!-- DNS RECORD EXTRA INFO -->
    <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
            <v-row justify="start" class="ma-0 pa-0 my-3 mx-2" v-for="attribute, key in getExtrasFromRecord(item, headers)" :key="key">
                <v-icon color="primary" class="mr-2" v-if="key == 'type'">
                    mdi-information-outline
                </v-icon>
                <v-icon color="primary" class="mr-2" v-else-if="key == 'distinguishedName'">
                    mdi-menu
                </v-icon>
                <v-icon color="primary" class="mr-2" v-else>
                    mdi-menu-right
                </v-icon>
                <span v-if="key == 'distinguishedName'">
                    {{ $t("attribute.ldap." + key) + ": " + attribute + " "}}
                </span>
                <span v-else-if="key == 'ts'">
                    {{ $t("dns.attributes." + key) + ": " }}
                    <v-icon v-if="item.ts == true" color="green">
                        mdi-check-circle
                    </v-icon>

                    <v-icon v-else color="red">
                        mdi-close-circle
                    </v-icon>
                </span>
                <span v-else>
                    {{ $t("dns.attributes." + key) + ": " + attribute + " "}}
                </span>
            </v-row>
        </td>
    </template>
  </v-data-table>

  <!-- RECORD VIEW/EDIT DIALOG -->
  <v-dialog eager :max-width="this.updateFlag ? '800px':'1200px'" v-model="dialogs['recordDialog']">
    <RecordDialog
        :zoneHasSOA="zoneHasSOA()"
        :currentZone="this.zoneFilter.dnsZone"
        :recordObject="this.currentRecord"
        :updateFlag="this.updateFlag"
        :viewKey="'recordDialog'"
        @closeDialog="closeDialog"
        @refresh="getDNSData"
        ref="RecordDialog"
      />
  </v-dialog>

  <!-- RECORD DELETE DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['recordDelete']">
    <RecordDelete
        :deleteMode="this.deleteMode"
        :currentZone="this.zoneFilter.dnsZone"
        :recordObject="this.currentRecord"
        :viewKey="'recordDelete'"
        @closeDialog="closeDialog"
        @refresh="getDNSData"
        ref="RecordDelete"
      />
  </v-dialog>

  <!-- RECORD MASS ACTION DIALOG -->
  <v-dialog eager max-width="800px" v-model="dialogs['recordMassAction']">
    <RecordMassAction
        :actionType="'delete'"
        :selectedRecords="selectedRecords"
        :currentZone="this.zoneFilter.dnsZone"
        :viewKey="'recordMassAction'"
        @closeDialog="closeDialog"
        @refresh="getDNSData"
        ref="RecordMassAction"
      />
  </v-dialog>

</v-card>
</template>

<script>
import { notificationBus } from '@/main.js'
import { getDomainDetails } from '@/include/utils.js'
import Domain, { default as DNS } from '@/include/Domain.js'
import RecordDialog from '@/components/DNS/RecordDialog.vue'
import RecordDelete from '@/components/DNS/RecordDelete.vue'
import RecordMassAction from '@/components/DNS/RecordMassAction.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
    name: 'dnsView',
    mixins: [ validationMixin, utilsMixin ],
    components: {
        RecordDialog,
        RecordDelete,
        RecordMassAction,
        RefreshButton
    },
    data() {
        return {
            selectedRecords: [],
            currentRecord: {
                name: "",
                type: 1,
            },
            zoneToCreate: "",
            showZoneAdd: false,
            updateFlag: false,
            singleExpand: false,
            expanded: [],
            filteredData: [],
            enabledRecordTypes: {
                A: true,
                AAAA: true,
                NS: true,
                TXT: true,
                MX: true,
                SOA: true,
                CNAME: true,
                PTR: true,
                SRV: true,
                Unsupported: false
            },
            filterListOpen: false,
            searchFilterListOpen: false,
            searchFilterColumns: {},
            searchString: "",
            loading: false,
            error: false,
            errorMsg: "",
            readonly: false,
            deleteMode: 'record',
            lastOperation: "",
            ldap: {},
            // Dialog States
            dialogs: {
                recordDialog: false,
                recordDelete: false,
                recordMassAction: false
            },
            dns: {
                headers: [],
                zones: [],
                records: []
            },
            zoneFilter: {
                dnsZone: ""
            },
        }
    },
    created() {
        this.ldap = getDomainDetails()
        this.getDNSData()
    },
    watch: {
        'enabledRecordTypes': {
            handler: function (newValue) {
                this.filterData(newValue)
            },
            deep: true
        },
        // Dialog Closed Handler
        'dialogs': {
            handler: function (newValue) {
                if (!newValue['recordDialog'] || newValue['recordDialog'] == false)
                    this.$refs.RecordDialog.resetRecord();
                this.$refs.RecordDialog.resetValidation();
            },
            deep: true
        }
    },
    methods: {
        createSnackbar(notifObj){
            notificationBus.$emit('createNotification', notifObj);
        },
        async createZone(){
            if (this.$refs.zoneCreateForm.validate()) {
                await new Domain({}).insert({dnsZone: this.zoneToCreate})
                .then(() => {
                    this.showZoneAdd = false
                    this.zoneFilter['dnsZone'] = this.zoneToCreate
                    this.lastOperation = "createZone"
                    this.getDNSData(undefined, false)
                    this.zoneToCreate = ""
                    notificationBus.$emit('createNotification', 
                        {message: (this.$tc("classes.dns.zone", 1) + " " + this.$tc("words.created.f", 1)).toUpperCase(), type: 'success'}
                    )
                })
                .catch(error => {
                    console.error(error)
                    this.errorMsg = this.getMessageForCode(error)
                    notificationBus.$emit('createNotification', 
                        {message: this.errorMsg.toUpperCase(), type: 'error'}
                    )
                })
            }
        },
        zoneHasSOA(){
            if (this.dns.records.filter(e => e.type == 6).length > 0)
                return true
            return false
        },
        resetCurrentRecord() {
            this.currentRecord = {}
            this.currentRecord.name = ""
            this.currentRecord.type = 1
        },
        getExtrasFromRecord(item, headers) {
            var result = {}
            // var keys = Object.keys(item)
            headers = headers.map(e => e.value)
            var excludeKeys = [
                'id',
                'record_bytes',
                'zone'
            ]
            for (const key in item) {
                if (Object.hasOwnProperty.call(item, key)) {
                    if (!headers.includes(key) && !excludeKeys.includes(key)) {
                        result[key] = item[key]
                    }
                }
            }
            return result
        },
        filterAllRecordTypes(){
            for (var key in this.enabledRecordTypes) {
                this.enabledRecordTypes[key] = true
            }
        },
        filterNoRecordTypes(){
            for (var key in this.enabledRecordTypes) {
                this.enabledRecordTypes[key] = false
            }
        },
        filterData(filters){
            var value
            this.filteredData = []
            for (var key in filters) {
                value = filters[key]
                if (value === true){
                    var filteredItems = this.dns.records.filter(e => e.typeName.toUpperCase() == key)
                    this.filteredData.push(...filteredItems)
                }
            }
        },
        searchDnsTable(value, search, item){
            const excludedKeys = ['record_bytes', 'type']
            var result = []
            for (const key in item){
                if (!excludedKeys.includes(key) && this.searchFilterColumns[key] == true)
                    result.push(item[key])
            }
            return result.some(v=>v&&v.toString().toLowerCase().includes(this.searchString.toLowerCase()))
        },
        resetData(resetFilter=false){
            this.enabledRecordTypes = {
                A: true,
                AAAA: true,
                NS: true,
                TXT: true,
                MX: true,
                SOA: true,
                CNAME: true,
                PTR: true,
                SRV: true,
                Unsupported: false
            },
            this.searchFilterColumns = {}
            this.ldap = getDomainDetails()
            this.loading = true
            this.error = false
            this.errorMsg = ""
            this.dns.headers = []
            this.dns.zones = []
            this.dns.records = []
            if (resetFilter === true)
                this.filterEnabledRecordTypes = {}
        },
        setSearchFilterColumnData(){
            let r = {}
            const DEFAULT_ON = [
                "name",
                "typeName",
                "value",
                "nameExchange",
                "stringData",
                "nameNode",
                "address",
                "ipv6Address",
                "displayName"
            ]
            DEFAULT_ON.forEach(key => {
                if (key == 'actions')
                    return
                if (DEFAULT_ON.includes(key))
                    r[key] = true
                else
                    r[key] = false
            })
            this.searchFilterColumns = r
            return
        },
        allColumnFilters(state=true){
            if (state !== true && state !== false)
                throw new Error("allColumnFilters: State must be a boolean.")
            for (const key in this.searchFilterColumns) {
                this.searchFilterColumns[key] = state
            }
        },
        loadFinished(error=undefined, message=undefined) {
            this.filterData(this.enabledRecordTypes)
            this.loading = false
            // If error...
            if (error != undefined){
                this.error = true
                if (message != undefined && message.length > 0)
                    this.errorMsg = message
                else
                    this.errorMsg = this.getMessageForCode(error)
                if (!this.lastOperation || this.lastOperation.length < 1) {
                    var msgToShow = this.errorMsg.length > 0 ? this.errorMsg : this.$t("error.unableToLoad")
                    this.createSnackbar({message: msgToShow, type: 'error'})
                    
                    if ('response' in error && 'data' in error.response && 'code' in error.response.data)
                        if (error.response.data.code == "dns_list_response_empty")
                            setTimeout(() => {
                                var legacyMessage = {
                                    message: this.$t('section.dns.legacyMode_hint').toUpperCase(),
                                    type: 'warning'
                                }
                                notificationBus.$emit('createNotification', legacyMessage);
                            }, 4000)
                }
            // If OK
            } else {
                if (!this.lastOperation || this.lastOperation.length < 1) {
                    this.createSnackbar({message: (this.$tc("classes.dns.zone", 1) + " " + this.$tc("words.loaded.f", 1)).toUpperCase(), type: 'success'})
                }
                this.setSearchFilterColumnData()
                this.error = false
                this.errorMsg = ""
            }
        },
        openDialog(key, updateFlag=false){
            if (updateFlag === true)
                this.updateFlag = true
            else if (key == 'recordDialog') {
                this.updateFlag = false
                this.resetCurrentRecord()
            }

            this.dialogs[key] = true;
            switch (key) {
                case 'recordDialog':
                    this.$refs.RecordDialog.resetValidation()
                    this.$refs.RecordDialog.syncRecord()
                break;
                case 'recordDelete':
                    this.$refs.RecordDelete.resetDelete()
                break;
                case 'recordMassAction':
                    this.$refs.RecordMassAction.reset()
                break;
                default:
                break;
            }
        },
        editRecord(recordItem) {
            this.currentRecord = recordItem
            this.openDialog('recordDialog', true)
        },
        openDeleteDialog(recordItem, mode='record') {
            this.deleteMode = mode
            this.currentRecord = recordItem
            this.openDialog('recordDelete')
        },
        async closeDialog(key, refresh=false){
            this.dialogs[key] = false;
            this.lastOperation = key;
            if (refresh == true && this.deleteMode == 'zone') {
                this.zoneToCreate = ""
                this.zoneFilter['dnsZone'] = this.ldap.name
                this.getDNSData(this.ldap.name)
            } else if (refresh === true) {
                this.getDNSData(this.zoneFilter['dnsZone'])
            }
        },
        async getDNSData(zoneToQuery=undefined, refresh=false) {
            if (refresh == true)
                this.lastOperation = ""

            // Set DNS Zone Query
            if (zoneToQuery != undefined && zoneToQuery != null && zoneToQuery.length > 0 && zoneToQuery != "")
                this.zoneFilter['dnsZone'] = zoneToQuery
            else if (this.zoneFilter['dnsZone'] == "")
                this.zoneFilter['dnsZone'] = this.ldap.name
            let queryFilter = this.zoneFilter

            this.selectedRecords = []

            // Reset Data
            this.resetData()

            await new DNS({}).zones({filter: queryFilter})
            .then(response => {
                let dnsHeaders = response.data.headers
                this.dns.zones = response.data.dnsZones
                this.dns.records = response.data.records
                // Add actions header
                let headerDict

                dnsHeaders.forEach(header => {
                    headerDict = {}
                    headerDict.text = this.$t('dns.attributes.' + header)
                    headerDict.width = (headerDict.text.length + 1) + "ch"
                    headerDict.value = header
                    if (header == 'ts') {
                        headerDict.align = 'center'
                        headerDict.sortable = false
                    }
                    if (header == 'address' || header == 'nameTarget')
                        headerDict.width = '35ch'
                    
                    if (header == 'displayName' || header == 'typeName')
                        headerDict.groupable = true

                    this.dns.headers.push(headerDict)
                });
                // Add actions last
                headerDict = {}
                headerDict.text = this.$t('actions.label')
                headerDict.value = 'actions'
                headerDict.groupable = false
                headerDict.width = '6rem'
                headerDict.align = 'center'
                headerDict.sortable = false
                this.dns.headers.push(headerDict)
                this.loadFinished()

                if (response.data.legacy == true) {
                    setTimeout(() => {
                        var legacyMessage = {
                            message: this.$t('section.dns.legacyMode'),
                            type: 'info'
                        }
                        notificationBus.$emit('createNotification', legacyMessage);
                    }, 4000)
                }
            })
            .catch(error => {
                console.error(error)
                this.reloadDataTableHeaders()
                this.loadFinished(error, "")
            })
        },
        // Reload Data Table Header Labels
        reloadDataTableHeaders(){
            this.dns.headers.forEach(tableHeader => {
                if (tableHeader.value == "actions"){
                    tableHeader.text = this.$t('actions.label')
                    tableHeader.width = (tableHeader.text.length + 1) + "ch"
                }
                else {
                    tableHeader.text = this.$t('dns.attributes.' + tableHeader.value)
                    tableHeader.width = (tableHeader.text.length + 1) + "ch"
                }
            });
        },
        // Reset Data Table variables
        resetDataTable(){
            this.dns.headers = []
            this.dns.zones = []
            this.dns.records = []
        },
    },
}
</script>

<style>
.v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none !important;
}
</style>