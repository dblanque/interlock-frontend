<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("section.groups.createView.header")}}</h3>
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
                    <v-stepper-step :complete="createStage > 1" step="1">{{ $t('section.groups.createView.step1') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--clr-primary) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 2" step="2">{{ $t('section.groups.createView.step2') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 2 ? 'border-color: var(--clr-primary) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 3" step="3">{{ $t('section.groups.createView.step3') }}</v-stepper-step>
                </v-stepper-header>

            <!-- Steps Content -->
                <v-stepper-items>
                    <!-- Basics -->
                    <v-stepper-content step="1">
                        <v-form ref="groupCreateForm1">
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="5">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.cn')"
                                    v-model="groupToCreate.cn"
                                    :rules="[this.fieldRules(groupToCreate.cn, 'ge_username', true)]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row class="ma-0 pa-0" justify="center">
                                <v-col cols="12" lg="8">
                                        <v-expansion-panels 
                                        v-model="userPathExpansionPanel"
                                        flat 
                                        hover 
                                        style="border: 1px solid var(--clr-primary);">
                                            <v-expansion-panel>
                                                <v-expansion-panel-header>
                                                    <span>
                                                        <span>
                                                            {{ $t('section.groups.createView.groupCreatedIn') + ': ' }}
                                                        </span>
                                                        <span class="font-weight-bold">
                                                            {{ this.groupDestination }}
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
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.givenName')"
                                    v-model="groupToCreate.givenName"
                                    :rules="[this.fieldRules(groupToCreate.givenName, 'ge_name', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.sn')"
                                    v-model="groupToCreate.sn"
                                    :rules="[this.fieldRules(groupToCreate.sn, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.displayName')"
                                    v-model="getDisplayName"
                                    :rules="[this.fieldRules(getDisplayName, 'ge_topic', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="2">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.initials')"
                                    v-model="groupToCreate.initials"
                                    :rules="[this.fieldRules(groupToCreate.initials, 'ge_topic')]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :hint="$t('misc.autocomputedField')"
                                    persistent-hint
                                    :label="$t('ldap.attributes.userPrincipalName')"
                                    readonly
                                    v-model="getUSN"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :hint="$t('misc.autocomputedField')"
                                    persistent-hint
                                    :label="$t('ldap.attributes.userPrincipalName_pre2000')"
                                    readonly
                                    v-model="getUSN_2000"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
    
                            <v-row class="ma-0 pa-0">
                                <v-divider class="mx-12 my-3 mt-6"></v-divider>
                            </v-row>

                            <!-- Optionals -->
                            <v-row justify="center" class="mb-1">
                                <span class="text-overline" style="font-size: .95em !important;">{{ $t("section.users.createView.optionalsHeader") }}</span>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
                                    :label="$t('ldap.attributes.mail')"
                                    v-model="groupToCreate.mail"
                                    :rules="[this.fieldRules(groupToCreate.mail, 'ge_mail')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        @keydown.enter="nextStep"
                                        :label="$t('ldap.attributes.wWWHomePage')"
                                        v-model="groupToCreate.wWWHomePage"
                                        :rules="[this.fieldRules(groupToCreate.wWWHomePage, 'ge_website')]"
                                        ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-stepper-content>
                    <!-- Password -->
                    <v-stepper-content step="2">
                        
                        <v-form ref="userCreateForm2">
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    :type="passwordHidden ? 'password' : 'text'"
                                    required
                                    @keydown.enter="nextStep"
                                    :append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="() => (passwordHidden = !passwordHidden)"
                                    dense
                                    :label="$t('ldap.attributes.password')"
                                    v-model="groupToCreate.password"
                                    :rules="[this.fieldRules(groupToCreate.password, 'ge_password', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        :type="passwordHidden ? 'password' : 'text'"
                                        dense
                                        @keydown.enter="nextStep"
                                        :label="$t('ldap.attributes.passwordConfirm')"
                                        v-model="groupToCreate.passwordConfirm"
                                        :rules="[groupToCreate.passwordConfirm == groupToCreate.password ? true : this.$t('error.validation.passwordNotSame') ]"
                                        ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-list>
                                <!-- Items -->
                                <v-list-item
                                two-line
                                @keydown.enter="nextStep"
                                @click="onClickPermission(key)"
                                :value="permissions[key].value"
                                v-for="(value, key) in permissions"
                                :key="key">
                                    <v-list-item-content class="pl-10">
                                        <!-- Title -->
                                        <v-list-item-title class="font-weight-bold">
                                        {{ $t('section.users.permissions.' + key) }}
                                        </v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{ key }}
                                        </v-list-item-subtitle>
                                    </v-list-item-content>
                                        <v-list-item-action>
                                        <v-checkbox @keypress="false" @keydown="false"
                                        @click="onClickPermission(key)" 
                                        v-model="permissions[key].value"/>
                                        </v-list-item-action>
                                    </v-list-item>
                            </v-list>
                        </v-form>
                    </v-stepper-content>
                    <!-- Check if user exists - loader -->
                    <v-stepper-content step="3">
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
                                        {{ this.error ? '' : $t('section.users.createView.step3_success') }}
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
                        <v-btn elevation="0" @click="newUser" v-if="this.createStage < 2"
                        class="text-normal ma-0 pa-0 pa-2 ma-1 pr-4 bg-white bg-lig-25" 
                        rounded>
                            <v-icon class="ma-0 mr-1" color="primary">
                                mdi-cached
                            </v-icon>
                            {{ $t("actions.reset" )}}
                        </v-btn>
                    </v-slide-x-reverse-transition>

                    <v-slide-x-reverse-transition>
                    <v-btn elevation="0" @click="prevStep" v-if="createStage > 1 && (createStage < 4 && this.error == true)"
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
                        <v-btn elevation="0" @click="nextStep" v-if="this.createStage < 3"
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
                        <v-btn elevation="0" @click="closeDialog(true)" v-if="this.createStage > 2 && this.error === false"
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
import Group from '@/include/Group'
import OrganizationalUnit from '@/include/OrganizationalUnit'
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList'
import validationMixin from '@/plugins/mixin/validationMixin';
import { getDomainDetails } from '@/include/utils';

