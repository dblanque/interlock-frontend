<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: SettingsCard.vue ----------------------------->
<template>
    <v-card outlined flat class="ma-0 pa-0">
        <v-progress-linear :indeterminate="testing == true" :value="testFinished ? 100 : 0" :color="testFinished ? (!testError ? 'valid-40-s' : 'red') : 'primary'"/>
        <v-row class="ma-0 ma-1 px-4 py-0 sticky-top" style="top: 3.5rem !important; z-index: 10 !important;" justify="center">
            <v-btn 
                @click="resetDialog = true" :disabled="readonly || loading"
                elevation="0"
                :dark="!(readonly || loading)"
                :light="isThemeDark($vuetify) && !(readonly || loading)"
                class="ma-0 pa-0 pa-4 ma-1 mx-1"
                color="red">
                    <v-icon class="mr-1">
                        mdi-backup-restore
                    </v-icon>
                    {{ $t("actions.restoreDefaultValues") }}
            </v-btn>
            <v-btn 
                @click="testSettings" :disabled="readonly || loading"
                elevation="0"
                :dark="!isThemeDark($vuetify) && !(readonly || loading)"
                :light="isThemeDark($vuetify) && !(readonly || loading)"
                class="ma-0 pa-0 pa-4 ma-1 mx-1">
                    <span>
                        {{ $t("actions.testSettings") }}
                    </span>
                    <v-progress-circular :indeterminate="testing == true" :value="testFinished ? 100 : 0" :color="testFinished ? (!testError ? 'green' : 'red') : 'primary'" size="26" class="ml-3">
                    <v-fab-transition>
                        <v-icon v-if="!testing && !testFinished" color="primary">
                            mdi-blur-radial
                        </v-icon>
                        <v-icon v-else-if="testFinished && !testError" >
                            mdi-checkbox-marked-circle
                        </v-icon>
                        <v-icon v-else-if="testFinished == true && testError == true">
                            mdi-close-circle
                        </v-icon>
                    </v-fab-transition>
                    </v-progress-circular>
            </v-btn>
        </v-row>
        <v-row class="ma-0 ma-1 px-4 py-0 mb-4 sticky-top" style="top: 6.3rem !important; z-index: 10 !important;" justify="center">
            <v-btn 
                @click="saveSettings" :disabled="readonly || loading"
                elevation="0"
                :dark="!isThemeDark($vuetify) && !(readonly || loading)"
                :light="isThemeDark($vuetify) && !(readonly || loading)"
                style="border-radius: 0; border-bottom-left-radius: 0.3rem; border-top-left-radius: 0.3rem;"
                class="ma-0 pa-0 pa-4 ma-1 mr-0" >
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
            </v-btn>
            <v-btn @click="refreshSettings"
                style="border-radius: 0; border-bottom-right-radius: 0.3rem; border-top-right-radius: 0.3rem;"
                elevation="0"
                class="ma-0 pa-0 pa-4 ma-1 ml-0"
                color="primary">
                    <v-icon :class="(loading == true ? 'custom-loader' : '' ) + ' mr-1'">
                        mdi-cached
                    </v-icon>
                    {{ $t("actions.refresh") }}
            </v-btn>
        </v-row>
        <v-row class="mx-1" justify="center" v-if="false">
            <v-select :label="$t('actions.ldap.operation')"
                @input="changeManualOpType(manual_cmd.operation)"
                :v-model="manual_cmd.operation"
                :items="ldap.operations">
                <template slot="selection" slot-scope="data">
                    {{ $t("actions.ldap.operation_list."+data.item) }}
                </template>
                <template slot="item" slot-scope="data">
                    {{ $t("actions.ldap.operation_list."+data.item) }}
                </template>
            </v-select>
        </v-row>
        <v-row class="mx-1" justify="center">
            <v-checkbox off-icon="mdi-close-box"
            :label="$t('section.settings.defaultAdminIs') + ' ' + (defaultAdminEnabled ? $t('words.enabled') : $t('words.disabled'))"
            v-model="defaultAdminEnabled"/>
        </v-row>
        <v-row class="mx-1" justify="center">
            <v-col cols="8" md="4" xl="3">
                <v-text-field
                type="password"
                v-model="defaultAdminPwd"
                ref="defaultAdminPwd"
                :rules="[this.fieldRules(defaultAdminPwd, 'ge_password', defaultAdminPwdConfirm.length > 0 ? true : false)]"
                label="Change Default Admin Password"/>
            </v-col>
            <v-col cols="8" md="4" xl="3">
                <v-text-field
                type="password"
                v-model="defaultAdminPwdConfirm"
                ref="defaultAdminPwdConfirm"
                :rules="[this.fieldRules(defaultAdminPwdConfirm, 'ge_password', defaultAdminPwd.length > 0 ? true : false)]"
                label="Confirm Default Admin Password"/>
            </v-col>
        </v-row>
        <v-slide-y-transition>
            <v-row justify="center" v-if="invalid == true">
                <v-alert type="warning" dense>
                    {{ $t("section.settings.settingFailedValidation") }}
                </v-alert>
            </v-row>
        </v-slide-y-transition>
        <v-slide-y-transition>
            <div v-if="showSettings == true">
                <v-form ref="settingsForm" @submit.prevent>
                <v-row>
                <v-col cols="12" v-for="(category, categoryKey) in config" :key="categoryKey">
                    <!-- Category Header -->
                    <v-row class="ma-0 pa-0" justify="center">
                        <h4>
                            {{ $t('section.settings.headers.' + categoryKey) }}
                        </h4>
                    </v-row>

                    <!-- Category Body -->
                    <v-row class="ma-1 pa-1" align="center" justify="center" v-for="(row, key) in category" :key="key">
                        <v-col :class="'ma-0 pa-0 py-0 px-4'" cols="10" :md="getColSize(key, 'md')" :lg="getColSize(key, 'lg')" v-for="(item, key) in row" :key="key">
                        <!-- Checkbox Settings -->
                        <v-checkbox :class="'pa-0 ma-0 ' + (key == 'LDAP_AUTH_USE_TLS' ? 'mt-4' : '') + ' ' + item.extraClasses"
                        v-if="item.type == 'checkbox' || item.type == 'boolean' || item.type == 'bool'"
                        v-model="item.value"
                        :disabled="item.disabled"
                        :readonly="item.readonly || readonly == true"
                        :hint="$t(item.hint)"
                        :persistent-hint="item.persistentHint"
                        :label="$t('section.settings.fields.' + key)"/>
                        <!-- List / Array of Settings -->
                        <v-card flat outlined class="ma-0 px-6 py-2" v-else-if="item.type == 'list' || item.type == 'array'">
                            <v-row class="ma-0 pa-0">
                                <v-text-field :label="$t('section.settings.fields.' + key)"
                                :readonly="item.readonly || readonly == true"
                                :hint="$t(item.hint)"
                                :persistent-hint="item.persistentHint"
                                @keydown.enter="addToArray(item.add, item, 'LIST_KEY_'+key)"
                                v-model="item.add"
                                :ref="'LIST_KEY_'+key"
                                :required="item.required && item.value.length == 0 ? true : false"
                                :rules="item.validator ? [fieldRules(item.add, item.validator, (item.required && item.value.length == 0 ? true : false))] : undefined"
                                :id="'LIST_KEY_'+key"
                                />
                                <v-btn color="primary" class="mt-3 ml-5"
                                @click="addToArray(item.add, item, 'LIST_KEY_'+key)"
                                :disabled="item.readonly || readonly == true"
                                rounded
                                icon>
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-row>
                            <v-list-item v-for="subItem, subItemKey in item.value" :key="subItemKey">
                                <v-list-item-content>
                                    {{ subItem }}
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn color="primary" class="ml-5"
                                    :disabled="item.readonly || readonly == true"
                                    @click="removeFromArray(subItem, item)"
                                    rounded small
                                    icon>
                                        <v-icon small>
                                            mdi-minus
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-card>
                        <!-- LDAP URI Type -->
                        <v-card flat outlined class="ma-0 px-6 py-2" v-else-if="item.type == 'ldap_uri'">
                            <v-row class="ma-0 pa-0">
                                <v-col cols="3">
                                    <v-select :label="$t('section.settings.fields.LDAP_URI_PREFIX')"
                                        ref="ldapUriPrefix"
                                        id="ldapUriPrefix"
                                        :readonly="item.readonly || readonly == true"
                                        v-model="item.addPREFIX"
                                        :items="[ 'ldap://','ldaps://' ]"
                                    />
                                </v-col>
                                <v-col>
                                    <v-text-field :label="$t('section.settings.fields.LDAP_URI_IP')"
                                    :readonly="item.readonly || readonly == true"
                                    @keydown.enter="addServer(item)"
                                    v-model="item.addIP"
                                    ref="ldapUriIP"
                                    :required="item.required && item.value.length == 0 ? true : false"
                                    :rules="[fieldRules(item.addIP, 'net_ip_uri', (item.required && item.value.length == 0 || item.addPORT.length > 0 ? true : false))]"
                                    id="ldapUriIP"
                                    />
                                </v-col>
                                <v-col>
                                    <v-text-field :label="$t('section.settings.fields.LDAP_URI_PORT')"
                                    :readonly="item.readonly || readonly == true"
                                    :hint="$t('section.settings.fields.LDAP_URI_PORT_HINT')"
                                    persistent-hint
                                    @keydown.enter="addServer(item)"
                                    v-model="item.addPORT"
                                    ref="ldapUriPort"
                                    :required="item.required && item.value.length == 0 ? true : false"
                                    :rules="[fieldRules(item.addPORT, 'net_port', (item.required && item.value.length == 0 || item.addIP.length > 0 ? true : false))]"
                                    id="ldapUriPort"
                                    />
                                </v-col>
                                <v-btn color="primary" class="mt-3 ml-5"
                                @click="addServer(item)"
                                :disabled="item.readonly || readonly == true"
                                rounded
                                icon>
                                    <v-icon>
                                        mdi-plus
                                    </v-icon>
                                </v-btn>
                            </v-row>
                            <v-list-item v-for="subItem, subItemKey in item.value" :key="subItemKey">
                                <v-list-item-content>
                                    {{ subItem }}
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-btn color="primary" class="ml-5"
                                    @click="removeFromArray(subItem, item)"
                                    :disabled="item.readonly || readonly == true"
                                    rounded small
                                    icon>
                                        <v-icon small>
                                            mdi-minus
                                        </v-icon>
                                    </v-btn>
                                </v-list-item-action>
                            </v-list-item>
                        </v-card>
                        <!-- Object Type Settings -->
                        <v-card flat outlined class="ma-0 px-6 py-2 pt-4" v-else-if="item.type == 'object'">
                            <ObjectEditor :value="item.value"
                            :label="$t('section.users.import.dataMapping')"
                            ref="settingFieldsEditor"
                            @update="v => item.value = v"
                            dense
                            :disableAddDelete="!item.allow_add_delete"
                            :required="item.required"
                            />
                        </v-card>
                        <!-- Select Settings -->
                        <v-select :label="$t('section.settings.fields.' + key)"
                        v-else-if="item.type == 'select'"
                        :readonly="item.readonly || readonly == true"
                        v-model="item.value"
                        :hint="$t(item.hint)"
                        :persistent-hint="item.persistentHint"
                        :id="key"
                        :items="item.choices"
                        />
                        <!-- Password Settings -->
                        <v-text-field v-else-if="item.type == 'password'"
                        :type="item.hidden ? 'password' : 'text'"
                        :readonly="item.readonly || readonly == true"
                        required
                        :append-icon="readonly == true ? undefined : (item.hidden ? 'mdi-eye' : 'mdi-eye-off')"
                        @click:append="() => (item.hidden = !item.hidden)"
                        dense
                        :label="$t('ldap.attributes.password')"
                        v-model="item.value"
                        :rules="[fieldRules(item.value, 'ge_password', getRequired(item.required))]"
                        />
                        <!-- Text Field Settings -->
                        <v-text-field :label="$t('section.settings.fields.' + key)"
                        v-else
                        :class="item.extraClasses"
                        :readonly="item.readonly || readonly == true"
                        :hint="$t(item.hint)"
                        :rules="item.validator ? [fieldRules(item.value, item.validator, item.required)] : undefined"
                        :persistent-hint="item.persistentHint"
                        v-model="item.value"
                        :id="key"
                        />
                        </v-col>
                    </v-row>
                </v-col>
                </v-row>
                </v-form>
            </div>
        </v-slide-y-transition>

        <v-dialog v-model="resetDialog" max-width="650px">
            <SettingsResetDialog
            @resetConfirm="restoreDefaultValues"
            @closeDialog="resetDialog = false"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import Settings from '@/include/Settings.js';
