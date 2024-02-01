<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserSettings.vue ---------------------------->
<template>
    <v-card :loading="loading" class="pa-0 ma-0">
        <v-card-title class="ma-0 pa-0 card-title">
            <v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
                <h3 class="pa-0 ma-0 ma-2">
                    {{ $t("userAccountDropdown.title_long") }}
                </h3>
                <v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
                <v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
                    <v-icon>
                        mdi-close
                    </v-icon>
                </v-btn>
            </v-row>
        </v-card-title>

        <div v-if="!showQR">
            <v-row cols="12" class="ma-0 pa-0 mt-2" justify="center">
                <h3>
                    {{ $t("ldap.attributes.username") }}
                </h3>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                {{ username }}
            </v-row>

            <v-row class="ma-0 pa-0" justify="center">
                <v-col cols="6" sm="10" md="8">
                    <v-divider/>
                </v-col>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                <h4>
                    {{ $t("ldap.attributes.name") }}
                </h4>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                {{ firstName + " " + lastName }}
            </v-row>

            <v-row class="ma-0 pa-0" justify="center">
                <v-col cols="6" sm="10" md="8">
                    <v-divider/>
                </v-col>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                <h4>
                    {{ $t("ldap.attributes.domain") }}
                </h4>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                {{ domain }}
            </v-row>

            <v-row class="ma-0 pa-0" justify="center">
                <v-col cols="6" sm="10" md="8">
                    <v-divider/>
                </v-col>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                <h4>
                    {{ $t("userAccountDropdown.auto_refresh_token") }}
                </h4>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                <v-checkbox class="ma-0 pa-0"
                    v-model="auto_refresh_token"
                    hide-details
                    :disabled="art_input_disabled"
                    @change="toggleAutoRefresh"
                    :label="`${$t('userAccountDropdown.auto_refresh_token')} ${auto_refresh_token ? $t('words.enabled') : $t('words.disabled')}`"/>
            </v-row>

            <v-row class="ma-0 pa-0" justify="center">
                <v-col cols="6" sm="10" md="8">
                    <v-divider/>
                </v-col>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                <h4>
                    {{ $t("ldap.attributes.realm") }}
                </h4>
            </v-row>

            <v-row cols="12" class="ma-0 pa-0" justify="center">
                {{ realm }}
            </v-row>
        </div>
        <div v-else>
            <v-row cols="12" class="ma-0 pa-0 mt-2" justify="center">
                <v-alert type="info" class="ma-0 pa-0 px-6 py-4">
                    {{ $t("userAccountDropdown.qrInfo") }}
                    <ul>
                        <li v-for="app, k in auth_apps" :key="k"
                        style="text-align:start;">
                            <a :href="app.link" class="text-secondary"
                                target="_blank" rel="noopener noreferrer">
                                {{ app.name }}
                                <v-icon small class="ml-2">
                                    mdi-open-in-new
                                </v-icon>
                            </a>
                        </li>
                    </ul>
                </v-alert>
            </v-row>
        </div>

        <v-divider class="mx-8 my-5"/>

        <v-row class="ma-0 pa-0" justify="center">
            <v-col cols="12">
                <h3>
                {{ $t('userAccountDropdown.two_factor_title') }}
                </h3>
            </v-col>
            <v-col cols="auto" class="ma-0 pa-0">
                <v-checkbox class="ma-0 pa-0"
                    v-model="two_factor_auth"
                    hide-details
                    @change="toggleTwoFactor"
                    :label="$t('userAccountDropdown.enable_two_factor')"/>
            </v-col>
            <v-col cols="12" class="ma-0 pa-0 my-2">
                <v-btn small color="primary" outlined
                v-if="!noTotp"
                :disabled="!totp_uri || totp_uri.length < 1"
                @click="showQR = !showQR">
                    {{ !showQR ? $t("userAccountDropdown.showQR") : $t("userAccountDropdown.hideQR")}}
                </v-btn>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0" v-if="hasTotp && !this.totp_confirmed"
            justify="center">
                <v-alert class="mt-1 mx-10" type="warning" dense border="top" icon="mdi-alert-box">
                    {{ $t("userAccountDropdown.TOTPnotConfirmed") }}
                </v-alert>
            </v-col>
            <v-form @submit.prevent style="width: 100%;"
                class="ma-0 pa-0" ref="TOTPForm" v-if="showValidator && showQR">
            <v-row class="ma-0 pa-0" justify="center" align="center">
                <v-col cols="auto" class="ma-0 pa-0 mb-2">
                    <v-text-field 
                        v-model="totp_code"
                        :label="$t('userAccountDropdown.totpCodeFieldLabel')"
                        :disabled="noTotp"
                        @keypress="isNumber($event)"
                        :rules="[this.fieldRules(totp_code, 'auth_totp', true)]"
                        outlined
                        dense/>
                </v-col>
                <v-col cols="auto" class="ma-0 pa-0 mb-2 mx-2">
                    <v-btn color="primary" outlined
                    class="mb-6"
                    :disabled="noTotp || loading"
                    @click="validateTwoFactor">
                        {{ $t("userAccountDropdown.validateTOTP") }}
                    </v-btn>
                </v-col>
            </v-row>
            </v-form>
            <v-row justify="center" class="ma-0 pa-0">
                <v-col cols="auto" v-if="totp_uri.length > 0 && two_factor_auth && showQR"
                    class="ma-0 pa-0">
                    <v-card class="ma-0 pa-0 pa-2 pb-0" elevation="0"
                    light width="fit-content" :outlined="!isThemeDark($vuetify)">
                        <QrcodeVue class="ma-0 pa-0" :value="totp_uri" :size="225" level="H" />
                    </v-card>
                </v-col>
            </v-row>
            <v-card class="ma-0 pa-0 mx-10" v-if="recovery_codes.length > 0 && !showQR" outlined>
                <v-row
                    class="ma-0 pa-0" 
                    justify="center">
                    <v-col>
                        {{ $t("userAccountDropdown.recoveryCodes").toUpperCase() }}
                    </v-col>
                    <v-col cols="12"
                    v-for="code in recovery_codes"
                    :key="code">
                        {{ code }}
                    </v-col>
                </v-row>
            </v-card>
        </v-row>

        <!-- Actions -->
        <v-card-actions class="card-actions mt-4">
            <v-row class="ma-1 pa-0" align="center" align-content="center" 
            :justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'end'">
                <!-- Save User Changes Button -->
                <v-btn @click="closeDialog" 
                :dark="!isThemeDark($vuetify)"
                :light="isThemeDark($vuetify)"
                class="ma-0 pa-0 pa-4 ma-1" 
                rounded>
                    <v-icon class="mr-1">
                        mdi-close
                    </v-icon>
                    {{ $t("actions.close") }}
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import TOTPDevice from '@/include/TOTP.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import { notificationBus } from '@/main.js'

