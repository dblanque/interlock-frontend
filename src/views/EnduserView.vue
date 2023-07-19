<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: EnduserView.vue ----------------------------->
<template>
    <div class="enduser">
    <v-row align="center"
      justify="space-between"
      :class="'ma-0 pa-0 px-4 text-normal transition-speed-fix ' + (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
      <v-img max-width="30ch" max-height="5em" class="my-3" contain :aspect-ratio="32/9" :src="!isThemeDark($vuetify) ? logoLight : logoDark"/>
      <h2 class="ma-2 my-4 font-weight-medium">{{ domain.toUpperCase() }}</h2>
    </v-row>
    <v-row
        :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" align="center"
        :class="'ma-0 pa-2 ' + (isThemeDark($vuetify) ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')"
        style="height: fit-content;">
        <v-col cols="12" md="auto">
            <LanguageSelector :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" class=""/>
        </v-col>
        <v-divider style="border-color: var(--clr-primary)" class="ma-6" v-if="this.$vuetify.breakpoint.mdAndUp"/>
        <v-col class="ma-0 pa-0 my-3" v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
            <span class="text-normal" v-if="last_name && last_name != '' && first_name && first_name != ''">
            {{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username }}
            </span>
            <span class="text-normal" v-else>
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
                    <v-alert type="info" dismissible close-icon="mdi-close">
                        {{ $t("section.enduser.helpMessage") }}
                    </v-alert>
                </v-row>

                <v-form @submit.prevent>
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
                                    :label="$t('ldap.attributes.givenName')"
                                    v-model="user.givenName"
                                    :rules="[this.fieldRules(user.givenName, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="sn"
                                    :label="$t('ldap.attributes.sn')"
                                    v-model="user.sn"
                                    :rules="[this.fieldRules(user.sn, 'ge_name')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="username"
                                    :label="$t('ldap.attributes.username')"
                                    v-model="user.username"
                                    :hint="$t('words.readOnly')"
                                    readonly
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="mail"
                                    :label="$t('ldap.attributes.mail')"
                                    v-model="user.mail"
                                    :rules="[this.fieldRules(user.mail, 'ge_mail')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" v-if="user.last_login != undefined && user.last_login != ''">
                                    {{ $t('ldap.attributes.last_login') + ": " + user.last_login }}
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="telephoneNumber"
                                    :label="$t('ldap.attributes.telephoneNumber')"
                                    v-model="user.telephoneNumber"
                                    :rules="[this.fieldRules(user.telephoneNumber, 'ge_phone')]"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                    <v-text-field
                                    dense
                                    id="wWWHomePage"
                                    :label="$t('ldap.attributes.wWWHomePage')"
                                    v-model="user.wWWHomePage"
                                    :rules="[this.fieldRules(user.wWWHomePage, 'ge_website')]"
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
                                        v-model="user.streetAddress"
                                        :rules="[this.fieldRules(user.streetAddress, 'ge_address_street')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="postalCode"
                                        :label="$t('ldap.attributes.postalCode')"
                                        v-model="user.postalCode"
                                        :rules="[this.fieldRules(user.postalCode, 'ge_address_postal_code')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6" 
                                    :class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
                                        <v-text-field
                                        dense
                                        id="l"
                                        :label="$t('ldap.attributes.l')"
                                        v-model="user.l"
                                        :rules="[this.fieldRules(user.l, 'ge_address_city')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-card v-ripple outlined class="pa-1 py-2">
                                            <div v-if="user.countryCode != undefined && user.countryCode != '' && user.countryCode != 0">
                                                {{ $t('ldap.attributes.countryCodeCombined') }}
                                                <div elevation="0">
                                                {{ user.countryCode }}
                                                {{ "(" + user.c + ")" }}
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
                                        v-model="user.st"
                                        :rules="[this.fieldRules(user.st, 'ge_state')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-autocomplete
                                        dense
                                        id="co"
                                        :label="$t('ldap.attributes.co')"
                                        v-model="user.co"
                                        :items="getCountryList()"
                                        :rules="[this.fieldRules(user.co, 'ge_country')]">
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
                                        :label="$t('ldap.attributes.distinguishedName')"
                                        readonly
                                        v-model="user.distinguishedName"
                                        :rules="[this.fieldRules(user.distinguishedName, 'ldap_dn')]"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="4">
                                        <v-text-field
                                        dense
                                        id="userPrincipalName"
                                        :label="$t('ldap.attributes.userPrincipalName')"
                                        readonly
                                        v-model="getUSN"
                                        :rules="[this.fieldRules(user.userPrincipalName, 'ldap_usn')]"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="whenCreated"
                                        :label="$t('ldap.attributes.whenCreated')"
                                        readonly
                                        v-model="user.whenCreated"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="whenChanged"
                                        :label="$t('ldap.attributes.whenChanged')"
                                        readonly
                                        v-model="user.whenChanged"
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
                                        v-model="user.lastLogon"
                                        ></v-text-field>
                                    </v-col>
                                    <v-col cols="12" lg="6">
                                        <v-text-field
                                        dense
                                        id="pwdLastSet"
                                        :label="$t('ldap.attributes.pwdLastSet')"
                                        readonly
                                        v-model="user.pwdLastSet"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-row>
                </v-form>

                <v-card-actions>
                    <v-row justify="center" class="pa-0 ma-0">
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
                        class="ma-0 pa-0 pa-4 ma-1 bg-secondary text-normal" 
                        rounded>
                            <v-icon class="mr-1">
                                mdi-content-save
                            </v-icon>
                            {{ $t("actions.save") }}
                        </v-btn>
                        <!-- Refresh User Button -->
                        <v-btn 
                        class="ma-0 pa-0 pa-4 ma-1 bg-primary" 
                        color="white" 
                        icon
                        elevation="0"
                        :loading="loading"
                        @click="refreshUser"
                        >
                        <v-icon>
                            mdi-refresh
                        </v-icon>
                        <template v-slot:loader>
                            <span class="custom-loader">
                            <v-icon>mdi-cached</v-icon>
                            </span>
                        </template>
                        </v-btn>
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
            :viewKey="'userResetPassword'"
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
            <LogoutDialog
            @logoutAction="logoutAction(true)"/>
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
import User from '@/include/User'
import Domain from '@/include/Domain'
import UserResetPassword from '@/components/User/UserResetPassword.vue'
import UserAccountDropdown from '@/components/User/UserAccountDropdown.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'
import LogoutDialog from '@/components/LogoutDialog.vue'
import RefreshTokenDialog from "@/components/RefreshTokenDialog.vue"
import NotificationBusContainer from '@/components/NotificationBusContainer.vue'
import validationMixin from '@/plugins/mixin/validationMixin'
import utilsMixin from '@/plugins/mixin/utilsMixin'

