<template>
    <v-card class="pa-6">
        <v-expand-transition>
        <div v-show="!refreshLoading">
        <!-- Title Bar -->
        <v-card-title class="ma-0 pa-0">
            <v-row class="ma-0 pa-0" align="center" justify="space-between">
                <h3 v-if="!usercopy.givenName || usercopy.givenName == '' || !usercopy.sn || usercopy.sn == ''" class="pa-0 ma-0 ma-2">
                    {{ usercopy.username ? usercopy.username.toUpperCase() : '' }}
                </h3>
                <h3 v-else class="pa-0 ma-0 ma-2">
                    {{ usercopy.givenName + " " + usercopy.sn }}
                </h3>
                <v-divider class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <!-- Body -->
        <v-card-text class="my-3 py-4">
            <v-row align="center">
            <!-- User Basic Data Panel -->
            <v-col cols="12" md="6">
                <v-row class="font-weight-medium">
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.givenName')"
                            :readonly="editFlag"
                            v-model="usercopy.givenName"
                            :rules="[this.fieldRules(usercopy.givenName, 'ge_name')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.sn')"
                            :readonly="editFlag"
                            v-model="usercopy.sn"
                            :rules="[this.fieldRules(usercopy.sn, 'ge_name')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.mail')"
                            :readonly="editFlag"
                            v-model="usercopy.mail"
                            :rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-fade-transition>
                                <v-card v-if="user.is_enabled != undefined" v-ripple outlined class="pa-1 py-2">
                                    <span :class="user.is_enabled ? 'clr-valid' : 'clr-error'">
                                        {{ user.is_enabled ? $t('section.users.attributes.is_enabled') : $t('section.users.attributes.is_disabled') }}
                                    </span>
                                    <div elevation="0" v-if="user.is_enabled">
                                    <v-icon class="clr-valid">
                                        mdi-check
                                    </v-icon>
                                    </div>
                                    <div elevation="0" icon rounded v-else>
                                    <v-icon class="clr-error">
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
                            :readonly="editFlag"
                            v-model="usercopy.telephoneNumber"
                            :rules="[this.fieldRules(usercopy.telephoneNumber, 'ge_phone')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.wWWHomePage')"
                            :readonly="editFlag"
                            v-model="usercopy.wWWHomePage"
                            :rules="[this.fieldRules(usercopy.wWWHomePage, 'ge_website')]"
                            ></v-text-field>
                        </v-col>
                </v-row>
            </v-col>
            <!-- Location Panel -->
            <v-col cols="12" md="6">
                <v-row class="font-weight-medium">
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.streetAddress')"
                            :readonly="editFlag"
                            v-model="usercopy.streetAddress"
                            :rules="[this.fieldRules(usercopy.streetAddress, 'ge_name')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.postalCode')"
                            :readonly="editFlag"
                            v-model="usercopy.postalCode"
                            :rules="[this.fieldRules(usercopy.postalCode, 'ge_address_postal_code')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" 
                        :class="this.$vuetify.breakpoint.smAndUp && user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0 ? 'mt-3' : ''">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.l')"
                            :readonly="editFlag"
                            v-model="usercopy.l"
                            :rules="[this.fieldRules(usercopy.l, 'ge_address_city')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6" v-if="user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0">
                            <v-card v-ripple outlined class="pa-1 py-2">
                                {{ $t('section.users.attributes.countryCodeCombined') }}
                                <div elevation="0">
                                {{ user.countryCode }}
                                {{ "(" + user.c + ")" }}
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
                            :readonly="editFlag"
                            v-model="usercopy.st"
                            :rules="[this.fieldRules(usercopy.st, 'ge_state')]"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" lg="6">
                            <v-text-field
                            dense
                            :label="$t('section.users.attributes.co')"
                            :readonly="editFlag"
                            v-model="usercopy.co"
                            :rules="[this.fieldRules(usercopy.co, 'ge_country')]"
                            ></v-text-field>
                        </v-col>
                </v-row>
            </v-col>
            </v-row>
        </v-card-text>
        </div>
        </v-expand-transition>
    
        <!-- Actions -->
        <v-card-actions class="">
            <v-row class="ma-1 pa-0" justify="end">
                <v-btn class="ma-0 pa-0 pa-4 mx-1" rounded :disabled="!editFlag">
                    <v-icon class="mr-1">
                        mdi-content-save
                    </v-icon>
                    {{ $t("actions.save") }}
                </v-btn>
                <v-btn 
                class="mx-2 bg-primary" 
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
    name: 'UserView',
    data () {
      return {
        usercopy: {},
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
    methods: {
        closeDialog(){
            this.$emit('closeDialog', this.viewKey);
        },
        syncUser(){
            this.usercopy = new User({})
            this.$nextTick(() => {
                this.usercopy = this.user
            });
        },
        async refreshUser(){
            this.$emit('refreshUser');
        }
    }
}
</script>
