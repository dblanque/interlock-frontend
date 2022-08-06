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
                                        id="givenName"
                                        :label="$t('ldap.attributes.givenName')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.givenName"
                                        :rules="[this.fieldRules(usercopy.givenName, 'ge_name')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="sn"
                                        :label="$t('ldap.attributes.sn')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.sn"
                                        :rules="[this.fieldRules(usercopy.sn, 'ge_name')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        id="mail"
                                        :label="$t('ldap.attributes.mail')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.mail"
                                        :rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-fade-transition>
                                            <v-card v-ripple outlined class="pa-1 py-2">
                                                <span :class="(usercopy.is_enabled ? 'clr-valid' : 'clr-error') + ' clr-lig-40'">
                                                    {{ usercopy.is_enabled ? $t('ldap.attributes.is_enabled') : $t('ldap.attributes.is_disabled') }}
                                                </span>
                                                <div elevation="0" v-if="usercopy.is_enabled == true">
                                                    <v-icon class="clr-valid clr-lig-40">
                                                        mdi-check
                                                    </v-icon>
                                                </div>
                                                <div elevation="0" icon rounded v-else-if="usercopy.is_enabled == false">
                                                    <v-icon class="clr-error clr-lig-40">
                                                        mdi-close
                                                    </v-icon>
                                                </div>
                                            </v-card>
                                        </v-fade-transition>
                                    </v-col>
                                    <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                        {{ $t('ldap.attributes.last_login') + ": " + user.last_login }}
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="telephoneNumber"
                                        :label="$t('ldap.attributes.telephoneNumber')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.telephoneNumber"
                                        :rules="[this.fieldRules(usercopy.telephoneNumber, 'ge_phone')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="wWWHomePage"
                                        :label="$t('ldap.attributes.wWWHomePage')"
                                        :readonly="editFlag != true"
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
                                        id="streetAddress"
                                        :label="$t('ldap.attributes.streetAddress')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.streetAddress"
                                        :rules="[this.fieldRules(usercopy.streetAddress, 'ge_address_street')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="postalCode"
                                        :label="$t('ldap.attributes.postalCode')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.postalCode"
                                        :rules="[this.fieldRules(usercopy.postalCode, 'ge_address_postal_code')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" 
                                    :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        id="l"
                                        :label="$t('ldap.attributes.l')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.l"
                                        :rules="[this.fieldRules(usercopy.l, 'ge_address_city')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-card v-ripple outlined class="pa-1 py-2">
                                            <div v-if="usercopy.countryCode != undefined && usercopy.countryCode != '' && usercopy.countryCode != 0">
                                                {{ $t('ldap.attributes.countryCodeCombined') }}
                                                <div elevation="0">
                                                {{ usercopy.countryCode }}
                                                {{ "(" + usercopy.c + ")" }}
                                                </div>
                                            </div>
                                            <div v-else>
                                                {{ $t('ldap.attributes.countryCodeCombined') }}
                                                <div>
                                                {{ $t('error.data.noCountryCode') }}
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                        {{ $t('ldap.attributes.last_login') + ": " + user.last_login }}
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="st"
                                        :label="$t('ldap.attributes.st')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.st"
                                        :rules="[this.fieldRules(usercopy.st, 'ge_state')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-autocomplete
                                        dense
                                        id="co"
                                        :label="$t('ldap.attributes.co')"
                                        :readonly="editFlag != true"
                                        v-model="usercopy.co"
                                        :items="getCountryList()"
                                        :rules="[this.fieldRules(usercopy.co, 'ge_country')]">
                                        </v-autocomplete>
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
                                        <v-col cols="12">
                                            <v-text-field
                                            dense
                                            id="distinguishedName"
                                            :label="$t('ldap.attributes.distinguishedName')"
                                            readonly
                                            v-model="usercopy.distinguishedName"
                                            :rules="[this.fieldRules(usercopy.distinguishedName, 'ldap_dn')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            id="userPrincipalName"
                                            :label="$t('ldap.attributes.userPrincipalName')"
                                            readonly
                                            v-model="getUSN"
                                            :rules="[this.fieldRules(usercopy.userPrincipalName, 'ldap_usn')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6" :justify="$vuetify.breakpoint.lgAndUp ? 'start':'center'">
                                            <v-text-field
                                            dense
                                            id="sAMAccountType"
                                            :label="$t('ldap.attributes.sAMAccountType')"
                                            readonly
                                            v-model="usercopy.sAMAccountType"
                                            :rules="[this.fieldRules(usercopy.sAMAccountType, 'ge_lettersStrictUnderscore')]"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row :justify="$vuetify.breakpoint.lgAndUp ? 'start':'center'" align="center">
                                        <v-col cols="12" md="3">
                                            <v-btn outlined color="primary" @click="goToGroups"
                                            class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
                                                {{ $t("actions.changeUserGroups") }}
                                                <v-icon>mdi-chevron-left</v-icon>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="12" md="4">
                                            <v-select
                                            dense
                                            id="primaryGroupID"
                                            :label="$t('ldap.attributes.primaryGroupID')"
                                            :readonly="editFlag != true"
                                            v-model="usercopy.primaryGroupID"
                                            :items="this.usercopy.memberOfObjects"
                                            :hint="$t('section.users.userDialog.hint.primaryGroupID')"
                                            persistent-hint
                                            :item-text="getNameForPID"
                                            item-value="objectRid"
                                            ></v-select>
                                        </v-col>
                                        <v-col cols="12" md="2">
                                            <v-text-field
                                            dense
                                            id="userAccountControl"
                                            :label="$t('ldap.attributes.userAccountControl')"
                                            readonly
                                            v-model="calcEnabledPerms"
                                            :rules="[this.fieldRules(calcEnabledPerms, 'ge_numbers')]"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-btn outlined color="primary" @click="goToPerms"
                                            class="ma-0 pa-0 py-2 pr-1 pl-3 ma-1">
                                                {{ $t("actions.changeUserPerms") }}
                                                <v-icon>mdi-chevron-right</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            id="whenCreated"
                                            :label="$t('ldap.attributes.whenCreated')"
                                            readonly
                                            v-model="usercopy.whenCreated"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            id="whenChanged"
                                            :label="$t('ldap.attributes.whenChanged')"
                                            readonly
                                            v-model="usercopy.whenChanged"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            id="lastLogon"
                                            :label="$t('ldap.attributes.lastLogon')"
                                            readonly
                                            v-model="usercopy.lastLogon"
                                            ></v-text-field>
                                        </v-col>
                                        <v-col cols="12" lg="6">
                                            <v-text-field
                                            dense
                                            id="pwdLastSet"
                                            :label="$t('ldap.attributes.pwdLastSet')"
                                            readonly
                                            v-model="usercopy.pwdLastSet"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" lg="8">
                                            <v-row justify="center">
                                                <span>
                                                    {{ $t('ldap.attributes.objectClass') }}
                                                </span>
                                            </v-row>
                                            <v-row justify="center">
                                                <v-chip :light="$vuetify.theme.dark"
                                                :dark="!$vuetify.theme.dark"
                                                class="ma-1" v-for="i in usercopy.objectClass" :key="i"
                                                @click:close="removeObjectClassFromArray(i)"
                                                :close="editFlag == true">
                                                    {{ i }}
                                                </v-chip>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" lg="">
                                            <v-row class="ma-0 pa-0" justify="center">
                                                <v-autocomplete dense v-model="addObjectClass"
                                                :label="$t('actions.addObjectClass')"
                                                clearable
                                                :readonly="editFlag != true"
                                                :hint="$t('section.users.userDialog.hint.addObjectClass')"
                                                :items="objectClasses">
                                                </v-autocomplete>
                                                <v-btn :class="(editFlag != true ? 'bg-white bg-lig-90' : 'bg-primary text-white') + ' ml-3'"
                                                :disabled="editFlag != true"
                                                @click="addObjectClassToArray"
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
                                            id="objectCategory"
                                            :label="$t('ldap.attributes.objectCategory')"
                                            readonly
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

            <!-- PERMISSIONS SCREEN -->
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

            <!-- GROUPS SCREEN -->
            <v-tab-item :key="2">
                <v-card-text class="my-3 py-4">
                    <v-row justify="center">
                        <v-col cols="12" md="10">
                            <v-select
                            dense
                            id="primaryGroupID"
                            :label="$t('ldap.attributes.primaryGroupID')"
                            :readonly="editFlag != true"
                            v-model="usercopy.primaryGroupID"
                            :items="this.usercopy.memberOfObjects"
                            :hint="$t('section.users.userDialog.hint.primaryGroupID')"
                            persistent-hint
                            :item-text="getNameForPID"
                            item-value="objectRid"
                            ></v-select>
                        </v-col>
                    </v-row>
                    <v-row justify="center" align-content="center" class="mb-2">
                    <v-col class="ma-0 pa-0" cols="12" md="10">
                        <v-card outlined height="100%" class="ma-1 pa-0 pt-4">
                            <v-row justify="center"
                            class="pa-0 ma-0 text-h6 mx-4 mb-2">
                                {{ $t('section.users.groups') }}
                            </v-row>
                            <v-divider class="mx-12"/>
                            <v-list dense>
                                <v-row class="ma-0 pa-0 mx-6 my-3" justify="end">
                                        <v-btn color="primary" outlined
                                            :disabled="editFlag != true"
                                            @click="openDialog('userAddToGroup')">
                                            <v-icon small>
                                                mdi-plus
                                            </v-icon>
                                            {{ $t("section.users.userDialog.addToGroup") }}
                                        </v-btn>
                                </v-row>
                                <v-list-item-group active-class="groupSelected">
                                    <v-list-item v-for="group, key in usercopy.memberOfObjects" :key="key">
                                        <template v-slot:default="{ }">
                                            <v-list-item-action/>

                                            <v-list-item-content>
                                                <v-list-item-title>
                                                    {{ group.name + " (" + group.objectRid + ")" }}
                                                </v-list-item-title>
                                            </v-list-item-content>

                                            <v-list-item-action class="ma-0">
                                                <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small icon 
                                                    @click="goToGroup(group.distinguishedName)"
                                                    @click.stop
                                                    color="primary"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    <v-icon small>
                                                        mdi-arrow-right-bold
                                                    </v-icon>
                                                    </v-btn>
                                                </template>
                                                <span> {{ $t("actions.goTo") + " " + $t("classes.group.single") }} </span>
                                                </v-tooltip>
                                            </v-list-item-action>
                                            <v-list-item-action class="ma-0">
                                                <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small icon 
                                                    @click="copyText(group.distinguishedName)"
                                                    @click.stop
                                                    color="primary"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    <v-icon small>
                                                        mdi-content-copy
                                                    </v-icon>
                                                    </v-btn>
                                                </template>
                                                <span> {{ $t("section.groups.groupDialog.copyDistinguishedName") }} </span>
                                                </v-tooltip>
                                            </v-list-item-action>
                                            <v-list-item-action class="ma-0">
                                                <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn small icon v-show="group.objectRid != usercopy.primaryGroupID"
                                                    :disabled="editFlag != true"
                                                    @click="removeFromGroup(group.distinguishedName)"
                                                    @click.stop
                                                    color="red"
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    <v-icon small>
                                                        mdi-close
                                                    </v-icon>
                                                    </v-btn>
                                                    <v-btn small icon v-show="group.objectRid == usercopy.primaryGroupID"
                                                    @click.stop
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    >
                                                    <v-icon small>
                                                        mdi-close
                                                    </v-icon>
                                                    </v-btn>
                                                </template>
                                                <span v-if="group.objectRid != usercopy.primaryGroupID"> {{ $t("section.users.userDialog.removeFromGroup") }} </span>
                                                <span v-else> {{ $t("section.users.userDialog.primaryGroupRemoveDisabled") }} </span>
                                                </v-tooltip>
                                            </v-list-item-action>
                                        </template>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
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
            <v-row class="ma-1 pa-0" align="center" align-content="center" :justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'end'">
                <!-- Go Back button (Permissions View) -->
                <v-slide-x-reverse-transition>
                        <v-btn v-if="changingPerms || changingGroups" @click="goBackToDetails"
                        class="text-normal ma-0 pa-0 pa-3 ma-1 px-1 bg-white bg-lig-25" 
                        rounded>
                            <v-fab-transition>
                                <v-icon class="ml-0" v-if="changingPerms">
                                    mdi-chevron-left
                                </v-icon>
                            </v-fab-transition>
                            <span :class="changingPerms ? 'mr-2' : 'ml-2'">
                                {{ $t("section.users.userDialog.userDetails" )}}
                            </span>
                            <v-fab-transition>
                                <v-icon class="mr-0" v-if="changingGroups">
                                    mdi-chevron-right
                                </v-icon>
                            </v-fab-transition>
                        </v-btn>
                </v-slide-x-reverse-transition>
                <!-- Enable/Disable Buttons -->
                <v-slide-x-reverse-transition>
                        <v-btn color="green" v-if="!usercopy.is_enabled" @click="enableUser" 
                        :class="(editFlag ? 'text-white ' : '' ) + 'ma-0 pa-0 pa-3 pr-4 ma-1'" 
                        rounded :disabled="!editFlag || isLoggedInUser(usercopy.username)">
                            <v-icon class="mr-1">
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                            {{ $t("actions.enable") }}
                        </v-btn>
                        <v-btn color="red" v-else-if="usercopy.is_enabled == true" @click="disableUser" 
                        :class="(editFlag ? 'text-white ' : '' ) + 'ma-0 pa-0 pa-3 pr-4 ma-1'" rounded :disabled="!editFlag || isLoggedInUser(usercopy.username)">
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
                <!-- Save User Changes Button -->
                <v-btn @click="saveUser(true)"
                :class="(editFlag ? 'text-normal ' : '' ) + 'ma-0 pa-0 pa-4 ma-1 bg-white bg-lig-25'" 
                rounded 
                :disabled="!editFlag">
                    <v-icon class="mr-1">
                        mdi-exit-to-app
                    </v-icon>
                    {{ $t("actions.saveClose") }}
                </v-btn>
                <!-- Refresh User Button -->
                <v-progress-circular class="pa-0 ma-0" :color="loadingColor" value="100" :indeterminate="loading || fetchingData" size="38" width="7">
                    <v-btn small
                    class="ma-1 bg-primary" 
                    color="white" 
                    icon
                    :disabled="loading || fetchingData"
                    elevation="0"
                    :loading="refreshLoading"
                    @click="refreshUser"
                    >
                        <v-icon>
                        mdi-refresh
                        </v-icon>
                        <template v-slot:loader>
                        <span class="custom-loader">
                            <v-icon color="white">mdi-cached</v-icon>
                        </span>
                        </template>
                    </v-btn>
                </v-progress-circular>
            </v-row>
        </v-card-actions>

        <!-- USER ADD TO GROUP DIALOG -->
        <v-dialog eager max-width="1200px" v-model="dialogs['userAddToGroup']">
            <CNObjectList
            :viewKey="'userAddToGroup'"
            ref="UserAddToGroup"
            @addDNs="addToGroup"
            :excludeDNs="excludeGroups"
            :enableUsers="false"
            @closeDialog="closeInnerDialog"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import User from '@/include/User'
