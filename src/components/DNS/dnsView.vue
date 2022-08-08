<template>
<v-card>
  <v-data-table
    :headers="dns.headers"
    :items="filteredData"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    sort-by="type"
    class="py-3 px-2 mt-2 mb-2">
    <!-- Table Header -->
    <template v-slot:top>
      <!-- Zone selection and operations -->
      <v-row align="center" class="px-2 mx-1 py-0 my-0">
        <v-select v-model="zoneFilter['dnsZone']" @change="getDNSData" :items="dns.zones" class="mx-2"/>
        <v-btn class="pa-2 mx-2" disabled color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.dns.zone.single') }}
        </v-btn>
        <v-btn class="pa-2 mx-2" disabled color="red">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.delete') + ' ' + $t('classes.dns.zone.single') }}
        </v-btn>
      </v-row>
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
            @click="getDNSData()"
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
            <v-btn class="pa-2 mx-2" :disabled="true || loading || zoneFilter['dnsZone'] == 'Root DNS Servers'" color="primary">
                <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
                {{ $t('actions.addN') + ' ' + $t('classes.dns.record.single') }}
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
                    <v-list-item v-for="enabled, key in recordTypes" :key="key">
                            <v-list-item-action class="ma-0 pa-0 mr-2">
                                <v-checkbox on-icon="mdi-close-box" color="red" v-model="recordTypes[key]" class="ma-0 pa-0" dense/>
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
    </template>

    <template v-slot:[`item.nameTarget`]="{ item }">
        {{ item.nameTarget == '' || !item.nameTarget ? '@' : item.nameTarget }}
    </template>

    <template v-slot:[`item.address`]="{ item }">
        <span v-if="item.address">
            {{ item.address }}
        </span>
        <v-divider class="mx-10" v-else/>
    </template>

    <!-- ZONE IS TOMBSTONED STATUS -->
    <template v-slot:[`item.ts`]="{ item }">

        <!-- Enable Record Button -->
        <v-tooltip color="primary" bottom v-if="item.ts">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || true"
          >
          <v-icon class="clr-valid clr-lig-40">
            mdi-check
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + ' ' + $t('actions.enable') + ' ' + $t('classes.dns.record.single') }}</span>
      </v-tooltip>

      <!-- Disable Record Button -->
      <v-tooltip color="red" bottom v-else-if="!item.ts">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading || true"
          >
          <v-icon class="clr-error clr-lig-40">
            mdi-close
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.disable') + ' ' + $t('classes.dns.record.single') }}</span>
      </v-tooltip>
    </template>

    <!-- DNS RECORD ACTIONS -->
    <template v-slot:[`item.actions`]="{ }">
      
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            small
            disabled
          >
            <!-- :disabled="loading" -->
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
            disabled
          >
            <!-- :disabled="loading || zoneFilter['dnsZone'] == 'Root DNS Servers'" -->
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
            disabled
          >
            <!-- :disabled="loading || zoneFilter['dnsZone'] == 'Root DNS Servers'" -->
          <v-icon small color="red">
            mdi-delete
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.delete') }}</span>
      </v-tooltip>
    </template>
  </v-data-table>

</v-card>
</template>

<script>
import { default as DNS } from '@/include/Domain'
import validationMixin from '@/plugins/mixin/validationMixin'
import { getDomainDetails } from '@/include/utils';

export default {
    mixins: [ validationMixin ],
    data() {
        return {
            filteredData: [],
            recordTypes: {
                A: false,
                AAAA: false,
                NS: false,
                TXT: false,
                MX: false,
                SOA: false,
                CNAME: false,
                PTR: false,
                SRV: false,
                Unsupported: true
            },
            filterListOpen: false,
            searchString: "",
            loading: false,
            error: false,
            errorMsg: "",
            readonly: false,
            ldap: {},
            dns: {
                headers: [],
                zones: [],
                records: []
            },
            zoneFilter: {
                dnsZone: ""
            },
            filterRecordTypes: {
            },
        }
    },
    created () {
        this.ldap = getDomainDetails()
        this.getDNSData(this.defaultZone)
    },
    watch: {
        'recordTypes': {
            handler: function (newValue) {
                this.filterData(newValue)
                console.log(this.filteredData)
            },
            deep: true
        }
    },
    methods: {
        filterData(filters){
            var value
            this.filteredData = this.dns.records
            for (var key in filters) {
                value = filters[key]
                if (value === true)
                    this.filteredData = this.filteredData.filter(e => e.typeName.toUpperCase() != key)
            }
        },
        resetData(resetFilter=false){
            this.recordTypes = {
                A: false,
                AAAA: false,
                NS: false,
                TXT: false,
                MX: false,
                SOA: false,
                CNAME: false,
                PTR: false,
                SRV: false,
                Unsupported: true
            },
            this.ldap = getDomainDetails()
            this.loading = true
            this.error = false
            this.errorMsg = ""
            this.dns.headers = []
            this.dns.zones = []
            this.dns.records = []
            if (resetFilter === true)
                this.filterRecordTypes = {}
        },
        loadFinished(error=undefined, message=undefined) {
            this.filterData(this.recordTypes)
            this.loading = false
            if (error != undefined){
                this.error = true
                if (message != undefined)
                    this.errorMsg = message
                else
                    this.errorMsg = this.getMessageForCode()
            } else {
                this.error = false
                this.errorMsg = ""
            }
        },
        async getDNSData(zoneToQuery=undefined) {
            if (zoneToQuery)
                this.zoneFilter['dnsZone'] = zoneToQuery
            else if (this.zoneFilter['dnsZone'] == "")
                this.zoneFilter['dnsZone'] = this.ldap.domain
            var queryFilter = this.zoneFilter
            this.resetData()
            await new DNS({}).zones({filter: queryFilter})
            .then(response => {
                var dnsHeaders = response.data.headers
                this.dns.zones = response.data.dnsZones
                this.dns.records = response.data.records
                // Add actions header
                var headerDict = {}

                dnsHeaders.forEach(header => {
                    headerDict = {}
                    headerDict.text = this.$t('dns.attributes.' + header)
                    headerDict.value = header
                    if (header == 'ts') {
                        headerDict.align = 'center'
                        headerDict.sortable = false
                    }
                    if (header == 'address' || header == 'nameTarget')
                        headerDict.width = '35ch'
                    
                    if (header == 'ts' && this.zoneFilter['dnsZone'] != 'Root DNS Servers')
                        this.dns.headers.push(headerDict)
                    else if (header != 'ts')
                        this.dns.headers.push(headerDict)
                });
                // Add actions last
                headerDict = {}
                headerDict.text = this.$t('actions.label')
                headerDict.value = 'actions'
                headerDict.align = 'center'
                headerDict.sortable = false
                this.dns.headers.push(headerDict)
                this.loadFinished()
            })
            .catch(error => {
                console.log(error)
                this.reloadDataTableHeaders()
                this.loadFinished(true, "")
            })
        },
        // Reload Data Table Header Labels
        reloadDataTableHeaders(){
            this.dns.headers.forEach(tableHeader => {
                if (tableHeader.value == "actions")
                    tableHeader.text = this.$t('actions.label')
                else
                    tableHeader.text = this.$t('dns.attributes.' + tableHeader.value)
            });
        },
        // Reset Data Table variables
        resetDataTable(){
            this.dns.headers = []
            this.dns.zones = []
            this.dns.records = []
        },
        resetSnackbar(){
            this.$emit('resetSnackbar')
        },
        createSnackbar(color, string){
            this.$emit('createSnackbar', color, string)
        },
    },
}
</script>

<style>

#filterListButton.active{
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}
</style>