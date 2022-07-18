<template>
    <v-card outlined flat>
        <v-row class="ma-0 ma-1 px-4 py-2 sticky-top" style="top: 3rem !important; z-index: 10 !important;" justify="center">
            <v-btn @click="saveSettings"
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
        <v-expand-transition>
        <v-row v-if="loading == true" class="ma-0 pa-0 ma-16" justify="center" align="center" align-content="center">
            <v-progress-circular size="100" width="10" indeterminate color="primary"/>
        </v-row>
        <v-form ref="settingsForm" v-else-if="showSettings == true">
        <v-row>
            <v-col cols="12" v-for="(category, categoryKey) in config" :key="categoryKey">
                <!-- Category Header -->
                <v-row class="ma-0 pa-0 pt-4" justify="center">
                    <h4>
                        {{ $t('section.settings.headers.' + categoryKey) }}
                    </h4>
                </v-row>

                <!-- Category Body -->
                <v-row class="ma-0 my-2 pa-0" justify="center" v-for="(row, key) in category" :key="key">
                    <v-col :class="'ma-0 pa-0 py-1 px-4'" cols="10" :md="getColSize(key, 'md')" :lg="getColSize(key, 'lg')" v-for="(item, key) in row" :key="key">
                    <!-- Checkbox Settings -->
                    <v-checkbox
                    v-if="item.type == 'checkbox'"
                    v-model="item.value"
                    :hint="$t(item.hint)"
                    :persistent-hint="item.persistentHint"
                    :label="$t('section.settings.fields.' + key)"/>
                    <!-- List / Array of Settings -->
                    <v-card flat outlined class="ma-0 px-6 py-2" v-else-if="item.type == 'list' || item.type == 'array'">
                        <v-row class="ma-0 pa-0">
                            <v-text-field :label="$t('section.settings.fields.' + key)"
                            :readonly="item.readonly"
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
                            :readonly="item.readonly"
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
                            :readonly="item.readonly"
                            :hint="$t(item.hint)"
                            :persistent-hint="item.persistentHint"
                            @keydown.enter="addToObject(item, item.keyToAdd, item.valueToAdd)"
                            v-model="item.valueToAdd"
                            :required="item.required && item.value.length == 0 ? true : false"
                            :rules="item.validator ? [fieldRules(item.valueToAdd, item.validator, getRequired(item.required, true, true))] : undefined"
                            :id="'OBJ_VAL_'+key"
                            />
                            <v-btn class="bg-primary text-white mt-3 ml-5"
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
                    :readonly="item.readonly"
                    v-model="item.value"
                    :hint="$t(item.hint)"
                    :persistent-hint="item.persistentHint"
                    :id="key"
                    :items="item.choices"
                    />
                    <!-- Password Settings -->
                    <v-text-field v-else-if="item.type == 'password'"
                    :type="item.hidden ? 'password' : 'text'"
                    required
                    :append-icon="item.hidden ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="() => (item.hidden = !item.hidden)"
                    dense
                    :label="$t('section.users.attributes.password')"
                    v-model="item.value"
                    :rules="[fieldRules(item.value, 'ge_password', getRequired(item.required))]"
                    />
                    <!-- Text Field Settings -->
                    <v-text-field :label="$t('section.settings.fields.' + key)"
                    v-else
                    :readonly="item.readonly"
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
    </v-card>    
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';
import Settings from '@/include/Settings';

export default {
    mixins: [ validationMixin ],
    data() {
        return {
            loading: true,
            showSettings: false,
            config: {
                domain: {
                    row1:{
                        // Domain Parameters
                        LDAP_AUTH_URL: {
                            value: [],
                            add: "",
                            type: "array",
                            hint: 'section.settings.fields.LDAP_AUTH_URL_HINT',
                            persistentHint: true,
                            required: true,
                            validator: "ge_ipaddress"
                        }
                    },
                    row2: {
                        LDAP_PORT: {
                            value: "",
                            hint: 'section.settings.fields.LDAP_PORT_HINT'
                        },
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
                            value: ""
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
                            validator: "ge_numbers"
                        },
                        LDAP_AUTH_RECEIVE_TIMEOUT: {
                            value: 5,
                            validator: "ge_numbers"
                        },
                    },
                    row2:{
                        LDAP_AUTH_USE_TLS: {
                            value: "",
                            type: "checkbox",
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
                            type: "checkbox"
                        },
                    },
                    row2:{
                        LDAP_AUTH_USER_FIELDS:{ 
                            value: {},
                            keyToAdd: "",
                            valueToAdd: "",
                            type: "object"
                        },
                        LDAP_AUTH_USER_LOOKUP_FIELDS:{ 
                            value: [],
                            type: 'list',
                            add: "",
                            required: true,
                            validator: "ge_lettersStrict"
                        },
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
            var dataToSend = {}
            for (const category in this.config) {
                for (const row in this.config[category]) {
                    var currentPath = this.config[category][row]
                    for (const settingKey in currentPath){
                        dataToSend[settingKey] = currentPath[settingKey]['value']
                    }
                }
            }
            console.log(dataToSend)
        },
        async refreshSettings(){
            if (this.$refs.settingsForm != undefined)
                this.$refs.settingsForm.validate('settingsForm')
            await new Settings({}).list()
            .then(response => {
                var settings = response.data.settings
                console.log(settings)
                for (const key in settings) {
                    if (Object.hasOwnProperty.call(settings, key)) {
                        const value = settings[key];
                        for (const category in this.config) {
                            for (const row in this.config[category]) {
                                var currentPath = this.config[category][row]
                                for (const settingKey in currentPath){
                                    if (settingKey == key) {
                                        currentPath[settingKey]['value'] = value
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
        logConfig(){
            console.log(this.config)
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
        addToArray(value, object, itemRef=undefined){
            var array = object.value
            if (itemRef){
                if (this.$refs.settingsForm.validate('LIST_KEY_'+itemRef)) {
                    if (!array.includes(value) && array && value)
                        array = array.push(value);
                }
            } 
            else if (!array.includes(value) && array && value)
                array = array.push(value);
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