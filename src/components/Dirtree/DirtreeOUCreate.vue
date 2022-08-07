<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("section.dirtree.ouCreate.header")}}</h3>
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
                    <v-stepper-step :complete="createStage > 1" step="1">{{ $t('section.dirtree.ouCreate.step1') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--clr-primary) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 2" step="2">{{ $t('section.dirtree.ouCreate.step2') }}</v-stepper-step>
                </v-stepper-header>

            <!-- Steps Content -->
                <v-stepper-items>
                    <!-- Basics -->
                    <v-stepper-content step="1">
                        <v-form ref="ouCreateForm1">
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="5">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.ouName')"
                                    v-model="ouToCreate.name"
                                    :rules="[this.fieldRules(ouToCreate.name, 'ge_cn', true)]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0 pa-0" justify="center">
                                <v-col cols="12">
                                        <v-expansion-panels 
                                        v-model="ouPathExpansionPanel"
                                        flat 
                                        hover 
                                        style="border: 1px solid var(--clr-primary);">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <span>
                                                        <span>
                                                            {{ $t('section.dirtree.ouCreate.ouCreatedIn') + ': ' }}
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
                                        {{ this.error ? '' : $t('section.dirtree.ouCreate.step2_success') }}
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
                        class="text-normal ma-0 pa-0 pa-2 ma-1 pr-4 bg-white bg-lig-25" 
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
                    class="text-normal ma-0 pa-0 pa-2 pr-4 ma-1 bg-white bg-lig-25" 
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
                        class="text-normal ma-0 pa-0 pa-2 ma-1 pl-4 bg-white bg-lig-25" 
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
import OrganizationalUnit from '@/include/OrganizationalUnit'
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList'
import validationMixin from '@/plugins/mixin/validationMixin';
import { getDomainDetails } from '@/include/utils';

export default {
    name: 'dirtreeOUCreate',
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
        showSnackbar: false,
        ouPathExpansionPanel: false,
        ouDestination: '',
        ouToCreate: {},
        ouList: [],
        createStage: 1,
      }
    },
    mixins: [
        validationMixin
    ],
    props: {
        viewKey: String
    },
    created(){
        this.newOU
    },
    computed:{
    },
    methods: {
        async resetDialog(){
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            this.allowRefresh = false
            if (this.$refs.DirtreeOUList) {
                this.$nextTick(()=>{
                    this.setDestination()
                    this.$refs.DirtreeOUList.fetchOUs(this.filter)
                    .then(() => {
                        this.allowRefresh = true
                    })
                })
            }
            return
        },
        setDestination(destination=undefined){
            // Set default destination if undefined
            if (destination == undefined || !destination)
                this.ouDestination = this.basedn
            // Set destination from arg
            else
                this.ouDestination = destination

            this.ouPathExpansionPanel = false
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
                            Object.keys(this.ouToCreate).forEach(key => {
                                if (this.ouToCreate[key] === undefined) {
                                    delete this.ouToCreate[key];
                                }
                            });
                            this.createOU()
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
            this.ouToCreate = new OrganizationalUnit({})
            this.createStage = 1
            this.error = false
            this.errorMsg = ""
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
        async fetchOUs(){
            await new OrganizationalUnit({}).list()
            .then(response => {
                this.ouList = response.data.ou_list
            })
            .catch(error => {
                console.log(error)
            })
        },
        closeDialog(refresh=false){
            this.$emit('closeDialog', this.viewKey, refresh);
        },
        async createOU(){
            this.error = false
            this.errorMsg = ""
            this.createStage += 1
            this.ouToCreate.path = this.ouDestination
            this.ouToCreate.ou = this.ouToCreate.name
            await this.ouToCreate.insert({ou: this.ouToCreate})
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
                if (error.response.data.code) {
                    switch (error.response.data.code) {
                        case 'ldap_obj_exists':
                            this.errorMsg = this.$t("error.codes.ldapObjectExists")
                            break;
                        default:
                            this.errorMsg = this.$t("error.unknown_short")
                            break;
                    }
                } else {
                    this.errorMsg = this.$t("error.unknown_short")
                }
            })
        }
    }
}
</script>