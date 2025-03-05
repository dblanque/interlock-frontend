<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------ File: UserImport.vue ------------------------>

<!-- TODO
Allow to Choose field association
Allow to use placeholder password (if no placeholder then require column)

Choose target OU for bulk import

username
password
email
fname
lname
initials
webpage
-->
<template>
	<v-card>
		<v-card-title class="ma-0 pa-0 card-title">
			<v-progress-linear :color="error == true ? 'red' : 'primary'"
				:indeterminate="loading" />
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="pa-0 ma-0 ma-2">
					{{ $t('section.users.import.title') }}
				</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
				<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
			<v-expand-transition>
				<v-tabs class="ma-0 pa-0" v-model="import_tab" :key="import_tab"
					ref="importTabs" v-if="!showResult"
					centered grow>
					<v-tabs-slider />
					<v-tab :key="0">{{ $t("section.users.import.importOptions") }}</v-tab>
					<v-tab :disabled="completed_tab < 1" :key="1">{{
						$t("section.users.import.uploadFile") }}</v-tab>
					<v-tab :disabled="completed_tab < 2" :key="2">{{
						$t("section.users.import.previewData") }}</v-tab>
				</v-tabs>
			</v-expand-transition>
		</v-card-title>

		<v-card-text class="pa-0 ma-0">
			<v-tabs-items v-model="import_tab">
				<v-tab-item :key="0">
					<v-row class="ma-0 pa-0 mt-4" align="center" justify="space-around">
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

					<v-row class="ma-0 pa-0" justify="center">
						<v-col cols="12" lg="8">
							<v-expansion-panels v-model="userPathExpansionPanel" flat hover
								style="border: 1px solid var(--v-primary-base);">
								<v-expansion-panel>
									<v-expansion-panel-header>
										<span>
											<span>
												{{ `${$t('section.users.userCreate.userCreatedIn')}:` }}
											</span>
											<span class="font-weight-bold">
												{{ this.userDestination }}
											</span>
										</span>
									</v-expansion-panel-header>

									<v-expansion-panel-content>
										<v-card flat outlined style="max-height: 300px; overflow: auto !important;">
											<!-- Dirtree OU List Component -->
											<DirtreeOUList ref="DirtreeOUList" @selectedDestination="setDestination" />
										</v-card>
									</v-expansion-panel-content>
								</v-expansion-panel>
							</v-expansion-panels>
						</v-col>
					</v-row>

					<v-row class="ma-0 pa-0 mb-2" justify="center">
						<v-col class="ma-0 pa-0" cols="12" md="6">
							<v-form ref="importPlaceholderPassword" @submit.prevent>
								<v-checkbox @change="resetPlaceholderPassword" v-model="usePlaceholderPassword"
									:label="$t('section.users.import.usePlaceholderPassword')" />
								<v-expand-transition>
									<v-text-field v-show="usePlaceholderPassword" ref="importPlaceholderPasswordField"
										:type="passwordHidden ? 'password' : 'text'" :required="usePlaceholderPassword"
										@keydown.enter="nextStep"
										:append-icon="passwordHidden ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="() => (passwordHidden = !passwordHidden)" dense
										:label="$t('attribute.ldap.password')" v-model="placeholderPassword"
										:rules="[this.fieldRules(placeholderPassword, 'ge_password', usePlaceholderPassword ? true : false)]"></v-text-field>
								</v-expand-transition>
							</v-form>
						</v-col>
					</v-row>
					<v-expand-transition>
						<v-row justify="center" class="pa-0 ma-0 mb-4" v-show="showUserMappings">
							<ObjectEditor :value="this.import_fields"
								:label="$t('section.users.import.dataMapping')"
								ref="importFieldsEditor" @update="v => import_fields = v" dense reorder resettable
								@reset="setDefaultImportFields" disableAddDelete :required="true"
								:deletableFields="deletableFields"
								:disabledFields="usePlaceholderPassword ? ['password'] : []" />
						</v-row>
					</v-expand-transition>

					<v-row class="ma-0 pa-0 mb-2" justify="center">
						<v-btn @click="downloadTemplate" :dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							color="primary" class="ma-0 pa-0 pa-2 ma-1">
							<v-icon class="mr-1">
								mdi-download
							</v-icon>
							<span class="pr-1">
								{{ $t("section.users.import.downloadTemplate") }}
							</span>
						</v-btn>
						<v-btn @click="showUserMappings = !showUserMappings" color="primary"
							class="ma-0 pa-0 pa-2 ma-1">
							<v-icon class="mr-1">
								mdi-cog
							</v-icon>
							<span class="pr-1">
								{{ $t("section.users.import.editUserMappings") }}
							</span>
						</v-btn>
					</v-row>
				</v-tab-item>

				<v-tab-item :key="1">
					<v-row class="ma-0 pa-0" justify="center">
						<v-col cols="6">
							<v-file-input :label="$t('section.users.import.fileToUpload')" outlined
								ref="importFileInput"
								@change="previewFile" @click:clear="clearFile()" v-model="inputFile" clearable
								prepend-icon="" prepend-inner-icon="mdi-upload" show-size class="ma-0 pa-0"
								accept=".csv,.tsv,.txt" />
							<v-progress-linear class="ma-0 pa-0 my-1"
								:color="json_loaded ? (error == true ? 'red' : 'green') : 'primary'"
								:indeterminate="loading" />
							<v-fade-transition>
								<v-alert :icon="false" v-if="json_loaded != true" type="warning" dense>
									<span v-html="$t('section.users.import.supportedExtensions').toUpperCase()" />
								</v-alert>
								<v-alert v-else-if="json_loaded && !error" icon="mdi-check-circle" dense
									type="success"
									close-icon="text-uppercase">
									{{ $t("section.users.import.readyToImport").toUpperCase() }}
								</v-alert>
								<v-alert v-else icon="mdi-close-circle" dense type="error" color="red"
									close-icon="text-uppercase">
									{{ errorMsg.toUpperCase() }}
								</v-alert>
							</v-fade-transition>
						</v-col>
					</v-row>
				</v-tab-item>

				<v-tab-item :key="2">
					<v-row class="pa-0 ma-0" justify="center">
						<v-alert v-if="!showResult" class="ma-4" dense type="info" close-icon="text-uppercase">
							{{ $t("section.users.import.previewMode").toUpperCase() }}
						</v-alert>
						<v-alert v-else-if="!error && showResult" class="ma-4" icon="mdi-check-circle" dense
							type="success" close-icon="text-uppercase">
							{{ $t("section.users.import.bulkImportSuccess").toUpperCase() }}
						</v-alert>
						<v-alert v-else class="ma-4" icon="mdi-alert-circle" dense type="warning"
							close-icon="text-uppercase">
							{{ $t("section.users.import.bulkImportPartial").toUpperCase() }}
						</v-alert>
					</v-row>
					<v-row class="pa-0 ma-0" justify="center">
						<v-data-table :headers="this.tableData.headers" :items="this.tableData.items"
							:loading="this.loading" :footer-props="{
								'items-per-page-options': [10, 25, 50, 100, -1]
							}" class="py-3 px-2 mt-2 mb-2">
							<template v-slot:[`item.status`]="{ item }">
								<!-- Failed -->
								<v-icon color="orange"
									v-if="item.status < 0 && item.error == 'password'">
									mdi-alert-circle
								</v-icon>
								<v-icon color="red" v-else-if="item.status < 0">
									mdi-close-circle
								</v-icon>
								<!-- Success -->
								<v-icon color="valid" v-else-if="item.status == 0">
									mdi-check-circle
								</v-icon>
								<!-- Skipped -->
								<v-icon color="primary" v-else-if="item.status > 0">
									mdi-share
								</v-icon>
							</template>
							<template v-slot:[`item.error`]="{ item }">
								<v-chip :class="getClassForError(item.error)"
									v-if="item.error != 'none'">
									{{ $t("section.users.import.error." + item.error) }}
								</v-chip>
								<v-chip :class="'bg-blue'" v-else-if="item.status > 0">
									{{ $t("words.skipped") }}
								</v-chip>
								<v-chip :class="'bg-valid'" v-else>
									{{ $t("words.success") }}
								</v-chip>
							</template>
						</v-data-table>
					</v-row>
				</v-tab-item>
			</v-tabs-items>
		</v-card-text>
		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
				<v-btn @click="prevStep" :dark="!isThemeDark($vuetify)" :light="isThemeDark($vuetify)"
					class="ma-0 pa-0 pa-2 ma-1" rounded>
					<v-icon class="mr-1">
						{{ import_tab < 1 || showResult && import_tab > 1 ? 'mdi-close-circle' :
							'mdi-chevron-left' }}
					</v-icon>
					<span class="pr-1">
						{{ import_tab < 1 || showResult && import_tab > 1 ? $t("actions.close") :
							$t("actions.back") }}
					</span>
				</v-btn>
				<v-btn @click="importUsers()" :disabled="loading || json_loaded != true || error"
					v-if="import_tab > 1 && !showResult" class="ma-0 pa-0 pa-2 ma-1" color="primary" rounded>
					<v-icon class="mr-1">
						mdi-check-circle
					</v-icon>
					<span class="pr-1">
						{{ $t("actions.import") + " " + $tc("classes.user", tableData.items.length
							|| 1) }}
					</span>
				</v-btn>
				<v-btn @click="nextStep" v-else-if="import_tab < 2" :disabled="!isStepValid()"
					:dark="!isThemeDark($vuetify) && isStepValid()"
					:light="isThemeDark($vuetify) && isStepValid()" class="ma-0 pa-0 pa-2 ma-1" rounded>
					<span class="pl-2">
						{{ $t("actions.next") }}
					</span>
					<v-icon color="primary">
						mdi-chevron-right
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import csvMixin from '@/plugins/mixin/csvMixin';
import CSV from '@/include/csv.js';
import { notificationBus } from '@/main.js'
import User from '@/include/User.js'
import { getDomainDetails } from '@/include/utils.js';
import DirtreeOUList from '@/components/Dirtree/DirtreeOUList.vue'
import ObjectEditor from '@/components/Settings/ObjectEditor.vue'

