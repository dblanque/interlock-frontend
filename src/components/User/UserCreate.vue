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
                                    @keydown.enter="nextStep"
                                    :label="$t('section.users.attributes.username')"
                                    v-model="userToCreate.username"
                                    :rules="[this.fieldRules(userToCreate.username, 'ge_username', true)]"
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
                                                            {{ $t('section.users.createView.userCreatedIn') + ': ' }}
                                                        </span>
                                                        <span class="font-weight-bold">
                                                            {{ this.userDestination }}
                                                        </span>
                                                    </span>
                                                </v-expansion-panel-header>
        
                                                <v-expansion-panel-content>
                                                    <v-card flat outlined style="max-height: 300px; overflow: auto !important;">
                                                        <v-treeview
                                                        :items="this.ouList"
                                                        dense
                                                        hoverable
                                                        activatable
                                                        @update:active="updateUserDestination"
                                                        >
                                                        <template v-slot:prepend="{ item, open }">
                                                            <v-icon v-if="item.type == 'Organizational-Unit'">
                                                                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
                                                            </v-icon>
                                                            <v-icon v-else>
                                                                mdi-at
                                                            </v-icon>
                                                        </template>
                                                        <template v-slot:label="{item}">
                                                        <v-row align="start">
                                                            <v-col cols="11" md="auto">
                                                            {{ item.name }}
                                                            </v-col>
                                                        </v-row>
                                                        </template>
                                                        </v-treeview>
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
                                    :label="$t('section.users.attributes.givenName')"
                                    v-model="userToCreate.givenName"
                                    :rules="[this.fieldRules(userToCreate.givenName, 'ge_name', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
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
                                    @keydown.enter="nextStep"
                                    :label="$t('section.users.attributes.displayName')"
                                    v-model="getDisplayName"
                                    :rules="[this.fieldRules(getDisplayName, 'ge_topic', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="2">
                                    <v-text-field
                                    dense
                                    @keydown.enter="nextStep"
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
                                    @keydown.enter="nextStep"
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
                                    @keydown.enter="nextStep"
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
                                    @keydown.enter="nextStep"
                                    :label="$t('section.users.attributes.mail')"
                                    v-model="userToCreate.mail"
                                    :rules="[this.fieldRules(userToCreate.mail, 'ge_mail')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        @keydown.enter="nextStep"
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
                                    :type="passwordHidden ? 'password' : 'text'"
                                    required
                                    @keydown.enter="nextStep"
                                    :append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
                                    @click:append="() => (passwordHidden = !passwordHidden)"
                                    dense
                                    :label="$t('section.users.attributes.password')"
                                    v-model="userToCreate.password"
                                    :rules="[this.fieldRules(userToCreate.password, 'ge_password', true)]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="4">
                                        <v-text-field
                                        :type="passwordHidden ? 'password' : 'text'"
                                        dense
                                        @keydown.enter="nextStep"
                                        :label="$t('section.users.attributes.passwordConfirm')"
                                        v-model="userToCreate.passwordConfirm"
                                        :rules="[userToCreate.passwordConfirm == userToCreate.password ? true : this.$t('error.validation.passwordNotSame') ]"
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
                        <v-btn elevation="0" @click="closeDialog" v-if="this.createStage > 2 && this.error === false"
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
import User from '@/include/User'
import OrganizationalUnit from '@/include/OrganizationalUnit'
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    name: 'UserCreate',
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
        userPathExpansionPanel: false,
        userDestination: '',
        userToCreate: {},
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
            this.basedn = localStorage.getItem('basedn')
        },
        prevStep(){
            switch (this.createStage) {
                case 2:
                    this.getDomainDetails()
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
                case 2:
                    if (this.$refs.userCreateForm2.validate()){
                        this.error = false
                        this.errorMsg = ""
                        this.userToCreate.distinguishedName = this.userToCreate.username + "@" + this.domain
                        this.userToCreate.sAMAccountName = this.userToCreate.username
                        var permission_list = []
                        Object.keys(this.userToCreate).forEach(key => {
                            if (this.userToCreate[key] === undefined) {
                                delete this.userToCreate[key];
                            }
                        });
                        Object.keys(this.permissions).forEach(key => {
                            if (this.permissions[key].value == true)
                                permission_list.push(key)
                        });
                        this.userToCreate.permission_list = permission_list
                        this.createUser()
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
        updateUserDestination(itemID){
            if (!itemID || itemID.length == 0){
                this.userDestination = "CN=Users," + this.basedn
                console.log('this.userDestination was reset to ' + this.userDestination)
                return this.userDestination
            }
            var itemToUpdate = this.ouList.find(ou => ou.id == itemID)
            var searchResult
            if (itemToUpdate == undefined){
                this.ouList.forEach(ou => {
                    if (!searchResult) {
                        searchResult = this.objectRecursiveSearch(ou, parseInt(itemID))
                        this.userDestination = searchResult
                    }
                })
            } else if (itemToUpdate.id == itemID)
                this.userDestination = itemToUpdate.dn
            
            this.userPathExpansionPanel = false
        },
        objectRecursiveSearch(targetEntity, idToSearch, keyToSearch='dn', childrenKey='children', searchResult=undefined){

            // If ID matches with current object
            if (idToSearch == targetEntity.id){
                if (targetEntity[keyToSearch] != undefined) {
                    searchResult = targetEntity[keyToSearch]
                    return searchResult
                }
                else {
                    console.log('Error: targetEntity key(' + keyToSearch + ') is undefined or its value is missing')
                    return searchResult
                }
            }

            // If ID hasn't matched with this object,
            // then search in it's children if it has any.
            if (childrenKey in targetEntity && targetEntity[childrenKey].length != 0)
                // For each child do a recursive search calling this function
                targetEntity[childrenKey].forEach(child => {
                    if (!searchResult) {
                        searchResult = this.objectRecursiveSearch(child, idToSearch, keyToSearch, childrenKey, searchResult)
                        if (searchResult && searchResult != false && searchResult != undefined){
                            return searchResult
                        }
                    }
                })
            return searchResult
        },
        async newUser(){
            this.passwordHidden = true
            this.userPathExpansionPanel = false
            this.userToCreate = new User({})
            this.createStage = 1
            this.error = false
            this.errorMsg = ""
            this.$refs.userCreateForm1.resetValidation()
            for (const [key] of Object.entries(this.permissions))
                this.permissions[key].value = false
            this.getDomainDetails()
            this.fetchOUs()
            this.userDestination = "CN=Users," + this.basedn
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
        onClickPermission(key){
            this.permissions[key].value = !this.permissions[key].value
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        async createUser(){
            this.error = false
            this.errorMsg = ""
            this.createStage += 1
            this.userToCreate.path = this.userDestination
            await this.userToCreate.insert(this.userToCreate)
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
                switch (error.response.status) {
                    case 405:
                        this.errorMsg = this.$t("error.codes.badRequest")
                        break;
                    case 650:
                        this.errorMsg = this.$t("error.codes.users.userExists")
                        break;
                    default:
                        this.errorMsg = this.$t("error.unknown_short")
                        break;
                }
            })
            this.$emit('save', this.viewKey, this.userToCreate);
        }
    }
}
</script>