export default {
    name: 'GroupCreate',
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
        groupPathExpansionPanel: false,
        groupDestination: '',
        groupToCreate: {},
        ouList: [],
        createStage: 1,
        addObjectClass: "",
        objectClasses: [
            "accessControlSubentry",
            "account",
            "alias",
            "applicationEntity",
            "applicationProcess",
            "bootableDevice",
            "certificationAuthority",
            "certificationAuthority-V2",
            "collectiveAttributeSubentry",
            "country",
            "crlDistributionPoint",
            "device",
            "dmd",
            "dnsDomain",
            "documentSeries",
            "domain",
            "domainRelatedObject",
            "dsa",
            "extensibleObject",
            "friendlyCountry",
            "groupOfNames",
            "groupOfUniqueNames",
            "ieee802Device",
            "inetOrgPerson",
            "ipHost",
            "ipNetwork",
            "ipProtocol",
            "ipService",
            "javaContainer",
            "javaMarshalledObject",
            "javaNamingReference",
            "javaObject",
            "javaSerializedObject",
            "labeledURIObject",
            "locality",
            "mailRecipient",
            "newPilotPerson",
            "nisDomainObject",
            "nisKeyObject",
            "nisMap",
            "nisNetgroup",
            "nisObject",
            "oldQualityLabelledData",
            "oncRpc",
            "organization",
            "organizationalPerson",
            "organizationalRole",
            "organizationalUnit",
            "person",
            "pilotDSA",
            "pilotObject",
            "pilotOrganization",
            "posixAccount",
            "posixGroup",
            "top",
            "user",
            "referral",
            "residentialPerson",
            "room",
            "shadowAccount",
            "simpleSecurityObject",
            "strongAuthenticationUser"
        ],
        permissions: {
            "LDAP_UF_ACCOUNT_DISABLE" : {
                value: false,
                int: 2
            },
            "LDAP_UF_PASSWD_CANT_CHANGE" : {
                value: false,
                int: 64
            },
            "LDAP_UF_DONT_EXPIRE_PASSWD" : {
                value: false,
                int: 65536
            },
        },
        categories: {
            basic: [
                "sAMAccountName",
                "givenName",
                "sn",
                "mail",
                "displayName",
                "is_enabled",
                "last_login",
                "telephoneNumber",
                "wWWHomePage",
            ],
            location: [
                "streetAddress",
                "postalCode",
                "l",
                "st",
                "countryCode",
                "co",
                "c",
            ],
            account: [
                "distinguishedName",
                "userPrincipalName",
                "userAccountControl",
                "whenCreated",
                "whenChanged",
                "lastLogon",
                "badPwdCount",
                "pwdLastSet",
                "primaryGroupID",
                "objectClass",
                "objectCategory",
                "sAMAccountType"
            ]
        }
      }
    },
    mixins: [
        validationMixin
    ],
    props: {
        viewKey: String
    },
    created(){
        this.newGroup
    },
    computed:{
    },
    methods: {
        setDestination(destination=undefined){
            // Set default destination if undefined
            if (destination == undefined || !destination)
                this.groupDestination = this.basedn
            // Set destination from arg
            else
                this.groupDestination = destination

            this.groupPathExpansionPanel = false
        },
        prevStep(){
            switch (this.createStage) {
                case 2:
                    var domainDetails = getDomainDetails()
                    this.domain = domainDetails.domain
                    this.realm = domainDetails.realm
                    this.basedn = domainDetails.basedn
                    this.createStage -= 1
                    break;
                case 3:
                    this.createStage -= 1
                    setTimeout(() => {  
                        this.loading = true; 
                    }, 500);
                    break;
                default:
                    this.createStage -= 1
                    break;
            }
        },
        nextStep(){
            switch (this.createStage) {
                case 1:
                    if (this.$refs.groupCreateForm1.validate()){
                        this.error = false
                        this.errorMsg = ""
                        this.createStage += 1
                    }
                    else {
                        // Force snackbar to reappear if error was pre-existent
                        if (this.showSnackbar == true)
                            this.showSnackbar = false
                        this.showSnackbar = true
                        this.error = true
                        this.errorMsg = this.$t('section.groups.createView.validationError')
                    }
                    break;
                case 2:
                    if (this.$refs.groupCreateForm2.validate()){
                        this.error = false
                        this.errorMsg = ""
                        Object.keys(this.groupToCreate).forEach(key => {
                            if (this.groupToCreate[key] === undefined) {
                                delete this.groupToCreate[key];
                            }
                        });
                        this.createGroup()
                    }
                    else {
                        // Force snackbar to reappear if error was pre-existent
                        if (this.showSnackbar == true)
                            this.showSnackbar = false
                        this.showSnackbar = true
                        this.error = true
                        this.errorMsg = this.$t('section.groups.createView.validationError')
                    }
                    break;
                default:
                    this.createStage += 1
                    break;
            }
        },
        async newGroup(){
            this.passwordHidden = true
            this.groupPathExpansionPanel = false
            this.groupToCreate = new Group({})
            this.createStage = 1
            this.error = false
            this.errorMsg = ""
            this.$refs.groupCreateForm1.resetValidation()
            var domainDetails = getDomainDetails()
            this.domain = domainDetails.domain
            this.realm = domainDetails.realm
            this.basedn = domainDetails.basedn
            this.fetchOUs()
            this.groupDestination = "CN=Users," + this.basedn
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
        async createGroup(){
            this.error = false
            this.errorMsg = ""
            this.createStage += 1
            this.groupToCreate.path = this.groupDestination
            await this.groupToCreate.insert(this.groupToCreate)
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
                        case 'group_exists':
                            this.errorMsg = this.$t("error.codes.groups.groupExists")
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