<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserCreate.vue ------------------------------>
<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">{{ $t("section.users.userCreate.header") }}</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
				<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>

		<!-- Steps -->
		<v-expand-transition>
			<div>
				<v-stepper v-model="createStage">
					<!-- Steps -->
					<v-stepper-header class="px-16">
						<!-- Basics -->
						<v-stepper-step :complete="createStage > 1" step="1">{{
							$t('section.users.userCreate.step1') }}</v-stepper-step>
						<v-divider class="mx-3"
							:style="createStage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
						<v-stepper-step :complete="createStage > 2" step="2">{{
							$t('section.users.userCreate.step2') }}</v-stepper-step>
						<v-divider class="mx-3"
							:style="createStage > 2 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
						<v-stepper-step :complete="createStage > 3" step="3">{{
							$t('section.users.userCreate.step3') }}</v-stepper-step>
					</v-stepper-header>

					<!-- Steps Content -->
					<v-stepper-items>
						<!-- Basics -->
						<v-stepper-content step="1">
							<v-form ref="userCreateForm1" @submit.prevent>
								<v-row justify="center" class="pa-0 ma-0 font-weight-medium">
									<v-col cols="12" lg="5">
										<v-text-field
											dense
											@keydown.enter="nextStep()"
											:label="$t('attribute.user.username')"
											v-model="userToCreate.username"
											:rules="[this.fieldRules(userToCreate.username, 'ge_username', true)]"></v-text-field>
									</v-col>
								</v-row>

								<v-row class="ma-0 pa-0 mt-4" align="center" justify="space-around"
									v-if="isLDAPView">
									<v-btn small text color="primary" class="ma-1"
										@click="userDestination = basedn">
										{{ $t('section.dirtree.move.setToRoot') }}
									</v-btn>
									<v-btn small
										class="ma-1"
										text
										:disabled="!allowRefresh"
										elevation="0"
										@click="fetchOUs(true)">
										{{ $t('actions.refresh') }}
										<v-icon>
											mdi-refresh
										</v-icon>
										<template v-slot:loader>
											<span class="custom-loader">
												<v-icon color="white">mdi-cached</v-icon>
											</span>
										</template>
									</v-btn>
								</v-row>

								<v-row
									class="ma-0 pa-0"
									justify="center"
									v-if="isLDAPView">
									<v-col
										cols="12"
										lg="8">
										<v-expansion-panels
											v-model="userPathExpansionPanel"
											flat
											hover
											style="border: 1px solid var(--v-primary-base);">
											<v-expansion-panel>
												<v-expansion-panel-header>
													<span>
														<span>
															{{ `${$t('section.users.userCreate.userCreatedIn')}: ` }}
														</span>
														<span class="font-weight-bold">
															{{ this.userDestination }}
														</span>
													</span>
												</v-expansion-panel-header>

												<v-expansion-panel-content>
													<v-card
														flat
														outlined
														style="max-height: 300px; overflow: auto !important;">
														<!-- Dirtree OU List Component -->
														<DirtreeOUList
															ref="DirtreeOUList"
															@selectedDestination="setDestination" />
													</v-card>
												</v-expansion-panel-content>
											</v-expansion-panel>
										</v-expansion-panels>
									</v-col>
								</v-row>
								<!-- LDAP User Attributes -->
								<div v-if="isLDAPView">
									<v-row
										justify="center"
										class="pa-0 ma-0 font-weight-medium">
										<v-col
											cols="12"
											lg="4">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:label="$t('attribute.first_name')"
												v-model="userToCreate.first_name"
												:rules="[this.fieldRules(userToCreate.first_name, 'ge_name')]"></v-text-field>
										</v-col>
										<v-col
											cols="12"
											lg="4">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:label="$t('attribute.last_name')"
												v-model="userToCreate.last_name"
												:rules="[this.fieldRules(userToCreate.last_name, 'ge_name')]"></v-text-field>
										</v-col>
									</v-row>
									<v-row
										justify="center"
										class="pa-0 ma-0 font-weight-medium">
										<v-col
											cols="12"
											lg="6">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:label="$t('attribute.full_name')"
												v-model="getDisplayName"
												:rules="[this.fieldRules(getDisplayName, 'ge_topic')]"></v-text-field>
										</v-col>
										<v-col
											cols="12"
											lg="2">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:label="$t('attribute.initials')"
												v-model="userToCreate.initials"
												:rules="[this.fieldRules(userToCreate.initials, 'ge_topic')]"></v-text-field>
										</v-col>
									</v-row>
									<v-row
										justify="center"
										class="pa-0 ma-0 font-weight-medium">
										<v-col
											cols="12"
											lg="4">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:hint="$t('misc.autocomputedField')"
												persistent-hint
												:label="$t('attribute.user_principal_name')"
												readonly
												v-model="getUSN"></v-text-field>
										</v-col>
										<v-col
											cols="12"
											lg="4">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												:hint="$t('misc.autocomputedField')"
												persistent-hint
												:label="$t('attribute.user_principal_name_pre2000')"
												readonly
												v-model="getUSN_2000"></v-text-field>
										</v-col>
									</v-row>
								</div>
								<!-- Django User Attributes -->
								<div v-else>
									<v-row class="pa-0 ma-0 font-weight-medium">
										<v-col
											cols="12"
											lg="6">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												id="first_name"
												:label="$t('attribute.first_name')"
												v-model="userToCreate.first_name"
												:rules="[this.fieldRules(userToCreate.first_name, 'ge_name')]"></v-text-field>
										</v-col>
										<v-col
											cols="12"
											lg="6">
											<v-text-field
												dense
												@keydown.enter="nextStep()"
												id="last_name"
												:label="$t('attribute.last_name')"
												v-model="userToCreate.last_name"
												:rules="[this.fieldRules(userToCreate.last_name, 'ge_name')]"></v-text-field>
										</v-col>
									</v-row>
								</div>

								<v-row class="ma-0 pa-0">
									<v-divider class="mx-12 my-3 mt-6"></v-divider>
								</v-row>

								<!-- Optionals -->
								<v-row
									justify="center"
									class="mb-1">
									<span
										class="text-overline"
										style="font-size: .95em !important;">
										{{ $t("section.users.userCreate.optionalsHeader") }}
									</span>
								</v-row>
								<v-row
									justify="center"
									class="pa-0 ma-0 font-weight-medium"
									v-if="isLDAPView">
									<v-col
										cols="12"
										lg="4">
										<v-text-field
											dense
											@keydown.enter="nextStep()"
											:label="$t('attribute.user.email')"
											v-model="userToCreate.email"
											:rules="[this.fieldRules(userToCreate.email, 'ge_mail')]"></v-text-field>
									</v-col>
									<v-col
										cols="12"
										lg="4">
										<v-text-field
											dense
											@keydown.enter="nextStep()"
											:label="$t('attribute.website')"
											v-model="userToCreate.website"
											:rules="[this.fieldRules(userToCreate.website, 'ge_website')]"></v-text-field>
									</v-col>
								</v-row>
								<v-row
									justify="center"
									class="pa-0 ma-0 font-weight-medium"
									v-else>
									<v-col
										cols="12"
										lg="4">
										<v-text-field
											dense
											@keydown.enter="nextStep()"
											:label="$t('attribute.user.email')"
											v-model="userToCreate.email"
											:rules="[this.fieldRules(userToCreate.email, 'ge_mail')]"></v-text-field>
									</v-col>
								</v-row>
							</v-form>
						</v-stepper-content>
						<!-- Password -->
						<v-stepper-content step="2">

							<v-form
								ref="userCreateForm2"
								@submit.prevent>
								<v-row
									justify="center"
									class="pa-0 ma-0 font-weight-medium">
									<v-col
										cols="12"
										lg="4">
										<v-text-field
											id="password"
											ref="password"
											:type="passwordHidden ? 'password' : 'text'"
											required
											@keydown.enter="nextStep()"
											:append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
											@click:append="() => (passwordHidden = !passwordHidden)"
											dense
											:label="$t('attribute.password')"
											v-model="userToCreate.password"
											:rules="[this.fieldRules(userToCreate.password, 'ge_password')]"></v-text-field>
									</v-col>
									<v-col
										cols="12"
										lg="4">
										<v-text-field
											id="password_confirm"
											ref="password_confirm"
											:type="passwordHidden ? 'password' : 'text'"
											dense
											@keydown.enter="nextStep()"
											v-model="userToCreate.password_confirm"
											:label="$t('attribute.password_confirm')"
											:rules="[(v) => v == this.userToCreate.password ? true : this.$t('error.validation.passwordNotSame')]"></v-text-field>
									</v-col>
								</v-row>
								<v-list v-if="isLDAPView">
									<!-- Items -->
									<v-list-item
										two-line
										@keydown.enter="nextStep()"
										@click="onClickPermission(key)"
										:value="permissions[key].value"
										v-for="(value, key) in permissions"
										:key="key">
										<v-list-item-content class="pl-10">
											<!-- Title -->
											<v-list-item-title class="font-weight-bold">
												{{ $t('section.users.permissions.' + key) }}
											</v-list-item-title>
											<v-list-item-subtitle>
												{{ key }}
											</v-list-item-subtitle>
										</v-list-item-content>
										<v-list-item-action>
											<v-checkbox
												@keypress="false"
												@keydown="false"
												@click="onClickPermission(key)"
												v-model="permissions[key].value" />
										</v-list-item-action>
									</v-list-item>
								</v-list>
								<div v-else>
									<v-row no-gutters align="center" justify="center">
										<v-col cols="auto">
											<v-checkbox
												on-icon="mdi-checkbox-marked"
												color="primary"
												v-model="userToCreate.is_superuser"
												class="ma-0 pa-0 mx-2"
												:label="$t('attribute.is_superuser')"
												dense />
										</v-col>
										<v-col cols="auto">
											<v-checkbox
												on-icon="mdi-checkbox-marked"
												color="primary"
												v-model="userToCreate.is_staff"
												class="ma-0 pa-0 mx-2"
												:label="$t('attribute.is_staff')"
												dense />
										</v-col>
									</v-row>
								</div>
							</v-form>
						</v-stepper-content>
						<!-- Check if user exists - loader -->
						<v-stepper-content step="3">
							<v-row
								class="pa-12 ma-12"
								justify="center"
								align-content="center"
								align="center">
								<v-col cols="12">
									<v-fab-transition>
										<v-progress-circular
											value="100"
											:color="(this.error === false) ? (loading ? 'primary' : 'green') : 'red'"
											:indeterminate="loading"
											size="100"
											width="10">
											<v-fab-transition>
												<div v-show="loading == false">
													<v-icon
														v-if="error == true"
														size="82"
														color="red">mdi-close-circle</v-icon>
													<v-icon
														v-else
														size="82"
														color="green">mdi-check-circle</v-icon>
												</div>
											</v-fab-transition>
										</v-progress-circular>
									</v-fab-transition>
								</v-col>

								<v-col cols="12">
									<v-slide-y-transition>
										<v-col v-if="!this.loading && this.loading == false">
											<h3>
												{{ this.error ? this.errorMsg :
													$t('section.users.userCreate.step3_success')
												}}
											</h3>
										</v-col>
									</v-slide-y-transition>
								</v-col>
							</v-row>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</div>
		</v-expand-transition>

		<v-snackbar
			text
			color="red"
			timeout="1500"
			v-if="$vuetify.breakpoint.smAndDown"
			v-model="showSnackbar"
			centered>
			<v-row justify="center">
				{{ this.errorMsg }}
			</v-row>
		</v-snackbar>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row
				class="ma-1 pa-0"
				:justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<!-- Back and Next buttons -->
				<div>
					<v-slide-x-reverse-transition>
						<v-chip
							class="mx-2"
							color="red"
							v-if="this.error && $vuetify.breakpoint.mdAndUp"
							text-color="white">
							{{ this.errorMsg }}
						</v-chip>
					</v-slide-x-reverse-transition>

					<v-slide-x-reverse-transition>
						<v-btn
							elevation="0"
							@click="newUser"
							v-if="this.createStage < 2"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pr-4"
							rounded>
							<v-icon
								class="ma-0 mr-1"
								color="primary">
								mdi-cached
							</v-icon>
							{{ $t("actions.reset") }}
						</v-btn>
					</v-slide-x-reverse-transition>

					<v-slide-x-reverse-transition>
						<v-btn
							elevation="0"
							@click="prevStep"
							v-if="createStage > 1 && createStage < 4"
							@keydown.enter="prevStep"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 pr-4 ma-1"
							rounded>
							<v-icon
								class="ma-0"
								color="primary">
								mdi-chevron-double-left
							</v-icon>
							{{ $t("actions.back_short") }}
						</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn
							elevation="0"
							@click="nextStep()"
							v-if="this.createStage < 3"
							@keydown.enter="nextStep()"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pl-4"
							rounded>
							{{ 
							this.createStage > 1 && 
								(
									!this.userToCreate.password ||
									this.userToCreate.password.length === 0
								) ? $t("actions.skip") : $t("actions.next") 
							}}
							<v-icon
								class="ma-0"
								color="primary">
								mdi-chevron-double-right
							</v-icon>
						</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn
							elevation="0"
							@click="closeDialog(true)"
							v-if="this.createStage > 2 && this.error === false"
							@keydown.enter="closeDialog(true)"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pr-4"
							rounded>
							<v-icon
								class="ma-0 mr-1"
								color="primary">
								mdi-checkbox-marked-circle-outline
							</v-icon>
							{{ $t("actions.done") }}
						</v-btn>
					</v-slide-x-reverse-transition>
				</div>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { getDomainDetails } from '@/include/utils.js';