export default {
    name: 'EnduserView',
    mixins: [ validationMixin, utilsMixin ],
    components: {
        LanguageSelector,
        UserResetPassword,
        UserAccountDropdown,
        NotificationBusContainer,
        RefreshTokenDialog,
        LogoutDialog,
        ThemeChanger
    },
    data() {
        return {
            logoLight: require('@/assets/interlock-logo-wt-dark.svg'),
            logoDark: require('@/assets/interlock-logo-wt-light.svg'),
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
            user: {
            },
            domain: "",
            realm: "",
            basedn: "",
            showLogoutDialog: false,
            showRefreshTokenDialog: false,
            timeoutId: 0,
        }
    },
    async created () {
        this.user = new User({})
        this.user.getCurrentUserData().then(response => {
            var responseStatus = response.status
            var token = localStorage.getItem('token')
            var admin_allowed = (localStorage.getItem('admin_allowed') === 'true')
            response = response.data

            // If response code is valid
            if (/^20[0-8]|226/.test(responseStatus)) {
                this.username = localStorage.getItem('username')
                this.first_name = localStorage.getItem('first_name')
                this.last_name = localStorage.getItem('last_name')
                this.email = localStorage.getItem('email')
                this.access_token_lifetime = localStorage.getItem("access_token_lifetime");
                this.refresh_token_lifetime = localStorage.getItem("refresh_token_lifetime");

                new Domain({}).getDetails().then(() => {
                    this.domain = localStorage.getItem('domain')
                    this.realm = localStorage.getItem('realm')
                    this.basedn = localStorage.getItem('basedn')
                })
            }
            // If response code is an HTTP error code
            else {
                token = localStorage.getItem("token");
                if ( !token || token == null || token == 'null' )
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
        this.user.fetchme()
        .then(() => {
            this.loading = false
        })
        .catch(error => {
            console.error(error)
            this.loading = false
            this.error = true
        });
        this.loadDomainData();
    },
    computed: {
        getUSN(){
            if (this.user.username != undefined)
                return this.user.username + "@" + this.domain
            else
                return "@" + this.domain
        },
        activeUserName() {
            if(	this.last_name && this.last_name.length > 0 &&
                this.first_name && this.first_name.length > 0)
                return this.last_name + ", " + this.first_name + " | " + this.username
                // return this.last_name + ", " + this.first_name + " | " + this.realm.toUpperCase() + "@" + this.username
            return this.realm.toUpperCase() + "@" + this.username
        }
    },
    methods: {
        openSettings(){
            this.showSettingsDialog = true
            if (this.$refs.UserSettings)
                this.$refs.UserSettings.loadSettings()
        },
        async saveUser(){
            this.loading = true
            // Uncomment below to debug permissions list
            this.$emit('save', this.viewKey, this.user);
            await new User({}).updateSelf(this.user)
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
        async refreshUser(){
            this.loading = true
            this.error = false
            await this.user.fetchme().then(() => {
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
        async loadDomainData(){
            if (!this.domain || !this.realm) {
                await new Domain({}).getDetails().then(() => {
                this.domain = localStorage.getItem('domain')
                this.realm = localStorage.getItem('realm')
                this.basedn = localStorage.getItem('basedn')
                })
            }
        },
        ////////////////////////////////////////////////////////////////////////
        // Logout Actions
        ////////////////////////////////////////////////////////////////////////
        async logoutAction(timeout=false) {
            await new User({}).logout(timeout).then(() => {
                localStorage.setItem("logoutMessage", true);
                this.$router.push("/login");
            });
        },
        ////////////////////////////////////////////////////////////////////////
        // Refresh Token Timers
        // What happens when the timer stops
        ////////////////////////////////////////////////////////////////////////
        handleInactive() {
            const refreshClock = Date.parse(localStorage.getItem("refreshClock"));
            const accessClockLimit = refreshClock + (this.access_token_lifetime * 1000)
            const refreshClockLimit = refreshClock + (this.refresh_token_lifetime * 1000)
            const clockDifference = this.refresh_token_lifetime - this.access_token_lifetime
            if (Date.now() >= accessClockLimit && Date.now() < refreshClockLimit) {
                this.showRefreshTokenDialog = true
                if (this.$refs.RefreshTokenDialog != undefined)
                this.$refs.RefreshTokenDialog.startCountdown()
                this.timeoutId = setTimeout(this.handleInactive, clockDifference * 1000)
            } else if (Date.now() >= refreshClockLimit) {
                this.showLogoutDialog = true
                this.showRefreshTokenDialog = false
            }
            else {
                this.resetTimer()
            }
        },
        startTimer() {
            // setTimeout returns an ID (can be used to start or clear a timer)
            this.timeoutId = setTimeout(this.handleInactive, this.access_token_lifetime * 1000);
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