<template>
    <v-card outlined flat>
        <v-row class="ma-0 px-4 py-2" justify="center">
            <v-btn elevation="0"
            style="border-radius: 0; border-bottom-left-radius: 0.3rem; border-top-left-radius: 0.3rem;"
                class="ma-0 pa-0 pa-4 ma-1 mr-0 bg-white bg-lig-25 text-normal" >
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
            </v-btn>
            <v-btn elevation="0"
            style="border-radius: 0; border-bottom-right-radius: 0.3rem; border-top-right-radius: 0.3rem;"
                class="ma-0 pa-0 pa-4 ma-1 ml-0 text-normal"
                color="primary">
                    <v-icon class="mr-1">
                        mdi-backup-restore
                    </v-icon>
                    {{ $t("actions.revert") }}
            </v-btn>
        </v-row>
        <v-form ref="settingsForm">
        <v-row>
            <v-col cols="12" v-for="(category, categoryKey) in config" :key="categoryKey">
                <!-- Category Header -->
                <v-row class="ma-0 pa-2" justify="center">
                    <h4>
                        {{ $t('section.settings.headers.' + categoryKey) }}
                    </h4>
                </v-row>

                <!-- Category Body -->
                <v-row class="ma-0 pa-0" v-for="(item, key) in category" :key="key" justify="center">
                    <v-col cols="10" md="6">
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
                            @keydown.enter="addServer(item)"
                            v-model="item.add"
                            ref="serverInput"
                            :required="item.required && item.value.length == 0 ? true : false"
                            :rules="item.validator ? [fieldRules(item.add, item.validator, (item.required && item.value.length == 0 ? true : false))] : false"
                            :id="key"
                            />
                            <v-btn class="bg-primary text-white mt-3 ml-5"
                            @click="addServer(item)"
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
                                @click="removeServer(subItem, item)"
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
                    <!-- Text Field Settings -->
                    <v-text-field :label="$t('section.settings.fields.' + key)"
                    v-else
                    :readonly="item.readonly"
                    :hint="$t(item.hint)"
                    :persistent-hint="item.persistentHint"
                    v-model="item.value"
                    :id="key"
                    />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        </v-form>
    </v-card>    
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin';

export default {
    mixins: [ validationMixin ],
    data() {
        return {
            config: {
                domain: {
                    // Domain Parameters
                    LDAP_AUTH_URL: {
                        value: [],
                        add: "",
                        type: "array",
                        hint: 'section.settings.fields.LDAP_AUTH_URL_HINT',
                        persistentHint: true,
                        required: true,
                        validator: "ge_ipaddress"
                    },
                    LDAP_DOMAIN: {
                        value: ""
                    },
                    LDAP_AUTH_SEARCH_BASE: {
                        value: ""
                    },
                    LDAP_AUTH_ACTIVE_DIRECTORY_DOMAIN: {
                        value: ""
                    }
                },
                bindUser: {
                    // Bind User
                    LDAP_AUTH_CONNECTION_USER_DN: {
                        value: ""
                    },
                    LDAP_AUTH_CONNECTION_PASSWORD: {
                        value: ""
                    }
                },
                connection: {
                    // Connection Parameters
                    LDAP_AUTH_CONNECT_TIMEOUT: {
                        value: 5
                    },
                    LDAP_AUTH_RECEIVE_TIMEOUT: {
                        value: 5
                    },
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
                },
                filters: {
                    ADMIN_GROUP_TO_SEARCH:{ 
                        value: "",
                    },
                    LDAP_AUTH_OBJECT_CLASS:{ 
                        value: "",
                    },
                    EXCLUDE_COMPUTER_ACCOUNTS:{ 
                        value: "",
                    },
                    LDAP_AUTH_USER_FIELDS:{ 
                        value: "",
                    },
                    LDAP_AUTH_USER_LOOKUP_FIELDS:{ 
                        value: ""
                    },
                }
            }
        }
    },
    methods:{
        logConfig(){
            console.log(this.config)
        },
        addServer(item){
            if (this.$refs.settingsForm.validate('serverInput'))
                this.addToArray(item.add, item.value)
            item.add = ""
        },
        removeServer(value, item){
            this.$refs.settingsForm.resetValidation('serverInput')
            item.value = this.removeFromArray(value, item.value)
        },
        removeFromArray(value, array){
            // Returns array without value
            if (array.includes(value) && Array.isArray(array)){
                array = array.filter(function(item) {
                    return item !== value
                });
            }
            return array
        },
        addToArray(value, array){
            if (!array.includes(value) && array && value)
                array = array.push(value);
            return array
        }
    }
}
</script>

<style>
.elevation-n1 {
  box-shadow:
    inset 0 2px 1px -1px rgba(0, 0, 0, 0.2),
    inset 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    inset 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
}
</style>