import LDAPObjectClasses from '@/include/constants/LDAPObjectClasses.js';
import { LDAPUserCategories } from '@/include/constants/LDAPUser.js';

export default {
	name: 'UserCreate',
	components: {
		DirtreeOUList
	},
	data() {
		return {
			passwordHidden: true,
			domain: "",
			realm: "",
			basedn: "",
			success: false,
			loading: true,
			error: false,
			errorMsg: "",
			valid: false,
			allowRefresh: true,
			showSnackbar: false,
			userPathExpansionPanel: false,
			userDestination: '',
			userToCreate: {},
			createStage: 1,
			addObjectClass: "",
			objectClasses: LDAPObjectClasses,
			permissions: {
				"LDAP_UF_ACCOUNT_DISABLE": {
					value: false,
					int: 2
				},
				"LDAP_UF_PASSWD_CANT_CHANGE": {
					value: false,
					int: 64
				},
				"LDAP_UF_DONT_EXPIRE_PASSWD": {
					value: false,
					int: 65536
				},
			},
			categories: LDAPUserCategories
		}
	},
	mixins: [
		validationMixin,
		utilsMixin
	],
	props: {
		dialogKey: String,
		parentTitle: String,
		userClass: Function,
	},
	created() {
		this.newUser
	},
	computed: {
		isLDAPView() {
			return this.parentTitle === 'ldap-users'
		},
		calcEnabledPerms() {
			var result = 0
			for (const [key, value] of Object.entries(this.permissions)) {
				if (value == true) {
					result += this.permission_values[key]
				}
			}
			return result
		},
		getEnabledPerms() {
			var array = []
			for (const [key, value] of Object.entries(this.permissions)) {
				if (value == true)
					array.push(key)
			}
			return array
		},
		getUSN() {
			if (this.userToCreate.username != undefined)
				return this.userToCreate.username + "@" + this.domain
			else
				return "@" + this.domain
		},
		getUSN_2000() {
			if (this.userToCreate.username != undefined)
				return this.realm + "\\" + this.userToCreate.username
			else
				return this.realm + "\\"
		},
		getDisplayName() {
			if (this.userToCreate.first_name != undefined && this.userToCreate.first_name != "" ||
				this.userToCreate.last_name != undefined && this.userToCreate.last_name != ""
			)
				return (this.userToCreate.first_name || "") + " " + (this.userToCreate.last_name || "").trim()
			else
				return ""
		}
	},
	watch: {
		"userToCreate.is_superuser": {
			deep: true,
			handler(newValue) {
				if (newValue === true)
					this.userToCreate.is_staff = true;
			},
		},
	},
	methods: {
		setDestination(destination = undefined) {
			// Set default destination if undefined
			if (destination == undefined || !destination) {
				this.userDestination = this.basedn
				this.userPathExpansionPanel = 0
			}
			// Set destination from arg
			else {
				this.userDestination = destination
				this.userPathExpansionPanel = false
			}
		},
		prevStep() {
			let domainDetails
			switch (this.createStage) {
				case 2:
					domainDetails = getDomainDetails()
					this.domain = domainDetails.name
					this.realm = domainDetails.realm
					this.basedn = domainDetails.basedn
					this.createStage -= 1
					break;
				case 3:
					this.createStage -= 1
					setTimeout(() => {
						this.loading = true;
					}, 500);
					break;
				default:
					this.createStage -= 1
					break;
			}
			this.error = false
			this.errorMsg = ""
		},
		nextStep() {
			switch (this.createStage) {
				case 1:
					if (this.$refs.userCreateForm1.validate()) {
						this.error = false
						this.errorMsg = ""
						this.createStage += 1
					}
					else {
						// Force snackbar to reappear if error was pre-existent
						if (this.showSnackbar == true)
							this.showSnackbar = false
						this.showSnackbar = true
						this.error = true
						this.errorMsg = this.$t('error.validation.fieldinvalid')
					}
					break;
				case 2:
					if (this.$refs.userCreateForm2.validate()) {
						this.error = false
						this.errorMsg = ""
						let permissions = []
						Object.keys(this.userToCreate).forEach(key => {
							if (this.userToCreate[key] === undefined) {
								delete this.userToCreate[key];
							}
						});
						Object.keys(this.permissions).forEach(key => {
							if (this.permissions[key].value == true)
								permissions.push(key)
						});
						this.userToCreate.permissions = permissions
						this.createUser()
					}
					else {
						// Force snackbar to reappear if error was pre-existent
						if (this.showSnackbar == true)
							this.showSnackbar = false
						this.showSnackbar = true
						this.error = true
						this.errorMsg = this.$t('error.validation.fieldinvalid')
					}
					break;
				default:
					this.createStage += 1
					break;
			}
		},
		async newUser() {
			this.passwordHidden = true
			this.userPathExpansionPanel = false
			this.userToCreate = new this.userClass({})
			this.userToCreate.password = ""
			this.userToCreate.password_confirm = ""
			this.createStage = 1
			this.error = false
			this.errorMsg = ""
			this.$refs.userCreateForm1.resetValidation()
			for (const [key] of Object.entries(this.permissions))
				this.permissions[key].value = false
			let domainDetails = getDomainDetails()
			this.domain = domainDetails.name
			this.realm = domainDetails.realm
			this.basedn = domainDetails.basedn
			this.fetchOUs()
			this.userDestination = "CN=Users," + this.basedn
		},
		async fetchOUs(refresh = false) {
			if (refresh == true)
				this.userPathExpansionPanel = 0
			if (this.$refs.DirtreeOUList != undefined) {
				this.allowRefresh = false
				this.$nextTick(() => {
					if (refresh != true)
						this.setDestination()
					this.$refs.DirtreeOUList.fetchOUs()
						.then(() => {
							setTimeout(() => {
								this.allowRefresh = true
							}, 50)
						})
				})
			}
		},
		onClickPermission(key) {
			this.permissions[key].value = !this.permissions[key].value
		},
		closeDialog(refresh = false) {
			this.$emit('closeDialog', this.dialogKey, refresh);
		},
		async createUser() {
			this.error = false
			this.errorMsg = ""
			this.createStage += 1
			this.userToCreate.path = this.userDestination
			await this.userToCreate.insert(this.userToCreate)
				.then(response => {
					if (response.status == 200) {
						this.error = false;
						this.errorMsg = "";
						// Set Timeout to do circle animation
						setTimeout(() => {
							this.loading = false;
						}, 450)
						this.success = true;
					} else {
						this.error = true;
						this.errorMsg = this.$t("error.unknown_short")
						// Set Timeout to do circle animation
						setTimeout(() => {
							this.loading = false;
						}, 450)
						this.success = false;
					}
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					this.success = true
					this.errorMsg = this.getMessageForCode(error)
				})
		}
	}
}
</script>
