<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: UserResetPassword.vue ------------------------>
<template>
    <v-card>
        <v-progress-linear :color="error == true ? 'red' : 'primary'" :indeterminate="loading"/>
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                    {{ $t('section.users.resetPasswordDialog.title') }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <v-card-text class="pa-0 ma-0">
            <v-form ref="userResetPasswordForm" @submit.prevent>
                <v-row class="pa-0 ma-0 mt-8 mb-4 text-uppercase font-weight-normal" style="font-size: medium !important;" justify="center">
                    {{ $t('section.users.resetPasswordDialog.changePasswordForUser') + " " }}
                </v-row>
                <v-row class="pa-0 ma-0 mt-4 mb-5 text-uppercase font-weight-bold" style="font-size: large !important;" justify="center">
                    {{ userObject.givenName && userObject.sn ? userObject.givenName + " " + userObject.sn + " (" + userObject.username + ")" : userObject.username }}
                </v-row>
                <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                    <v-col cols="10" lg="4">
                        <v-text-field
                        :type="passwordHidden ? 'password' : 'text'"
                        required
                        :append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append="() => (passwordHidden = !passwordHidden)"
                        dense
                        @keydown.enter="closeDialog(true, user)"
                        :label="$t('ldap.attributes.password')"
                        v-model="user.password"
                        :rules="[this.fieldRules(user.password, 'ge_password', true)]"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="10" lg="4">
                            <v-text-field
                            :type="passwordHidden ? 'password' : 'text'"
                            dense
                            @keydown.enter="closeDialog(true, user)"
                            :label="$t('ldap.attributes.passwordConfirm')"
                            v-model="user.passwordConfirm"
                            :rules="[user.passwordConfirm == user.password ? true : this.$t('error.validation.passwordNotSame') ]"
                            ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
            <v-row class="ma-0 pa-0 pt-4 pb-4">
                <v-col cols="12" class="ma-0 pa-0 pb-3">
                    <h3>
                        {{ $t('section.users.resetPasswordDialog.complexity.title') }}
                    </h3>
                </v-col>
                <v-col cols="12" class="ma-0 pa-0">
                    <ul>
                        <li>
                            {{ $t('section.users.resetPasswordDialog.complexity.letters') }}
                        </li>
                        <li>
                            {{ $t('section.users.resetPasswordDialog.complexity.numbers') }}
                        </li>
                        <li>
                            {{ $t('section.users.resetPasswordDialog.complexity.symbols') }}
                        </li>
                        <li>
                            {{ $t('section.users.resetPasswordDialog.complexity.dontMatchUser') }}
                        </li>
                    </ul>
                </v-col>
            </v-row>
        </v-card-text>
        <!-- Actions -->
        <v-card-actions class="card-actions">
            <v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
                <v-btn @click="closeDialog(true, user)"
                class="ma-0 pa-0 pa-2 ma-1" color="primary"
                rounded>
                    <v-icon class="mr-2" color="white">
                        mdi-account-key
                    </v-icon>
                    <span class="pr-1 text-white">
                        {{ $t("actions.changePassword" )}}
                    </span>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js'
import User from '@/include/User.js'

export default {
    name: "UserResetPassword",
    mixins: [
        validationMixin,
        utilsMixin
    ],
    data () {
      return {
        passwordHidden: true,
        loading: false,
        error: false,
        errorMsg: "",
        user: {
            "password":"",
            "passwordConfirm":"",
        }
      }
    },
    props: {
        userObject: Object,
        isEndUser: {
            type: Boolean,
            default: false
        },
        viewKey: String
    },
    created() {
    },
    methods: {
        clearUser(){
            this.loading = false
            this.error = false
            this.errorMsg = false
            this.user = {
                "password":"",
                "passwordConfirm":"",
            }
            this.$refs.userResetPasswordForm.resetValidation()
        },
        async closeDialog(resetConfirm=false, user={}) {
            if(resetConfirm != true)
                this.$emit('closeDialog', this.viewKey);
            if (this.isEndUser === true) {
                if (resetConfirm == true && this.$refs.userResetPasswordForm.validate()) {
                    this.loading = true
                    await new User({}).changePasswordSelf(user)
                    .then(response => {
                        setTimeout(() => {
                            this.loading = false
                        }, 100)
                        this.error = false
                        this.errorMsg = ""
                        if (response.data.username == user.username)
                            notificationBus.$emit('createNotification', {
                                message: this.$t('section.logs.extras.changed_password'),
                                type: "success"
                            });
                        this.$emit('closeDialog', this.viewKey);
                    })
                    .catch(error => {
                        setTimeout(() => {
                            this.loading = false
                        }, 100)
                        this.error = true
                        this.errorMsg = this.getMessageForCode(error).toUpperCase()
                        notificationBus.$emit('createNotification', {
                            message: this.errorMsg,
                            type: "error"
                        });
                    })
                }
            }
            else {
                user.distinguishedName = this.userObject.distinguishedName
                user.username = this.userObject.username
                if (resetConfirm == true && this.$refs.userResetPasswordForm.validate()) {
                    this.loading = true
                    await new User({}).changePassword(user)
                    .then(response => {
                        setTimeout(() => {
                            this.loading = false
                        }, 100)
                        this.error = false
                        this.errorMsg = ""
                        if (response.data.username == user.username)
                            notificationBus.$emit('createNotification', {
                                message: this.$t('section.logs.extras.changed_password'),
                                type: "success"
                            });
                        this.$emit('closeDialog', this.viewKey, true);
                    })
                    .catch(error => {
                        setTimeout(() => {
                            this.loading = false
                        }, 100)
                        this.error = true
                        this.errorMsg = this.getResponseErrorCode(error)
                        if (this.errorMsg.toLowerCase() == "unwillingtoperform")
                            this.errorMsg = this.getMessageForCode(this.errorMsg + "Pwd").toUpperCase()
                        else
                            this.errorMsg = this.getMessageForCode(this.errorMsg).toUpperCase()
                        notificationBus.$emit('createNotification', {
                            message: this.errorMsg,
                            type: "error"
                        });
                    })
                }
            }
        },
    }
}
</script>