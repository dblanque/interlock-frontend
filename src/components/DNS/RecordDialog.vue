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

    <v-form ref="RecordForm">
    <v-row class="ma-0 pa-0 pa-4 pb-1" align="center" justify="center">
        <v-col cols="10" md="8" class="ma-0 pa-0" v-if="updateFlag != true">
            <v-select @change="resetRecord" :label="$t('dns.attributes.typeName')"
            v-model="selectedType"
            hide-details
            :items="recordTypes.filter(e => e.supported == true)"
            item-value="value"
            item-text="name"/>
        </v-col>
        <v-col cols="12" class="ma-0 pa-0 px-2 mt-4">
            <v-combobox @change="setTTL" :label="$t('dns.attributes.ttl')"
            :items="ttlPresets"
            v-model="recordCopy.ttl"
            :rules="[this.fieldRules(recordCopy.ttl, 'ge_numbers', true)]"
            />
        </v-col>
        <v-col cols="12" class="ma-0 pa-0 mt-0">
            <v-text-field
            v-model="recordCopy.name"
            :hint="$t('dns.hints.name')"
            persistent-hint
            :label="$t('dns.attributes.name')"
            :rules="[this.fieldRules(recordCopy.name, 'dns_root', true)]"
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
            <v-textarea auto-grow outlined
            v-model="recordCopy.stringData"
            :label="$t('dns.attributes.stringData')"
            :rules="[this.fieldRules(recordCopy.stringData, 'ge_ascii', true)]"
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

    <!-- Actions -->
    <v-card-actions class="card-actions">
        <v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
            <!-- Back and Next buttons -->
            <div>
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
import DNSRecord from '@/include/DNSRecord'

export default {
    mixins: [ validationMixin ],
    props: {
        viewKey: String,
        recordObject: Object,
        currentZone: String,
        updateFlag: Boolean
    },
    data() {
        return {
            ttlPresets: [
                60,
                300,
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
            if (this.$refs.RecordForm != undefined)
                this.$refs.RecordForm.resetValidation()
            this.recordCopy = {}
            setTimeout(() => {
                this.recordCopy.type = this.selectedType
            }, 500)
        },
        resetValidation(){
            if (this.$refs.RecordForm != undefined)
                this.$refs.RecordForm.resetValidation()
        },
        syncRecord() {
            this.resetRecord()
            this.$nextTick(() => {
                // Do deep copy of object for reset
                this.recordCopy = JSON.parse(JSON.stringify(this.recordObject))
                if (this.recordObject.type != undefined)
                    this.selectedType = this.recordObject.type
            })
        },
        setTTL(v) {
            this.recordCopy.ttl = v
        },
        async createRecord() {
            console.log('Create Record')
            console.log(this.recordCopy)
            this.recordCopy.zone = this.currentZone
            if (this.$refs.RecordForm.validate()) {
                await new DNSRecord({}).insert(this.recordCopy)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        async updateRecord() {
            console.log('Update Record')
            console.log(this.recordCopy)
            this.recordCopy.zone = this.currentZone
            if (this.$refs.RecordForm.validate()) {
                await new DNSRecord({}).update(this.recordCopy)
                .then(response => {
                    console.log(response)
                })
                .catch(error => {
                    console.log(error)    
                })
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
</style>