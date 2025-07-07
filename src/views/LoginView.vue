<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LoginView.vue ------------------------------->
<template>
	<v-container id="login-container"
		class="ma-0 pa-0 justify-center align-items-center"
		fluid
		fill-height>
		<v-card id="login-card" :width="$vuetify.breakpoint.mdAndUp ? '800px' : '60vw'"
			class="pa-12" :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
			<v-row class="my-2" justify="center" align="center">
				<v-img contain max-width="450px" :aspect-ratio="14 / 3"
					:src="isThemeDark($vuetify) ? logoLight : logoDark" />
			</v-row>
			<v-row class="pa-0 ma-0" justify="center">
				<!-- Initial Loading Component -->
				<v-col class="my-6" cols="12" v-if="init_loading">
					<v-progress-circular
						indeterminate
						color="primary"
						size="60"
						width="7"
						/>
				</v-col>
				<v-form @submit.prevent
					id="login-form-container"
					v-model="valid"
					color="transparent"
					ripple
					ref="loginform">
					<v-col align="center">
						<!-- LOGIN MODE FORM -->
						<v-expand-transition>
							<div v-if="viewModes.login">
								<v-row class="ma-0 pa-0 my-4" justify="center" align="center">
									<v-btn class="ma-0 pa-0 px-2" small outlined color="primary-s"
										@click="loginWithUsername = !loginWithUsername; username = ''; email = ''; $refs.loginform.resetValidation()">
										<span v-if="loginWithUsername">
											<v-icon class="mr-1">
												mdi-email
											</v-icon>
											{{ $t("section.login.useEmail") }}
										</span>
										<span v-else>
											<v-icon class="mr-1">
												mdi-account
											</v-icon>
											{{ $t("section.login.useUsername") }}
										</span>
									</v-btn>
								</v-row>
								<!-- USER / EMAIL FIELD -->
								<v-row v-if="loginWithUsername" justify="center" class="ma-0 pa-0">
									<v-text-field
										outlined
										dense
										v-model="username"
										:label="$t('attribute.user.username')"
										prepend-inner-icon="mdi-account"
										:disabled="submitted"
										validate-on-blur
										:rules="[this.fieldRules(username, 'ge_name', true)]"
										class="font-weight-bold"
										required
										@keydown.enter="submit()"></v-text-field>
								</v-row>
								<v-row v-else justify="center" class="ma-0 pa-0">
									<v-text-field
										autofocus
										outlined
										dense
										v-model="email"
										:label="$t('attribute.user.email')"
										prepend-inner-icon="mdi-email"
										:disabled="submitted"
										validate-on-blur
										:rules="[this.fieldRules(email, 'ge_email', true)]"
										class="font-weight-bold"
										required
										@keydown.enter="submit()"></v-text-field>
								</v-row>

								<!-- PASSWORD FIELD -->
								<v-row justify="center" class="ma-0 pa-0">
									<v-text-field
										outlined
										dense
										:label="$t('attribute.user.password')"
										:type="hidePassword ? 'password' : 'text'"
										prepend-inner-icon="mdi-lock"
										v-model="password"
										:disabled="submitted"
										@keydown.enter="submit()"
										class="font-weight-bold"
										required
										:append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="() => (hidePassword = !hidePassword)"></v-text-field>
								</v-row>

								<v-row justify="center" class="ma-0 pa-0">
									<LanguageSelector full-width class="font-weight-medium" />
								</v-row>
								<v-row justify="center">
									<ThemeChanger class="font-weight-medium ma-6" :buttonIsSwitch="true" />
								</v-row>
							</div>
						</v-expand-transition>

						<!-- TOTP MODE FORM -->
						<v-expand-transition>
							<div v-if="viewModes.totp">
								<!-- TOTP FIELD -->
								<v-row id="RowRCM" justify="center" class="ma-0 pa-0">
									<v-slide-y-transition>
										<v-otp-input
											ref="f_totp_code"
											v-if="!recovery_mode && !rcm_animation"
											:disabled="submitted"
											:label="$t('attribute.user.totp_code')"
											:rules="[this.fieldRules(totp_code, 'auth_totp')]"
											@keydown.enter="submit()"
											@keypress="isNumber"
											@paste="isNumber"
											class="ma-0 pa-0 font-weight-bold"
											dense
											required
											type="text"
											v-model="totp_code" />

										<!-- RECOVERY FIELD -->
										<v-text-field
											ref="f_recovery_code"
											v-else-if="recovery_mode && !rcm_animation"
											:disabled="submitted"
											:label="$t('attribute.user.recovery_code')"
											:rules="[this.fieldRules(recovery_code, 'auth_recovery')]"
											@keydown.enter="submit()"
											class="font-weight-bold"
											dense
											outlined
											prepend-inner-icon="mdi-code-array"
											required
											type="text"
											v-model="recovery_code"></v-text-field>
									</v-slide-y-transition>
								</v-row>
								<v-row justify="center" class="ma-0 pa-0">
									<v-checkbox :label="$t('section.login.useRecoveryCode')"
										class="ma-0 pa-0" @click="toggleRCM"
										:value="recovery_mode" />
								</v-row>
							</div>
						</v-expand-transition>

						<!-- OIDC CONSENT MODE FORM -->
						<v-expand-transition>
							<OIDCWidget
								v-if="viewModes.oidc"
								:application-name="oidc.application"
								:disable-actions="submitted"
								:accepted-consent="oidc.accepted_consent"
								@accept="consentResponse(true)"
								@decline="consentResponse(false)"
								/>
						</v-expand-transition>

						<!-- ERROR MESSAGE -->
						<v-row justify="center" class="mt-2">
							<v-expand-transition>
								<v-alert
									:type="loginForbiddenCount > 2 && error ? (loginForbiddenCount > 4 ? 'error' : 'warning') : 'info'"
									v-if="!init_loading && (error == true || errorMsg != '')">
									{{ this.errorMsg }}
								</v-alert>
							</v-expand-transition>
						</v-row>

						<!-- LOGIN BUTTONS -->
						<v-expand-transition>
							<v-row
								v-if="viewModes.login || viewModes.totp"
								justify="center"
								class="pa-2 mt-4">
								<v-expand-x-transition>
									<v-col class="ma-0 pa-0" v-if="viewModes.totp">
										<v-btn
											:disabled="submitted || (userIdentifier.length == 0 || this.password.length == 0) || !valid"
											@click="goBack"
											class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3">
											{{ $t("actions.back") }}
										</v-btn>
									</v-col>
								</v-expand-x-transition>
								<v-col class="ma-0 pa-0" v-if="viewModes.login || viewModes.totp">
									<v-btn
										:loading="submitted"
										:disabled="disableLoginBtn"
										@click="submit"
										class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3">
										{{ $t("section.login.loginBtn") }}
									</v-btn>
								</v-col>
							</v-row>
						</v-expand-transition>
					</v-col>
				</v-form>
			</v-row>
		</v-card>

		<!-- Snackbar -->
		<v-snackbar
			v-model="logoutSnackbar"
			timeout="3e3"
			class="mb-12"
			:dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)">
			{{ snackbarMessage }}

			<template v-slot:action="{ attrs }">
				<v-btn
					icon
					text
					v-bind="attrs"
					@click="logoutSnackbar = false">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>

