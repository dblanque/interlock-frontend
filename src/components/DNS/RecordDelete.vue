<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: RecordDelete.vue --------------------------->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('actions.delete') + ' ' + $t('classes.dns.'+ deleteMode +'.single') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-card-text class="pa-0 ma-0 pb-4">
            <v-row v-if="deleteMode == 'record'" class="pa-0 ma-8 mb-2 text-subtitle-1 text-inverted" justify="center">
                {{ $t('section.dns.deleteRecord.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ recordObject.displayName + " (" + recordObject.typeName + ")?" }}
                </span>
            </v-row>
            <v-row v-else-if="deleteMode == 'zone'" class="pa-0 ma-8 mb-2 text-subtitle-1 text-inverted" justify="center">
                {{ $t('section.dns.deleteRecord.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ currentZone + "?" }}
                </span>
            </v-row>
            <v-divider class="mx-8 mb-3"/>
            <span v-if="deleteMode == 'record'">
                <v-row class="pa-0 ma-0 text-subtitle-1 text-inverted" justify="center" v-for="value, attr_key in recordObject" :key="attr_key">
                    <span class="ma-0 pa-0" style="padding-left: 0.5ch;" 
                    v-if="showAttribute(attr_key)">
                        {{ $t('dns.attributes.' + attr_key) + ": " + value }}
                    </span>
                </v-row>
            </span>
            <span v-else-if="deleteMode == 'zone'">
                <v-form @submit="confirmZone == currentZone ? closeDialog(true) : false" @submit.prevent ref="deleteZoneForm">
                <v-row class="ma-0 pa-0" justify="center">
                    <v-col cols="8">
                        <v-text-field v-model="confirmZone"
                        :label="$t('section.dns.deleteZone.confirmZone')"
                        :rules="[fieldRules(confirmZone, 'ldap_website')]"
                        />
                    </v-col>
                </v-row>
                </v-form>
            </span>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @keydown.enter="closeDialog(true)" 
                @click="closeDialog(true)" 
                :disabled="getAllowConfirmStatus"
                class="ma-0 pa-0 pa-2 pl-1 ma-1 bg-white bg-lig-25" 
                rounded>
                    <v-icon class="mr-1" color="green">
                    </v-icon>
                    <v-progress-circular :indeterminate="loading == true" :value="submitted ? 100 : 0" 
                    :color="error ? 'red' : 'green'" 
                    size="26" 
                    class="ma-0 mr-1">
                    <v-fab-transition>
                        <v-icon color="green" v-if="!submitted" >
                            mdi-checkbox-marked-circle-outline
                        </v-icon>
                        <v-icon color="green" v-else-if="submitted && !error" >
                            mdi-checkbox-marked-circle
                        </v-icon>
                        <v-icon color="red" v-else-if="submitted == true && error == true">
                            mdi-close-circle
                        </v-icon>
                    </v-fab-transition>
                    </v-progress-circular>
                    <span class="pr-1 text-normal">
                        {{ $t("actions.yes" )}}
                    </span>
                </v-btn>
                <v-btn @click="closeDialog"
                class="ma-0 pa-0 pa-2 ma-1 bg-white bg-lig-25" 
                rounded>
                    <span class="pl-1 text-normal">
                        {{ $t("actions.no" )}}
                    </span>
                    <v-icon class="ml-1" color="red">
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import DNSRecord from '@/include/DNSRecord'
import Domain from '@/include/Domain'
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin';

export default {
    name: "confirmDialog",
    mixins: [ validationMixin, utilsMixin ],
    data() {
        return {
            confirmZone: "",
            excludeAttr: [
                'ts',
                'type',
                'id',
                'index',
                'distinguishedName',
                'zone',
                'record_bytes'
            ],
            loading: false,
            error: false,
            submitted: false,
        }
    },
    props: {
        currentZone: String,
        deleteMode: {
            type: String,
            default: "record"
        },
        recordObject: Object,
        viewKey: String
    },
    computed: {
        getAllowConfirmStatus() {
            switch (this.deleteMode) {
                case 'zone':
                    if (this.currentZone == undefined || this.currentZone == null)
                        return true
                    if (this.currentZone != this.confirmZone)
                        return true
                    break;
                case 'record':
                    if (this.recordObject == undefined)
                        return true
                    break;
                default:
                    break;
            }
            return false
        },
    },
    methods: {
        resetDelete(){
            this.confirmZone = ""
            this.loading = false
            this.error = false
            this.submitted = false
        },
        showAttribute(attr){
            if (this.excludeAttr.includes(attr))
                return false
            return true
        },
        async closeDialog(deleteConfirm=false, record={}) {
            if (record != {} && this.deleteMode == 'record') {
                record = this.recordObject
                record.zone = this.currentZone
            }
            if (deleteConfirm == true) {
                this.loading = true
                this.error = false
                this.errorMsg = ""
                this.submitted = false
                if (this.deleteMode == 'zone' && this.currentZone == this.confirmZone && this.$refs.deleteZoneForm.validate()) {
                    await new Domain({}).delete({dnsZone: this.currentZone})
                    .then(() => {
                        this.loading = false
                        this.error = false
                        this.errorMsg = ""
                        this.submitted = true
                    })
                    .catch(error => {
                        this.loading = false
                        this.error = true
                        this.errorMsg = this.getMessageForCode(error)
                        this.submitted = true
                        console.log(error)
                    })
                } else if (this.deleteMode == 'record' && record) {
                    await new DNSRecord({}).delete({record: record})
                    .then(response => {
                        this.loading = false
                        this.error = false
                        this.errorMsg = ""
                        this.submitted = true
                        if (response.data.distinguishedName == record.distinguishedName)
                            console.log("Record Deleted Successfully")
                    })
                    .catch(error => {
                        this.loading = false
                        this.error = true
                        this.errorMsg = this.getMessageForCode(error)
                        this.submitted = true
                        console.log(error)
                    })
                }
            }

            // Wait for animations if delete confirm true
            if (deleteConfirm == true && this.submitted == true && this.error != true)
                setTimeout(() => {
                    this.$emit('closeDialog', this.viewKey, deleteConfirm);
                }, 150)
            else
                this.$emit('closeDialog', this.viewKey);
        },
    }
}
</script>

<style>
.outlined {
    border: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

.card-title {
    border-radius: 4px;
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-100));
    position: sticky !important;
    top: 0 !important;
    z-index: 100;
    border-bottom: thin solid hsla(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-0), 0.12)
}

[theme=dark] .card-title {
    background: hsl(var(--clr-white-hue), var(--clr-white-sat), var(--clr-lig-85));
}

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