export default {
    name: 'UserSettings',
    components: {
      QrcodeVue
    },
    mixins: [ utilsMixin, validationMixin ],
    data(){
        return {
            auto_refresh_token: false,
            art_input_disabled: false,
            loading: false,
            error: false,
            message: "",
            showValidator: false,
            preferDarkMode: false,
            two_factor_auth: false,
            totp_uri: "",
            totp_code: "",
            recovery_codes: [],
            totp_confirmed: false,
            showQR: false,
            auth_apps:{
                "freeotp":{
                    link: "https://play.google.com/store/apps/details?id=org.liberty.android.freeotpplus",
                    name: "FreeOTP+"
                },
                "google":{
                    link: "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2",
                    name: "Google Authenticator"
                },
                "authy":{
                    link: "https://authy.com/download/",
                    name: "Authy"
                },
            }
        }
    },
    props: {
        username: String,
        firstName: String,
        lastName: String,
        domain: String,
        realm: String,
        adminMode: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.loadSettings()
    },
    computed: {
        noTotp(){
            return (!this.totp_uri || this.totp_uri.length < 1)
        },
        hasTotp(){
            if (this.totp_uri)
                return this.totp_uri.length > 0
            return false
        },
    },
    methods: {
        toggleAutoRefresh(){
            this.art_input_disabled = true
            let v = localStorage.getItem('auto_refresh_token') == 'true'
            localStorage.setItem('auto_refresh_token', !v)
            this.art_input_disabled = false
        },
        closeDialog(){
            this.$emit("close")
        },
        async loadSettings(){
            this.auto_refresh_token = localStorage.getItem('auto_refresh_token') == 'true'
            this.loading = true
            this.recovery_codes = []
            this.setTotp()
            this.preferDarkMode = this.isThemeDark(this.$vuetify)
            await new TOTPDevice({}).list()
            .then(response => {
                this.setTotp(response)
                if (response.recovery_codes)
                    this.recovery_codes = response.recovery_codes
                this.loading = false
                this.error = false
            })
            .catch(e => {
                console.error(e)
                this.loading = false
                this.error = true
            })
        },
        setTotp(r=undefined){
            if (r)
                if (r.totp_uri) {
                    this.totp_uri = r.totp_uri
                    if ('totp_confirmed' in r)
                        this.totp_confirmed = r.totp_confirmed[0]
                    this.totp_code = ""
                    this.two_factor_auth = true
                    if (this.hasTotp && this.totp_confirmed != true)
                        this.showValidator = true
                    this.$forceUpdate()
                    return
                }
            this.totp_uri = ""
            this.totp_confirmed = false
            this.totp_code = ""
            this.two_factor_auth = false
            this.showValidator = false
            this.showQR = false
            this.loading = false
            this.error = false
            this.message = ""
            if (this.$refs.TOTPForm)
                this.$refs.TOTPForm.resetValidation()
            this.$forceUpdate()
        },
        async toggleTwoFactor(){
            this.loading = true
            if (this.two_factor_auth == true)
                await new TOTPDevice({}).create()
                .then(response => {
                    this.setTotp(response)
                    this.loadSettings()
                    this.showValidator = true
                    this.showQR = true
                    this.loading = false
                    this.error = false
                    this.message = this.$t("userAccountDropdown.totpCreated")
                    notificationBus.$emit('createNotification', 
                        {
                            message: this.message,
                            type: 'success'
                        }
                    );
                })
                .catch(e => {
                    console.error(e)
                    this.loading = false
                    this.error = true
                    this.message = this.getMessageForCode(e)
                    notificationBus.$emit('createNotification', 
                        {
                            message: this.message, 
                            type: 'error'
                        }
                    );
                })
            else
                await new TOTPDevice({}).delete()
                .then(() => {
                    this.setTotp()
                    this.loadSettings()
                    this.showValidator = false
                    this.showQR = false
                    this.loading = false
                    this.error = false
                    this.message = this.$t("userAccountDropdown.totpDeleted")
                    notificationBus.$emit('createNotification', 
                        {
                            message: this.message,
                            type: 'info'
                        }
                    );
                })
                .catch(e => {
                    console.error(e)
                    this.setTotp()
                    this.loading = false
                    this.error = true
                    this.message = this.getMessageForCode(e)
                    notificationBus.$emit('createNotification', 
                        {
                            message: this.message, 
                            type: 'error'
                        }
                    );
                })
        },
        async validateTwoFactor(){
            if (!this.$refs.TOTPForm.validate())
                return
            const data = {
                totp_code: this.totp_code
            }
            await new TOTPDevice({}).validate(data)
            .then(() => {
                this.loading = false
                this.error = false
                this.showQR = false
                this.showValidator = false
                this.totp_confirmed = true
                this.message = this.$t("userAccountDropdown.totpValidated")
                notificationBus.$emit('createNotification', 
                    {
                        message: this.message,
                        type: 'success'
                    }
                );
            })
            .catch(e => {
                console.error(e)
                this.loading = false
                this.error = true
                this.message = this.getMessageForCode(e)
                notificationBus.$emit('createNotification', 
                    {
                        message: this.message, 
                        type: 'error'
                    }
                );
            })
        }
    }
}
</script>
