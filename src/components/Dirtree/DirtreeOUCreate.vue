<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: DirtreeOUCreate.vue -------------------------->
<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("actions.create") + " " + $tc("classes."+createType, 1)}}</h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>
    
        <!-- Steps -->
        <v-expand-transition>
        <div>
            <v-stepper v-model="createStage">
            <!-- Steps -->
                <v-stepper-header class="px-16">
                    <!-- Basics -->
                    <v-stepper-step :complete="createStage > 1" step="1">{{ $t('section.dirtree.' + createType + 'Create.step1') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 2" step="2">{{ $t('section.dirtree.' + createType + 'Create.step2') }}</v-stepper-step>
                </v-stepper-header>

            <!-- Steps Content -->
                <v-stepper-items>
                    <!-- Basics -->
                    <v-stepper-content step="1">
                        <v-form ref="ouCreateForm1" @submit.prevent>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="5">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$tc('classes.'+createType, 1) + ' ' + $t('ldap.attributes.name')"
                                    v-model="objectToCreate.name"
                                    :rules="[this.fieldRules(objectToCreate.name, 'ge_cn', true)]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0 pa-0" justify="center">                                
                                <v-row class="ma-0 pa-0 mt-4" align="center" justify="space-around">
                                    <v-btn small text color="primary" class="ma-1" @click="setDestination()">
                                        {{ $t('section.dirtree.move.setToRoot')}}
                                    </v-btn>
                                    <v-btn small
                                        class="ma-1"
                                        text
                                        :disabled="!allowRefresh"
                                        elevation="0"
                                        @click="fetchOUs(true)"
                                        >
                                        {{ $t('actions.refresh') }}
                                        <v-icon>
                                        mdi-refresh
                                        </v-icon>
                                        <template v-slot:loader>
                                        <span class="custom-loader">
                                            <v-icon color="white">mdi-cached</v-icon>
                                        </span>
                                        </template>
                                    </v-btn>
                                </v-row>
                                <v-col cols="12">
                                        <v-expansion-panels 
                                        v-model="ouPathExpansionPanel"
                                        flat 
                                        hover 
                                        style="border: 1px solid var(--v-primary-base);">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <span>
                                                        <span>
                                                            {{ $t('section.dirtree.'+createType+'Create.'+createType+'CreatedIn') + ': ' }}
                                                        </span>
                                                        <span class="font-weight-bold">
                                                            {{ this.ouDestination }}
                                                        </span>
                                                    </span>
                                                </v-expansion-panel-header>
        
                                                <v-expansion-panel-content>
                                                    <v-card flat outlined style="max-height: 300px; overflow: auto !important;">
                                                        <!-- Dirtree OU List Component -->
                                                        <DirtreeOUList
                                                        ref="DirtreeOUList"
                                                        @selectedDestination="setDestination"
                                                        />
                                                    </v-card>
                                                </v-expansion-panel-content>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-stepper-content>
                    <!-- Check if OU exists - loader -->
                    <v-stepper-content step="2">
                        <v-row class="pa-12 ma-12" justify="center" align-content="center" align="center">
                            <v-col cols="12">
                                <v-fab-transition>
                                    <v-progress-circular value="100"
                                    :color="(this.error === false) ? (loading ? 'primary' : 'green') : 'red'"
                                    :indeterminate="loading" 
                                    size="100" 
                                    width="10">
                                        <v-fab-transition>
                                            <div v-show="loading == false">
                                                <v-icon v-if="error == true" size="82" color="red">mdi-close-circle</v-icon>
                                                <v-icon v-else size="82" color="green">mdi-check-circle</v-icon>
                                            </div>
                                        </v-fab-transition>
                                    </v-progress-circular>
                                </v-fab-transition>
                            </v-col>
                            
                            <v-col cols="12">
                                <v-slide-y-transition>
                                    <v-col v-if="!this.loading && this.loading == false">
                                        {{ this.error ? '' : $t('section.dirtree.'+createType+'Create.step2_success') }}
                                    </v-col>
                                </v-slide-y-transition>
                            </v-col>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </div>
        </v-expand-transition>

        <v-snackbar text color="red" timeout="1500" v-if="$vuetify.breakpoint.smAndDown" v-model="showSnackbar" centered>
        <v-row justify="center">
            {{ this.errorMsg }}
        </v-row>
        </v-snackbar>

        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
                <!-- Back and Next buttons -->
                <div>
                    <v-slide-x-reverse-transition>
                        <v-chip class="mx-2" color="red" v-if="this.error && $vuetify.breakpoint.mdAndUp" text-color="white">
                            {{ this.errorMsg }}
                        </v-chip>
                    </v-slide-x-reverse-transition>

                    <v-slide-x-reverse-transition>
                        <v-btn elevation="0" @click="newOU" v-if="this.createStage < 2"
                        class="ma-0 pa-0 pa-2 ma-1 pr-4"
                        :dark="!isThemeDark($vuetify)"
                        :light="isThemeDark($vuetify)"
                        rounded>
                            <v-icon class="ma-0 mr-1" color="primary">
                                mdi-cached
                            </v-icon>
                            {{ $t("actions.reset" )}}
                        </v-btn>
                    </v-slide-x-reverse-transition>

                    <v-slide-x-reverse-transition>
                    <v-btn elevation="0" @click="prevStep" v-if="createStage > 1 && this.error"
                    @keydown.enter="prevStep"
                    class="ma-0 pa-0 pa-2 pr-4 ma-1"
                    :dark="!isThemeDark($vuetify)"
                    :light="isThemeDark($vuetify)"
                    rounded>
                        <v-icon class="ma-0" color="primary">
                            mdi-chevron-double-left
                        </v-icon>
                        {{ $t("actions.back_short" )}}
                    </v-btn>
                    </v-slide-x-reverse-transition>
                    <v-slide-x-reverse-transition>
                        <v-btn elevation="0" @click="nextStep" v-if="this.createStage < 2"
                        @keydown.enter="nextStep"
                        :dark="!isThemeDark($vuetify)"
                        :light="isThemeDark($vuetify)"
                        class="ma-0 pa-0 pa-2 ma-1 pl-4" 
                        rounded>
                            {{ $t("actions.next" )}}
                            <v-icon class="ma-0" color="primary">
                                mdi-chevron-double-right
                            </v-icon>
                        </v-btn>
                    </v-slide-x-reverse-transition>
                    <v-slide-x-reverse-transition>
                        <v-btn elevation="0" @click="closeDialog(true)" v-if="this.createStage > 1 && this.error === false"
                        @keydown.enter="closeDialog"
                        :dark="!isThemeDark($vuetify)"
                        :light="isThemeDark($vuetify)"
                        class="ma-0 pa-0 pa-2 ma-1 pr-4" 
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
import OrganizationalUnit from '@/include/OrganizationalUnit.js'
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { getDomainDetails } from '@/include/utils.js';

export default {
    name: 'DirtreeOUCreate',
    components: {
        DirtreeOUList
    },
    data () {
      return {
        passwordHidden: true,
        domain: "",
        realm: "",
        basedn: "",
        success: false,
        loading: true,
        error: false,
        valid: false,
        errorMsg: "",
        allowRefresh: true,
        showSnackbar: false,
        ouPathExpansionPanel: false,
        ouDestination: '',
        objectToCreate: {},
        createStage: 1,
      }
    },
    mixins: [
        validationMixin,
        utilsMixin
    ],
    props: {
        createType: {
            type: String,
            default: "ou"
        },
        viewKey: String
    },
    created(){
        this.newOU()
    },
    methods: {
        async resetDialog(){
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            return
        },
        setDestination(destination=undefined){
            // Set default destination if undefined
            if (destination == undefined || !destination){
                this.ouDestination = this.basedn
                this.ouPathExpansionPanel = 0
            }
            // Set destination from arg
            else {
                this.ouDestination = destination
                this.ouPathExpansionPanel = false
            }
        },
        prevStep(){
            switch (this.createStage) {
                case 2:
                    this.error = false
                    this.errorMsg = ""
                    var domainDetails = getDomainDetails()
                    this.domain = domainDetails.domain
                    this.realm = domainDetails.realm
                    this.basedn = domainDetails.basedn
                    this.createStage -= 1
                    break;
                default:
                    this.createStage -= 1
                    break;
            }
        },
        nextStep(){
            switch (this.createStage) {
                case 1:
                    if (this.$refs.ouCreateForm1.validate() && this.ouDestination != ""){
                        this.error = false
                        this.errorMsg = ""
                        if (!this.error){
                            Object.keys(this.objectToCreate).forEach(key => {
                                if (this.objectToCreate[key] === undefined) {
                                    delete this.objectToCreate[key];
                                }
                            });
                            this.createLDAPObject()
                        }
                        else {
                            // Force snackbar to reappear if error was pre-existent
                            if (this.showSnackbar == true)
                                this.showSnackbar = false
                            this.showSnackbar = true
                            this.error = true
                            this.errorMsg = this.$t('section.dirtree.ouCreate.validationError')
                        }
                    }
                    else {
                        // Force snackbar to reappear if error was pre-existent
                        if (this.showSnackbar == true)
                            this.showSnackbar = false
                        this.showSnackbar = true
                        this.error = true
                        this.errorMsg = this.$t('error.validation.fieldinvalid')
                    }
                    break;
                default:
                    break;
            }
        },
        async newOU(){
            this.passwordHidden = true
            this.ouPathExpansionPanel = false
            this.allowRefresh = true
            this.objectToCreate = new OrganizationalUnit({})
            this.createStage = 1
            this.error = false
            this.errorMsg = ""
            if (this.$refs.ouCreateForm1)
                this.$refs.ouCreateForm1.resetValidation()
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            this.fetchOUs()
            this.ouDestination = this.basedn
        },
        updateValue(key, value){
            this[key] = value
        },
        async fetchOUs(refresh=false){
            if (refresh == true)
                this.ouPathExpansionPanel = 0
            if (this.$refs.DirtreeOUList != undefined) {
                this.allowRefresh = false
                this.$nextTick(()=>{
                    if (refresh != true)
                        this.setDestination()
                    this.$refs.DirtreeOUList.fetchOUs()
                    .then(() => {
                        this.allowRefresh = true
                    })
                })
            }
        },
        closeDialog(refresh=false){
            this.$emit('closeDialog', this.viewKey, refresh);
        },
        async createLDAPObject(){
            this.error = false
            this.errorMsg = ""
            this.createStage += 1
            this.objectToCreate.path = this.ouDestination
            this.objectToCreate.type = this.createType
            if (this.createType == 'ou' || !this.createType)
                this.objectToCreate.ou = this.objectToCreate.name
            await this.objectToCreate.insert({ldapObject: this.objectToCreate})
            .then(response => {
                if (response.status == 200) {
                    this.error = false;
                    this.errorMsg = "";
                    // Set Timeout to do circle animation
                    setTimeout(() => {
                        this.loading = false;
                    }, 450)
                    this.success = true;
                } else {
                    this.error = true;
                    this.errorMsg = this.$t("error.unknown_short")
                    // Set Timeout to do circle animation
                    setTimeout(() => {
                        this.loading = false;
                    }, 450)
                    this.success = false;
                }
            })
            .catch(error => {
                this.error = true;
                // Set Timeout to do circle animation
                setTimeout(() => {
                    this.loading = false;
                }, 450)
                this.errorMsg = this.getMessageForCode(error)
            })
        }
    }
}
</script>