<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: EnduserView.vue ----------------------------->
<template>
    <div class="enduser">
    <v-row align="center"
      justify="space-between"
      style="background: var(--v-secondary-10-base)"
      class="ma-0 pa-0 px-4 transition-speed-fix">
      <v-img max-width="30ch" max-height="5em" class="my-3" contain :aspect-ratio="32/9" :src="!isThemeDark($vuetify) ? logoLight : logoDark"/>
      <h2 style="color: var(--v-text-background-base)" class="ma-2 my-4 font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row
        :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" align="center"
        class="ma-0 pa-2 transition-speed-fix"
        style="background: var(--v-secondary-10-base); height: fit-content;">
        <v-col cols="12" md="auto">
            <LanguageSelector :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" class=""/>
        </v-col>
        <v-divider style="border-color: var(--v-primary-base)" class="ma-6" v-if="this.$vuetify.breakpoint.mdAndUp"/>
        <v-col class="ma-0 pa-0 my-3" v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
            <span style="color: var(--v-white-d-base);"
                v-if="last_name && last_name != '' && first_name && first_name != ''">
            {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username }}
            </span>
            <span style="color: var(--v-white-d-base);"
                v-else>
            {{ realm.toUpperCase() + '@' + username }}
            </span>
        </v-col>
        <v-col class="ma-0 pa-0" cols="12" md="auto">
            <div class="mt-2 mr-4">
            <UserAccountDropdown 
                :extraClasses="'mr-3 px-2'"
                icon="mdi-account-cog"
                color="primary"
                @logout="logoutAction"
                @openSettings="openSettings"
                :username="activeUserName"/>
            <ThemeChanger :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" :buttonIsSmall="true"/>
            </div>
        </v-col>
        </v-row>

        <v-container>
            <v-card>
                <v-progress-linear :color="error ? 'red':'primary'" :indeterminate="loading"/>
                <v-card-title>
                    <v-row justify="center" class="pa-0 ma-0 text-uppercase">
                        {{ first_name.length > 0 && last_name.length > 0 ? $t('section.enduser.title') + " " + first_name + " " + last_name : $t('section.enduser.title') + ' ' + username }}
                    </v-row>
                </v-card-title>

                <v-row justify="center" class="pa-0 ma-0">
                    <v-alert type="info" dismissible close-icon="mdi-close"
                    @input="disableEnduserHelpMessage()" v-if="showEnduserHelpMessage">
                        {{ $t("section.enduser.helpMessage") }}
                    </v-alert>
                </v-row>

                <v-form ref="endUserForm" @submit.prevent>
                <!-- Details Row -->
                <v-row align-content="center" class="ma-2 mt-0">
                    <!-- User Basic Data Panel -->
                    <v-col class="ma-0 pa-0" cols="12" md="6">
                        <v-card outlined height="100%" class="ma-1 pa-4">
                            <v-row :justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'start'" 
                            class="pa-0 ma-0 text-h6 mx-3 mb-5">
                                {{ $t('section.users.basicDetails') }}
                            </v-row>
                            <v-row class="pa-0 ma-0 font-weight-medium">
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="givenName"
                                    :label="$t('attribute.ldap.givenName')"
                                    v-model="usercopy.givenName"
                                    :rules="[this.fieldRules(usercopy.givenName, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="sn"
                                    :label="$t('attribute.ldap.sn')"
                                    v-model="usercopy.sn"
                                    :rules="[this.fieldRules(usercopy.sn, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="username"
                                    :label="$t('attribute.user.username')"
                                    v-model="usercopy.username"
                                    :hint="$t('words.readOnly')"
                                    readonly
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="mail"
                                    :label="$t('attribute.user.email')"
                                    v-model="usercopy.mail"
                                    :rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                    {{ $t('attribute.ldap.last_login') + ": " + user.last_login }}
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="telephoneNumber"
                                    :label="$t('attribute.ldap.telephoneNumber')"
                                    v-model="usercopy.telephoneNumber"
                                    :rules="[this.fieldRules(usercopy.telephoneNumber, 'ge_phone_intl')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="wWWHomePage"
                                    :label="$t('attribute.ldap.wWWHomePage')"
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
                                        :label="$t('attribute.ldap.streetAddress')"
                                        v-model="usercopy.streetAddress"
                                        :rules="[this.fieldRules(usercopy.streetAddress, 'ge_address_street')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="postalCode"
                                        :label="$t('attribute.ldap.postalCode')"
                                        v-model="usercopy.postalCode"
                                        :rules="[this.fieldRules(usercopy.postalCode, 'ge_address_postal_code')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" 
                                    :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        id="l"
                                        :label="$t('attribute.ldap.l')"
                                        v-model="usercopy.l"
                                        :rules="[this.fieldRules(usercopy.l, 'ge_address_city')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-card v-ripple outlined class="pa-1 py-2">
                                            <div v-if="user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0">
                                                {{ $t('attribute.ldap.countryCodeCombined') }}
                                                <div elevation="0">
                                                {{ user.countryCode }}
                                                {{ "(" + user.c + ")" }}
                                                </div>
                                            </div>
                                            <div v-else>
                                                {{ $t('attribute.ldap.countryCodeCombined') }}
                                                <div>
                                                {{ $t('error.data.noCountryCode') }}
                                                </div>
                                            </div>
                                        </v-card>
                                    </v-col>
                                    <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                        {{ $t('attribute.ldap.last_login') + ": " + user.last_login }}
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="st"
                                        :label="$t('attribute.ldap.st')"
                                        v-model="usercopy.st"
                                        :rules="[this.fieldRules(usercopy.st, 'ge_state')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-autocomplete
                                        dense
                                        id="co"
                                        :label="$t('attribute.ldap.co')"
                                        v-model="usercopy.co"
                                        :items="getCountryList()"
                                        :rules="[this.fieldRules(usercopy.co, 'ge_country')]">
                                        </v-autocomplete>
                                    </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
                <!-- Advanced Details Row -->
                <v-row class="ma-2">
                    <v-expansion-panels flat class="ma-1">
                        <v-expansion-panel class="outlined">
                            <v-expansion-panel-header class="font-weight-medium">
                                {{ $t("section.users.advancedDetails") + " (" + $t("words.readOnly") + ")" }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-row>
                                    <v-col cols="12" lg="8">
                                        <v-text-field
                                        dense
                                        id="distinguishedName"
                                        :label="$t('attribute.ldap.distinguishedName')"
                                        readonly
                                        v-model="usercopy.distinguishedName"
                                        :rules="[this.fieldRules(usercopy.distinguishedName, 'ldap_dn')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        id="userPrincipalName"
                                        :label="$t('attribute.ldap.userPrincipalName')"
                                        readonly
                                        v-model="getUSN"
                                        :rules="[this.fieldRules(usercopy.userPrincipalName, 'ldap_usn')]"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="whenCreated"
                                        :label="$t('attribute.ldap.whenCreated')"
                                        readonly
                                        v-model="usercopy.whenCreated"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="whenChanged"
                                        :label="$t('attribute.ldap.whenChanged')"
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
                                        :label="$t('attribute.ldap.lastLogon')"
                                        readonly
                                        v-model="usercopy.lastLogon"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="pwdLastSet"
                                        :label="$t('attribute.ldap.pwdLastSet')"
                                        readonly
                                        v-model="usercopy.pwdLastSet"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-row>
                </v-form>

                <v-card-actions>
                    <v-row justify="center" class="pa-0 ma-0" align="center">
                        <!-- Reset Password Button -->
                        <v-btn color="primary" @click="openDialog('userResetPassword')"
                        :disabled="!user.can_change_pwd"
                        class="ma-0 pa-0 pa-4 ma-1" 
                        rounded>
                            <v-icon class="mr-1">
                                mdi-key-variant
                            </v-icon>
                            {{ $t("actions.changeEnduserPassword") }}
                        </v-btn>
                        <!-- Save User Changes Button -->
                        <v-btn @click="saveUser"
                        :dark="!isThemeDark($vuetify)"
                        :light="isThemeDark($vuetify)"
                        class="ma-0 pa-0 pa-4 ma-1" 
                        rounded>
                            <v-icon class="mr-1">
                                mdi-content-save
                            </v-icon>
                            {{ $t("actions.save") }}
                        </v-btn>
                        <!-- Refresh User Button -->
                        <refresh-button dense
                            :loading="loading"
                            @refresh="refreshUser"/>
                    </v-row>
                </v-card-actions>
            </v-card>
        </v-container>
        
        <!-- SNACKBAR / NOTIF. BUS -->
        <NotificationBusContainer/>

        <!-- USER RESET PASSWORD DIALOG -->
        <v-dialog eager max-width="800px" v-model="dialogs['userResetPassword']">
            <UserResetPassword
            :userObject="this.user"
            :dialogKey="'userResetPassword'"
            ref="UserResetPassword"
            :isEndUser="true"
            @closeDialog="closeDialog"
            />
        </v-dialog>

        <!-- LOGOUT DIALOG  -->
        <v-dialog
            persistent
            content-class=""
            max-width="40rem"
            v-model="showLogoutDialog">
            <LogoutDialog @logoutAction="logoutAction()"/>
        </v-dialog>

        <!-- REFRESH TOKEN DIALOG  -->
        <v-dialog
        persistent
        eager
        content-class=""
        max-width="40rem"
        v-model="showRefreshTokenDialog">
            <RefreshTokenDialog 
            ref="RefreshTokenDialog"
            :countdown="showRefreshTokenDialog" 
            @closeDialog="closeRefreshDialog"
            @logoutAction="logoutAction()"/>
        </v-dialog>
    </div>
</template>

<script>
import User from '@/include/User.js'
import Domain from '@/include/Domain.js'
import UserResetPassword from '@/components/User/UserResetPassword.vue'
import UserAccountDropdown from '@/components/User/UserAccountDropdown.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'
import LogoutDialog from '@/components/LogoutDialog.vue'
import RefreshTokenDialog from "@/components/RefreshTokenDialog.vue"
import RefreshButton from '@/components/RefreshButton.vue'
import NotificationBusContainer from '@/components/NotificationBusContainer.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import { getDomainDetails } from '@/include/utils.js';

export default {
    name: 'EnduserView',
    mixins: [ validationMixin, utilsMixin ],
    components: {
        LanguageSelector,
        UserResetPassword,
        UserAccountDropdown,
        NotificationBusContainer,
        RefreshTokenDialog,
        RefreshButton,
        LogoutDialog,
        ThemeChanger
    },
    data() {
        return {
            logoLight: 'logo/interlock-logo-wt-dark.svg',
            logoDark: 'logo/interlock-logo-wt-light.svg',
            // Dialog States
            dialogs: {
                userResetPassword: false,
            },
            loading: false,
            error: false,
            username: "",
            first_name: "",
            last_name: "",
            email: "",
            user: {},
            usercopy: {},
            domain: "",
            realm: "",
            basedn: "",
            showLogoutDialog: false,
            showRefreshTokenDialog: false,
            timeoutId: 0,
        }
    },
    async created() {
        this.user = new User({})
        this.user.selfInfo().then(response => {
            let responseStatus = response.status
            let admin_allowed = (localStorage.getItem('user.admin_allowed') === 'true')
            response = response.data

            // If response code is valid
            if (/^20[0-8]|226/.test(responseStatus)) {
                this.username = localStorage.getItem('user.username')
                this.first_name = localStorage.getItem('user.first_name')
                this.last_name = localStorage.getItem('user.last_name')
                this.email = localStorage.getItem('user.email')
                this.refreshTokenExpiryData()

                new Domain({}).getDetails().then(() => {
                    let domainData = getDomainDetails()
                    this.domain = domainData['name']
                    this.realm = domainData['realm']
                    this.basedn = domainData['basedn']
                })
            }
            // If response code is an HTTP error code
            else {
                this.logoutAction()
                this.showLogoutDialog = true;
            }

            if (admin_allowed == true)
                this.$router.push("/home");
        })
        this.setupTimers()
    },
    async mounted () {
        this.loading = true
        this.refreshUser()
    },
    computed: {
        getUSN(){
            return `${this.user.username}@${this.domain}`
        },
        activeUserName() {
            if(	this.last_name && this.last_name.length > 0 &&
                this.first_name && this.first_name.length > 0)
                return this.last_name + ", " + this.first_name + " | " + this.username
                // return this.last_name + ", " + this.first_name + " | " + this.realm.toUpperCase() + "@" + this.username
            return this.realm.toUpperCase() + "@" + this.username
        },
        showEnduserHelpMessage() {
            return (localStorage.getItem('user.tips.enduserHelp') === 'true')
        }
    },
    methods: {
        getModifiedValues(){
            let v = []
            const IGNORE_KEYS = [
                'lastLogon'
            ]
            for (const key in this.user) {
                if (IGNORE_KEYS.includes(key)) continue
                if (!(key in this.user) ||
                    !(key in this.usercopy)) {
                    continue
                }
                if (Array.isArray(this.user[key])) {
                    // Compare Values for Partial Update
                    let orig_list = structuredClone(this.user[key])
                    orig_list.sort()
                    this.usercopy[key].sort()
                    if (JSON.stringify(orig_list) !== JSON.stringify(this.usercopy[key]))
                        v.push(key)
                }
                else if (this.usercopy[key] != this.user[key]) {
                    v.push(key)
                }
            }
            return v
        },
        getIsUserModified(){
            // Check the rest of the user data.
            if (this.getModifiedValues().length > 0) return true
            return false
        },
        disableEnduserHelpMessage(){
            localStorage.setItem('user.tips.enduserHelp', false)
        },
        openSettings(){
            this.showSettingsDialog = true
            if (this.$refs.UserSettings)
                this.$refs.UserSettings.loadSettings()
        },
        async saveUser(){
            if (!this.getIsUserModified()) {
                console.log("User was not modified, ignoring request.")
                return
            }
            this.loading = true
            let modifiedValues = this.getModifiedValues()
            let partialUpdateData = {}
            modifiedValues.forEach(k => {
                partialUpdateData[k] = this.usercopy[k]
            })
            if (this.$refs.endUserForm.validate()){
                await new User({}).selfUpdate(partialUpdateData)
                .then(() => {
                    this.refreshUser();
                    this.loading = false
                    this.loadingColor = 'primary'
                })
                .catch(error => {
                    console.error(error)
                    this.userRefreshLoading = false;
                    this.loading = false
                    this.loadingColor = 'error'
                    this.error = true;
                })
            } else {
                this.loading = false
            }
        },
        openDialog(key){
            this.dialogs[key] = true;
            switch (key) {
                default:
                break;
            }
        },
        async closeDialog(key){
            this.dialogs[key] = false;
            if (key == 'userResetPassword')
                this.showLogoutDialog = true
        },
        closeRefreshDialog(){
            this.showRefreshTokenDialog = false
            this.resetTimer()
        },
        refreshTokenExpiryData(){
            this.access_expire = parseInt(localStorage.getItem("auth.access_expire"));
            this.refresh_expire = parseInt(localStorage.getItem("auth.refresh_expire"));
        },
        // Sync the usercopy object to the parent view user object on the
        // next tick to avoid mutation errors
        syncUser(){
            this.setDomainDetails()
            this.usercopy = new User({})
            this.$nextTick(() => { this.usercopy = Object.assign({}, this.user) })
        },
        async refreshUser(){
            this.loading = true
            this.error = false
            await this.user.selfFetch().then(() => {
                this.syncUser()
                setTimeout(() => {
                    this.loading = false
                }, 50)
            })
            .catch(error => {
                console.error(error)
                this.loading = false
                this.error = true
            })
        },
        async setDomainDetails(){
            let domainData = getDomainDetails()
            if (!domainData.domain || !domainData.realm) {
                await new Domain({}).getDetails().then(() => {
                    domainData = getDomainDetails()
                    this.domain = domainData['name']
                    this.realm = domainData['realm']
                    this.basedn = domainData['basedn']
                })
            }
        },
        ////////////////////////////////////////////////////////////////////////
        // Logout Actions
        ////////////////////////////////////////////////////////////////////////
        async logoutAction() {
            await new User({}).logout()
            .then(() => {
                localStorage.setItem("auth.logoutMessage", true);
                this.$router.push("/login");
            })
            .catch(e => {
                console.error(e)
            });
        },
        ////////////////////////////////////////////////////////////////////////
        // Refresh Token Timers
        // What happens when the timer stops
        ////////////////////////////////////////////////////////////////////////
        async handleInactive() {
            // ! Dates in EPOCH - Milliseconds
            const accessClockLimit = this.access_expire;
            const refreshClockLimit = this.refresh_expire;
            const clockDifference = refreshClockLimit - accessClockLimit;
            if (Date.now() >= accessClockLimit && Date.now() < refreshClockLimit) {
                if (localStorage.getItem('auth.auto_refresh_token') == 'true') {
                    await new User({}).selfInfo()
                    .then(() => { this.resetTimer() })
                    .catch((error) => { console.error(error) })
                } else if (!this.showRefreshTokenDialog) {
                this.timeoutId = setTimeout(this.handleInactive, clockDifference)
                this.showRefreshTokenDialog = true
                if (this.$refs.RefreshTokenDialog != undefined)
                    this.$refs.RefreshTokenDialog.startCountdown()
                }
            } else if (Date.now() >= refreshClockLimit) {
                this.showLogoutDialog = true
                this.showRefreshTokenDialog = false
            }
            else {
                this.resetTimer()
            }
        },
        startTimer() {
            this.refreshTokenExpiryData()
            const refreshClock = Date.parse(localStorage.getItem("auth.refreshClock"));
            const accessClockLimit = this.access_expire;
            const clockDifference = accessClockLimit - refreshClock;
            // setTimeout returns an ID (can be used to start or clear a timer)
            this.timeoutId = setTimeout(this.handleInactive, clockDifference);
        },
        resetTimer() { 
            clearTimeout(this.timeoutId);
            this.startTimer();
        },
        setupTimers () {
            this.startTimer();
        }
    },
}
</script>

<style scoped>
.outlined {
    border: thin solid var(--border-d-base);
}
</style>