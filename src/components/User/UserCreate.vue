<template>
    <v-card class="pa-0 ma-0">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="ma-2">{{$t("section.users.createView.header")}}</h3>
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
                    <v-stepper-step :complete="createStage > 1" step="1">{{ $t('section.users.createView.step1') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--clr-primary) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 2" step="2">{{ $t('section.users.createView.step2') }}</v-stepper-step>
                    <v-divider class="mx-3" :style="createStage > 2 ? 'border-color: var(--clr-primary) !important' : ''"></v-divider>
                    <v-stepper-step :complete="createStage > 3" step="3">{{ $t('section.users.createView.step3') }}</v-stepper-step>
                </v-stepper-header>

            <!-- Steps Content -->
                <v-stepper-items>
                    <!-- Basics -->
                    <v-stepper-content step="1">
                        <v-form ref="userCreateForm1">
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="5">
                                    <v-text-field
                                    dense
                                    :label="$t('section.users.attributes.username')"
                                    v-model="userToCreate.username"
                                    :rules="[this.fieldRules(userToCreate.username, 'ge_username', true)]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    :label="$t('section.users.attributes.givenName')"
                                    v-model="userToCreate.givenName"
                                    :rules="[this.fieldRules(userToCreate.givenName, 'ge_name', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    :label="$t('section.users.attributes.sn')"
                                    v-model="userToCreate.sn"
                                    :rules="[this.fieldRules(userToCreate.sn, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    :label="$t('section.users.attributes.displayName')"
                                    v-model="getDisplayName"
                                    :rules="[this.fieldRules(getDisplayName, 'ge_topic', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="2">
                                    <v-text-field
                                    dense
                                    :label="$t('section.users.attributes.initials')"
                                    v-model="userToCreate.initials"
                                    :rules="[this.fieldRules(userToCreate.initials, 'ge_topic')]"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    :hint="$t('misc.autocomputedField')"
                                    persistent-hint
                                    :label="$t('section.users.attributes.userPrincipalName')"
                                    readonly
                                    v-model="getUSN"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    :hint="$t('misc.autocomputedField')"
                                    persistent-hint
                                    :label="$t('section.users.attributes.userPrincipalName_pre2000')"
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
                                    :label="$t('section.users.attributes.mail')"
                                    v-model="userToCreate.mail"
                                    :rules="[this.fieldRules(userToCreate.mail, 'ge_mail')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.wWWHomePage')"
                                        v-model="userToCreate.wWWHomePage"
                                        :rules="[this.fieldRules(userToCreate.wWWHomePage, 'ge_website')]"
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
                                    dense
                                    :label="$t('section.users.attributes.password')"
                                    v-model="userToCreate.password"
                                    :rules="[this.fieldRules(userToCreate.password, 'ge_password')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.passwordConfirm')"
                                        v-model="userToCreate.passwordConfirm"
                                        :rules="[this.fieldRules(userToCreate.passwordConfirm, 'ge_password')]"
                                        ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-list>
                                <!-- Items -->
                                <v-list-item
                                two-line
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
                                        <v-checkbox @click="onClickPermission(key)" v-model="permissions[key].value"></v-checkbox>
                                        </v-list-item-action>
                                    </v-list-item>
                            </v-list>
                        </v-form>
                    </v-stepper-content>
                    <!-- Check if user exists - loader -->
                    <v-stepper-content step="3">
                        check if user exists
                    </v-stepper-content>
                    <!-- End Screen -->
                    <v-stepper-content step="4">
                        if user exists ok
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
                    <v-btn elevation="0" @click="prevStep" v-if="createStage > 1"
                    class="text-normal ma-0 pa-0 pa-2 pr-4 ma-1 bg-white bg-lig-25" 
                    rounded>
                        <v-icon class="ma-0" color="primary">
                            mdi-chevron-double-left
                        </v-icon>
                        {{ $t("actions.back_short" )}}
                    </v-btn>
                    </v-slide-x-reverse-transition>
                    <v-btn elevation="0" @click="nextStep"
                    class="text-normal ma-0 pa-0 pa-2 ma-1 pl-4 bg-white bg-lig-25" 
                    rounded>
                        {{ $t("actions.next" )}}
                        <v-icon class="ma-0" color="primary">
                            mdi-chevron-double-right
                        </v-icon>
                    </v-btn>
                </div>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import User from '@/include/User'
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    name: 'UserCreate',
    data () {
      return {
        domain: "",
        realm: "",
        error: false,
        valid: false,
        errorMsg: "",
        showSnackbar: false,
        userToCreate: {},
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
        this.newUser
    },
    computed:{
        calcEnabledPerms() {
            var result = 0
            for (const [key, value] of Object.entries(this.permissions)) {
                if (value == true) {
                    result += this.permission_values[key]
                }
            }
            return result
        },
        getEnabledPerms() {
            var array = []
            for (const [key, value] of Object.entries(this.permissions)) {
                if (value == true)
                    array.push(key)
            }
            return array
        },
        getUSN(){
            if (this.userToCreate.username != undefined)
                return this.userToCreate.username + "@" + this.domain
            else
                return "@" + this.domain
        },
        getUSN_2000(){
            if (this.userToCreate.username != undefined)
                return this.realm + "\\" + this.userToCreate.username
            else
                return this.realm + "\\"
        },
        getDisplayName(){
            if (this.userToCreate.givenName != undefined || this.userToCreate.sn != undefined)
                return (this.userToCreate.givenName || "") + " " + (this.userToCreate.sn || "")
            else
                return ""
        }
    },
    methods: {
        getDomainDetails(){
            this.domain = localStorage.getItem('domain')
            this.realm = localStorage.getItem('realm')
        },
        prevStep(){
            switch (this.createStage) {
                case 2:
                    this.getDomainDetails()
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
                    if (this.$refs.userCreateForm1.validate()){
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
                        this.errorMsg = this.$t('section.users.createView.validationError')
                    }
                    break;
                default:
                    this.createStage += 1
                    break;
            }
        },
        async newUser(){
            this.userToCreate = new User({})
            this.createStage = 1
            this.error = false
            this.errorMsg = ""
            this.$refs.userCreateForm1.resetValidation()
            for (const [key] of Object.entries(this.permissions))
                this.permissions[key].value = false
            this.getDomainDetails()
        },
        onClickPermission(key){
            this.permissions[key].value = !this.permissions[key].value
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        createUser(){
            this.$emit('save', this.viewKey, this.userToCreate);
        }
    }
}
</script>