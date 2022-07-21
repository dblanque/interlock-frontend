<template>
    <v-card outlined flat class="pt-2">
        <v-row class="ma-0 ma-1 px-4 py-0" style="top: 3.5rem !important; z-index: 10 !important;" justify="center">
            <v-btn @click="resetDialog = true" disabled
                class="ma-0 pa-0 pa-4 ma-1 mx-1 text-normal"
                color="red">
                    <v-icon :class="(loading == true ? 'custom-loader' : '' ) + ' mr-1'">
                        mdi-backup-restore
                    </v-icon>
                    {{ $t("actions.restoreDefaultValues") }}
            </v-btn>
            <v-btn disabled
                class="ma-0 pa-0 pa-4 ma-1 mx-1 text-normal"
                color="red">
                    <v-icon :class="(loading == true ? 'custom-loader' : '' ) + ' mr-1'">
                        mdi-memory
                    </v-icon>
                    {{ $t("actions.testSettings") }}
            </v-btn>
        </v-row>
        <v-row class="ma-0 ma-1 px-4 py-0 mb-4 sticky-top" style="top: 3.5rem !important; z-index: 10 !important;" justify="center">
            <v-btn @click="saveSettings" disabled
            style="border-radius: 0; border-bottom-left-radius: 0.3rem; border-top-left-radius: 0.3rem;"
                class="ma-0 pa-0 pa-4 ma-1 mr-0 bg-white bg-lig-25 text-normal" >
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
            </v-btn>
            <v-btn @click="refreshSettings"
            style="border-radius: 0; border-bottom-right-radius: 0.3rem; border-top-right-radius: 0.3rem;"
                class="ma-0 pa-0 pa-4 ma-1 ml-0 text-normal"
                color="primary">
                    <v-icon :class="(loading == true ? 'custom-loader' : '' ) + ' mr-1'">
                        mdi-cached
                    </v-icon>
                    {{ $t("actions.refresh") }}
            </v-btn>
        </v-row>
        <v-row class="mx-1" justify="center">
            <v-checkbox off-icon="mdi-close-box"
            :label="$t('section.settings.defaultAdminIs') + ' ' + (defaultAdminEnabled ? $t('words.enabled') : $t('words.disabled'))"
            v-model="defaultAdminEnabled"/>
        </v-row>
        <v-row class="mx-1" justify="center">
            <v-col cols="8" md="4" xl="3">
                <v-text-field
                v-model="defaultAdminPwd"
                :rules="[this.fieldRules(defaultAdminPwd, 'ge_password', defaultAdminPwdConfirm.length > 0 ? true : false)]"
                label="Change Default Admin Password"/>
            </v-col>
            <v-col cols="8" md="4" xl="3">
                <v-text-field
                v-model="defaultAdminPwdConfirm"
                :rules="[this.fieldRules(defaultAdminPwd, 'ge_password', defaultAdminPwd.length > 0 ? true : false)]"
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
        <v-expand-transition>
        <v-row v-if="loading == true" class="ma-0 pa-0 ma-16" justify="center" align="center" align-content="center">
            <v-progress-circular size="100" width="10" indeterminate color="primary"/>
        </v-row>
        <v-form ref="settingsForm" v-else-if="showSettings == true">
        <v-row>
            <v-col cols="12" v-for="(category, categoryKey) in config" :key="categoryKey">
                <!-- Category Header -->
                <v-row class="ma-0 pa-0" justify="center">
                    <h4>
                        {{ $t('section.settings.headers.' + categoryKey) }}
                    </h4>
                </v-row>

                <!-- Category Body -->
                <v-row class="ma-0 my-2 pa-0" justify="center" v-for="(row, key) in category" :key="key">
                    <v-col :class="'ma-0 pa-0 py-1 px-4'" cols="10" :md="getColSize(key, 'md')" :lg="getColSize(key, 'lg')" v-for="(item, key) in row" :key="key">
                    <!-- Checkbox Settings -->
                    <v-checkbox 
                    v-if="item.type == 'checkbox' || item.type == 'boolean' || item.type == 'bool'"
                    v-model="item.value"
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
                            <v-btn class="bg-primary text-white mt-3 ml-5"
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
                                <v-btn class="bg-primary text-white ml-5"
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
                                :rules="[fieldRules(item.addIP, 'net_ip', (item.required && item.value.length == 0 || item.addPORT.length > 0 ? true : false))]"
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
                            <v-btn class="bg-primary text-white mt-3 ml-5"
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
                                <v-btn class="bg-primary text-white ml-5"
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
                        <span class="font-weight-normal">
                            {{ $t('section.settings.fields.' + key) }}
                        </span>
                        <v-row class="ma-0 pa-0">
                            <v-text-field :label="$t('words.key')"
                            class="px-2"
                            :readonly="item.readonly || readonly == true"
                            :hint="$t(item.hint)"
                            :ref="'OBJ_KEY_'+key"
                            :persistent-hint="item.persistentHint"
                            @keydown.enter="addToObject(item, item.keyToAdd, item.valueToAdd)"
                            v-model="item.keyToAdd"
                            :required="item.required && item.value.length == 0 ? true : false"
                            :rules="item.validator ? [fieldRules(item.keyToAdd, item.validator, getRequired(item.required, true))] : undefined"
                            :id="'OBJ_KEY_'+key"
                            />
                            <v-text-field :label="$t('words.value')"
                            class="px-2"
                            :ref="'OBJ_VAL_'+key"
                            :readonly="item.readonly || readonly == true"
                            :hint="$t(item.hint)"
                            :persistent-hint="item.persistentHint"
                            @keydown.enter="addToObject(item, item.keyToAdd, item.valueToAdd)"
                            v-model="item.valueToAdd"
                            :required="item.required && item.value.length == 0 ? true : false"
                            :rules="item.validator ? [fieldRules(item.valueToAdd, item.validator, getRequired(item.required, true, true))] : undefined"
                            :id="'OBJ_VAL_'+key"
                            />
                            <v-btn class="bg-primary text-white mt-3 ml-5"
                            :disabled="item.readonly || readonly == true"
                            @click="addToObject(item, item.keyToAdd, item.valueToAdd)"
                            rounded
                            icon>
                                <v-icon>
                                    mdi-plus
                                </v-icon>
                            </v-btn>
                        </v-row>
                        <v-list-item v-bind="item.value" v-for="subItem, subItemKey in item.value" :key="subItemKey">
                            <v-list-item-content class="ma-0 pa-0">
                                <v-col class="ma-0 pa-0 px-2 py-1" cols="6">
                                    <v-text-field outlined
                                        :label="$t('words.key')"
                                        :value="subItemKey" 
                                        readonly/>
                                </v-col>
                                <v-col class="ma-0 pa-0 px-2 py-1" cols="6">
                                    <v-text-field outlined
                                        :label="$t('words.value')"
                                        :value="subItem" 
                                        readonly/>
                                </v-col>
                            </v-list-item-content>
                            <v-list-item-action class="ma-0 pa-0">
                                <v-btn class="bg-primary text-white ml-2 mb-7"
                                :disabled="item.readonly || readonly == true"
                                @click="removeFromObject(item, subItemKey)"
                                rounded small
                                icon>
                                    <v-icon small>
                                        mdi-minus
                                    </v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
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
                    :label="$t('section.users.attributes.password')"
                    v-model="item.value"
                    :rules="[fieldRules(item.value, 'ge_password', getRequired(item.required))]"
                    />
                    <!-- Text Field Settings -->
                    <v-text-field :label="$t('section.settings.fields.' + key)"
                    v-else
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
        </v-expand-transition>

        <v-dialog v-model="resetDialog" max-width="650px">
            <SettingsResetDialog
            @resetConfirm="restoreDefaultValues"
            @closeDialog="resetDialog = false"
            />
        </v-dialog>
    </v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';