<script>
import User from '@/include/User.js'
import Oidc from '@/include/Oidc.js'
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { getRuntimeConfig, ignoreErrorCodes } from "@/providers/interlock_backend/config";
import OIDCWidget from '@/components/OIDC/OIDCWidget.vue';

export default {
	name: "LoginView",
	mixins: [validationMixin, utilsMixin],
	components: {
		LanguageSelector,
		ThemeChanger,
		OIDCWidget
	},
	async created() {
		this.version = await getRuntimeConfig()
			.then(function (json) {
				localStorage.setItem("interlock.version", json.version)
			})
	},
	data() {
		return {
			init_loading: true,
			viewModes: {
				login: false,
				totp: false,
				oidc: false
			},
			transitionDelay: 3e2,
			rcm_animation: false,
			recovery_mode: false,
			recovery_code: "",
			logoLight: '/logo/interlock-logo-wt-dark.svg',
			logoDark: '/logo/interlock-logo-wt-light.svg',
			loginWithUsername: true,
			loginForbiddenCount: 0,
			timeoutCounter: 30,
			timedOut: false,
			timeoutInterval: false,
			valid: false,
			error: false,
			errorMsg: "",
			username: "",
			email: "",
			password: "",
			totp_code: "",
			submitted: false,
			logoutSnackbar: false,
			alternateTabLoginTimerId: undefined,
			snackbarMessage: "",
			next: "",
			oidc: {
				application: "",
				error: false,
				error_detail: "",
				client_id: "",
				redirect_uri: "",
				reject_uri: "",
				require_consent: false,
				reuse_consent: false,
				accepted_consent: false
			},
			hidePassword: true,
		};
	},
	computed: {
		userIdentifierKey() {
			return this.loginWithUsername ? "username" : "email"
		},
		userIdentifier() {
			return this.loginWithUsername ? this.username : this.email
		},
		disableLoginBtn() {
			if (this.submitted)
				return true
			if (this.userIdentifier.length == 0 || this.password.length == 0)
				return true
			if (!this.valid)
				return true
			if (this.viewModes.totp) {
				if (!this.recovery_mode && this.totp_code.length <= 0) return true
				if (this.recovery_mode && this.recovery_code.length <= 0) return true
			}
			return false
		}
	},
	mounted() {
		this.next = this.$route.query.next || "";
		this.oidc.error = this.$route.query.error === "true" || false;
		this.oidc.error_detail = this.$route.query.error_detail || "";
		if (this.next !== "") {
			this.oidc = this.$route.query
			const bool_values = [
				"require_consent",
				"reuse_consent",
			]
			bool_values.forEach(b => {
				this.oidc[b] = this.oidc[b] === "true" || this.oidc[b] === true
			});
		}
		let errInStorage = parseInt(localStorage.getItem('auth.loginForbiddenCount'))
		let timedOutStorage = Boolean(localStorage.getItem('auth.loginTimedOut'))
		let timeOutCounterStorage = parseInt(localStorage.getItem('auth.loginTimeOutCounter'))
		if (Number.isInteger(errInStorage))
			this.loginForbiddenCount = errInStorage
		if (Number.isInteger(timeOutCounterStorage))
			this.timeoutCounter = timeOutCounterStorage
		if (timedOutStorage == true && this.timeoutCounter > 0)
			this.timedOut = timedOutStorage

		if (this.timedOut == true)
			this.setLoginTimeout()

		if (this.loginForbiddenCount > 0)
			this.error = true

		if (this.oidc.error === true)
			this.adviseFailedOIDC()

		let userJustLoggedOut = localStorage.getItem('auth.logoutMessage')
		if (userJustLoggedOut) {
			this.snackbarMessage = this.$t("misc.loggedOut").toUpperCase()
			this.enableViewmode("login");
			this.logoutSnackbar = true;
			localStorage.removeItem('auth.logoutMessage')
		} else {
			this.checkUserIsLoggedIn()
		}

		this.clearAlternateTabLoginCheckTimer()
		this.alternateTabLoginTimerId = setInterval(() => {
			this.userLoggedInAnotherTab()
		}, 5e3) // Every 5s
	},
	watch: {
		recovery_mode(v) {
			if (v === true) this.totp_code = ""
			else this.recovery_code = ""
		},
		validateForm() {
			if (!this.$refs.loginform.validate()) {
				this.valid = false
				return;
			}
			this.valid = true
			return;
		},
		totp_code(v) {
			if (v == "") return
			if (!isNaN(v) && this.fieldRules(this.totp_code, 'auth_totp') === true)
				setTimeout(() => {
					this.submit()
				}, 1e2)
		},
	},
	methods: {
		anyViewmodeEnabled(){
			for (const key in this.viewModes) {
				if (this.viewModes[key])
					return true;
			}
			return false
		},
		disableAllViewmodes() {
			this.viewModes.login = false;
			this.viewModes.totp = false;
			this.viewModes.oidc = false;
		},
		enableViewmode(viewmode, transition=true) {
			if (this.viewModes !== undefined && !(viewmode in this.viewModes))
				return;
			this.disableAllViewmodes();

			if (transition === true) {
				setTimeout(() => {
					this.init_loading = false;
					this.viewModes[viewmode] = true;
				}, this.transitionDelay)
			} else {
				this.init_loading = false;
				this.viewModes[viewmode] = true;
			}
		},
		userLoggedInAnotherTab() {
			if (this.viewModes.oidc === true || this.viewModes.totp === true)
				return;

			let logged_in = localStorage.getItem("user.logged_in")
			if (logged_in === "true" || logged_in === true)
				this.checkUserIsLoggedIn()
		},
		clearAlternateTabLoginCheckTimer() {
			if (this.alternateTabLoginTimerId !== undefined)
				clearInterval(this.alternateTabLoginTimerId)
		},
		checkUserIsLoggedIn() {
			if (this.error || this.errorMsg !== "") {
				if (!this.anyViewmodeEnabled()) {
					this.enableViewmode("login");
					return;
				}
				return;
			}

			console.log("Checking if user logged in from another tab...")
			let admin_allowed = localStorage.getItem('user.admin_allowed')
			new User({}).selfFetch()
				.then(() => {
					console.log("User is already logged in.")
					this.error = false;
					this.errorMsg = "";
					this.clearLoginTimeout()
					this.clearAlternateTabLoginCheckTimer()

					if (!this.error) {
						if (this.next !== "")
							this.redirectOIDC()
						else {
							this.pushToIndex(admin_allowed)
						}
					}
				})
				.catch(e => {
					localStorage.removeItem("user.logged_in")
					if (!ignoreErrorCodes.includes(e.status)) {
						console.error(e)
						this.enableViewmode("login");
					} else {
						this.enableViewmode("login");
						if (this.next !== "")
							this.errorMsg = this.$t("section.login.loginForOidc")
					}
				})
		},
		adviseFailedOIDC() {
			this.error = true
			this.errorMsg = this.getMessageForCode(`${this.oidc.error_detail}`)
		},
		goToNextURI() {
			if (this.next === "true" || this.next === true)
				console.error("Authorization Flow Exception.")
			let decodedURL = decodeURIComponent(this.next)
			window.location.href = decodedURL;
		},
		async consentResponse(consent) {
			this.submitted = true
			if (consent !== true) {
				await new Oidc({}).reject(Object.assign({}, this.oidc))
					.then(() => {
						window.location.href = decodeURIComponent(this.oidc.reject_uri)
					})
					.catch(e => {
						if (e?.code == 401) {
							this.enableViewmode("login")
						}
						console.error(e)
						this.errorMsg = this.getMessageForCode(e)
						this.error = true
						this.submitted = false
					})
			} else {
				this.oidc.accepted_consent = consent
				await new Oidc({}).consent(Object.assign({}, this.oidc))
					.then(response => {
						let data = response.data.data
						this.submitted = false
						this.next = data.redirect_uri
						this.goToNextURI()
					})
					.catch(e => {
						if (e?.code == 401) {
							this.enableViewmode("login");
						}
						console.error(e)
						this.errorMsg = this.getMessageForCode(e)
						this.error = true
						this.submitted = false
					})
			}
		},
		redirectOIDC() {
			if (this.oidc.require_consent == true) {
				this.submitted = false
				setTimeout(() => {
					this.enableViewmode("oidc");
				}, 250)
			} else {
				this.consentResponse(true)
			}
		},
		toggleRCM() {
			this.rcm_animation = true
			this.recovery_mode = !this.recovery_mode
			setTimeout(() => {
				this.rcm_animation = false
			}, this.transitionDelay + 1e2)
		},
		goBack() {
			this.totp_code = "";
			this.enableViewmode("login");
		},
		setLoginTimeout() {
			this.timedOut = true
			if (!this.timeoutCounter)
				this.timeoutCounter = 30
			localStorage.setItem('auth.loginTimedOut', true)
			localStorage.setItem('auth.loginTimeOutCounter', this.timeoutCounter)
			this.submitted = false
			this.valid = false
			this.error = true;
			this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
			this.timeoutInterval = setInterval(() => {
				if (this.timeoutCounter == 0) {
					this.clearLoginTimeout()
					this.valid = true
					this.errorMsg = this.$t("section.login.tryAgain")
					clearInterval(this.timeoutInterval)
					setTimeout(() => { this.error = false }, 2500)
				}
				else {
					this.timeoutCounter -= 1
					this.valid = false
					localStorage.setItem('auth.loginTimeOutCounter', this.timeoutCounter)
					if (this.timeoutCounter == 1)
						this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
					this.errorMsg = this.$t("section.login.tooManyLogins") + " (" + this.timeoutCounter + " " + this.$t("words.seconds") + ")";
				}
			}, 1000)
		},
		clearLoginTimeout() {
			localStorage.removeItem('auth.loginForbiddenCount')
			localStorage.removeItem('auth.loginTimedOut')
			localStorage.removeItem('auth.loginTimeOutCounter')
			this.timedOut = false
			this.timeoutCounter = 30
			this.loginForbiddenCount = 0
		},
		pushToIndex(admin) {
			try {
				if (admin === true || admin === "true")
					this.$router.push("/home")
				else
					this.$router.push("/enduser")
			} catch (error) {
				console.error(error)
			}
		},
		async submit() {
			if (!this.$refs.loginform.validate())
				return
			if (this.userIdentifier.length == 0 || this.password.length == 0) {
				this.error = true;
				this.errorMsg = this.$t("section.login.invalidCredentials");
			}
			else {
				this.submitted = true;
				setTimeout(() => {
					if (this.submitted && !this.error && this.viewModes.login === true) {
						this.submitted = false
						this.error = true
						this.errorMsg = this.getMessageForCode(502)
					}
				}, 10e3) // wait for 15 seconds
				let user = new User({})
				let data = { username: this.userIdentifier, password: this.password }
				if (this.totp_code.length > 0 && !this.recovery_mode)
					data.totp_code = this.totp_code
				else if (this.recovery_code.length > 0)
					data.recovery_code = this.recovery_code
				await user.login(data)
					.then(response => {
						this.error = false;
						this.errorMsg = "";
						this.clearLoginTimeout()
						this.clearAlternateTabLoginCheckTimer()

						if (this.next !== "")
							this.redirectOIDC()
						else if (!this.error) {
							this.pushToIndex(response.data.admin_allowed)
						}
					})
					.catch(e => {
						localStorage.removeItem("user.logged_in")
						if (e?.response?.data?.code == "otp_required") {
							this.submitted = false;
							this.error = false;
							this.enableViewmode("totp");
							return
						}
						this.submitted = false;
						this.error = true;
						let retriesLeft = e?.data?.remaining_login_count
						let retriesLeftMsg = this.$t("section.login.retriesLeft")
						if (retriesLeft == 1)
							retriesLeftMsg = this.$t("section.login.oneRetryLeft")
						if (e.status == 401) {
							if (!Number.isInteger(retriesLeft))
								this.errorMsg = this.$t('error.codes.auth.invalid_credentials')
							else if (retriesLeft > 0)
								this.errorMsg = this.$t('error.codes.auth.invalid_credentials') + ` (${retriesLeft} ${retriesLeftMsg})`
							else
								this.setLoginTimeout()
						}
						else {
							this.errorMsg = this.getMessageForCode(e);
						}
					});
			}
		},
	},
};
</script>

<style scoped>
#RowRCM {
	width: 290px;
	min-height: 80px;
}

#login-form-container {
	width: 100%;
	max-width: 400px;
}

@media screen and (max-width: 960px) {
	#login-form-container {
		max-width: 80vw;
	}
}
</style>