import SettingsResetDialog from '@/components/Settings/SettingsResetDialog.vue'
import ObjectEditor from '@/components/Settings/ObjectEditor.vue'
import { notificationBus } from '@/main.js'

export default {
    name: 'SettingsCard',
    mixins: [ validationMixin, utilsMixin ],
    components: {
        SettingsResetDialog,
        ObjectEditor
    },
    data() {
        return {
            ldap:{
                operations:[
                    "ADD",
                    "DELETE",
                    "MODIFY",
                    "MODIFYDN",
                    "SEARCH",
                    "COMPARE",
                    "EXTENDED"
                ],
                object_classes:[
                    'user',
                    'person',
                    'organizationalPerson',
                    'container',
                    'organizational-unit'
                ],
                object_attributes:[
                    'distinguishedName',
                    'givenName', 
                    'sn', 
                    'displayName', 
                    'sAMAccountName', 
                    'mail',
                    'telephoneNumber',
                    'streetAddress',
                    'postalCode',
                    'l', // Local / City
                    'st', // State/Province
                    'countryCode', // INT
                    'co', // 2 Letter Code for Country
                    'c', // Full Country Name
                    'wWWHomePage',
                    'distinguishedName',
                    'userPrincipalName',
                    'userAccountControl', // Permission ACLs
                    'whenCreated',
                    'whenChanged',
                    'lastLogon',
                    'badPwdCount',
                    'pwdLastSet',
                    'primaryGroupID',
                    'objectClass',
                    'objectCategory',
                    'objectSid',
                    'sAMAccountType',
                    'memberOf',
                    'cn',
                    'member',
                    'groupType'
                ]
            },
            manual_cmd: {
                operation: "ADD",
                filters: []
            },
            testing: false,
            testError: false,
            testFinished: false,
            readonly: true,
            saveTimerId: 0,
            invalid: false,
            loading: true,
            resetDialog: false,
            showSettings: false,
            defaultAdminEnabled: true,
            defaultAdminPwd: "",
            defaultAdminPwdConfirm: "",
            config: {
                log: {
                    row1:{
                        // Log parameters
                        LDAP_LOG_MAX: {
                            value: 0,
                            validator: 'set_log_max',
                            type: "integer",
                            extraClasses: "mb-4"
                        },
                        LDAP_LOG_CREATE: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_READ: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_UPDATE: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_DELETE: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_OPEN_CONNECTION: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_CLOSE_CONNECTION: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_LOGIN: {
                            value: false,
                            type: "boolean",
                        },
                        LDAP_LOG_LOGOUT: {
                            value: false,
                            type: "boolean",
                        },
                    }
                },
                domain: {
                    row1:{
                        // Domain Parameters
                        LDAP_AUTH_URL: {
                            value: [],
                            addPREFIX: "ldap://",
                            addIP: "",
                            addPORT: "",
                            type: "ldap_uri",
                            required: true,
                            validator: "ldap_uri"
                        }
                    },
                    row2: {
                        LDAP_DOMAIN: {
                            value: "",
                            hint: 'section.settings.fields.LDAP_DOMAIN_HINT',
                            validator: 'ldap_website'
                        },
                        LDAP_AUTH_SEARCH_BASE: {
                            value: "",
                            hint: 'section.settings.fields.LDAP_AUTH_SEARCH_BASE_HINT',
                            validator: 'ldap_dn'
                        },
                        LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN: {
                            value: "",
                            hint: 'section.settings.fields.LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN_HINT',
                            validator: "ldap_realm"
                        },
                        LDAP_DNS_LEGACY: {
                            value: false,
                            type: "boolean",
                            hint: 'section.settings.fields.LDAP_DNS_LEGACY_HINT',
                            persistentHint: true
                        },
                    }
                },
                bindUser: {
                    row1:{
                        // Bind User
                        LDAP_AUTH_CONNECTION_USER_DN: {
                            value: "",
                            validator: "ldap_dn"
                        },
                        LDAP_AUTH_CONNECTION_PASSWORD: {
                            value: "",
                            type: "password",
                            hidden: true,
                            required: 'config.bindUser.row1.LDAP_AUTH_CONNECTION_USER_DN'
                        }
                    }
                },
                connection: {
                    row1:{
                        // Connection Parameters
                        LDAP_AUTH_CONNECT_TIMEOUT: {
                            value: 5,
                            type: "integer",
                            validator: "ge_numbers"
                        },
                        LDAP_AUTH_RECEIVE_TIMEOUT: {
                            value: 5,
                            type: "integer",
                            validator: "ge_numbers"
                        },
                        LDAP_AUTH_USE_SSL: {
                            value: false,
                            type: "boolean",
                            extraClasses: "mb-2",
                            hint: "section.settings.fields.LDAP_USE_SSL_HINT",
                            persistentHint: true
                        },
                    },
                    row2:{
                        LDAP_AUTH_USE_TLS: {
                            value: false,
                            type: "boolean",
                            hint: "section.settings.fields.LDAP_USE_SSL_HINT",
                            persistentHint: true
                        },
                        LDAP_AUTH_TLS_VERSION: { 
                            value: "PROTOCOL_TLSv1_2",
                            choices: [
                                "PROTOCOL_TLSv1",
                                "PROTOCOL_TLSv1_1",
                                "PROTOCOL_TLSv1_2",
                                "PROTOCOL_TLS",
                                "PROTOCOL_TLS_CLIENT"
                            ],
                            hint: 'section.settings.fields.LDAP_AUTH_TLS_VERSION_HINT',
                            persistentHint: true,
                            type: "select"
                        }
                    }
                },
                filters: {
                    row1:{
                        ADMIN_GROUP_TO_SEARCH:{ 
                            value: "",
                        },
                        LDAP_AUTH_OBJECT_CLASS:{ 
                            value: "",
                        }
                    },
                    row2:{
                        EXCLUDE_COMPUTER_ACCOUNTS:{ 
                            value: false,
                            type: "boolean"
                        }
                    },
                    row3:{
                        LDAP_AUTH_USER_FIELDS:{ 
                            value: {},
                            keyToAdd: "",
                            valueToAdd: "",
                            type: "object",
                            allow_add_delete: false
                        },
                        // LDAP_AUTH_USER_LOOKUP_FIELDS:{ 
                        //     value: [],
                        //     type: 'list',
                        //     add: "",
                        //     required: true,
                        //     validator: "ge_lettersStrict"
                        // },
                    }
                }
            }
        }
    },
    props: {
        viewTitle: String
    },
    mounted(){
        this.refreshSettings();
    },
    methods:{
        changeManualOpType(v){
            console.log(v)
        },
        createSnackbar(notifObj){
            notificationBus.$emit('createNotification', notifObj);
        },
        // This function returns true or false based on another key value 
        // if a data key path is passed through
        getRequired(value, sameObject=false, valueField=false) {
            if (value === true || value === false)
                return value
            value = value.split('.')

            var currentPath = this[value[0]]
            value.forEach(function callback(subpath, key) {
                if (key != 0) {
                    currentPath = currentPath[subpath]
                }
            });
            if (sameObject == true && valueField == true)
                return currentPath['keyToAdd']
            else if (sameObject == true)
                return currentPath['valueToAdd']
            return currentPath['value']
        },
        getColSize(key, breakpoint){
            // REGEX Switch
            switch (true) {
                case /LDAP_LOG_[A-Z]{0,}/.test(key):
                    if (this.$vuetify.breakpoint.mdAndUp)
                        return 8
                    else
                        return 10
                default:
                    break;
            }
            // STRING Switch
            switch (key) {
                case 'LDAP_AUTH_URL':
                    if (breakpoint == 'md')
                        return 10
                    else
                        return 8
                case 'LDAP_AUTH_USE_TLS':
                    return 3
                case 'LDAP_AUTH_TLS_VERSION':
                    return 5
                default:
                    return 8
            }
        },
        async testSettings(){
            if (this.$refs.settingsForm.validate('settingsForm') && 
                this.$refs.defaultAdminPwd.validate() && 
                this.$refs.defaultAdminPwdConfirm.validate()){
                    this.invalid = false
                    this.testing = true
                    this.testFinished = false
                    this.testError = false
                }
            else {
                this.invalid = true
                this.testing = false
                this.testFinished = true
                this.testError = true
            }

            if (!this.invalid) {
                var dataToSend = {}
                dataToSend = this.getConfigValues()
                await new Settings({}).test(dataToSend).then(() => {
                    setTimeout(() => {
                        this.testing = false
                        this.testFinished = true
                        this.testError = false
                        this.createSnackbar({message: (this.$t("section.settings.testSuccess")).toUpperCase(), type: 'success'})
                    }, 500)
                })
                .catch(error => {
                    console.error(error)
                    this.createSnackbar({message: this.getMessageForCode(error), type: 'error'})
                    setTimeout(() => {
                        this.testing = false
                        this.testFinished = true
                        this.testError = true
                    }, 500)
                })
            }
        },
        async sleep(time_in_milliseconds){
            clearTimeout(this.saveTimerId)
            await new Promise(r => this.saveTimerId = setTimeout(r, time_in_milliseconds));
        },
        async saveSettings(){
            if (this.$refs.settingsForm.validate('settingsForm') && 
                this.$refs.defaultAdminPwd.validate() && 
                this.$refs.defaultAdminPwdConfirm.validate())
                    this.invalid = false
            else
                this.invalid = true

            if (!this.invalid) {
                this.loading = true
                var dataToSend = {}
                dataToSend = this.getConfigValues()
                dataToSend['DEFAULT_ADMIN_ENABLED'] = this.defaultAdminEnabled
                dataToSend['DEFAULT_ADMIN_PWD'] = this.defaultAdminPwd
                await new Settings({}).save(dataToSend).then(() => {
                    this.createSnackbar({message: (this.$tc("classes.setting", 5) + " " + this.$tc("words.saved.m", 5)).toUpperCase(), type: 'success'})
                })
                .catch(error => {
                    console.error(error)
                    this.createSnackbar({message: this.getMessageForCode(error), type: 'error'})
                })
                await this.sleep(1000);
                this.createSnackbar({message: (this.$t("section.settings.waitingServiceRestart")).toUpperCase(), type: 'info'})

                // Wait until Back-end service is active to refresh
                await this.sleep(2000);
                this.refreshSettings()
            }
        },
        validateSettings(){
            if (this.$refs.settingsForm != undefined)
                if (this.$refs.settingsForm.validate('settingsForm'))
                    this.invalid = false
                else
                    this.invalid = true
            
            this.readonly = true
            if (this.testFinished) {
                this.testing = false
                this.testFinished = false
                this.testError = false
            }
        },
        async refreshSettings(){
            this.invalid = false
            this.testing = false
            this.testError = false
            this.testFinished = false
            await new Settings({}).list()
            .then(response => {
                var settings = response.data.settings
                this.defaultAdminEnabled = settings['DEFAULT_ADMIN_ENABLED']
                this.defaultAdminPwd = ""
                this.defaultAdminPwdConfirm = ""
                for (const key in settings) {
                    if (Object.hasOwnProperty.call(settings, key)) {
                        var value = settings[key]['value'];
                        const type = settings[key]['type'];
                        for (const category in this.config) {
                            for (const row in this.config[category]) {
                                var currentPath = this.config[category][row]
                                for (const settingKey in currentPath){
                                    if (settingKey == key) {
                                        currentPath[settingKey]['value'] = value
                                        currentPath[settingKey]['type'] = type
                                    }
                                }
                            }
                        }
                    }
                }
                this.loading = false
                this.createSnackbar({message: (this.$tc("classes.setting", 5) + " " + this.$tc("words.loaded.m", 5)).toUpperCase(), type: 'success'})
                setTimeout(()=>{
                    this.showSettings = true
                    this.readonly = false
                }, 300)
                this.error = false
            })
            .catch(error => {
                console.error(error)
                this.loading = false
                this.createSnackbar({message: this.getMessageForCode(error), type: 'error'})
                setTimeout(()=>{
                    this.showSettings = false
                }, 250)
                this.error = true
                this.readonly = false
            })
        },
        async restoreDefaultValues(){
            this.resetDialog = false
            this.loading = true
            await new Settings({}).reset()
            .then(() => {
                setTimeout(async () => {
                    await this.sleep(1000);
                    this.createSnackbar({message: (this.$t("section.settings.waitingServiceRestart")).toUpperCase(), type: 'info'})

                    // Wait until Back-end service is active to refresh
                    await this.sleep(2000);
                    this.refreshSettings()
                    this.loading = false
                }, 550)
            })
            .catch(error => {
                console.error(error)
            })
        },
        getConfigValues(log=false){
            var dataToSend = {}
            for (const category in this.config) {
                for (const row in this.config[category]) {
                    var currentPath = this.config[category][row]
                    for (const settingKey in currentPath){
                        dataToSend[settingKey] = {}
                        dataToSend[settingKey]['value'] = currentPath[settingKey]['value']
                        if (currentPath[settingKey]['type'])
                            dataToSend[settingKey]['type'] = currentPath[settingKey]['type']
                        else
                            dataToSend[settingKey]['type'] = 'string'
                    }
                }
            }
            if (log == true)
                console.log(dataToSend)
            return dataToSend
        },
        addToObject(object, key, value){
            object['value'][key] = value
            object.valueToAdd = ""
            object.keyToAdd = ""
        },
        removeFromObject(object, key){
            delete object['value'][key];
            // For some reason the v-bind isn't registering when removing an item
            this.$forceUpdate()
        },
        addServer(item){
            var fieldsToValidate = [
                'ldapUriPrefix',
                'ldapUriIP',
                'ldapUriPort',
            ]
            var valid = true
            fieldsToValidate.forEach(field => {
                if (!this.$refs[field][0].validate())
                    valid = false
            });

            if (item.addIP.length <= 0 || item.addPORT.length <= 0)
                return false

            if(valid == true) {
                var result = item.addPREFIX + item.addIP + ":" + item.addPORT
                this.addToArray(result, item)
                this.config.domain.row1.LDAP_AUTH_URL.addIP = ""
                this.config.domain.row1.LDAP_AUTH_URL.addPORT = ""
            }
        },
        addToArray(value, object, itemRef=undefined){
            var array = object.value
            if (itemRef){
                if (this.$refs[itemRef][0].validate()) {
                    if (!array.includes(value) && array && value)
                        array = array.push(value);
                }
            } 
            else if (!array.includes(value) && array && value){
                array = array.push(value);
            }
            return array
        },
        removeFromArray(value, object){
            if (object.value.includes(value) && Array.isArray(object.value)){
                object.value = object.value.filter(function(item) {
                    return item !== value
                });
            }
            return object.value
        },
    }
}
</script>