import Settings from '@/include/Settings';
import SettingsResetDialog from '@/components/Settings/SettingsResetDialog.vue'

export default {
    mixins: [ validationMixin ],
    components: {
        SettingsResetDialog
    },
    data() {
        return {
            readonly: false,
            invalid: false,
            loading: true,
            resetDialog: false,
            showSettings: false,
            defaultAdminEnabled: true,
            defaultAdminPwd: "",
            defaultAdminPwdConfirm: "",
            config: {
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
                        }
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
                    },
                    row2:{
                        LDAP_AUTH_USE_TLS: {
                            value: "",
                            type: "boolean",
                        },
                        LDAP_AUTH_TLS_VERSION: { 
                            value: "PROTOCOL_TLSv1_2",
                            choices: [
                                "PROTOCOL_TLSv1",
                                "PROTOCOL_TLSv1_1",
                                "PROTOCOL_TLSv1_2",
                                "PROTOCOL_SSLv2",
                                "PROTOCOL_SSLv3",
                                "PROTOCOL_SSLv23",
                                "PROTOCOL_TLS",
                                "PROTOCOL_TLS_CLIENT",
                                "PROTOCOL_TLS_SERVER",
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
                        },
                        EXCLUDE_COMPUTER_ACCOUNTS:{ 
                            value: "",
                            type: "boolean"
                        },
                    },
                    row2:{
                        LDAP_AUTH_USER_FIELDS:{ 
                            value: {},
                            keyToAdd: "",
                            valueToAdd: "",
                            type: "object"
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
    computed: {
    },
    mounted(){
        this.refreshSettings();
    },
    methods:{
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
            switch (key) {
                case 'LDAP_AUTH_URL':
                    if (breakpoint == 'md')
                        return 10
                    else
                        return 8
                case 'LDAP_AUTH_USE_TLS':
                    return 2
                case 'LDAP_AUTH_TLS_VERSION':
                    return 6
                default:
                    return 8
            }
        },
        async saveSettings(){
            if (this.$refs.settingsForm.validate('settingsForm'))
                this.invalid = false
            else
                this.invalid = true

            if (!this.invalid) {
                var dataToSend = {}
                dataToSend = this.getConfigValues()
                dataToSend['DEFAULT_ADMIN_ENABLED'] = this.defaultAdminEnabled
                dataToSend['DEFAULT_ADMIN_PWD'] = this.defaultAdminPwd
                await new Settings({}).save(dataToSend)
            }
        },
        async refreshSettings(){
            if (this.$refs.settingsForm != undefined)
                if (this.$refs.settingsForm.validate('settingsForm'))
                    this.invalid = false
                else
                    this.invalid = true
            await new Settings({}).list()
            .then(response => {
                var settings = response.data.settings
                this.defaultAdminEnabled = settings['DEFAULT_ADMIN_ENABLED']
                for (const key in settings) {
                    if (Object.hasOwnProperty.call(settings, key)) {
                        const value = settings[key]['value'];
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
                setTimeout(()=>{
                    this.showSettings = true
                }, 200)
                this.error = false
            })
            .catch(error => {
                console.log(error)
                this.loading = false
                setTimeout(()=>{
                    this.showSettings = false
                }, 200)
                this.error = true
            })
        },
        async restoreDefaultValues(){
            this.resetDialog = false
            await new Settings({}).reset()
            .then(() => {
                this.refreshSettings();
            })
            .catch(error => {
                console.log(error)
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
                console.log('yay')
                var result = item.addPREFIX + item.addIP + ":" + item.addPORT
                this.addToArray(result, item)
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
        }
    }
}
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>