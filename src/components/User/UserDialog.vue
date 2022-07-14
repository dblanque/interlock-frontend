<template>
    <v-card :loading="refreshLoading" class="pa-0 ma-0">
        <v-expand-transition>
        <div v-show="!refreshLoading">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 v-if="!usercopy.givenName || usercopy.givenName == '' || !usercopy.sn || usercopy.sn == ''" class="pa-0 ma-0 ma-2">
                    {{ usercopy.username ? $t('classes.user.single') + ': ' + usercopy.username.toUpperCase() : '' }}
                </h3>
                <h3 v-else class="pa-0 ma-0 ma-2">
                    {{ $t('classes.user.single') + ': ' + usercopy.givenName + " " + usercopy.sn }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-expand-transition>
            <v-row v-if="editFlag" justify="center" class="pa-0 ma-0">
                <v-alert class="pa-0 ma-1 pa-4 pb-3 mt-3" border="top" type="warning" :icon="false">
                    <v-icon class="mdso mr-2">warning</v-icon>
                    {{ $t('section.users.editFlagWarning') }}
                    <v-btn @click="viewUser" small class="ma-0 pa-0 ml-2 pr-2 pl-1">
                        <v-icon color="orange" class="">mdi-chevron-left</v-icon>
                        {{ $t('actions.back') }}
                    </v-btn>
                </v-alert>
            </v-row>
        </v-expand-transition>
        <!-- Body -->
        <v-tabs v-model="tab" height="0">
            <v-tab-item :key="0">
                <v-card-text class="ma-0 py-4">
                    <v-form>
                    <v-row align-content="center" class="mb-2">
                    <!-- User Basic Data Panel -->
                    <v-col class="ma-0 pa-0" cols="12" md="6">
                        <v-card outlined height="100%" class="ma-1 pa-4">
                            <v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'start'" 
                            class="pa-0 ma-0 text-h6 mx-4 mb-5">
                                {{ $t('section.users.basicDetails') }}
                            </v-row>
                            <v-row class="pa-0 ma-0 font-weight-medium">
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.givenName')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.givenName"
                                        :rules="[this.fieldRules(usercopy.givenName, 'ge_name')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.sn')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.sn"
                                        :rules="[this.fieldRules(usercopy.sn, 'ge_name')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.mail')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.mail"
                                        :rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-fade-transition>
                                            <v-card v-if="user.is_enabled != undefined" v-ripple outlined class="pa-1 py-2 mini-card">
                                                <span :class="(user.is_enabled ? 'clr-valid' : 'clr-error') + ' clr-lig-40'">
                                                    {{ user.is_enabled ? $t('section.users.attributes.is_enabled') : $t('section.users.attributes.is_disabled') }}
                                                </span>
                                                <div elevation="0" v-if="user.is_enabled">
                                                <v-icon class="clr-valid clr-lig-40">
                                                    mdi-check
                                                </v-icon>
                                                </div>
                                                <div elevation="0" icon rounded v-else>
                                                <v-icon class="clr-error clr-lig-40">
                                                    mdi-close
                                                </v-icon>
                                                </div>
                                            </v-card>
                                        </v-fade-transition>
                                    </v-col>
                                    <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                        {{ $t('section.users.attributes.last_login') + ": " + user.last_login }}
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.telephoneNumber')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.telephoneNumber"
                                        :rules="[this.fieldRules(usercopy.telephoneNumber, 'ge_phone')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.wWWHomePage')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.wWWHomePage"
                                        :rules="[this.fieldRules(usercopy.wWWHomePage, 'ge_website')]"
                                        ></v-text-field>
                                    </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <!-- Location Panel -->
                    <v-col class="ma-0 pa-0" cols="12" md="6">
                        <v-card outlined height="100%" class="ma-1 pa-4">
                            <v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'" 
                            class="pa-0 ma-0 text-h6 mx-4 mb-5">
                                {{ $t('section.users.location') }}
                            </v-row>
                            <v-row class="pa-0 ma-0 font-weight-medium">
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.streetAddress')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.streetAddress"
                                        :rules="[this.fieldRules(usercopy.streetAddress, 'ge_address_street')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.postalCode')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.postalCode"
                                        :rules="[this.fieldRules(usercopy.postalCode, 'ge_address_postal_code')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" 
                                    :class="this.$vuetify.breakpoint.smAndUp && user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0 ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.l')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.l"
                                        :rules="[this.fieldRules(usercopy.l, 'ge_address_city')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-card v-ripple outlined class="pa-1 py-2 mini-card">
                                            <div v-if="user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0">
                                                {{ $t('section.users.attributes.countryCodeCombined') }}
                                                <div elevation="0">
                                                {{ user.countryCode }}
                                                {{ "(" + user.c + ")" }}
                                                </div>
                                            </div>
                                            <div v-else>
                                                {{ $t('section.users.attributes.countryCodeCombined') }}
                                                <div>
                                                {{ $t('error.data.noCountryCode') }}
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                        {{ $t('section.users.attributes.last_login') + ": " + user.last_login }}
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.st')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.st"
                                        :rules="[this.fieldRules(usercopy.st, 'ge_state')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        :label="$t('section.users.attributes.co')"
                                        :readonly="this.editFlag != true"
                                        v-model="usercopy.co"
                                        :rules="[this.fieldRules(usercopy.co, 'ge_country')]"
                                        ></v-text-field>
                                    </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    </v-row>
                    <v-row class="mt-2">
                        <v-expansion-panels v-model="panel" flat class="ma-1">
                            <v-expansion-panel class="outlined">
                                <v-expansion-panel-header class="font-weight-medium">
                                    {{ $t("section.users.advancedDetails") }}
                                </v-expansion-panel-header>
                                <v-expansion-panel-content>
                                    <v-row>
                                        <v-col cols="12" lg="8">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.distinguishedName')"
                                            :readonly="this.editFlag != true"
                                            v-model="usercopy.distinguishedName"
                                            :rules="[this.fieldRules(usercopy.distinguishedName, 'ldap_dn')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="4">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.userPrincipalName')"
                                            :readonly="this.editFlag != true"
                                            v-model="usercopy.userPrincipalName"
                                            :rules="[this.fieldRules(usercopy.userPrincipalName, 'ldap_usn')]"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="10" lg="3">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.userAccountControl')"
                                            readonly
                                            v-model="usercopy.userAccountControl"
                                            :rules="[this.fieldRules(usercopy.userAccountControl, 'ge_numbers')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="" lg="3">
                                            <v-btn color="primary" @click="changePerms"
                                            small class="">
                                                {{ $t("actions.changeUserPerms") }}
                                                <v-icon>mdi-chevron-right</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" lg="3">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.sAMAccountType')"
                                            :readonly="this.editFlag != true"
                                            v-model="usercopy.sAMAccountType"
                                            :rules="[this.fieldRules(usercopy.sAMAccountType, 'ge_numbers')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="3">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.primaryGroupID')"
                                            :readonly="this.editFlag != true"
                                            v-model="usercopy.primaryGroupID"
                                            :rules="[this.fieldRules(usercopy.primaryGroupID, 'ge_numbers')]"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.whenCreated')"
                                            readonly
                                            v-model="usercopy.whenCreated"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.whenChanged')"
                                            readonly
                                            v-model="usercopy.whenChanged"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.lastLogon')"
                                            readonly
                                            v-model="usercopy.lastLogon"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.pwdLastSet')"
                                            readonly
                                            v-model="usercopy.pwdLastSet"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.objectClass')"
                                            readonly
                                            v-model="usercopy.objectClass"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="">
                                            <v-row class="ma-0 pa-0" justify="center">
                                                <v-autocomplete dense v-model="addObjectClass"
                                                :label="$t('actions.addObjectClass')"
                                                clearable
                                                :items="objectClasses">
                                                </v-autocomplete>
                                                <v-btn :class="(this.editFlag != true ? 'bg-white bg-lig-90' : 'bg-primary text-white') + ' ml-3'"
                                                :disabled="this.editFlag != true"
                                                rounded
                                                icon>
                                                    <v-icon>
                                                        mdi-plus
                                                    </v-icon>
                                                </v-btn>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" lg="12">
                                            <v-text-field
                                            dense
                                            :label="$t('section.users.attributes.objectCategory')"
                                            :readonly="this.editFlag != true"
                                            v-model="usercopy.objectCategory"
                                            :rules="[this.fieldRules(usercopy.objectCategory, 'ldap_dn')]"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                    </v-form>
                </v-card-text>
            </v-tab-item>
            <v-tab-item :key="1">
                <v-card-text class="my-3 py-4">
                    <v-row align-content="center" class="mb-2">
                    <!-- Disabled Permissions Panel -->
                    <v-col class="ma-0 pa-0" cols="12" md="8">
                        <v-card outlined height="100%" class="ma-1 pa-4">
                            <v-row justify="center"
                            class="pa-0 ma-0 text-h6 mx-4 mb-5">
                                {{ $t('section.users.perms') }}
                            </v-row>
                            <!-- List -->
                            <v-list
                            class="pa-0 ma-0 font-weight-medium" 
                            :justify="$vuetify.breakpoint.mdAndUp ? 'start' : 'center'">
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
                                        <v-checkbox :disabled="!editFlag" @click="onClickPermission(key)" v-model="permissions[key].value"></v-checkbox>
                                        </v-list-item-action>
                                    </v-list-item>
                            </v-list>
                        </v-card>
                    </v-col>
                    <!-- Enabled Permissions Panel -->
                    <v-col class="ma-0 pa-0" cols="12" md="4">
                        <v-card outlined height="100%" class="ma-1 pa-4">
                            <v-row justify="center" 
                            class="pa-0 ma-0 text-h6 mx-4 mb-5">
                                {{ $t('section.users.permsRaw') }}
                            </v-row>
                            <v-row class="pa-0 ma-0 font-weight-medium">
                                <a href="https://docs.microsoft.com/en-US/troubleshoot/windows-server/identity/useraccountcontrol-manipulate-account-properties"
                                target="_blank" class="text-white">
                                <v-alert type="info">
                                    {{ $t('section.users.permsRawHint') }}
                                </v-alert>
                                </a>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-textarea hide-details :label="$t('section.users.permsOutputArray')"
                                    outlined readonly v-model="getEnabledPerms" auto-grow>
                                    </v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field hide-details :label="$t('section.users.permsCalc')"
                                    outlined readonly v-model="calcEnabledPerms">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    </v-row>
                </v-card-text>
            </v-tab-item>
        </v-tabs>
        <!-- End of Details Page -->
        </div>
        </v-expand-transition>
    
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
                <!-- Go Back button (Permissions View) -->
                <v-slide-x-reverse-transition>
                        <v-btn v-if="changingPerms" @click="goBackToDetails"
                        class="text-normal ma-0 pa-0 pa-3 ma-1 bg-white bg-lig-25" 
                        rounded>
                            <v-icon class="mr-1">
                                mdi-chevron-left
                            </v-icon>
                            {{ $t("actions.back" )}}
                        </v-btn>
                </v-slide-x-reverse-transition>
                <!-- Enable/Disable Buttons -->
                <v-slide-x-reverse-transition>
                        <v-btn color="green" v-if="!usercopy.is_enabled" @click="enableUser" 
                        :class="(editFlag ? 'text-white ' : '' ) + 'ma-0 pa-0 pa-3 pr-4 ma-1'" 
                        rounded :disabled="!editFlag">
                            <v-icon class="mr-1">
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                            {{ $t("actions.enable") }}
                        </v-btn>
                        <v-btn color="red" v-else-if="usercopy.is_enabled == true" @click="disableUser" 
                        :class="(editFlag ? 'text-white ' : '' ) + 'ma-0 pa-0 pa-3 pr-4 ma-1'" rounded :disabled="!editFlag">
                            <v-icon class="mr-1">
                                mdi-close-circle-outline
                            </v-icon>
                            {{ $t("actions.disable") }}
                        </v-btn>
                </v-slide-x-reverse-transition>
                <!-- Edit User Button -->
                <v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag != true" @click="editUser">
                    <v-icon class="mr-1">
                        mdi-pencil
                    </v-icon>
                    {{ $t("actions.edit") }}
                </v-btn>
                <!-- View User Button -->
                <v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag == true" @click="viewUser">
                    <v-icon class="mr-1">
                        mdi-eye
                    </v-icon>
                    {{ $t("actions.view") }}
                </v-btn>
                <!-- Save User Changes Button -->
                <v-btn @click="saveUser"
                :class="(editFlag ? 'text-normal ' : '' ) + 'ma-0 pa-0 pa-4 ma-1 bg-white bg-lig-25'" 
                rounded 
                :disabled="!editFlag">
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
                </v-btn>
                <!-- Refresh User Button -->
                <v-btn 
                class="ma-1 bg-primary" 
                color="white" 
                icon
                elevation="0"
                :loading="refreshLoading"
                @click="refreshUser"
                >
                    <v-icon>
                    mdi-refresh
                    </v-icon>
                    <template v-slot:loader>
                    <span class="custom-loader">
                        <v-icon light>mdi-cached</v-icon>
                    </span>
                    </template>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import User from '@/include/User'
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    name: 'UserDialog',
    data () {
      return {
          panel: [],
        tab: 0,
        changingPerms: false,
        usercopy: {},
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
            "LDAP_UF_SCRIPT" : {
                value: false,
                int: 1
            },
            "LDAP_UF_ACCOUNT_DISABLE" : {
                value: false,
                int: 2
            },
            "LDAP_UF_HOMEDIR_REQUIRED" : {
                value: false,
                int: 8
            },
            "LDAP_UF_LOCKOUT" : {
                value: false,
                int: 16
            },
            "LDAP_UF_PASSWD_NOTREQD" : {
                value: false,
                int: 32
            },
            "LDAP_UF_PASSWD_CANT_CHANGE" : {
                value: false,
                int: 64
            },
            "LDAP_UF_ENCRYPTED_TEXT_PASSWORD_ALLOWED" : {
                value: false,
                int: 128
            },
            "LDAP_UF_NORMAL_ACCOUNT" : {
                value: false,
                int: 512
            },
            "LDAP_UF_INTERDOMAIN_TRUST_ACCOUNT" : {
                value: false,
                int: 2048
            },
            "LDAP_UF_WORKSTATION_TRUST_ACCOUNT" : {
                value: false,
                int: 4096
            },
            "LDAP_UF_SERVER_TRUST_ACCOUNT" : {
                value: false,
                int: 8192
            },
            "LDAP_UF_DONT_EXPIRE_PASSWD" : {
                value: false,
                int: 65536
            },
            "LDAP_UF_MNS_LOGON_ACCOUNT" : {
                value: false,
                int: 131072
            },
            "LDAP_UF_SMARTCARD_REQUIRED" : {
                value: false,
                int: 262144
            },
            "LDAP_UF_TRUSTED_FOR_DELEGATION" : {
                value: false,
                int: 524288
            },
            "LDAP_UF_NOT_DELEGATED" : {
                value: false,
                int: 1048576
            },
            "LDAP_UF_USE_DES_KEY_ONLY" : {
                value: false,
                int: 2097152
            },
            "LDAP_UF_DONT_REQUIRE_PREAUTH" : {
                value: false,
                int: 4194304
            },
            "LDAP_UF_PASSWORD_EXPIRED" : {
                value: false,
                int: 8388608
            },
            "LDAP_UF_TRUSTED_TO_AUTHENTICATE_FOR_DELEGATION" : {
                value: false,
                int: 16777216
            },
            "LDAP_UF_NO_AUTH_DATA_REQUIRED" : {
                value: false,
                int: 33554432
            },
            "LDAP_UF_PARTIAL_SECRETS_ACCOUNT" : {
                value: false,
                int: 67108864
            }
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
        viewKey: String,
        editFlag: Boolean,
        user: Object,
        refreshLoading: Boolean
    },
    created(){
        this.syncUser();
    },
    computed:{
        calcEnabledPerms() {
            var result = 0
            for (const [key] of Object.entries(this.permissions)) {
                if (this.permissions[key].value == true) {
                    result += this.permissions[key].int
                }
            }
            return result
        },
        getEnabledPerms() {
            var array = []
            for (const [key] of Object.entries(this.permissions)) {
                if (this.permissions[key].value == true)
                    array.push(key)
            }
            return array
        },
    },
    methods: {
        // When a permission in the v-list changes this function is executed
        onClickPermission(key){
            if (this.editFlag == true) {
                this.permissions[key].value = !this.permissions[key].value
            }
        },
        goBackToDetails(){
            this.tab = 0
            this.changingPerms = false
        },
        // This function sets the permissions each time the usercopy object is
        // synced to the parent view user object
        setPermissions() {
            for (const [key] of Object.entries(this.permissions)) {
                this.permissions[key].value = false
            }
            if (this.usercopy['permission_list'] != undefined) {
                this.usercopy['permission_list'].forEach(perm => {
                    this.permissions[perm].value = true
                });
            }
        },
        // changePerms(): Changes tab to the permissions section
        changePerms(){
            this.tab = 1
            this.changingPerms = true
        },
        disableUser(){
        },
        enableUser(){
        },
        editUser(){
            this.$emit('editToggle', true);
        },
        viewUser(){
            this.$emit('editToggle', false);
            this.refreshUser();
        },
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        saveUser(){
            this.$emit('save', this.viewKey, this.usercopy);
        },
        // Sync the usercopy object to the parent view user object on the
        // next tick to avoid mutation errors
        syncUser(){
            this.usercopy = new User({})
            this.$nextTick(() => {
                this.usercopy = this.user
                if (this.usercopy.lastLogon == 0)
                    this.usercopy.lastLogon = this.$t('section.users.userDialog.noLastLogon')
                this.setPermissions()
            })
        },
        // Tells the parent view to refresh/fetch the user again
        async refreshUser(){
            this.$emit('refreshUser');
        }
    }
}
</script>

<style>
.mini-card {
}

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