export default {
	name: "UserImport",
	mixins: [
		validationMixin,
		utilsMixin,
		csvMixin
	],
	data() {
		return {
			loading: false,
			showResult: false,
			error: false,
			errorMsg: "",
			inputFile: null,
			json_result: {},
			json_loaded: false,
			status_color: 'blue',
			allowRefresh: true,
			deletableFields: [
				"initials",
				"telephoneNumber",
				"wWWHomePage",
				"streetAddress",
				"postalCode",
				"l",
				"st",
				"co"
			],
			showUserMappings: false,
			userPathExpansionPanel: false,
			import_tab: 0,
			completed_tab: 0,
			import_fields: {},
			usePlaceholderPassword: false,
			placeholderPassword: "",
			placeholderPassword_idx: 1,
			passwordHidden: true,
			userDestination: '',
			tableData: {
				headers: [],
				items: []
			}
		}
	},
	props: {
		userObject: Object,
		viewKey: String
	},
	mounted() {
		this.setDefaultImportFields()
	},
	components: {
		DirtreeOUList,
		ObjectEditor
	},
	watch: {
		usePlaceholderPassword(new_value) {
			if (new_value == true) {
				this.placeholderPassword_idx = Object.keys(this.import_fields).indexOf('password')
				delete this.import_fields['password'];
			}
			else {
				let keyValues = Object.entries(this.import_fields); //convert object to keyValues ["key1", "value1"] ["key2", "value2"]
				keyValues.splice(this.placeholderPassword_idx, 0, ["password", "password"]); // insert key value at the index you want like 1.
				this.import_fields = Object.fromEntries(keyValues) // convert key values to obj {key1: "value1", newKey: "newValue", key2: "value2"}
			}

			this.$refs.importFieldsEditor.setObject()
		},
		inputFile(v) {
			if (v == null || v == undefined) {
				notificationBus.$emit('createNotification', {
					message: this.$t("section.users.import.fileCleared"),
					type: 'info'
				});
			}
		}
	},
	methods: {
		isStepValid() {
			switch (this.import_tab) {
				case 0:
					if (this.userDestination.length == 0 || !this.userDestination)
						return false
					break;
				case 1:
					if (!this.json_loaded || this.json_result == false || this.error)
						return false
					break;
			}
			return true
		},
		prevStep() {
			if (this.import_tab < 1 || this.showResult && this.import_tab > 1)
				this.closeDialog()
			switch (this.import_tab - 1) {
				case 0:
					this.error = false
					this.errorMsg = ""
					this.clearFile()
					this.clearDataTable()
					this.import_tab -= 1
					break;
				default:
					this.import_tab -= 1
					break;
			}
		},
		nextStep() {
			switch (this.import_tab + 1) {
				case 1:
					if (this.usePlaceholderPassword && this.$refs.importPlaceholderPassword.validate()) {
						this.import_tab += 1
						this.completed_tab += 1
					}
					else if (!this.usePlaceholderPassword) {
						this.import_tab += 1
						this.completed_tab += 1
					}
					break;
				default:
					this.import_tab += 1
					this.completed_tab += 1
					break;
			}
		},
		resetPlaceholderPassword() {
			this.placeholderPassword = ""
			this.passwordHidden = true
			this.$refs.importPlaceholderPasswordField.reset()
		},
		getLocalUserImportHeaders() {
			var v = []
			for (const key in this.import_fields)
				v.push(this.import_fields[key])
			return v
		},
		// TODO - Check newline validation
		downloadTemplate() {
			const t_headers = this.getLocalUserImportHeaders()
			CSV.export(
				t_headers,
				[],
				"ilck_user_import_template"
			)
		},
		refreshDataTable() {
			this.tableData.headers = []
			for (let i = 0; i < this.json_result.headers.length; i++) {
				this.tableData.headers.push({
					text: this.json_result.headers[i],
					align: 'center',
					value: this.json_result.headers[i],
				})
			}
			this.tableData.items = this.json_result.data
		},
		clearDataTable() {
			this.tableData.headers = []
			this.tableData.items = []
			this.completed_tab -= 1
		},
		async previewFile(file) {
			if (!file || file == undefined || file == null || file.length == 0)
				return
			this.loading = true
			const t_headers = this.getLocalUserImportHeaders()

			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = async (event) => {
				// notificationBus.$emit('send', {type: "success", text:"File Uploaded Successfully!"});
				var csv_file = event.target.result
				csv_file = csv_file.replace(/\r\n/g, '\n'); // Replaces windows new line to linux.
				var csv_delimiter = CSV.guessDelimiters(csv_file, [",", "\t"])

				this.json_result = await this.csvToJSON(csv_file, csv_delimiter)

				// csvToJSON can return invalid headers error
				if (typeof (this.json_result) === 'string') {
					this.error = true
					this.errorMsg = this.getMessageForCode(this.json_result)
				}

				// Validate headers
				if (!this.error && !this.json_result.headers) {
					this.json_result = false
					this.error = true
					this.errorMsg = this.getMessageForCode('ERR_INVALID_CSV_HEADERS')
				}

				// Header Cross Checking
				if (!this.error) {
					if (this.json_result.headers.length != t_headers.length) {
						this.json_result = false
						this.error = true
						this.errorMsg = this.getMessageForCode('ERR_INVALID_CSV_HEADERS')
					} else {
						for (let i = 0; i < this.json_result.headers.length; i++)
							if (this.json_result.headers[i] != t_headers[i]) {
								this.json_result = false
								this.error = true
								this.errorMsg = this.getMessageForCode('ERR_INVALID_CSV_HEADERS')
							}
					}
				}

				if (!this.error && this.json_result.data.length < 1) {
					this.error = true
					this.json_result = false
					this.errorMsg = this.getMessageForCode('noUsersInImport')
				}

				if (this.error) {
					this.error = true
					if (this.errorMsg.length < 1)
						this.errorMsg = this.getMessageForCode('ERR_INVALID_CSV')
					this.loading = false
					notificationBus.$emit('createNotification', {
						message: this.errorMsg,
						type: 'error'
					});
					this.clearDataTable()
				} else {
					notificationBus.$emit('createNotification', {
						message: this.$t("section.users.import.fileReady"),
						type: 'success'
					});
					this.refreshDataTable()
				}
				this.json_loaded = true
			}
			reader.onerror = (event) => {
				console.error(event)
				this.error = true
				this.errorMsg = this.getMessageForCode('ERR_INVALID_CSV')
				this.json_loaded = true
				this.loading = false
				notificationBus.$emit('createNotification', {
					message: this.errorMsg,
					type: 'error'
				});
				this.clearDataTable()
			}

			setTimeout(() => {
				this.loading = false
			}, 500)
		},
		clearFile() {
			this.loading = false
			this.showResult = false
			this.error = false
			this.errorMsg = ""
			if (this.$refs.importFileInput)
				this.$refs.importFileInput.reset()
			this.inputFile = null
			this.json_result = {}
			this.json_loaded = false
			this.clearDataTable()
		},
		clearData() {
			this.clearFile()
			let domainDetails = getDomainDetails()
			this.domain = domainDetails.name
			this.realm = domainDetails.realm
			this.basedn = domainDetails.basedn
			this.fetchOUs()
			this.userDestination = "CN=Users," + this.basedn
			this.import_tab = 0
			this.completed_tab = 0
			this.usePlaceholderPassword = false
			this.passwordHidden = true
			this.placeholderPassword = ""
			this.placeholderPassword_idx = 1
			this.setDefaultImportFields()
			this.resetPlaceholderPassword()
			this.showUserMappings = false
			if (this.$refs.importTabs)
				if (this.$refs.items)
					this.$refs.importTabs.callSlider()
		},
		setDefaultImportFields() {
			this.import_fields = {
				"username": "username",
				"password": "password",
				"mail": "email",
				"givenName": "first_name",
				"sn": "last_name",
				"initials": "initials",
				"telephoneNumber": "phone_number",
				"wWWHomePage": "webpage",
				"streetAddress": "street_address",
				"postalCode": "postal_code",
				"l": "town",
				"st": "state_province",
				"co": "country"
			}
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
		getClassForError(key) {
			switch (key) {
				case "password":
				case "country":
					return "bg-orange"
				default:
					return "bg-red"
			}
		},
		closeDialog() {
			var refresh = false
			if (this.showResult)
				refresh = true
			return this.$emit('closeDialog', this.viewKey, refresh);
		},
		async importUsers() {
			this.loading = true
			await new User({}).bulkInsert({
				headers: this.json_result.headers,
				placeholder_password: this.placeholderPassword,
				mapping: this.import_fields,
				users: this.json_result.data,
				path: this.userDestination
			})
				.then(response => {
					setTimeout(() => {
						this.loading = false
					}, 100)
					this.error = false
					this.errorMsg = ""
					if (response.data.code != 0) {
						notificationBus.$emit('createNotification', {
							message: this.$t('error.unknown_short'),
							type: "error"
						});
						throw new Error(this.$t('error.unknown_short'));
					}
					this.showResult = true
					this.tableData = {
						headers: [],
						items: []
					}
					this.tableData.headers.push({
						text: this.$tc("classes.user", 1),
						align: 'center',
						value: this.import_fields['username'],
					})
					this.tableData.headers.push({
						text: this.$t("words.status"),
						align: 'center',
						value: 'status',
					})
					this.tableData.headers.push({
						text: this.$t("words.error"),
						align: 'center',
						value: 'error',
					})
					if (response.data.failed_users.length > 0) {
						response.data.failed_users.forEach(u => {
							this.tableData.items.push({
								"username": u.username,
								"status": -1,
								"error": u.stage
							})
						});
						this.error = true
					}
					if (response.data.skipped_users.length > 0)
						response.data.skipped_users.forEach(u => {
							this.tableData.items.push({
								"username": u,
								"status": 1,
								"error": "none"
							})
						})
					if (response.data.imported_users.length > 0)
						response.data.imported_users.forEach(u => {
							this.tableData.items.push({
								"username": u,
								"status": 0,
								"error": "none"
							})
						})
					// notificationBus.$emit('createNotification', {
					//     message: this.$t('section.users.import.bulkImportSuccess'),
					//     type: "success"
					// });
				})
				.catch(e => {
					console.error(e)
					setTimeout(() => {
						this.loading = false
					}, 100)
					this.error = true
					if (this.errorMsg.length < 1)
						this.errorMsg = this.getMessageForCode(e).toUpperCase()
					notificationBus.$emit('createNotification', {
						message: this.errorMsg,
						type: "error"
					});
				})
		},
	}
}
</script>