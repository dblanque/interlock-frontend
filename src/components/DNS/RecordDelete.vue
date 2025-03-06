<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: RecordDelete.vue --------------------------->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('actions.delete') + ' ' + $tc('classes.dns.'+ deleteMode, 1) }}
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
            <v-row v-if="deleteMode == 'record'" class="pa-0 ma-8 mb-2 text-subtitle-1" justify="center">
                {{ $t('section.dns.deleteRecord.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ recordObject.displayName + " (" + recordObject.typeName + ")?" }}
                </span>
            </v-row>
            <v-row v-else-if="deleteMode == 'zone'" class="pa-0 ma-8 mb-2 text-subtitle-1" justify="center">
                {{ $t('section.dns.deleteZone.message') }}
                <span class="font-weight-medium" style="padding-left: 0.5ch;">
                    {{ currentZone + "?" }}
                </span>
            </v-row>
            <v-divider class="mx-8 mb-3"/>
            <span v-if="deleteMode == 'record'">
                <v-row class="pa-0 ma-0 text-subtitle-1" justify="center" v-for="value, attr_key in recordObject" :key="attr_key">
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
            <!-- ! TODO Make this a component -->
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <ProgressButton
                    class="ma-0 pa-0 pa-2 pl-1 ma-1" 
                    @keydown.enter="closeDialog(true)"
                    @click="closeDialog(true)"
                    :disabled="getAllowConfirmStatus"
                    :loading="loading == true"
                    :submitted="submitted"
                    :icon-color="loading || !submitted ? 'primary' : (submitted && !error ? 'valid-40-s' : 'error')"
                    icon-success="mdi-check-circle"
                    icon-error="mdi-close-circle"
                    :label="$t('actions.yes')"
                />
                <v-btn @click="closeDialog"
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-2 ma-1" 
                rounded>
                    <span class="pl-1">
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
import DNSRecord from '@/include/DNSRecord.js'
import Domain from '@/include/Domain.js'
import ProgressButton from '@/components/ProgressButton.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js'

export default {
    name: "RecordDelete",
    mixins: [ validationMixin, utilsMixin ],
    components: {
        ProgressButton
    },
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
        dialogKey: String
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
        }
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
                        notificationBus.$emit('createNotification', 
                            {message: (this.$tc("classes.dns.zone", 1) + " " + this.$tc("words.deleted.f", 1)).toUpperCase(), type: 'info'}
                        )
                    })
                    .catch(error => {
                        this.loading = false
                        this.error = true
                        this.errorMsg = this.getMessageForCode(error)
                        this.submitted = true
                        notificationBus.$emit('createNotification', 
                            {message: this.errorMsg.toUpperCase(), type: 'error'}
                        )
                        console.error(error)
                    })
                } else if (this.deleteMode == 'record' && record) {
                    await new DNSRecord({}).delete({record: record})
                    .then(() => {
                        this.loading = false
                        this.error = false
                        this.errorMsg = ""
                        this.submitted = true
                        notificationBus.$emit('createNotification', 
                            {message: (this.$tc("classes.dns.record", 1) + " " + this.$tc("words.deleted.m", 1)).toUpperCase(), type: 'info'}
                        )
                    })
                    .catch(error => {
                        this.loading = false
                        this.error = true
                        this.errorMsg = this.getMessageForCode(error)
                        this.submitted = true
                        notificationBus.$emit('createNotification', 
                            {message: this.errorMsg.toUpperCase(), type: 'error'}
                        )
                        console.error(error)
                    })
                }
            }

            // Wait for animations if delete confirm true
            if (deleteConfirm == true && this.submitted == true && this.error != true)
                setTimeout(() => {
                    this.$emit('closeDialog', this.dialogKey, deleteConfirm);
                }, 150)
            else
                this.$emit('closeDialog', this.dialogKey);
        },
    }
}
</script>

<style>
.outlined {
    border: thin solid var(--border-d-base);
}

.card-title {
    border-radius: 4px;
    background: var(--v-white-d-base);
    position: sticky !important;
    top: 0 !important;
    z-index: 100;
    border-bottom: thin solid var(--border-d-base);
}

[theme=dark] .card-title {
    background: var(--v-gray-85-base);
}

.card-actions {
    border-radius: 4px;
    background: var(--v-white-d-base);
    position: sticky !important;
    bottom: 0 !important;
    z-index: 100;
    border-top: thin solid var(--border-d-base);
}

[theme=dark] .card-actions {
    background: var(--v-gray-85-base);
}
</style>