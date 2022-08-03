<template>
    <v-card>
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
            <v-form ref="userResetPasswordForm">
                <v-row class="pa-0 ma-0 mt-8 mb-4 text-uppercase font-weight-normal text-inverted" style="font-size: medium !important;" justify="center">
                    {{ $t('section.users.resetPasswordDialog.changePasswordForUser') + " " }}
                </v-row>
                <v-row class="pa-0 ma-0 mt-4 mb-5 text-uppercase font-weight-bold text-inverted" style="font-size: large !important;" justify="center">
                    {{ userObject.givenName && userObject.sn ? userObject.givenName + " " + userObject.sn + " (" + userObject.username + ")" : userObject.username }}
                </v-row>
                <v-row justify="center" class="pa-0 ma-0 font-weight-medium">
                    <v-col cols="12" lg="4">
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
                    <v-col cols="12" lg="4">
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
import validationMixin from '@/plugins/mixin/validationMixin';
import User from '@/include/User'

export default {
    name: "confirmDialog",
    mixins: [
        validationMixin
    ],
    data () {
      return {
        passwordHidden: true,
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
            this.user = {
                "password":"",
                "passwordConfirm":"",
            }
            this.$refs.userResetPasswordForm.resetValidation()
        },
        async closeDialog(resetConfirm=false, user={}) {
            if(resetConfirm != true)
                this.$emit('closeDialog', this.viewKey);

            user.distinguishedName = this.userObject.distinguishedName
            user.username = this.userObject.username
            console.log(this.isEndUser)
            if (this.isEndUser === true) {
                if (resetConfirm == true && this.$refs.userResetPasswordForm.validate()) {
                    await new User({}).changePasswordSelf(user)
                    .then(response => {
                        if (response.data.username == user.username)
                            console.log("User Password Changed Successfully")
                        this.$emit('closeDialog', this.viewKey);
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
            else {
                if (resetConfirm == true && this.$refs.userResetPasswordForm.validate()) {
                    await new User({}).changePassword(user)
                    .then(response => {
                        if (response.data.username == user.username)
                            console.log("User Password Changed Successfully")
                        this.$emit('closeDialog', this.viewKey);
                    })
                    .catch(error => {
                        console.log(error)
                    })
                }
            }
        },
    }
}
</script>