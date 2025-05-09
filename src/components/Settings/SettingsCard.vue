<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: SettingsCard.vue ----------------------------->
<template>
	<v-card outlined flat class="ma-0 pa-0">
		<v-progress-linear :indeterminate="testing == true" :value="testFinished ? 100 : 0"
			:color="testFinished ? (!testError ? 'valid-40-s' : 'red') : 'primary'" />
		<!-- Top Button Row 1 -->
		<v-row class="ma-0 ma-1 px-4 py-0 sticky-top"
			style="top: 3.5rem !important; z-index: var(--home-footer-z-index) !important;"
			justify="center">
			<v-btn
				@click="resetDialog = true" :disabled="readonly || loading"
				elevation="0"
				:dark="!(readonly || loading)"
				:light="isThemeDark($vuetify) && !(readonly || loading)"
				class="ma-0 pa-0 pa-4 ma-1 mx-1"
				color="red">
				<v-icon class="mr-1">
					mdi-backup-restore
				</v-icon>
				{{ $t("actions.restoreDefaultValues") }}
			</v-btn>
			<v-btn
				@click="testSettings" :disabled="readonly || loading || !settingClsEnabled('ldap')"
				elevation="0"
				:dark="!isThemeDark($vuetify) && !(readonly || loading || !settingClsEnabled('ldap'))"
				:light="isThemeDark($vuetify) && !(readonly || loading || !settingClsEnabled('ldap'))"
				class="ma-0 pa-0 pa-4 ma-1 mx-1">
				<span>
					{{ $t("actions.testSettings") }}
				</span>
				<v-progress-circular :indeterminate="testing == true"
					:value="testFinished ? 100 : 0"
					:color="testFinished ? (!testError ? 'green' : 'red') : 'primary'" size="26"
					class="ml-3">
					<v-fab-transition>
						<v-icon v-if="!testing && !testFinished" color="primary">
							mdi-blur-radial
						</v-icon>
						<v-icon v-else-if="testFinished && !testError">
							mdi-checkbox-marked-circle
						</v-icon>
						<v-icon v-else-if="testFinished == true && testError == true">
							mdi-close-circle
						</v-icon>
					</v-fab-transition>
				</v-progress-circular>
			</v-btn>
		</v-row>
		<!-- Top Button Row 2 -->
		<v-row class="ma-0 ma-1 px-4 py-0 mb-4 sticky-top"
			style="top: 6.3rem !important; z-index: var(--home-footer-z-index) !important;"
			justify="center">
			<v-btn
				@click="saveSettings" :disabled="readonly || loading"
				elevation="0"
				:dark="!isThemeDark($vuetify) && !(readonly || loading)"
				:light="isThemeDark($vuetify) && !(readonly || loading)"
				style="border-radius: 0; border-bottom-left-radius: 0.3rem; border-top-left-radius: 0.3rem;"
				class="ma-0 pa-0 pa-4 ma-1 mr-0">
				<v-icon class="mr-1">
					mdi-content-save
				</v-icon>
				{{ $t("actions.save") }}
			</v-btn>
			<v-btn @click="refreshSettings"
				style="border-radius: 0; border-bottom-right-radius: 0.3rem; border-top-right-radius: 0.3rem;"
				elevation="0"
				class="ma-0 pa-0 pa-4 ma-1 ml-0"
				color="primary">
				<v-icon :class="(loading == true ? 'custom-loader' : '') + ' mr-1'">
					mdi-cached
				</v-icon>
				{{ $t("actions.refresh") }}
			</v-btn>
		</v-row>
		<!-- Validation Fail Message -->
		<v-slide-y-transition>
			<v-row justify="center" v-if="invalid == true">
				<v-alert type="warning" dense>
					{{ $t("section.settings.settingFailedValidation") }}
				</v-alert>
			</v-row>
		</v-slide-y-transition>
		<v-row justify="center" align="center">
			<v-col cols="6" sm="8" md="6">
				<v-select class="ma-0 pa-0"
					id="defaultPresetSelect"
					:items="presets"
					outlined
					dense
					hide-details
					:label="$t('actions.ldap.configPreset')"
					:disabled="!presets || presets.length <= 1"
					item-value="id"
					@change="refreshSettings"
					v-model="presetId">
					<template slot="selection" slot-scope="data">
						{{ data.item.name == "default" ? $t("actions.ldap.defaultPreset") :
							`${data.item.label}` }}
						<v-tooltip bottom v-if="data.item.active === true">
							<template v-slot:activator="{ on, attrs }">
								<v-icon class="ml-2" color="valid-35" small v-bind="attrs"
									v-on="on">
									mdi-check-circle
								</v-icon>
							</template>
							<span>
								{{ $t("section.settings.activePreset") }}
							</span>
						</v-tooltip>
					</template>
					<template
						slot="item"
						slot-scope="data">
						{{ data.item.name == "default" ? $t("actions.ldap.defaultPreset") :
							`${data.item.label}` }}
						<v-tooltip bottom v-if="data.item.active === true">
							<template v-slot:activator="{ on, attrs }">
								<v-icon class="ml-2" color="valid-35" small v-bind="attrs"
									v-on="on">
									mdi-check-circle
								</v-icon>
							</template>
							<span>
								{{ $t("section.settings.activePreset") }}
							</span>
						</v-tooltip>
					</template>
				</v-select>
			</v-col>
			<v-col cols="auto">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							v-bind="attrs"
							v-on="on"
							@click="settingsPresetEnable"
							:disabled="readonly || loading || isActivePreset()"
							class="mx-1"
							color="secondary"
							small
							elevation="0">
							<v-icon>
								mdi-location-enter
							</v-icon>
						</v-btn>
					</template>
					<span>{{ $t("actions.enable") }}</span>
				</v-tooltip>

				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							v-bind="attrs"
							v-on="on"
							@click="renamingProfile = !renamingProfile; addingProfile = false"
							:disabled="readonly || loading"
							class="mx-1"
							:color="renamingProfile ? 'primary' : 'secondary'"
							small
							elevation="0">
							<v-icon>
								mdi-pencil
							</v-icon>
						</v-btn>
					</template>
					<span>{{ $t("actions.rename") }}</span>
				</v-tooltip>

				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-bind="attrs"
							v-on="on"
							class="mx-1"
							@click="addingProfile = !addingProfile; renamingProfile = false"
							:color="addingProfile ? 'primary' : 'secondary'"
							small
							elevation="0"
							icon>
							<v-icon>
								mdi-plus-circle
							</v-icon>
						</v-btn>
					</template>
					<span>{{ $t("actions.addN") }}</span>
				</v-tooltip>

				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<v-btn
							v-bind="attrs"
							v-on="on"
							@click="settingsPresetDelete"
							:disabled="loading || readonly || isActivePreset() || presets.length <= 1"
							class="mx-1" color="error-60-s" small elevation="0" icon>
							<v-icon>
								mdi-delete
							</v-icon>
						</v-btn>
					</template>
					<span>{{ $t("actions.delete") }}</span>
				</v-tooltip>
			</v-col>
		</v-row>
		<v-expand-transition>
			<v-row
				class="ma-0 pa-0 mx-1"
				v-if="addingProfile || renamingProfile"
				align="center"
				justify="center">
				<v-col
					cols="8"
					md="6"
					lg="7">
					<v-text-field
						:label="$t('actions.ldap.newConfigPreset')"
						v-model="newPresetLabel"
						:hint="renamingProfile ? $t('section.settings.configLabelFieldHint') : ''"
						:persistent-hint="renamingProfile"
						:rules="[this.fieldRules(newPresetLabel, 'ge_name', newPresetLabel.length > 0 ? true : false)]">
					</v-text-field>
				</v-col>
				<v-col cols="auto">
					<v-row
						class="pa-0 ma-0"
						justify="center"
						align="center">
						<v-btn
							@click="settingsPresetCreateOrRename"
							class="mx-1"
							color="accent-55-s"
							small
							elevation="0"
							icon
							:disabled="!newPresetNameValid || newPresetLabel.length == 0">
							<v-icon>
								{{ renamingProfile ? "mdi-content-save" : "mdi-content-save-plus" }}
							</v-icon>
						</v-btn>
					</v-row>
				</v-col>
			</v-row>
		</v-expand-transition>
		<v-row
			class="mx-2"
			justify="center">
			<v-checkbox
				off-icon="mdi-close-box"
				:label="$t('section.settings.superAdminIs') + ' ' + (defaultAdminEnabled ? $t('words.enabled') : $t('words.disabled'))"
				v-model="defaultAdminEnabled" />
		</v-row>
		<v-row
			class="mx-4"
			justify="center">
			<v-col
				cols="10"
				md="4"
				xl="3">
				<v-text-field
					type="password"
					v-model="defaultAdminPwd"
					ref="defaultAdminPwd"
					:rules="[this.fieldRules(defaultAdminPwd, 'ge_password', defaultAdminPwdConfirm.length > 0 ? true : false)]"
					:label="$t('section.settings.superAdminPwd')" />
			</v-col>
			<v-col
				cols="10"
				md="4"
				xl="3">
				<v-text-field
					type="password"
					v-model="defaultAdminPwdConfirm"
					ref="defaultAdminPwdConfirm"
					:rules="[this.fieldRules(defaultAdminPwdConfirm, 'ge_password', defaultAdminPwd.length > 0 ? true : false)]"
					:label="$t('section.settings.superAdminPwdConfirm')" />
			</v-col>
		</v-row>
		<v-expansion-panels
			class="mb-6"
			multiple
			accordion
			flat>
			<v-expansion-panel
				class="settings-category"
				v-for="(cls, clsKey) in config"
				:disabled="!settingClsEnabled(clsKey)"
				:key="clsKey">
				<v-expansion-panel-header ripple class="settings-category-header">
					<v-row no-gutters justify="center">
						{{ $t(`section.settings.headers.${clsKey}.title`) }}
					</v-row>
				</v-expansion-panel-header>
				<v-expansion-panel-content class="mt-6 mb-2 pa-0" eager>
					<v-row v-if="clsKey == 'ldap'"
						class="pa-0 ma-0"
						justify="center"
						align="center">
						<v-btn
							:disabled="!settingClsEnabled(clsKey)"
							@click="requestLDAPUserSync"
							class="mx-1 mb-4"
							color="primary"
							elevation="0">
							<v-icon class="mr-2">
								mdi-account-sync
							</v-icon>
							{{ `${$t("actions.synchronize")} ${$tc("classes.user", 2)}` }}
						</v-btn>
						<v-btn
							:disabled="!settingClsEnabled(clsKey)"
							@click="requestLDAPUserPrune"
							class="mx-1 mb-4"
							color="primary"
							elevation="0">
							<v-icon class="mr-2">
								mdi-account-wrench
							</v-icon>
							{{ `${$t("actions.prune")} ${$tc("classes.user", 2)}` }}
						</v-btn>
						<v-btn
							:disabled="!settingClsEnabled(clsKey)"
							@click="requestLDAPUserPurge"
							class="mx-1 mb-4"
							color="secondary"
							elevation="0">
							<v-icon class="mr-2">
								mdi-account-off
							</v-icon>
							{{ `${$t("actions.purge")} ${$tc("classes.user", 2)}` }}
						</v-btn>
					</v-row>
					<v-form
						:disabled="!settingClsEnabled(clsKey)"
						:ref="`${clsKey}SettingsForm`"
						@submit.prevent>
						<v-row>
							<v-col
								cols="12"
								v-for="(category, categoryKey) in cls"
								:key="categoryKey">
								<!-- Category Header -->
								<v-row
									class="ma-0 pa-0"
									justify="center">
									<h4>
										{{ $t(`section.settings.headers.${clsKey}.${categoryKey}`) }}
									</h4>
								</v-row>

								<!-- Category Body -->
								<v-row
									class="ma-1 pa-1"
									align="center"
									justify="center"
									v-for="(row, rowKey) in category"
									:key="rowKey">
									<v-col
										:class="'ma-0 pa-0'"
										cols="10"
										:md="getColSize(rowKey, 'md')"
										:lg="getColSize(rowKey, 'lg')"
										v-for="(item, key) in row"
										:key="key">
										<!-- Checkbox Settings -->
										<v-checkbox
											:class="'pa-0 ma-0 ' + (key == 'LDAP_AUTH_USE_TLS' ? 'mt-4' : '') + ' ' + item.extraClasses"
											v-if="item.type == 'checkbox' || item.type == 'boolean' || item.type == 'bool'"
											v-model="item.value"
											:disabled="item.disabled"
											:readonly="item.readonly || readonly == true"
											:hint="$t(item.hint)"
											:persistent-hint="item.persistentHint"
											:label="$t('section.settings.fields.' + key)" />
										<!-- List / Array of Settings -->
										<v-card
											flat
											outlined
											class="ma-0 px-6 py-2"
											v-else-if="item.type == 'list' || item.type == 'array'">
											<v-row class="ma-0 pa-0">
												<v-text-field
													:label="$t('section.settings.fields.' + key)"
													:readonly="item.readonly || readonly == true"
													:hint="$t(item.hint)"
													:persistent-hint="item.persistentHint"
													@keydown.enter="addToArray(item.add, item, 'LIST_KEY_' + key)"
													v-model="item.add"
													:ref="'LIST_KEY_' + key"
													:required="item.required && item.value.length == 0 ? true : false"
													:rules="item.validator ? [fieldRules(item.add, item.validator, (item.required && item.value.length == 0 ? true : false))] : undefined"
													:id="'LIST_KEY_' + key" />
												<v-btn
													color="primary"
													class="mt-3 ml-5"
													@click="addToArray(item.add, item, 'LIST_KEY_' + key)"
													:disabled="item.readonly || readonly == true || !settingClsEnabled(clsKey)"
													rounded
													icon>
													<v-icon>
														mdi-plus
													</v-icon>
												</v-btn>
											</v-row>
											<v-list-item
												v-for="subItem, subItemKey in item.value"
												:key="subItemKey">
												<v-list-item-content>
													{{ subItem }}
												</v-list-item-content>
												<v-list-item-action>
													<v-btn
														color="primary"
														class="ml-5"
														:disabled="item.readonly || readonly == true || !settingClsEnabled(clsKey)"
														@click="removeFromArray(subItem, item)"
														rounded
														small
														icon>
														<v-icon small>
															mdi-minus
														</v-icon>
													</v-btn>
												</v-list-item-action>
											</v-list-item>
										</v-card>
										<!-- LDAP URI Type -->
										<v-card
											flat
											outlined
											class="ma-0 px-6 py-2"
											v-else-if="item.type == 'ldap_uri'">
											<v-row class="ma-0 pa-0">
												<v-col cols="3">
													<v-select
														:label="$t('section.settings.fields.LDAP_URI_PREFIX')"
														ref="ldapUriPrefix"
														id="ldapUriPrefix"
														:readonly="item.readonly || readonly == true"
														v-model="item.addPREFIX"
														:items="['ldap://', 'ldaps://']" />
												</v-col>
												<v-col>
													<v-text-field
														:label="$t('section.settings.fields.LDAP_URI_IP')"
														:readonly="item.readonly || readonly == true"
														@keydown.enter="addServer(item)"
														v-model="item.addIP"
														ref="ldapUriIP"
														:required="item.required && item.value.length == 0 ? true : false"
														:rules="[fieldRules(item.addIP, 'net_ip_uri', (item.required && item.value.length == 0 || item.addPORT.length > 0 ? true : false))]"
														id="ldapUriIP" />
												</v-col>
												<v-col>
													<v-text-field
														:label="$t('section.settings.fields.LDAP_URI_PORT')"
														:readonly="item.readonly || readonly == true"
														:hint="$t('section.settings.fields.LDAP_URI_PORT_HINT')"
														persistent-hint
														@keydown.enter="addServer(item)"
														v-model="item.addPORT"
														ref="ldapUriPort"
														:required="item.required && item.value.length == 0 ? true : false"
														:rules="[fieldRules(item.addPORT, 'net_port', (item.required && item.value.length == 0 || item.addIP.length > 0 ? true : false))]"
														id="ldapUriPort" />
												</v-col>
												<v-btn
													color="primary"
													class="mt-3 ml-5"
													@click="addServer(item)"
													:disabled="item.readonly || readonly == true || !settingClsEnabled(clsKey)"
													rounded
													icon>
													<v-icon>
														mdi-plus
													</v-icon>
												</v-btn>
											</v-row>
											<v-list-item
												v-for="subItem, subItemKey in item.value"
												:key="subItemKey">
												<v-list-item-content>
													{{ subItem }}
												</v-list-item-content>
												<v-list-item-action>
													<v-btn
														color="primary"
														class="ml-5"
														@click="removeFromArray(subItem, item)"
														:disabled="item.readonly || readonly == true || !settingClsEnabled(clsKey)"
														rounded
														small
														icon>
														<v-icon small>
															mdi-minus
														</v-icon>
													</v-btn>
												</v-list-item-action>
											</v-list-item>
										</v-card>
										<!-- Object Type Settings -->
										<v-card
											flat
											outlined
											class="ma-0 px-6 py-2 pt-4"
											v-else-if="item.type == 'object' || item.type == 'json'">
											<ObjectEditor
												:value="item.value"
												:label="$t('section.users.import.dataMapping')"
												ref="settingFieldsEditor"
												@update="v => item.value = v"
												dense
												:disableAddDelete="!item.allow_add_delete"
												:required="item.required" />
										</v-card>
										<!-- Select Settings -->
										<v-select
											:label="$t('section.settings.fields.' + key)"
											v-else-if="item.type == 'select' || item.type == 'ldap_tls'"
											:readonly="item.readonly || readonly == true"
											v-model="item.value"
											:hint="$t(item.hint)"
											:persistent-hint="item.persistentHint"
											:id="key"
											:items="item.choices" />
										<!-- Password Settings -->
										<v-text-field
											v-else-if="item.type == 'password' || item.type == 'crypt'"
											:type="item.hidden ? 'password' : 'text'"
											:readonly="item.readonly || readonly == true"
											required
											:append-icon="readonly == true ? undefined : (item.hidden ? 'mdi-eye' : 'mdi-eye-off')"
											@click:append="() => (item.hidden = !item.hidden)"
											dense
											:label="$t('attribute.password')"
											v-model="item.value"
											:rules="[fieldRules(item.value, 'ge_password', getRequired(item.required))]" />
										<!-- Text Field Settings -->
										<v-text-field
											:label="$t('section.settings.fields.' + key)"
											v-else
											:class="item.extraClasses"
											:readonly="item.readonly || readonly == true"
											:hint="$t(item.hint)"
											:rules="item.validator ? [fieldRules(item.value, item.validator, item.required)] : undefined"
											:persistent-hint="item.persistentHint"
											v-model="item.value"
											:id="key" />
									</v-col>
								</v-row>
							</v-col>
						</v-row>
					</v-form>
				</v-expansion-panel-content>
			</v-expansion-panel>
		</v-expansion-panels>

		<v-dialog
			v-model="resetDialog"
			max-width="650px">
			<SettingsResetDialog
				@resetConfirm="restoreDefaultValues"
				@closeDialog="resetDialog = false" />
		</v-dialog>
	</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import Settings from '@/include/Settings.js';
