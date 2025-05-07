<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: EnduserView.vue ----------------------------->
<template>
	<div class="enduser" v-if="showView">
		<v-row align="center"
			justify="space-between"
			style="background: var(--v-secondary-10-base)"
			class="ma-0 pa-0 px-4 transition-speed-fix">
			<v-img max-width="30ch" max-height="5em" class="my-3" contain :aspect-ratio="32 / 9"
				:src="!isThemeDark($vuetify) ? logoLight : logoDark" />
			<h2 style="color: var(--v-text-background-base)" class="ma-2 my-4 font-weight-medium">{{
				domain.toUpperCase() }}</h2>
		</v-row>
		<v-row
			:dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)" align="center"
			class="ma-0 pa-2 transition-speed-fix"
			style="background: var(--v-secondary-10-base); height: fit-content;">
			<v-col cols="12" md="auto">
				<LanguageSelector :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
					class="" />
			</v-col>
			<v-divider style="border-color: var(--v-primary-base)" class="ma-6"
				v-if="this.$vuetify.breakpoint.mdAndUp" />
			<v-col class="ma-0 pa-0 my-3"
				v-if="!this.$vuetify.breakpoint.mdAndUp && realm && realm != ''">
				<span style="color: var(--v-white-d-base);"
					v-if="last_name && last_name != '' && first_name && first_name != ''">
					{{ last_name + ", " + first_name + " | " + realm.toUpperCase() + '@' + username
					}}
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
						show-preferences-menu
						@logout="logoutAction"
						@openSettings="openSettings"
						:username="activeUserName" />
					<ThemeChanger :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
						:buttonIsSmall="true" />
				</div>
			</v-col>
		</v-row>

		<v-container>
			<v-card>
				<v-progress-linear :color="error ? 'red' : 'primary'" :indeterminate="loading" />
				<v-card-title>
					<v-row justify="center" class="pa-0 ma-0 text-uppercase">
						{{ first_name.length > 0 && last_name.length > 0 ?
							$t('section.enduser.title') + " " + first_name + " " + last_name :
							$t('section.enduser.title') + ' ' + username }}
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
					<v-row align-content="center" class="ma-2 mt-0" v-if="isLDAPUser">
						<!-- User Basic Data Panel -->
						<v-col class="ma-0 pa-0" cols="12" md="6">
							<v-card outlined height="100%" class="ma-1 pa-4">
								<v-row
									:justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'start'"
									class="pa-0 ma-0 text-h6 mx-3 mb-5">
									{{ $t('section.users.basicDetails') }}
								</v-row>
								<v-row class="pa-0 ma-0 font-weight-medium">
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="first_name"
											:label="$t('attribute.first_name')"
											v-model="usercopy.first_name"
											:rules="[this.fieldRules(usercopy.first_name, 'ge_name')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="last_name"
											:label="$t('attribute.last_name')"
											v-model="usercopy.last_name"
											:rules="[this.fieldRules(usercopy.last_name, 'ge_name')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="username"
											:label="$t('attribute.user.username')"
											v-model="usercopy.username"
											:hint="$t('words.readOnly')"
											readonly></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="mail"
											:label="$t('attribute.user.email')"
											v-model="usercopy.mail"
											:rules="[this.fieldRules(usercopy.mail, 'ge_mail')]"></v-text-field>
									</v-col>
									<v-col cols="12"
										v-if="user.last_login != undefined && user.last_login != ''">
										{{ $t('attribute.last_login') + ": " + user.last_login
										}}
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="phone"
											:label="$t('attribute.phone')"
											v-model="usercopy.phone"
											:rules="[this.fieldRules(usercopy.phone, 'ge_phone_intl')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="website"
											:label="$t('attribute.website')"
											v-model="usercopy.website"
											:rules="[this.fieldRules(usercopy.website, 'ge_website')]"></v-text-field>
									</v-col>
								</v-row>
							</v-card>
						</v-col>
						<!-- Location Panel -->
						<v-col class="ma-0 pa-0" cols="12" md="6">
							<v-card outlined height="100%" class="ma-1 pa-4">
								<v-row
									:justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
									class="pa-0 ma-0 text-h6 mx-4 mb-5">
									{{ $t('section.users.location') }}
								</v-row>
								<v-row class="pa-0 ma-0 font-weight-medium">
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="street_address"
											:label="$t('attribute.street_address')"
											v-model="usercopy.street_address"
											:rules="[this.fieldRules(usercopy.street_address, 'ge_address_street')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="postal_code"
											:label="$t('attribute.postal_code')"
											v-model="usercopy.postal_code"
											:rules="[this.fieldRules(usercopy.postal_code, 'ge_address_postal_code')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6"
										:class="this.$vuetify.breakpoint.smAndUp ? 'mt-3' : ''">
										<v-text-field
											dense
											id="city"
											:label="$t('attribute.city')"
											v-model="usercopy.city"
											:rules="[this.fieldRules(usercopy.city, 'ge_address_city')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-card v-ripple outlined class="pa-1 py-2">
											<div
												v-if="user.country_code_dcc != undefined && user.country_code_dcc != '' && user.country_code_dcc != 0">
												{{ $t('attribute.countryCodeCombined') }}
												<div elevation="0">
													{{ user.country_code_dcc }}
													{{ "(" + user.country_code_iso + ")" }}
												</div>
											</div>
											<div v-else>
												{{ $t('attribute.countryCodeCombined') }}
												<div>
													{{ $t('error.data.noCountryCode') }}
												</div>
											</div>
										</v-card>
									</v-col>
									<v-col cols="12"
										v-if="user.last_login != undefined && user.last_login != ''">
										{{ $t('attribute.last_login') + ": " + user.last_login
										}}
									</v-col>
									<v-col cols="12" lg="6">
										<v-text-field
											dense
											id="state_province"
											:label="$t('attribute.state_province')"
											v-model="usercopy.st"
											:rules="[this.fieldRules(usercopy.state_province, 'ge_state')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="6">
										<v-autocomplete
											dense
											id="country_name"
											:label="$t('attribute.country_name')"
											v-model="usercopy.country_name"
											:items="LDAPCountries"
											:rules="[this.fieldRules(usercopy.country_name, 'ge_country')]">
										</v-autocomplete>
									</v-col>
								</v-row>
							</v-card>
						</v-col>
					</v-row>
					<!-- Advanced Details Row -->
					<v-row class="ma-2" v-if="isLDAPUser">
						<v-expansion-panels flat class="ma-1">
							<v-expansion-panel class="outlined">
								<v-expansion-panel-header class="font-weight-medium">
									{{ $t("section.users.advancedDetails") + " (" +
										$t("words.readOnly") + ")" }}
								</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-row>
										<v-col cols="12" lg="8">
											<v-text-field
												dense
												id="distinguished_name"
												:label="$t('attribute.distinguished_name')"
												readonly
												v-model="usercopy.distinguished_name"
												:rules="[this.fieldRules(usercopy.distinguished_name, 'ldap_dn')]"></v-text-field>
										</v-col>
										<v-col cols="12" lg="4">
											<v-text-field
												dense
												id="user_principal_name"
												:label="$t('attribute.user_principal_name')"
												readonly
												v-model="getUSN"
												:rules="[this.fieldRules(usercopy.user_principal_name, 'ldap_usn')]"></v-text-field>
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="12" lg="6">
											<v-text-field
												dense
												id="created_at"
												:label="$t('attribute.created_at')"
												readonly
												v-model="usercopy.created_at"></v-text-field>
										</v-col>
										<v-col cols="12" lg="6">
											<v-text-field
												dense
												id="modified_at"
												:label="$t('attribute.modified_at')"
												readonly
												v-model="usercopy.modified_at"></v-text-field>
										</v-col>
									</v-row>
									<v-row>
										<v-col cols="12" lg="6">
											<v-text-field
												dense
												id="last_login_win32"
												:label="$t('attribute.last_login_win32')"
												readonly
												v-model="usercopy.last_login_win32"></v-text-field>
										</v-col>
										<v-col cols="12" lg="6">
											<v-text-field
												dense
												id="password_set_at"
												:label="$t('attribute.password_set_at')"
												readonly
												v-model="usercopy.password_set_at"></v-text-field>
										</v-col>
									</v-row>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-row>

					<!-- DJANGO USER DATA -->
					<v-row align-content="center" class="ma-2 mt-0" v-else>
						<v-col class="ma-0 pa-0" cols="12">
							<v-card outlined height="100%" class="ma-1 pa-4">
								<v-row class="pa-0 ma-0 font-weight-medium">
									<v-col cols="12" lg="4">
										<v-text-field dense id="first_name"
											:label="$t('attribute.first_name')"
											v-model="usercopy.first_name"
											:rules="[this.fieldRules(usercopy.first_name, 'ge_name')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="4">
										<v-text-field dense id="last_name" :label="$t('attribute.last_name')"
											v-model="usercopy.last_name"
											:rules="[this.fieldRules(usercopy.last_name, 'ge_name')]"></v-text-field>
									</v-col>
									<v-col cols="12" lg="4">
										<v-text-field dense id="email" :label="$t('attribute.user.email')"
											v-model="usercopy.email"
											:rules="[this.fieldRules(usercopy.email, 'ge_mail')]"></v-text-field>
									</v-col>
									<v-col cols="12"
										v-if="user.last_login != undefined && user.last_login != ''">
										{{ $t('attribute.last_login') + ": " +
											truncateDate(user.last_login) }}
									</v-col>
								</v-row>
								<v-row justify="center" no-gutters>
									<v-col cols="12" lg="6" class="px-2 my-2">
										<v-text-field dense id="dn" :label="$t('attribute.created_at')"
											:value="truncateDate(user.created_at)" readonly></v-text-field>
									</v-col>
									<v-col cols="12" lg="6" class="px-2 my-2">
										<v-text-field dense id="dn" :label="$t('attribute.modified_at')"
											:value="truncateDate(user.modified_at)" readonly></v-text-field>
									</v-col>
								</v-row>
							</v-card>
						</v-col>
					</v-row>
				</v-form>

				<v-card-actions>
					<v-row justify="center" class="pa-0 ma-0" align="center">
						<!-- Reset Password Button -->
						<v-btn color="primary" @click="openDialog('userResetPassword')"
							:disabled="!user.can_change_pwd && user_type == 'ldap'"
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
							@refresh="refreshUser" />
					</v-row>
				</v-card-actions>
			</v-card>
		</v-container>

		<!-- SNACKBAR / NOTIF. BUS -->
		<NotificationBusContainer />

		<!-- SETTINGS DIALOG  -->
		<v-dialog
			max-width="48rem"
			v-model="showSettingsDialog">
			<UserSettings
				ref="UserSettings"
				:username="username"
				:first-name="first_name"
				:last-name="last_name"
				admin-mode
				:domain="domain"
				:realm="realm"
				@close='showSettingsDialog = !showSettingsDialog' />
		</v-dialog>

		<!-- USER RESET PASSWORD DIALOG -->
		<v-dialog eager max-width="800px" v-model="dialogs['userResetPassword']">
			<UserResetPassword
				:userObject="this.user"
				:dialogKey="'userResetPassword'"
				:parentTitle="isLDAPUser ? 'ldap-users' : 'django-users'"
				:userClass="userClass"
				ref="UserResetPassword"
				:isEndUser="true"
				@closeDialog="closeDialog" />
		</v-dialog>

		<!-- LOGOUT DIALOG  -->
		<v-dialog
			persistent
			content-class=""
			max-width="40rem"
			v-model="showLogoutDialog">
			<LogoutDialog @logoutAction="logoutAction()" />
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
				@logoutAction="logoutAction()" />
		</v-dialog>
	</div>
