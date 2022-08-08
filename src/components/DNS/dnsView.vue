<template>
<v-card>
  <v-data-table
    :headers="this.dns.headers"
    :items="this.dns.records"
    :custom-sort="sortNullLast"
    :loading="loading"
    :search="searchString"
    sort-by="type"
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
            @click="getDNSData"
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
          <v-btn class="pa-2 mx-2" :disabled="loading" color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.dns.zone.single') }}
          </v-btn>
          <v-btn class="pa-2 mx-2" :disabled="loading" color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.dns.record.single') }}
          </v-btn>
        </v-row>
      </v-row>
    </template>

    <template v-slot:[`item.nameTarget`]="{ item }">
        {{ item.nameTarget || "@" }}
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
        <v-tooltip color="red" bottom v-if="item.ts">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading"
          >
          <v-icon class="clr-valid clr-lig-40">
            mdi-check
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + ' ' + $t('actions.disable') + ' ' + $t('classes.dns.zone.single') }}</span>
      </v-tooltip>

      <!-- Disable Record Button -->
      <v-tooltip color="green" bottom v-else-if="!item.ts">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            rounded
            v-bind="attrs"
            v-on="on"
            :disabled="loading"
          >
          <v-icon class="clr-error clr-lig-40">
            mdi-close
          </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('actions.clickTo') + " " + $t('actions.enable') + ' ' + $t('classes.dns.zone.single') }}</span>
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
            :disabled="loading"
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

</v-card>
</template>

<script>
import { default as DNS } from '@/include/Domain'
import validationMixin from '@/plugins/mixin/validationMixin'

export default {
    mixins: [ validationMixin ],
    data() {
        return {
            searchString: "",
            loading: false,
            error: false,
            errorMsg: "",
            readonly: false,
            dns: {
                headers: [],
                zones: [],
                records: []
            },
            filterRecordTypes: {
            }
        }
    },
    created () {
        this.getDNSData()
    },
    methods: {
        resetData(resetFilter=false){
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
        async getDNSData() {
            this.resetData()
            await new DNS({}).zones()
            .then(response => {
                console.log(response.data)
                var dnsHeaders = response.data.headers
                this.dns.zones = response.data.dnsZones
                this.dns.records = response.data.records
                console.log(this.dns.records)
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