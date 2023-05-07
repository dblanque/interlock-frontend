<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: RecordDialog.vue ---------------------------->
<template>
<v-card class="pa-0 ma-0">
    <!-- Title Bar -->
    <v-card-title class="ma-0 pa-0 card-title">
        <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
            <h3 class="ma-2">{{ (updateFlag ? $t('actions.edit') : $t('actions.create')) + " " + $t("classes.dns.record.single") }}</h3>
            <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
            <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                <v-icon>
                    mdi-close
                </v-icon>
            </v-btn>
        </v-row>
    </v-card-title>

    <v-card-text class="ma-0 pa-0">
        <v-row class="ma-0 pa-0">
        <v-col class="ma-0 pa-0" cols="4" lg="3" v-if="useSidebar && updateFlag != true">
            <v-list class="pa-0 ma-0 dnssidebar">
                <v-radio-group class="ma-0 pa-0 pt-4" column v-model="selectedType">
                    <v-list-item v-for="element, index in getRecordTypes" :key="element.value">
                        <v-radio 
                        :key="index" 
                        :value="element.value"
                        :label="$t('classes.dns.record.single') + ' ' + element.name"/>
                    </v-list-item>
                </v-radio-group>
            </v-list>
        </v-col>
        <v-col class="ma-0 pa-0">
            <v-form ref="RecordForm" @submit.prevent>
                <v-row class="ma-0 pa-0 pa-4 pb-1" align="center" justify="center">
                    <v-col cols="10" md="8" class="ma-0 pa-0" v-if="updateFlag != true">
                        <v-select @change="resetRecord" :label="$t('dns.attributes.typeName')"
                        v-model="selectedType"
                        v-show="!useSidebar"
                        hide-details
                        :items="getRecordTypes"
                        item-value="value"
                        item-text="name"/>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0 px-2 mt-4">
                        <v-combobox @change="setTTL"
                        :label="$t('dns.attributes.ttl')"
                        :items="ttlPresets"
                        v-model="ttlVal"
                        ref="TTLField"
                        :rules="[this.fieldRules(ttlVal, 'ge_numbers', true)]"
                        />
                    </v-col>
                    <v-col v-if="selectedType != 6" cols="12" class="ma-0 pa-0 mt-0">
                        <v-text-field
                        v-model="recordCopy.name"
                        :hint="$t('dns.hints.name')"
                        persistent-hint
                        :label="$t('dns.attributes.name')"
                        :rules="[this.fieldRules(recordCopy.name, getValidationForRecordTypeName, true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- A Record Type -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="selectedType == 1">
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.address"
                        :label="$t('dns.attributes.ipAddress')"
                        :rules="[this.fieldRules(recordCopy.address, 'net_ip', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- NS / CNAME Record Types -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="isNodeNameRecord(selectedType)">
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.nameNode"
                        :label="$t('dns.attributes.nameNode')"
                        :rules="[this.fieldRules(recordCopy.nameNode, 'net_domain_canonical', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- MX Record Types -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="selectedType == 15">
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.nameExchange"
                        :label="$t('dns.attributes.nameExchange')"
                        :rules="[this.fieldRules(recordCopy.nameExchange, 'net_domain_canonical', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.wPreference"
                        :label="$t('dns.attributes.wPreference')"
                        :rules="[this.fieldRules(recordCopy.wPreference, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- TXT Record Types -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="isStringRecord(selectedType)">
                    <v-col cols="12" class="ma-0 pa-0 mt-4">
                        <v-alert type="info" class="mx-2 mb-1">
                            {{ $t("dns.hints.quotesNotRequired") }}
                        </v-alert>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0 mt-4">
                        <v-textarea auto-grow outlined
                        v-model="recordCopy.stringData"
                        :hint="$t('dns.hints.stringData')"
                        persistent-hint
                        :label="$t('dns.attributes.stringData')"
                        :rules="[this.fieldRules(recordCopy.stringData, 'dns_stringData', true)]"
                        class="mx-2"
                        ></v-textarea>
                    </v-col>
                </v-row>

                <!-- SOA Record Type -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="selectedType == 6">
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.namePrimaryServer"
                        :label="$t('dns.attributes.namePrimaryServer')"
                        :rules="[this.fieldRules(recordCopy.namePrimaryServer, 'net_domain_canonical', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.zoneAdminEmail"
                        :label="$t('dns.attributes.zoneAdminEmail')"
                        :rules="[this.fieldRules(recordCopy.zoneAdminEmail, 'net_domain_canonical', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.dwSerialNo"
                        :label="$t('dns.attributes.dwSerialNo')"
                        :rules="[this.fieldRules(recordCopy.dwSerialNo, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.dwRefresh"
                        :label="$t('dns.attributes.dwRefresh')"
                        :rules="[this.fieldRules(recordCopy.dwRefresh, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.dwRetry"
                        :label="$t('dns.attributes.dwRetry')"
                        :rules="[this.fieldRules(recordCopy.dwRetry, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.dwExpire"
                        :label="$t('dns.attributes.dwExpire')"
                        :rules="[this.fieldRules(recordCopy.dwExpire, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.dwMinimumTtl"
                        :label="$t('dns.attributes.dwMinimumTtl')"
                        :rules="[this.fieldRules(recordCopy.dwMinimumTtl, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- SRV Record Type -->
                <v-row class="ma-0 pa-0 px-4 pb-4" v-if="selectedType == 33">
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.wPriority"
                        :label="$t('dns.attributes.wPriority')"
                        :rules="[this.fieldRules(recordCopy.wPriority, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.wWeight"
                        :label="$t('dns.attributes.wWeight')"
                        :rules="[this.fieldRules(recordCopy.wWeight, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.wPort"
                        :label="$t('dns.attributes.wPort')"
                        :rules="[this.fieldRules(recordCopy.wPort, 'ge_numbers', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="ma-0 pa-0">
                        <v-text-field
                        v-model="recordCopy.nameTarget"
                        :label="$t('dns.attributes.nameTarget')"
                        :rules="[this.fieldRules(recordCopy.nameTarget, 'net_domain_canonical', true)]"
                        class="mx-2"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-col>
        </v-row>
    </v-card-text>

    <!-- Actions -->
    <v-card-actions class="card-actions">
        <v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
            <!-- Back and Next buttons -->
            <div>
                <v-slide-x-reverse-transition>
                    <v-progress-circular :indeterminate="loading == true" :value="submitted ? 100 : 0" :color="submitted ? (!error ? 'green' : 'red') : 'primary'" size="26" class="mx-3">
                    <v-fab-transition>
                        <v-icon color="green" v-if="submitted && !error" >
                            mdi-checkbox-marked-circle
                        </v-icon>
                        <v-icon color="red" v-else-if="submitted == true && error == true">
                            mdi-close-circle
                        </v-icon>
                    </v-fab-transition>
                    </v-progress-circular>
                </v-slide-x-reverse-transition>

                <v-slide-x-reverse-transition>
                    <v-chip text-color="white" class="mr-2" v-if="submitted == true" :color="error == true ? 'red':'green'">
                        {{ errorMsg == "" ? $t('section.dns.'+ (updateFlag ? 'update' : 'create' ) +'Success') : errorMsg }}
                    </v-chip>
                </v-slide-x-reverse-transition>

                <v-slide-x-reverse-transition>
                    <v-btn elevation="0" @click="syncRecord"
                    class="text-normal ma-0 pa-0 pa-2 ma-1 pr-4 bg-white bg-lig-25" 
                    rounded>
                        <v-icon class="ma-0 mr-1" color="primary">
                            mdi-cached
                        </v-icon>
                        {{ $t("actions.reset" )}}
                    </v-btn>
                </v-slide-x-reverse-transition>

                <v-slide-x-reverse-transition>
                    <v-btn elevation="0" @click="updateFlag == true ? updateRecord() : createRecord()"
                    @keydown.enter="updateFlag == true ? updateRecord() : createRecord()"
                    class="text-normal ma-0 pa-0 pa-2 ma-1 pr-4 bg-white bg-lig-25" 
                    rounded>
                        <v-icon class="ma-0 mr-1" color="primary">
                            mdi-checkbox-marked-circle-outline
                        </v-icon>
                        {{ $t("actions.done" )}}
                    </v-btn>
                </v-slide-x-reverse-transition>
            </div>
        </v-row>
    </v-card-actions>
