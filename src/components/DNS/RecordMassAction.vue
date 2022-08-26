<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: RecordMassAction.vue ------------------------->
<template>
    <v-card>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                {{ $t('actions.delete') + ' ' + $t('classes.dns.record.plural') }}
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
            <v-row class="pa-0 ma-4 mb-2 text-subtitle-1 text-inverted" justify="center">
                <v-col cols="12" class="ma-0 pa-0"> {{ $t('section.dns.massAction.delete') }} </v-col>
                <v-divider class="mx-12 my-1"/>
                <v-col cols="12" class="font-weight-medium pa-0 ma-0" style="padding-left: 0.5ch;" 
                    v-for="record, index in selectedRecords" :key="index">
                    {{ record.displayName + " (" + record.typeName + ")" }}
                    <v-divider class="mx-12 my-1"/>
                </v-col>
            </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @keydown.enter="closeDialog(true)" 
                @click="closeDialog(true)" 
                :disabled="selectedRecords == undefined || selectedRecords.length < 1"
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
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin';

export default {
    mixins: [ validationMixin, utilsMixin ],
    data() {
        return {
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
        actionType: {
            type: String,
            default: 'delete'
        },
        selectedRecords: Array,
        currentZone: String,
        viewKey: String
    },
    methods: {
        reset(){
            this.loading = false
            this.error = false
            this.submitted = false
        },
        async closeDialog(deleteConfirm=false) {
            if (deleteConfirm == true) {
                this.loading = true
                this.error = false
                this.errorMsg = ""
                this.submitted = false
                var recordsToSend = []
                this.selectedRecords.forEach(record => {
                    var tempRec = record
                    tempRec['zone'] = this.currentZone
                    recordsToSend.push(tempRec)
                });
                console.log(recordsToSend)
                await new DNSRecord({}).delete({records: recordsToSend})
                .then(response => {
                    this.loading = false
                    this.error = false
                    this.errorMsg = ""
                    this.submitted = true
                    if (response.data.length == this.selectedRecords.length)
                        console.log("Records Deleted Successfully")
                })
                .catch(error => {
                    this.loading = false
                    this.error = true
                    this.errorMsg = this.getMessageForCode(error)
                    this.submitted = true
                    console.log(error)
                })
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