<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: LoginView.vue ------------------------------->
<template>
	<v-container class="login ma-0 pa-0" fluid fill-height>
		<v-card outlined 
		style="min-width: 100%; border-radius: 0; border-left: 0; border-right:0;"
		class="py-4 px-6" :dark="isThemeDark($vuetify)" :light="!isThemeDark($vuetify)">
			<v-row class="my-2" justify="center">
				<v-img contain max-width="450px" :aspect-ratio="14/3" :src="isThemeDark($vuetify) ? logoLight : logoDark"/>
			</v-row>
			<v-row class="pa-0 ma-0" justify="center">
				<v-form @submit.prevent
					id="login-form-container"
					v-model="valid"
					color="transparent"
					ripple
					ref="loginform"
				>
					<v-col align="center">
					<v-expand-transition>
					<div v-show="showLogin">
						<v-row class="ma-0 pa-0 my-4" justify="center" align="center">
								<v-btn class="ma-0 pa-0 px-2" small outlined color="primary-s" @click="modeUser = !modeUser; username = ''; $refs.loginform.resetValidation()">
									<span v-if="modeUser">
										<v-icon class="mr-1">
											mdi-email
										</v-icon>
										{{ $t("section.login.useEmail")}}
									</span>
									<span v-else>
										<v-icon class="mr-1">
											mdi-account
										</v-icon>
										{{ $t("section.login.useLDAPUser")}}
									</span>
								</v-btn>
						</v-row>
						<!-- USER / EMAIL FIELD -->
						<v-row v-if="modeUser" justify="center" class="ma-0 pa-0">
							<v-text-field
								outlined
								dense
								v-model="username"
								:label="$t('section.login.account')"
								prepend-inner-icon="mdi-account"
								:disabled="submitted"
								validate-on-blur
								:rules="[this.fieldRules(username, 'ge_name', true)]"
								class="font-weight-bold"
								required
								@keydown.enter="submit()"
							></v-text-field>
						</v-row>
						<v-row v-else justify="center" class="ma-0 pa-0">
							<v-text-field
								autofocus
								outlined
								dense
								v-model="username"
								:label="$t('attribute.email')"
								prepend-inner-icon="mdi-email"
								:disabled="submitted"
								validate-on-blur
								:rules="[this.fieldRules(username, 'ge_email', true)]"
								class="font-weight-bold"
								required
								@keydown.enter="submit()"
							></v-text-field>
						</v-row>
						
						<!-- PASSWORD FIELD -->
						<v-row justify="center" class="ma-0 pa-0">
							<v-text-field
								outlined
								dense
								:label="$t('attribute.users.password')"
								:type="value ? 'password' : 'text'"
								prepend-inner-icon="mdi-lock"
								v-model="password"
								:disabled="submitted"
								@keydown.enter="submit()"
								class="font-weight-bold"
								required
								:append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
								@click:append="() => (value = !value)"
							></v-text-field>
						</v-row>

						<v-row justify="center" class="ma-0 pa-0">
							<LanguageSelector full-width class="font-weight-medium"/>
						</v-row>
						<v-row justify="center">
							<ThemeChanger class="font-weight-medium ma-6" :buttonIsSwitch="true"/>
						</v-row>
					</div>
					</v-expand-transition>

					<v-expand-transition>
						<div v-show="showTotp">
							<!-- TOTP FIELD -->
							<v-row id="RowRCM" justify="center" class="ma-0 pa-0">
								<v-slide-y-transition>
									<v-otp-input
										ref="f_totp_code"
										v-if="!recovery_mode && !rcm_animation"
										:disabled="submitted"
										:label="$t('attribute.users.totp_code')"
										:rules="[this.fieldRules(totp_code, 'auth_totp')]"
										@keydown.enter="submit()"
										@keypress="isNumber"
										@paste="isNumber"
										class="ma-0 pa-0 font-weight-bold"
										dense
										required
										type="text"
										v-model="totp_code"
									/>
									<!-- TOTP CODE TEXT FIELD -->
									<!-- <v-text-field
										:disabled="submitted"
										:label="$t('attribute.users.totp_code')"
										:rules="[this.fieldRules(totp_code, 'auth_totp')]"
										@keydown.enter="submit()"
										@keypress="isNumber"
										@paste="isNumber"
										class="font-weight-bold"
										dense
										outlined
										prepend-inner-icon="mdi-qrcode"
										required
										type="text"
										v-if="!recovery_mode"
										v-model="totp_code"
									></v-text-field> -->

									<!-- RECOVERY FIELD -->
									<v-text-field
										ref="f_recovery_code"
										v-else-if="recovery_mode && !rcm_animation"
										:disabled="submitted"
										:label="$t('attribute.users.recovery_code')"
										:rules="[this.fieldRules(recovery_code, 'auth_recovery')]"
										@keydown.enter="submit()"
										class="font-weight-bold"
										dense
										outlined
										prepend-inner-icon="mdi-code-array"
										required
										type="text"
										v-model="recovery_code"
									></v-text-field>
								</v-slide-y-transition>
							</v-row>
							<v-row justify="center" class="ma-0 pa-0">
								<v-checkbox :label="$t('section.login.useRecoveryCode')"
								class="ma-0 pa-0" @click="toggleRCM"
								:value="recovery_mode"/>
							</v-row>
						</div>
					</v-expand-transition>

						<!-- ERROR MESSAGE -->
						<v-row justify="center">
							<v-expand-transition>
								<v-alert 
									:type="loginForbiddenCount > 2 && error ? (loginForbiddenCount > 4 ? 'error' : 'warning') : 'info'" 
									v-if="error == true && errorMsg != ''">
									{{ this.errorMsg }}
								</v-alert>
							</v-expand-transition>
						</v-row
						>
						<!-- LOGIN BUTTONS -->
						<div>
						<v-row justify="space-around" class="pa-2 mt-4">
							<v-expand-x-transition>
								<v-btn v-show="showTotp"
									:disabled="submitted || (this.username.length == 0 || this.password.length == 0) || !valid"
									@click="goBack"
									class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3"
								>
									{{ $t("actions.back") }}
								</v-btn>
							</v-expand-x-transition>
								<v-btn
									:loading="submitted"
									:disabled="disableLoginBtn"
									@click="submit"
									class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3"
								>
									{{ $t("section.login.loginBtn") }}
								</v-btn>
						</v-row>
						</div>
					</v-col>
				</v-form>
		</v-row>
		</v-card>

			<!-- Snackbar -->
			<v-snackbar
				v-model="logoutSnackbar"
				timeout="3e3"
				class="mb-12"
				:dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
			>
				{{ snackbarMessage }}

				<template v-slot:action="{ attrs }">
					<v-btn
						icon
						text
						v-bind="attrs"
						@click="logoutSnackbar = false"
					>
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
import LanguageSelector from '@/components/LanguageSelector.vue'
import ThemeChanger from '@/components/ThemeChanger.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { getRuntimeConfig, ignoreErrorCodes } from "@/providers/interlock_backend/config";