import CNObjectList from '@/components/CNObjectList.vue'
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    name: 'UserDialog',
    components: {
        CNObjectList,
    },
    data () {
      return {
        panel: [],
        loading: false,
        loadingColor: 'accent',
        tab: 0,
        error: false,
        errorMsg: "",
        domain: "",
        realm: "",
        basedn: "",
        changingPerms: false,
        changingGroups: false,
        usercopy: {},
        addObjectClass: "",
        groupsToRemove: [],
        groupsToAdd: [],
        excludeGroups: [],
        // Dialog States
        dialogs: {
            userAddToGroup: false
        },
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
            // "LDAP_UF_LOCKOUT" : {
            //     value: false,
            //     int: 16
            // },
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
            // "LDAP_UF_PASSWORD_EXPIRED" : {
            //     value: false,
            //     int: 8388608
            // },
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
        fetchingData: Boolean,
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
        getUSN(){
            if (this.usercopy.username != undefined)
                return this.usercopy.username + "@" + this.domain
            else
                return "@" + this.domain
        },
    },
    watch: {
        'dialogs': {
            handler: function (newValue) {
                if (!newValue['userAddToGroup'] || newValue['userAddToGroup'] == false)
                this.$refs.UserAddToGroup.clearList();
            },
            deep: true
        }
        // Monitor changes in usercopy
        // usercopy(newValue) {
        // }
    },
    methods: {
        goToGroup(groupDn) {
            this.$emit('goToGroup', { distinguishedName: groupDn })
        },
        setupExclude(){
            this.excludeGroups = []
            if (this.usercopy.memberOfObjects != undefined && this.usercopy.memberOfObjects.length > 0) {
                this.usercopy.memberOfObjects.forEach(g => {
                    this.excludeGroups.push(g.distinguishedName)
                });
            }
            if (this.usercopy.groupsToAdd != undefined && this.usercopy.groupsToAdd.length > 0) {
                this.usercopy.groupsToAdd.forEach(g => {
                    if (!this.excludeGroups.includes(g))
                        this.excludeGroups.push(g)
                });
            }
            return
        },
        openDialog(key){
            this.dialogs[key] = true;
            switch (key) {
                case 'userAddToGroup':
                    this.setupExclude()
                    this.$refs.UserAddToGroup.fetchLists()
                break;
                default:
                break;
            }
        },
        closeInnerDialog(key){
            this.dialogs[key] = false;
        },
        addToGroup(groups){
            this.groupsToAdd = groups.map(e => e.distinguishedName)
            if (!this.usercopy.memberOfObjects)
                this.usercopy.memberOfObjects = []
            groups.forEach(g => {
                if (this.usercopy.memberOfObjects.filter(e => e.distinguishedName == g.distinguishedName).length == 0) {
                    this.usercopy.memberOfObjects.push(g)
                }

                if (this.groupsToRemove != undefined) {
                    console.log("MTR Includes this member, removing. " + g.distinguishedName)
                    this.groupsToRemove = this.groupsToRemove.filter(e => e != g.distinguishedName)
                }
            });
            this.closeInnerDialog('userAddToGroup')
            this.logGroups()
            this.$forceUpdate
        },
        removeFromGroup(groupDn) {
            var currentGroupFilter = this.usercopy.memberOfObjects.filter(e => e.distinguishedName == groupDn)
            if (currentGroupFilter.length > 0)
                var currentGroup = currentGroupFilter[0]

            if (currentGroup['objectRid'] == this.usercopy['primaryGroupID']) {
                console.error("Primary group cannot be deleted")
            }
            else {
                if (!this.groupsToRemove.includes(groupDn))
                    this.groupsToRemove.push(groupDn)
    
                if (this.groupsToAdd.includes(groupDn))
                    this.groupsToAdd = this.groupsToAdd.filter(e => e != groupDn)
    
                if (this.excludeGroups.includes(groupDn))
                    this.excludeGroups = this.excludeGroups.filter(e => e != groupDn)
    
                this.usercopy.memberOfObjects = this.usercopy.memberOfObjects.filter(e => e.distinguishedName != groupDn)
                this.logGroups()
                this.$forceUpdate
            }
        },
        logGroups(){
            console.log("Groups to Add")
            console.log(this.groupsToAdd)
            console.log("Groups to Remove")
            console.log(this.groupsToRemove)
            console.log("Member Of Objects")
            console.log(this.usercopy.memberOfObjects)
        },
        copyText(textString) {
            navigator.clipboard.writeText(textString);
        },
        getNameForPID(item){
            return item.name + " (" + item.objectRid + ")"
        },
        getDomainDetails(){
            this.domain = localStorage.getItem('domain')
            this.realm = localStorage.getItem('realm')
            this.basedn = localStorage.getItem('basedn')
        },
        setObjectClassToArray(){
            if (this.usercopy.objectClass && this.usercopy.objectClass != '' && (typeof this.usercopy.objectClass === 'string' || this.usercopy.objectClass instanceof String)) {
                this.usercopy.objectClass = this.usercopy.objectClass.replace(/'/g, "\"")
                this.usercopy.objectClass = JSON.parse(this.usercopy.objectClass)
            }
        },
        removeObjectClassFromArray(value){
            // Returns array without value
            if (this.usercopy.objectClass.includes(value) && Array.isArray(this.usercopy.objectClass))
                this.usercopy.objectClass = this.usercopy.objectClass.filter(e => e !== value);
            this.addObjectClass = value
        },
        addObjectClassToArray(){
            if (!this.usercopy.objectClass.includes(this.addObjectClass) && this.addObjectClass)
                this.usercopy.objectClass.push(this.addObjectClass);
            this.addObjectClass = ''
        },
        // When a permission in the v-list changes this function is executed
        onClickPermission(key){
            if (this.editFlag == true) {
                this.permissions[key].value = !this.permissions[key].value
            }
        },
        goBackToDetails(){
            this.tab = 0
            this.changingPerms = false
            this.changingGroups = false
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
        goToPerms(){
            this.tab = 1
            this.changingPerms = true
            this.changingGroups = false
        },
        goToGroups(){
            this.tab = 2
            this.changingPerms = false
            this.changingGroups = true
        },
        async disableUser(){
            await this.usercopy.disable(this.usercopy.username)
            this.refreshUser();
        },
        async enableUser(){
            await this.usercopy.enable(this.usercopy.username)
            this.refreshUser();
        },
        editUser(){
            this.$emit('editToggle', true);
        },
        viewUser(){
            this.$emit('editToggle', false);
            this.refreshUser();
        },
        closeDialog() {
            this.$emit('closeDialog', this.viewKey);
        },
        async saveUser(closeDialog=false){
            this.loading = true
            // Set permissions array properly
            this.usercopy.permission_list = []
            for (const [key] of Object.entries(this.permissions)) {
                if (this.permissions[key].value == true)
                    this.usercopy.permission_list.push(key)
            }
            // Set groups to add or remove
            if (this.groupsToAdd.length > 0)
                this.usercopy.groupsToAdd = this.groupsToAdd
            else
                delete this.usercopy.groupsToAdd
            
            if (this.groupsToRemove.length > 0)
                this.usercopy.groupsToRemove = this.groupsToRemove
            else
                delete this.usercopy.groupsToRemove
            // Uncomment below to debug permissions list
            // console.log(this.usercopy.permission_list)
            this.$emit('save', this.viewKey, this.usercopy);
            await new User({}).update({user: this.usercopy})
            .then(() => {
                if (closeDialog == true)
                    this.closeDialog();
                else
                    this.refreshUser();
                this.loading = false
                this.loadingColor = 'primary'
            })
            .catch(error => {
                console.log(error)
                if (error.response.data.code) {
                    switch (error.response.data.code) {
                        case 'user_permission_malformed':
                            this.errorMsg = this.$t("error.codes.users.permissionMalformed")
                            break;
                        case 'user_update_error':
                            this.errorMsg = this.$t("error.codes.users.couldNotSave")
                            break;
                        case 'user_country_error':
                            this.errorMsg = this.$t("error.codes.users.countryMalformed")
                            break;
                        default:
                            this.errorMsg = this.$t("error.unknown_short")
                            break;
                    }
                } else {
                    this.errorMsg = this.$t("error.unknown_short")
                }
                this.userRefreshLoading = false;
                this.loading = false
                this.loadingColor = 'error'
                this.error = true;
            })
        },
        isLoggedInUser(username){
            if (username == localStorage.getItem('username'))
                return true
            return false
        },

        setUserGroups(){
            this.groupsToRemove = []
            this.groupsToAdd = []
        },
        // Sync the usercopy object to the parent view user object on the
        // next tick to avoid mutation errors
        syncUser(){
            this.tab = 0
            this.changingPerms = false
            this.changingGroups = false
            this.getDomainDetails()
            this.usercopy = new User({})
            this.$nextTick(() => {
                this.usercopy = this.user
                this.setUserGroups()
                this.setObjectClassToArray()
                this.setupExclude()
                if (this.usercopy.lastLogon == 0)
                    this.usercopy.lastLogon = this.$t('section.users.userDialog.noLastLogon')
                this.setPermissions()
                this.loading = false
                this.loadingColor = 'primary'
            })
        },
        // Tells the parent view to refresh/fetch the user again
        async refreshUser(){
            this.loading = true
            this.$emit('refreshUser', this.user);
            this.loading = false
            this.loadingColor = 'primary'
        }
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

.groupSelected {
    border-left: 4px solid var(--clr-primary);
}
.groupSelected::before {
    background-color: rgba(0,0,0,0.3);
}
</style>