</template>

<script>
import User from '@/include/User.js'
import DjangoUser from '@/include/DjangoUser.js'
import Domain from '@/include/Domain.js'
import UserResetPassword from '@/components/User/UserResetPassword.vue'
import UserAccountDropdown from '@/components/User/UserAccountDropdown.vue'
import UserSettings from '@/components/User/UserSettings.vue'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue'
import LogoutDialog from '@/components/LogoutDialog.vue'
import RefreshTokenDialog from "@/components/RefreshTokenDialog.vue"
import RefreshButton from '@/components/RefreshButton.vue'
import NotificationBusContainer from '@/components/NotificationBusContainer.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import { getDomainDetails, truncateDate } from '@/include/utils.js';
import LDAPCountries from '@/include/constants/LDAPCountries.js'

export default {
	name: 'EnduserView',
	mixins: [validationMixin, utilsMixin],
	components: {
		LanguageSelector,
		UserResetPassword,
		UserAccountDropdown,
		UserSettings,
		NotificationBusContainer,
		RefreshTokenDialog,
		RefreshButton,
		LogoutDialog,
		ThemeChanger
	},
	data() {
		return {
			showView: false,
			LDAPCountries: LDAPCountries,
			showSettingsDialog: false,
			logoLight: 'logo/interlock-logo-wt-dark.svg',
			logoDark: 'logo/interlock-logo-wt-light.svg',
			// Dialog States
			dialogs: {
				userResetPassword: false,
			},
			loading: false,
			error: false,
			userClass: undefined,
			username: "",
			first_name: "",
			last_name: "",
			email: "",
			user_type: "local",
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
		let user_type = localStorage.getItem("user.user_type")
		if (user_type == "local")
			this.userClass = DjangoUser
		else if (user_type == "ldap")
			this.userClass = User
		this.user = new this.userClass({})
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
				this.user_type = localStorage.getItem('user.user_type')
				this.refreshTokenExpiryData()

				new Domain({}).getDetails().then(() => {
					let domainData = getDomainDetails()
					this.domain = domainData['name']
					this.realm = domainData['realm']
					this.basedn = domainData['basedn']
					this.showView = true
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
	async mounted() {
		this.loading = true
		this.refreshUser()
	},
	computed: {
		async isLDAPUser() {
			return await this.getUserType() === 'ldap'
		},
		getUSN() {
			return `${this.user.username}@${this.domain}`
		},
		activeUserName() {
			if (this.last_name && this.last_name.length > 0 &&
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
		truncateDate,
		async getUserType() {
			let user_type = localStorage.getItem("user.user_type")
			return new Promise((resolve, reject) => {
				if (user_type == "local") {
					this.userClass = DjangoUser
					resolve();
				}
				else if (user_type == "ldap") {
					this.userClass = User
					resolve();
				} else
					reject()
			});
		},
		getModifiedValues() {
			let v = []
			const IGNORE_KEYS = [
				'last_login_win32'
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
		getIsUserModified() {
			// Check the rest of the user data.
			if (this.getModifiedValues().length > 0) return true
			return false
		},
		disableEnduserHelpMessage() {
			localStorage.setItem('user.tips.enduserHelp', false)
		},
		openSettings() {
			this.showSettingsDialog = true
			if (this.$refs.UserSettings)
				this.$refs.UserSettings.loadSettings()
		},
		async saveUser() {
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
			if (this.$refs.endUserForm.validate()) {
				await new this.userClass({}).selfUpdate(partialUpdateData)
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
		openDialog(key) {
			this.dialogs[key] = true;
			switch (key) {
				default:
					break;
			}
		},
		async closeDialog(key, extra) {
			this.dialogs[key] = false;
			if (key == 'userResetPassword' && extra === true)
				this.showLogoutDialog = true
		},
		closeRefreshDialog() {
			this.showRefreshTokenDialog = false
			this.resetTimer()
		},
		refreshTokenExpiryData() {
			this.access_expire = parseInt(localStorage.getItem("auth.access_expire"));
			this.refresh_expire = parseInt(localStorage.getItem("auth.refresh_expire"));
		},
		// Sync the usercopy object to the parent view user object on the
		// next tick to avoid mutation errors
		syncUser() {
			this.setDomainDetails()
			this.usercopy = new this.userClass({})
			this.$nextTick(() => { this.usercopy = Object.assign({}, this.user) })
		},
		async refreshUser() {
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
		async setDomainDetails() {
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
					await new this.userClass({}).selfInfo()
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
		setupTimers() {
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