import Liveness from '@/include/Liveness.js';
import SettingsResetDialog from '@/components/Settings/SettingsResetDialog.vue'
import ObjectEditor from '@/components/Settings/ObjectEditor.vue'
import { notificationBus } from '@/main.js'
import LDAPSettings from '@/include/constants/LDAPSettings.js'

export default {
	name: 'SettingsCard',
	mixins: [validationMixin, utilsMixin],
	components: {
		SettingsResetDialog,
		ObjectEditor
	},
	data() {
		return {
			checking_backend: false,
			backend_offline: false,
			testing: false,
			testError: false,
			testFinished: false,
			readonly: true,
			saveTimerId: 0,
			invalid: false,
			loading: true,
			resetDialog: false,
			defaultAdminEnabled: true,
			defaultAdminPwd: "",
			defaultAdminPwdConfirm: "",
			presetId: -1,
			presets: [],
			newPresetLabel: "",
			addingProfile: false,
			renamingProfile: false,
			config: {
				local: {
					general: {
						row1: {
							ILCK_ENABLE_LDAP: {
								value: false,
								type: "boolean",
							}
						}
					}
				},
				ldap: LDAPSettings
			}
		}
	},
	props: {
		viewTitle: String
	},
	mounted() {
		this.refreshSettings();
	},
	computed: {
		newPresetNameValid() {
			if (this.presets.map((v) => v.label).includes(this.newPresetLabel)) return false
			return this.fieldRules(this.newPresetLabel, 'ge_name', this.newPresetLabel.length > 0 ? true : false) === true
		}
	},
	watch: {
		// config: {
		// 	deep: true,
		// 	immediate: true,
		// 	handler: function (val, oldVal) {
		// 		console.log(val)
		// 	}
		// },
		addingProfile(new_v) {
			if (new_v === true) this.newPresetLabel = ""
		},
		renamingProfile(new_v) {
			if (new_v === true) {
				let activePreset = this.getSelectedPreset()
				if (activePreset && 'label' in activePreset)
					this.newPresetLabel = activePreset["label"]
			}
		}
	},
	methods: {
		getSelectedPreset() {
			for (let i = 0; i < this.presets.length; i++) {
				const ps = this.presets[i];
				if (ps.id == this.presetId) return ps
			}
		},
		isActivePreset() {
			for (let i = 0; i < this.presets.length; i++) {
				const ps = this.presets[i];
				if (ps.id == this.presetId && ps.active == true) return true
			}
			return false
		},
		createSnackbar(notifObj) {
			notificationBus.$emit('createNotification', notifObj);
		},
		// This function returns true or false based on another key value 
		// if a data key path is passed through
		getRequired(value, sameObject = false, valueField = false) {
			if (value === true || value === false)
				return value
			value = value.split('.')

			let currentPath = this[value[0]]
			value.forEach(function callback(subpath, key) {
				if (key != 0)
					currentPath = currentPath[subpath]
			});
			if (sameObject == true && valueField == true)
				return currentPath['keyToAdd']
			else if (sameObject == true)
				return currentPath['valueToAdd']
			return currentPath['value']
		},
		getColSize(key, breakpoint) {
			// REGEX Switch
			switch (true) {
				case /LDAP_LOG_[A-Z]{0,}/.test(key):
					if (this.$vuetify.breakpoint.mdAndUp)
						return 8
					else
						return 10
				default:
					break;
			}
			// STRING Switch
			switch (key) {
				case 'LDAP_AUTH_URL':
					if (breakpoint == 'md')
						return 10
					else
						return 8
				case 'LDAP_AUTH_USE_TLS':
					return 3
				case 'LDAP_AUTH_TLS_VERSION':
					return 5
				default:
					return 8
			}
		},
		async testSettings() {
			this.loading = true
			this.invalid = false
			if (!this.validateSettings() ||
				!this.$refs.defaultAdminPwd.validate() ||
				!this.$refs.defaultAdminPwdConfirm.validate())
				this.invalid = true

			if (this.invalid)
				return

			await new Settings({}).test(this.getConfigValues()['ldap']).then(() => {
				setTimeout(() => {
					this.loading = false
					this.readonly = false
					this.testing = false
					this.testFinished = true
					this.testError = false
					this.createSnackbar({ message: (this.$t("section.settings.testSuccess")).toUpperCase(), type: 'success' })
				}, 500)
			})
				.catch(error => {
					console.error(error)
					this.createSnackbar({ message: this.getMessageForCode(error), type: 'error' })
					setTimeout(() => {
						this.loading = false
						this.readonly = false
						this.testing = false
						this.testFinished = true
						this.testError = true
					}, 500)
				})
		},
		async sleep(time_in_milliseconds) {
			clearTimeout(this.saveTimerId)
			await new Promise(r => this.saveTimerId = setTimeout(r, time_in_milliseconds));
		},
		async checkBackendStatus() {
			if (this.backend_offline == true && this.checking_backend == true) return
			this.checking_backend = true
			await new Liveness({}).check()
				.then(() => {
					this.checking_backend = false
					this.backend_offline = false
				})
				.catch(() => {
					this.checking_backend = false
					this.backend_offline = true
				})
		},
		async backendAlive() {
			this.backend_offline = true
			let aliveCheckCountLimit = 20;
			let aliveCheckCount = 0;
			let aliveCheckFrequencyMsec = 500;
			while (this.backend_offline === true && await (new Promise(resolve => setTimeout(() => resolve(aliveCheckCount), aliveCheckFrequencyMsec))) < aliveCheckCountLimit) {
				await this.checkBackendStatus()
				aliveCheckCount++
			}
			return
		},
		async saveSettings() {
			this.invalid = false
			if (!this.validateSettings() ||
				!this.$refs.defaultAdminPwd.validate() ||
				!this.$refs.defaultAdminPwdConfirm.validate())
				this.invalid = true

			if (this.invalid === true)
				return

			this.loading = true
			var dataToSend = {}
			dataToSend = this.getConfigValues()
			dataToSend['DEFAULT_ADMIN_ENABLED'] = this.defaultAdminEnabled
			dataToSend['DEFAULT_ADMIN_PWD'] = this.defaultAdminPwd
			let preset = {}
			preset["id"] = this.presetId
			if (this.renamingProfile === true && this.newPresetLabel.length > 0)
				preset["label"] = this.newPresetLabel
			await new Settings({}).save({ settings: dataToSend, preset: preset })
				.then(() => {
					this.loading = false
					this.readonly = false
					this.createSnackbar({
						message: (`${this.$tc("classes.setting", 5)} ${this.$tc("words.saved.m", 5)}`).toUpperCase(),
						type: 'success'
					})
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.readonly = false
					this.createSnackbar({ message: this.getMessageForCode(error), type: 'error' })
				})
			await this.backendAlive().then(() => {
				this.refreshSettings(false)
			})
		},
		getSettingValue(clsKey, valueKey) {
			for (const [categoryKey, category] of Object.entries(this.config[clsKey])) {
				for (const [rowKey, row] of Object.entries(category)) {
					if (valueKey in row) {
						return row[valueKey].value
					}
				}
			}
		},
		settingClsEnabled(clsKey) {
			if (clsKey == "ldap")
				return this.getSettingValue("local", "ILCK_ENABLE_LDAP") === true
			return true
		},
		validateSettings() {
			this.invalid = false
			const configKeys = Object.keys(this.config)
			for (let i = 0; i < configKeys.length; i++) {
				const clsKey = configKeys[i];
				const ref = `${clsKey}SettingsForm`
				const refLen = this.$refs[ref] ? this.$refs[ref].length : 0
				if (this.$refs[ref][refLen - 1] !== undefined)
					if (!this.$refs[ref][refLen - 1].validate())
						this.invalid = true
			}

			this.readonly = true
			if (this.testFinished) {
				this.testing = false
				this.testFinished = false
				this.testError = false
			}
			return !this.invalid
		},
		setSettingsClassData(cls, settings) {
			let config = this.config[cls]
			for (const category of Object.values(config)) {
				for (const row of Object.values(category)) {
					for (const settingKey in row) {
						if (settingKey in settings) {
							row[settingKey].value = settings[settingKey].value
							row[settingKey].type = settings[settingKey].type
						}
					}
				}
			}
		},
		async refreshSettings(snackbar = true, resetPreset = false) {
			this.readonly = true
			this.loading = true
			this.invalid = false
			this.testing = false
			this.testError = false
			this.testFinished = false
			if (resetPreset) {
				this.addingProfile = false
				this.renamingProfile = false
			}
			// Fetch Presets
			await new Settings({}).list()
				.then(r => {
					this.presets = r.data.presets
					if (this.presetId == -1 || !this.presetId || !r.data.presets.map(v => v.id).includes(this.presetId) || resetPreset)
						this.presetId = r.data.active_preset
				})
				.catch(e => {
					console.error(e)
					this.loading = false
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					this.error = true
					this.readonly = false
				})

			// Fetch Current Preset Data
			await new Settings({}).fetch(this.presetId)
				.then(response => {
					const data = response.data.settings
					this.defaultAdminEnabled = data.ldap['DEFAULT_ADMIN_ENABLED']
					this.defaultAdminPwd = ""
					this.defaultAdminPwdConfirm = ""

					for (const cls in data) {
						if (Object.prototype.hasOwnProperty.call(data, cls)) {
							this.setSettingsClassData(cls, data[cls])
						}
					}
					this.loading = false
					if (snackbar === true)
						this.createSnackbar({ message: (this.$tc("classes.setting", 5) + " " + this.$tc("words.loaded.m", 5)).toUpperCase(), type: 'success' })
					setTimeout(() => {
						this.readonly = false
						this.$emit("refreshDomain")
					}, 300)
					this.error = false
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.createSnackbar({ message: this.getMessageForCode(error), type: 'error' })
					this.error = true
					this.readonly = false
				})
			this.$emit('done')
		},
		async restoreDefaultValues() {
			this.resetDialog = false
			this.loading = true
			this.backend_offline = true
			await new Settings({}).reset()
				.then(async () => {
					await this.backendAlive(true).then(() => {
						this.refreshSettings()
					})
					this.loading = false
				})
				.catch(error => {
					console.error(error)
				})
		},
		async settingsPresetCreateOrRename() {
			this.loading = true;
			if (!this.newPresetNameValid) return
			if (this.addingProfile)
				await new Settings({}).preset_create({ "label": this.newPresetLabel })
					.then(() => {
						this.createSnackbar({ message: (this.$tc("classes.setting-preset", 5) + " " + this.$tc("words.created.m", 5)).toUpperCase(), type: 'success' })
						this.refreshSettings(false)
					})
					.catch(e => {
						this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
						console.error(e)
					})
			else
				await new Settings({}).preset_rename({ "id": this.presetId, "label": this.newPresetLabel })
					.then(() => {
						this.createSnackbar({ message: (this.$tc("classes.setting-preset", 5) + " " + this.$tc("words.renamed.m", 5)).toUpperCase(), type: 'success' })
						this.refreshSettings(false)
					})
					.catch(e => {
						this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
						console.error(e)
					})
		},
		async settingsPresetEnable() {
			this.loading = true;
			await new Settings({}).preset_enable({ "id": this.presetId })
				.then(async () => {
					this.createSnackbar({ message: (this.$tc("classes.setting-preset", 5) + " " + this.$tc("words.saved.m", 5)).toUpperCase(), type: 'success' })
					await this.backendAlive(true).then(() => {
						this.refreshSettings(false)
					})
				})
				.catch(e => {
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					console.error(e)
				})
		},
		async settingsPresetDelete() {
			this.loading = true;
			await new Settings({}).preset_delete({ "id": this.presetId })
				.then(() => {
					this.createSnackbar({ message: (this.$tc("classes.setting-preset", 5) + " " + this.$tc("words.saved.m", 5)).toUpperCase(), type: 'success' })
					this.refreshSettings(false)
				})
				.catch(e => {
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					console.error(e)
				})
		},
		getConfigValues(log = false) {
			let dataToSend = {}
			try {
				for (const [clsKey, cls] of Object.entries(this.config)) {
					dataToSend[clsKey] = {}
					for (const [categoryKey, category] of Object.entries(cls)) {
						for (const [rowKey, row] of Object.entries(category)) {
							let currentPath = row
							for (const settingKey in currentPath) {
								dataToSend[clsKey][settingKey] = {}
								dataToSend[clsKey][settingKey]['value'] = currentPath[settingKey]['value']
								if (currentPath[settingKey]['type'])
									dataToSend[clsKey][settingKey]['type'] = currentPath[settingKey]['type']
								else
									dataToSend[clsKey][settingKey]['type'] = 'string'
							}
						}
					}
				}
			} catch (error) {
				console.error(error)
			}
			if (log == true)
				console.log(dataToSend)
			return dataToSend
		},
		addServer(item) {
			var fieldsToValidate = [
				'ldapUriPrefix',
				'ldapUriIP',
				'ldapUriPort',
			]
			var valid = true
			fieldsToValidate.forEach(field => {
				if (!this.$refs[field][0].validate())
					valid = false
			});

			if (item.addIP.length <= 0 || item.addPORT.length <= 0)
				return false

			if (valid == true) {
				var result = item.addPREFIX + item.addIP + ":" + item.addPORT
				this.addToArray(result, item)
				this.config.domain.row1.LDAP_AUTH_URL.addIP = ""
				this.config.domain.row1.LDAP_AUTH_URL.addPORT = ""
			}
		},
		addToArray(value, object, itemRef = undefined) {
			var array = object.value
			if (itemRef) {
				if (this.$refs[itemRef][0].validate()) {
					if (!array.includes(value) && array && value)
						array = array.push(value);
				}
			}
			else if (!array.includes(value) && array && value) {
				array = array.push(value);
			}
			return array
		},
		removeFromArray(value, object) {
			if (object.value.includes(value) && Array.isArray(object.value)) {
				object.value = object.value.filter(function (item) {
					return item !== value
				});
			}
			return object.value
		},
		async requestLDAPUserSync() {
			await new Settings({}).sync_users()
				.then(response => {
					this.createSnackbar({
						message: (`${response.data.count} ${this.$tc('classes.user', response.data.count)} ${this.$t('words.synchronized.m')}`).toUpperCase(),
						type: 'success'
					})
					this.refreshSettings(false)
				})
				.catch(e => {
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					console.error(e)
				})
		},
		async requestLDAPUserPrune() {
			await new Settings({}).prune_users()
				.then(response => {
					this.createSnackbar({
						message: (`${response.data.count} ${this.$tc('classes.user', response.data.count)} ${this.$t('words.pruned.m')}`).toUpperCase(),
						type: 'info'
					})
					this.refreshSettings(false)
				})
				.catch(e => {
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					console.error(e)
				})
		},
		async requestLDAPUserPurge() {
			await new Settings({}).purge_users()
				.then(response => {
					this.createSnackbar({
						message: (`${response.data.count} ${this.$tc('classes.user', response.data.count)} ${this.$t('words.purged.m')}`).toUpperCase(),
					})
					this.refreshSettings(false)
				})
				.catch(e => {
					this.createSnackbar({ message: this.getMessageForCode(e), type: 'error' })
					console.error(e)
				})
		}
	}
}
</script>

<style>
#defaultPresetSelect {
	cursor: pointer;
}

.settings-category:first-child {
	border-top: solid var(--v-gray-75-base) 1px;
	border-bottom: 0;
}
.settings-category {
	border-bottom: solid var(--v-gray-75-base) 1px;
}
.settings-category-header {
	--border-width: 0em;
	--border-color: var(--v-gray-75-base);
	border-left: solid var(--border-color) var(--border-width);
	border-right: solid var(--border-color) var(--border-width);
	transition: all 50ms ease-in-out !important;
}
.settings-category-header.v-expansion-panel-header--active {
	--border-width: 0.75em;
	--border-color: var(--v-primary-60-50-base);
}
.settings-category-header:hover {
	--border-width: 1.5em;
}
</style>