</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin';
import DNSRecord from '@/include/DNSRecord'
import { notificationBus } from '@/main.js'

export default {
    mixins: [ validationMixin, utilsMixin ],
    props: {
        viewKey: String,
        recordObject: Object,
        currentZone: String,
        updateFlag: Boolean,
        zoneHasSOA: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            loading: false,
            error: false,
            submitted: false,
            drawerState: true,
            errorMsg: "",
            ttlVal: 900,
            ttlPresets: [
                60,
                300,
                900,
                3600,
                86400,
                604800
            ],
            selectedType: 1,
            recordTypes: [
                {
                    name: "A",
                    value: 1,
                    supported: true
                },
                {
                    name: "NS",
                    value: 2,
                    supported: true
                },
                {
                    name: "CNAME",
                    value: 5,
                    supported: true
                },
                {
                    name: "DNAME",
                    value: 39,
                    supported: true
                },
                {
                    name: "SOA",
                    value: 6,
                    supported: true
                },
                {
                    name: "HINFO",
                    value: 13,
                    supported: true
                },
                {
                    name: "MX",
                    value: 15,
                    supported: true
                },
                {
                    name: "TXT",
                    value: 16,
                    supported: true
                },
                {
                    name: "SIG",
                    value: 18,
                    supported: false
                },
                {
                    name: "KEY",
                    value: 19,
                    supported: false
                },
                {
                    name: "ISDN",
                    value: 20,
                    supported: true
                },
                {
                    name: "AAAA",
                    value: 28,
                    supported: false
                },
                {
                    name: "LOC",
                    value: 29,
                    supported: true
                },
                {
                    name: "SRV",
                    value: 33,
                    supported: true
                },
                {
                    name: "PTR",
                    value: 35,
                    supported: true
                },
                {
                    name: "WINS",
                    value: 65281,
                    supported: false
                },
            ],
            recordCopy: {},
            originalRecord: {},
            nodeNameRecordTypes: [
                35, // PTR
                2,  // NS
                5,  // CNAME
                39 // DNAME
            ],
            stringRecordTypes: [
                13, // HINFO
                20, // ISDN
                16, // TXT
                19, // X25
                29  // LOC
            ]
        }
    },
    computed: {
        useSidebar(){
            return this.$vuetify.breakpoint.mdAndUp
        },
        getValidationForRecordTypeName(){
            var defaultValidator = 'dns_root'
            if (this.recordCopy.type != undefined) {
                switch (this.recordCopy.type) {
                    default:
                        return defaultValidator
                }
            } else
            return defaultValidator
        },
        getRecordTypes(){
            var rTypes = this.recordTypes.filter(e => e.supported == true)
            if (this.zoneHasSOA == true)
                rTypes = rTypes.filter(e => e.value != 6)
            return rTypes
        }
    },
    created () {
        this.syncRecord();
    },
    methods: {
        isNodeNameRecord(type){
            if (this.nodeNameRecordTypes.includes(type))
                return true
            return false
        },
        isStringRecord(type){
            if (this.stringRecordTypes.includes(type))
                return true
            return false
        },
        logData(){
            console.log(this.recordCopy)
            console.log(this.recordObject)
        },
        resetRecord() {
            this.resetLoadingStatus()
            if (this.$refs.RecordForm != undefined)
                this.$refs.RecordForm.resetValidation()
            this.recordCopy = {}
            if (this.recordObject != undefined && this.recordObject != null){
                if (this.recordObject.ttl == undefined)
                    this.recordCopy.ttl = 900
                setTimeout(() => {
                        this.recordCopy.type = this.selectedType
                }, 500)
            }
        },
        resetValidation(){
            if (this.$refs.RecordForm != undefined)
                this.$refs.RecordForm.resetValidation()
        },
        syncRecord() {
            this.resetRecord()
            this.$nextTick(() => {
                // Do deep copy of object for reset
                if (this.recordObject != undefined && this.recordObject != null) {
                    this.recordCopy = JSON.parse(JSON.stringify(this.recordObject))
                    this.originalRecord = JSON.parse(JSON.stringify(this.recordObject))
                    
                    if (this.recordObject.ttl == undefined)
                        this.recordCopy.ttl = 900
                    if (this.recordObject.type != undefined)
                        this.selectedType = this.recordObject.type
                }
            })
        },
        setTTL(v) {
            if (this.$refs.TTLField.validate())
                this.recordCopy.ttl = v
        },
        resetLoadingStatus(){
            this.loading = false
            this.error = false
            this.errorMsg = ""
            this.submitted = false
        },
        async createRecord() {
            // console.log('Create Record')
            // console.log(this.recordCopy)
            this.recordCopy.zone = this.currentZone
            // If Record Type is SOA force the Root Name
            if (this.recordCopy.type == 6)
                this.recordCopy.name = '@'

            if (this.$refs.RecordForm.validate()) {
                this.resetLoadingStatus()
                this.loading = true
                await new DNSRecord({}).insert(this.recordCopy)
                .then(() => {
                    this.loading = false
                    this.error = false
                    this.errorMsg = ""
                    this.submitted = true
                    setTimeout(() => {
                        this.closeDialog(true)
                        notificationBus.$emit('createNotification', 
                            {message: (this.$t("classes.dns.record.single") + " " + this.$t("words.created.single.m")).toUpperCase(), type: 'success'}
                        )
                    }, 250)
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                    this.error = true
                    this.submitted = true
                    this.errorMsg = this.getMessageForCode(error)
                    notificationBus.$emit('createNotification', 
                        {message: this.errorMsg.toUpperCase(), type: 'error'}
                    )
                })
            }
        },
        async updateRecord() {
            // console.log('Update Record')
            // console.log(this.recordCopy)
            this.recordCopy.zone = this.currentZone
            var recordDiffers = false

            if (this.recordCopy.type == 6)
                this.recordCopy.serial = parseInt(this.recordCopy.dwSerialNo)

            for (const key in this.recordCopy) {
                if (key in this.recordCopy && key in this.originalRecord) {
                    if (this.recordCopy[key] != this.originalRecord[key])
                        recordDiffers = true
                }
            }

            if (recordDiffers == true && this.$refs.RecordForm.validate()) {
                this.resetLoadingStatus()
                this.loading = true
                await new DNSRecord({}).update({record: this.recordCopy, oldRecord: this.originalRecord})
                .then(() => {
                    this.loading = false
                    this.error = false
                    this.errorMsg = ""
                    this.submitted = true
                    setTimeout(() => {
                        this.closeDialog(true)
                        notificationBus.$emit('createNotification', 
                            {message: (this.$t("classes.dns.record.single") + " " + this.$t("words.updated.single.m")).toUpperCase(), type: 'success'}
                        )
                    }, 250)
                })
                .catch(error => {
                    console.log(error)
                    this.loading = false
                    this.error = true
                    this.submitted = true
                    this.errorMsg = this.getMessageForCode(error)
                    notificationBus.$emit('createNotification', 
                        {message: this.errorMsg.toUpperCase(), type: 'error'}
                    )
                })
            } else {
                this.closeDialog()
            }
        },
        closeDialog(refresh=false){
            this.$emit('closeDialog', this.viewKey, refresh);
        },
    },
}
</script>

<style>
.card-actions {
    border-radius: 4px;
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-100));
    position: sticky !important;
    bottom: 0 !important;
    z-index: 100;
    border-top: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

[theme=dark] .card-actions {
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-85));
}

.dnssidebar {
    border-right: 1px solid rgba(0,0,0,0.2) !important;
}

[theme=dark] .dnssidebar {
    border-color: rgba(255,255,255,0.2) !important;
}
</style>