export default {
	name: "LoginView",
	mixins: [ validationMixin, utilsMixin ],
	components: {
		LanguageSelector,
		ThemeChanger
	},
	async created() {
		this.version = await getRuntimeConfig()
		.then(function(json) {
				localStorage.setItem("interlock.version", json.version)
		})
	},
	computed:{
		disableLoginBtn(){
			if (this.submitted) return true
			if (this.username.length == 0 || this.password.length == 0) return true
			if (!this.valid) return true
			if (this.showTotp) {
				if (!this.recovery_mode && this.totp_code.length <= 0) return true
				if (this.recovery_mode && this.recovery_code.length <= 0) return true
			}
			return false
		}
	},
	data() {
		return {
			showLogin: true,
			showTotp: false,
			rcm_animation: false,
			recovery_mode: false,
			recovery_code: "",
			logoLight: 'logo/interlock-logo-wt-dark.svg',
			logoDark: 'logo/interlock-logo-wt-light.svg',
			modeUser: true,
			loginForbiddenCount: 0,
			timeoutCounter: 30,
			timedOut: false,
			timeoutInterval: false,
			valid: false,
			error: false,
			errorMsg: "",
			username: "",
			password: "",
			totp_code: "",
			submitted: false,
			logoutSnackbar: false,
			snackbarMessage: "",
			value: String,
		};
	},
	mounted() {
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

		let userJustLoggedOut = localStorage.getItem('auth.logoutMessage')
		if (userJustLoggedOut) {
			this.snackbarMessage = this.$t("misc.loggedOut").toUpperCase()
			this.logoutSnackbar = true;
			localStorage.removeItem('auth.logoutMessage')
		} else {
			let admin_allowed = localStorage.getItem('user.admin_allowed')
			new User({}).fetchme()
			.then(() => {
				console.log("User is already logged in.")
				if (admin_allowed === 'true')
					this.$router.push("/home")
				else
					this.$router.push("/enduser")
			})
			.catch(e=>{
				if (!ignoreErrorCodes.includes(e.status))
					console.error(e)
			})
		}
	},
	watch: {
		recovery_mode(v){
			if (v === true) this.totp_code = ""
			else this.recovery_code = ""
		},
		validateForm(){
			if (!this.$refs.loginform.validate()) {
				this.valid = false
				return;
			}
			this.valid = true
			return;
		},
		totp_code(v){
			if(!isNaN(v) && this.fieldRules(this.totp_code, 'auth_totp') === true)
				setTimeout(()=>{
					this.submit()
				}, 100)
		}
	},
	methods: {
		toggleRCM(){
			this.rcm_animation = true
			this.recovery_mode = !this.recovery_mode
			setTimeout(()=>{
				this.rcm_animation = false
			}, 300)
		},
		goBack(){
			this.showLogin = true;
			this.showTotp = false;
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
						setTimeout(()=>{ this.error = false }, 2500)
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
		async submit() {
			if (!this.$refs.loginform.validate())
				return
			if (this.username == "" || this.password == "") {
				this.error = true;
				this.errorMsg = "";
			}
			else {
				this.submitted = true;
				setTimeout(() => {
					if (this.submitted && !this.error) {
						this.submitted = false
						this.error = true
						this.errorMsg = this.getMessageForCode("ERR_LDAP_GW")
					}
				}, 10000)
				let user = new User({})
				let data = {
					username: this.username,
					password: this.password
				}
				if (this.totp_code.length > 0 && !this.recovery_mode)
					data.totp_code = this.totp_code
				else if (this.recovery_code.length > 0)
					data.recovery_code = this.recovery_code
				await user.login(data)
				.then(response =>{
					if(response.data != undefined) {
						this.error = false
						this.errorMsg = "";
						localStorage.removeItem('auth.loginForbiddenCount')
						this.clearLoginTimeout()
						if (response.data.admin_allowed === true)
							this.$router.push("/home")
						else
							this.$router.push("/enduser")
					}
				})
				.catch(e => {
					if (e?.response?.data?.code == "otp_required"){
						this.showLogin = false;
						this.showTotp = true;
						this.submitted = false;
						this.error = false;
						return
					}
					this.submitted = false;
					this.error = true;
					let retriesLeft = e?.data?.remaining_login_count
					let retriesLeftMsg = this.$t("section.login.retriesLeft")
					if (retriesLeft == 1)
						retriesLeftMsg = this.$t("section.login.oneRetryLeft")
					if(e.status == 401){
						if (!Number.isInteger(retriesLeft))
							this.errorMsg = this.$t('error.codes.auth.invalid_credentials')
						else if (retriesLeft > 0)
							this.errorMsg = this.$t('error.codes.auth.invalid_credentials')  + " (" + retriesLeft + " " + retriesLeftMsg + ")"
						else
							this.setLoginTimeout()
					}
					else {
						this.errorMsg = this.getMessageForCode(e);
					}
				});
			}
		},
		gotoPasswRecovery: function () {},
	},
};
</script>

<style scoped>
#RowRCM {
	width:290px;
	min-height:80px;
}

#login-form-container{
	width: 100%;
	max-width: 400px;
}

@media screen and (max-width: 960px) {
	#login-form-container{
		max-width: 80vw;
	}
}
</style>