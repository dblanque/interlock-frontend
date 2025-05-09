<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: UserView.vue -------------------------------->
<template>
	<div>
		<v-data-table
			:headers="tableData.headers"
			:show-select="true"
			:item-key="tableItemKey"
			v-model="tableData.selected"
			:items="tableData.items"
			:custom-sort="sortNullLast"
			:loading="loading"
			:search="searchString"
			:footer-props="{
				'items-per-page-options': [10, 25, 50, 100, -1]
			}"
			:sort-by="tableDefaultSortKey"
			class="py-3 px-2 mt-2 mb-2">
			<!-- Table Header -->
			<template v-slot:top>
				<v-row align="center" class="px-2 mx-1 py-0 my-0">
					<v-text-field
						v-model="searchString"
						clearable
						:label="$t('actions.search')"
						class="mx-2"></v-text-field>
					<v-row style="max-width: fit-content;" class="pa-0 px-4" justify="end">
						<refresh-button dense
							:loading="loading"
							@refresh="listUserItems(true)" />
						<v-btn class="pa-2 mx-2" :disabled="loading || !isImplemented('create')" color="primary"
							@click="openDialog('userCreate')">
							<v-icon class="ma-0 pa-0">mdi-plus</v-icon>
							{{ $t('actions.addN') + ' ' + $tc('classes.user', 1) }}
						</v-btn>
					</v-row>
				</v-row>
				<v-row class="ma-0 pa-0 px-4" justify="center" align="center">
					<!-- Import Button -->
					<v-btn class="pa-2 mx-2" small
						:dark="!loading && !isThemeDark($vuetify) && isImplemented('import')"
						:light="!loading && isThemeDark($vuetify) && isImplemented('import')"
						:disabled="loading || !isImplemented('import')"
						@click="openDialog('userImport')">
						<v-icon small class="ma-0 pa-0 mr-1">mdi-file-import</v-icon>
						{{ $t('actions.import') }}
					</v-btn>
					<!-- Mass Enable Button -->
					<v-btn class="pa-2 mx-2" small
						:dark="!actionButtonsDisabled && isImplemented('bulkEnable')"
						:light="!actionButtonsDisabled && isThemeDark($vuetify) && isImplemented('bulkEnable')"
						color="green" @click="massAccountStatusChange(false)"
						:disabled="loading || tableData.selected.length < 1 || !isImplemented('bulkEnable')">
						<v-icon small class="ma-0 pa-0 mr-1">mdi-check</v-icon>
						{{ $t('actions.enable') }}
					</v-btn>
					<!-- Mass Disable Button -->
					<v-btn class="pa-2 mx-2" small
						color="red"
						:dark="!actionButtonsDisabled && isImplemented('bulkDisable')"
						:light="!actionButtonsDisabled && isThemeDark($vuetify) && isImplemented('bulkDisable')"
						@click="massAccountStatusChange(true)"
						:disabled="loading || tableData.selected.length < 1 || !isImplemented('bulkDisable')">
						<v-icon small class="ma-0 pa-0 mr-1">mdi-close</v-icon>
						<span :color="actionButtonsDisabled ? 'error' : 'error-70-s'">
							{{ $t('actions.disable') }}
						</span>
					</v-btn>
					<!-- Mass Unlock Button -->
					<v-btn class="pa-2 mx-2" small v-if="viewTitle == 'ldap-users'"
						@click="massUnlock()"
						:dark="!actionButtonsDisabled && !isThemeDark($vuetify) && isImplemented('bulkUnlock')"
						:light="!actionButtonsDisabled && isThemeDark($vuetify) && isImplemented('bulkUnlock')"
						:disabled="actionButtonsDisabled || !isImplemented('bulkUnlock')">
						<span>
							<v-icon small class="ma-0 pa-0 mr-1">mdi-lock-open</v-icon>
							{{ $t('actions.unlock') }}
						</span>
					</v-btn>
					<!-- Mass Edit Button -->
					<v-btn class="pa-2 mx-2" small
						:dark="!actionButtonsDisabled && isImplemented('bulkEdit')"
						:light="!actionButtonsDisabled && isThemeDark($vuetify) && isImplemented('bulkEdit')"
						color="primary"
						@click="openBulkOperationDialog('userBulkUpdate')"
						:disabled="actionButtonsDisabled || !isImplemented('bulkEdit')">
						<v-icon small dark :color="actionButtonsDisabled ? undefined : 'white'"
							class="ma-0 pa-0 mr-1">mdi-shield-account</v-icon>
						<span :color="actionButtonsDisabled ? undefined : 'white'">
							{{ $t('actions.edit') }}
						</span>
					</v-btn>
					<!-- Mass Delete Button -->
					<v-btn class="pa-2 mx-2" small
						:dark="!actionButtonsDisabled && isImplemented('bulkDelete')"
						:light="!actionButtonsDisabled && isThemeDark($vuetify) && isImplemented('bulkDelete')"
						color="red" @click="openBulkOperationDialog('userDelete')"
						:disabled="actionButtonsDisabled || !isImplemented('bulkDelete')">
						<v-icon small dark :color="actionButtonsDisabled ? undefined : 'white'"
							class="ma-0 pa-0 mr-1">mdi-delete</v-icon>
						<span :color="actionButtonsDisabled ? undefined : 'white'">
							{{ $t('actions.delete') }}
						</span>
					</v-btn>
				</v-row>
			</template>
			<!-- USER IS ENABLED STATUS -->
			<template v-slot:[`item.user_type`]="{ item }">
				<v-chip color="primary">
					{{ item.user_type.toUpperCase() }}
				</v-chip>
			</template>
			<!-- USER IS ENABLED STATUS -->
			<template v-slot:[`item.is_enabled`]="{ item }">
				<!-- Same User Icon -->
				<v-tooltip bottom v-if="isLoggedInUser(item.username)">
					<template v-slot:activator="{ on, attrs }">
						<v-icon
							v-bind="attrs"
							v-on="on"
							color="primary">
							mdi-account
						</v-icon>
					</template>
					<span>{{ $t('section.users.youAreHere') }}
						<v-icon color="white">mdi-emoticon</v-icon>
					</span>
				</v-tooltip>

				<!-- Disable User Button -->
				<v-tooltip color="red" bottom v-else-if="item.is_enabled">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
							v-bind="attrs"
							v-on="on"
							:disabled="loading || isLoggedInUser(item.username) || !isUserEditable(item)"
							@click="setAccountStatus(item, false)">
							<v-icon :color="!isLoggedInUser(item.username) ? 'valid-40-s' : ''">
								mdi-check
							</v-icon>
						</v-btn>
					</template>
					<span>
						{{ `${$t('actions.clickTo')} ${$t('actions.disable').toLowerCase()} ${item.username}` }}
					</span>
				</v-tooltip>

				<!-- Enable User Button -->
				<v-tooltip color="green" bottom v-else-if="!item.is_enabled">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
							v-bind="attrs"
							v-on="on"
							:disabled="loading || isLoggedInUser(item.username) || !isUserEditable(item)"
							@click="setAccountStatus(item, true)">
							<v-icon :color="!isLoggedInUser(item.username) ? 'error-60-s' : ''">
								mdi-close
							</v-icon>
						</v-btn>
					</template>
					<span>
						{{ `${$t('actions.clickTo')} ${$t('actions.enable').toLowerCase()} ${item.username}` }}
					</span>
				</v-tooltip>
			</template>

			<!-- USER ACTIONS -->
			<template v-slot:[`item.actions`]="{ item }">
				<v-row class="my-1" justify="center">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading"
								@click="fetchUser(item, false)">
								<v-icon small color="primary">
									mdi-eye
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.view') }}</span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading || !isUserEditable(item)"
								@click="fetchUser(item, true)">
								<v-icon small color="primary">
									mdi-pencil
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.edit') }}</span>
					</v-tooltip>

					<!-- RESET PASSWORD BUTTON -->
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading || !isUserEditable(item)"
								@click="changeUserPassword(item)">
								<v-icon small color="primary">
									mdi-key-variant
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.changePassword') }}</span>
					</v-tooltip>

					<!-- UNLOCK USER BUTTON -->
					<v-tooltip bottom v-if="viewTitle == 'ldap-users'">
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon color="secondary-20"
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading"
								@click="unlockUser(item)">
								<v-icon small>
									mdi-lock-open
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.unlock') }}</span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading || !isUserEditable(item)"
								@click="openBulkOperationDialog('userDelete', item)"
								v-if="!isLoggedInUser(item.username)">
								<v-icon small color="red">
									mdi-delete
								</v-icon>
							</v-btn>
							<v-btn
								v-else
								disabled
								elevation="0"
								icon
								small>
								<v-icon small>
									mdi-delete
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.delete') }}</span>
					</v-tooltip>
				</v-row>
			</template>
		</v-data-table>

		<!-- USER VIEW/EDIT DIALOG -->
		<v-dialog eager max-width="1200px" v-model="dialogs['userDialog']">
			<UserDialog :user="data.userdata" :editFlag="this.editableForm" :dialogKey="'userDialog'"
				ref="UserDialog" :refreshLoading="loading" :disable-actions="fetchingData"
				:fetchingData="fetchingData" @closeDialog="closeDialog" @save="userSaved"
				@goToGroup="goToGroup"
				:userClass="userClass" :parentTitle="viewTitle" @editToggle="setViewToEdit"
				@refreshUser="refreshUser" @refreshUserList="listUserItems(false)" />
		</v-dialog>

		<!-- USER DELETE CONFIRM DIALOG -->
		<v-dialog eager max-width="800px" v-model="dialogs['userDelete']">
			<UserDelete :userObject="this.data.selectedUser" :userObjectList="tableData.selected"
				:dialogKey="'userDelete'" ref="UserDelete" @closeDialog="closeDialog"
				@refresh="listUserItems" :userClass="userClass"
				:parentTitle="viewTitle" />
		</v-dialog>

		<!-- USER RESET PASSWORD DIALOG -->
		<v-dialog eager max-width="800px" v-model="dialogs['userResetPassword']">
			<UserResetPassword :userObject="this.data.selectedUser" :dialogKey="'userResetPassword'"
				ref="UserResetPassword" @closeDialog="closeDialog" :parentTitle="viewTitle"
				:userClass="userClass"
				/>
		</v-dialog>

		<!-- USER CREATE DIALOG -->
		<v-dialog eager max-width="1200px" v-model="dialogs['userCreate']">
			<UserCreate :dialogKey="'userCreate'" ref="UserCreate" @closeDialog="closeDialog"
				:userClass="userClass"
				:parentTitle="viewTitle" />
		</v-dialog>

		<!-- USER IMPORT DIALOG -->
		<v-dialog eager persistent max-width="1600px" v-model="dialogs['userImport']">
			<UserImport :dialogKey="'userImport'" ref="UserImport" @closeDialog="closeDialog"
				:parentTitle="viewTitle" />
		</v-dialog>

		<!-- USER EDIT DIALOG -->
		<v-dialog eager max-width="1600px" v-model="dialogs['userBulkUpdate']">
			<UserBulkUpdate :selectedUsers="this.tableData.selected" :dialogKey="'userBulkUpdate'"
				ref="UserBulkUpdate" @closeDialog="closeDialog" @refresh="listUserItems"
				:parentTitle="viewTitle" />
		</v-dialog>
	</div>
</template>

<script>
import User from '@/include/User.js';
import DjangoUser from '@/include/DjangoUser.js';
import UserCreate from '@/components/User/UserCreate.vue';
import UserImport from '@/components/User/UserImport.vue';
import UserDialog from '@/components/User/UserDialog.vue';
import UserBulkUpdate from '@/components/User/UserBulkUpdate.vue';
import UserResetPassword from '@/components/User/UserResetPassword.vue';
import UserDelete from '@/components/User/UserDelete.vue';
import RefreshButton from '@/components/RefreshButton.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';

export default {
	name: 'UserView',
	mixins: [validationMixin, utilsMixin],
	components: {
		UserCreate,
		UserImport,
		UserDialog,
		UserResetPassword,
		UserBulkUpdate,
		UserDelete,
		RefreshButton
	},
	data() {
		return {
			tableData: {
				headers: [],
				items: [],
				selected: []
			},
			localUsersOnly: false,
			userClass: undefined,
			tableItemKey: undefined,
			tableDefaultSortKey: undefined,
			searchString: "",
			loading: false,
			fetchingData: false,
			error: false,
			errorMsg: "",
			editableForm: false,

			// User Data
			data: {
				selectedUser: {
					"username": "",
					"distinguished_name": ""
				},
				userdata: {},
			},

			// Dialog States
			dialogs: {
				userDialog: false,
				userImport: false,
				userDelete: false,
				userResetPassword: false,
				userCreate: false,
				userBulkUpdate: false
			}
		}
	},
	created() {
		this.listUserItems(true);
	},
	watch: {
		'computedDialogs': {
			handler: function (v, v_old) {
				for (const d in v) {
					const ref_key = d[0].toUpperCase() + d.slice(1);
					// On Close do exit method
					if (v_old[d] === true) {
						if (this.$refs[ref_key].exit !== undefined) {
							this.$refs[ref_key].exit()
							console.log(`Exit for ${d} executed.`)
						}
					}
				}
			},
			deep: true
		}
	},
	computed: {
		actionButtonsDisabled() {
			return this.loading || this.tableData.selected.length < 1
		},
		computedDialogs() {
			return Object.assign({}, this.dialogs)
		}
	},
	props: {
		viewTitle: String,
		snackbarTimeout: Number
	},
	methods: {
		isImplemented(action) {
			switch (this.viewTitle) {
				case "django-users":
					switch (action) {
						case "import":
						case "bulkEnable":
						case "bulkDisable":
						case "bulkDelete":
						case "bulkUnlock":
						case "bulkEdit":
							return false
						default:
							return true
					}
				default:
					return true
			}
		},
		resetSearch() {
			this.searchString = ""
		},
		goToGroup(groupDn) {
			this.$emit('goToGroup', groupDn)
			this.closeDialog('userDialog')
		},
		openDialog(key) {
			this.dialogs[key] = true;
			switch (key) {
				case 'userDialog':
					if (this.$refs.UserDialog != undefined)
						this.$refs.UserDialog.goBackToDetails()
					break;
				case 'userCreate':
					if (this.$refs.UserCreate != undefined)
						this.$refs.UserCreate.newUser()
					break;
				case 'userResetPassword':
					if (this.$refs.UserResetPassword != undefined)
						this.$refs.UserResetPassword.clearUser()
					break;
				case 'userImport':
					if (this.$refs.UserImport != undefined)
						this.$refs.UserImport.clearData()
					break;
				case 'userBulkUpdate':
					if (this.$refs.UserBulkUpdate != undefined)
						this.$refs.UserBulkUpdate.init()
					break;
				default:
					break;
			}
		},
		async closeDialog(key, refresh = false, emitData=undefined) {
			this.dialogs[key] = false;
			if (refresh) {
				let emitNotif
				switch (key) {
					case 'userResetPassword':
						emitNotif = false
						notificationBus.$emit("createNotification", {
							message: this.$t("actions.passwordChanged").toUpperCase(),
							type: 'success'
						})
						break;
					case 'userImport':
						emitNotif = false
						notificationBus.$emit("createNotification", {
							message: this.$t('section.users.import.bulkImportSuccess').toUpperCase(),
							type: 'success'
						})
						break;
					case 'userDelete':
						emitNotif = false
						if (!emitData)
							emitData = {
								message: this.$t('section.users.deleteUser.success').toUpperCase(),
								type: 'info'
							}
						notificationBus.$emit("createNotification", emitData)
						break;
					default:
						emitNotif = true
						break;
				}
				await this.listUserItems(emitNotif)
			}
		},
		setViewToEdit(value) {
			this.editableForm = value;
		},
		// Reload Data Table Header Labels
		reloadDataTableHeaders() {
			this.tableData.headers.forEach(tableHeader => {
				if (tableHeader.value == "actions") {
					tableHeader.text = this.$t('actions.label')
				} else {
					tableHeader.text = this.$t('attribute.' + tableHeader.value)
				}
			});
		},
		// Reset Data Table variables
		resetDataTable() {
			this.tableData.headers = []
			this.tableData.items = []
		},
		setLoading() {
			this.loading = true
			this.error = false
			this.tableData.headers = []
			this.tableData.items = []
			this.tableData.selected = []
		},
		isUserEditable(user) {
			if ("user_type" in user)
				if (user.user_type != "local")
					return false
			return true
		},
		// User Actions
		async listUserItems(emitNotif) {
			this.resetDataTable()
			let translationParent
			switch (this.viewTitle) {
				case "django-users":
					this.setLoading()
					this.userClass = DjangoUser
					this.tableItemKey = "username"
					this.tableDefaultSortKey = "last_name"
					translationParent = "attribute.user."
					break;
				case "ldap-users":
					this.setLoading()
					this.userClass = User
					this.tableItemKey = "distinguished_name"
					this.tableDefaultSortKey = "sn"
					translationParent = "attribute."
					break;
				default:
					return
			}
			await new this.userClass({}).list()
				.then(response => {
					let headerDict = {}
					response.headers.forEach(header => {
						headerDict = {}
						switch (header) {
							case "email":
								headerDict.text = this.$t("attribute.user.email")
								break;
							case "is_enabled":
								headerDict.text = this.$t("attribute.user." + header)
								headerDict.align = 'center'
								headerDict.sortable = false
								break;
							default:
								headerDict.text = this.$t(translationParent + header)
								break;
						}
						headerDict.value = header
						this.tableData.headers.push(headerDict)
					});
					headerDict = {}
					headerDict.text = this.$t('actions.label')
					headerDict.value = 'actions'
					headerDict.align = 'center'
					headerDict.sortable = false
					this.tableData.headers.push(headerDict)
					this.tableData.items = response.users
					for (let i = 0; i < this.tableData.items.length; i++) {
						const user = this.tableData.items[i];
						if (user.username == localStorage.getItem('user.username') ||
							user.username == 'Administrator' && localStorage.getItem('user.username') == 'admin') {
							user.isSelectable = false
							continue
						}
						if ("user_type" in user) {
							if (user.user_type != "local")
								user.isSelectable = false
						}
					}
					this.loading = false
					this.error = false
					this.errorMsg = ""
					if (emitNotif == true)
						notificationBus.$emit("createNotification", {
							message: (`${this.$tc("classes.user", response.users.length)} ${this.$tc("words.loaded.m", response.users.length)}`).toUpperCase(),
							type: 'success'
						})
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit('createNotification',
						{ message: this.errorMsg.toUpperCase(), type: 'error' }
					)
				})
			this.$emit('done')
		},
		async unlockUser(userObject) {
			await new User({}).unlock(userObject.username)
				.then(() => {
					this.loading = false
					this.error = false
					notificationBus.$emit("createNotification", {
						message: this.$t("section.users.userUnlocked").toUpperCase(),
						type: 'success'
					})
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					notificationBus.$emit("createNotification", {
						message: this.$t("section.users.errorUserUnlock").toUpperCase(),
						type: 'error'
					})
				})
		},
		isLoggedInUser(username) {
			if (username == localStorage.getItem('user.username') || username == 'Administrator' && localStorage.getItem('username') == 'admin')
				return true
			return false
		},
		async changeUserPassword(userObject) {
			this.data.selectedUser = {}
			this.data.selectedUser = userObject
			this.openDialog('userResetPassword')
		},
		openBulkOperationDialog(dialogRef, userObject) {
			this.data.selectedUser = {}
			if (userObject) {
				this.tableData.selected = []
				this.data.selectedUser = userObject
			}
			if (this.data.selectedUser || this.tableData.selected.length > 0)
				this.openDialog(dialogRef)
		},
		async setAccountStatus(userObject, enabled) {
			this.loading = true
			this.error = false
			this.errorMsg = false
			this.data.selectedUser = {}
			this.data.selectedUser = userObject
			this.data.userdata = await new this.userClass({})
			let ident
			if (this.viewTitle === "ldap-users")
				ident = {
					username: this.data.selectedUser.username,
					enabled: enabled
				}
			else
				ident = {
					id: this.data.selectedUser.id,
					enabled: enabled
				}
			await this.data.userdata.changeAccountStatus(ident)
				.then(() => {
					let action = `words.${enabled ? 'enabled' : 'disabled'}`;
					this.loading = false
					this.error = false
					this.errorMsg = false
					this.listUserItems(false);
					notificationBus.$emit('createNotification',
						{
							message: (`${this.$tc("classes.user", 1)} ${this.$t(action)}`).toUpperCase(),
							type: 'success'
						});
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit('createNotification',
						{
							message: this.errorMsg.toUpperCase(),
							type: 'error'
						});
				})
		},
		async refreshUser(item) {
			await this.fetchUser(item, this.editableForm, true).then(() => {
				if (this.$refs.UserDialog != undefined)
					this.$refs.UserDialog.syncUser()
			});
		},
		async massAccountStatusChange(disable) {
			this.loading = true
			this.error = false
			this.errorMsg = ""
			const current_user = localStorage.getItem('user.username')
			const actionMsg = disable ? this.$t("words.disabled") : this.$t("words.enabled")
			const actionType = disable ? 'warning' : 'success'
			if (this.tableData.selected.find(v => v == current_user)) {
				throw new Error("Current user cannot change their own status.");
			}
			else {
				let _filtered_map = this.tableData.selected.map(
					({ distinguished_name, username }) => ({ distinguished_name, username })
				);
				await new User({}).bulkChangeStatus({
					"disable": disable,
					"users": _filtered_map
				})
					.then(() => {
						this.loading = false
						this.error = false
						this.errorMsg = ""
						this.listUserItems(false);
						notificationBus.$emit('createNotification',
							{
								message: (this.$tc("classes.user", _filtered_map.length) + " " + actionMsg).toUpperCase(),
								type: actionType
							}
						);
					})
					.catch(error => {
						console.error(error)
						this.loading = false
						this.error = true
						this.errorMsg = this.getMessageForCode(error)
						this.listUserItems(false);
						notificationBus.$emit('createNotification',
							{
								message: this.errorMsg.toUpperCase(),
								type: 'error'
							})
					})
			}
		},
		async massUnlock() {
			this.loading = true
			this.error = false
			this.errorMsg = false
			let _filtered_map = this.tableData.selected.map(
				({ distinguished_name, username }) => ({ distinguished_name, username })
			);
			await new User({}).bulkUnlock(_filtered_map)
				.then(() => {
					this.loading = false
					this.error = false
					this.errorMsg = false
					this.listUserItems(false);
					notificationBus.$emit('createNotification',
						{
							message: (this.$tc("classes.user", this.tableData.selected.length) + " " + this.$tc("words.unlocked.n", this.tableData.selected.length).toUpperCase()).toUpperCase(),
							icon: 'mdi-lock-open',
							type: 'info'
						}
					);
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit('createNotification',
						{ message: this.errorMsg.toUpperCase(), type: 'error' }
					)
					this.listUserItems(false);
				})
		},
		userSaved() {
			this.listUserItems(false)
			this.$refs.UserDialog.syncUser()
			notificationBus.$emit("createNotification",
				{
					message: (`${this.$tc("classes.user", 1)} ${this.$tc("words.saved.m", 1)}`).toUpperCase(),
					type: 'success'
				})
		},
		// Fetch individual User
		async fetchUser(item, isEditable = false, openedDialogLoading = false) {
			let ident = this.viewTitle == "ldap-users" ? item.username : item.id
			if (!openedDialogLoading)
				this.loading = true
			this.fetchingData = true
			this.data.selectedUser.username = item.username
			if (this.viewTitle == "ldap-users")
				this.data.selectedUser.distinguished_name = item.distinguished_name
			this.data.userdata = new this.userClass({})
			await this.data.userdata.fetch(ident)
				.then(() => {
					if (!this.dialogs.userDialog) {
						this.openDialog('userDialog')
						this.$refs.UserDialog.syncUser()
						this.$refs.UserDialog.setupExclude()
					}
					if (isEditable == true)
						this.editableForm = true
					else
						this.editableForm = false
					setTimeout(() => {
						this.loading = false
					}, 50);
					this.fetchingData = false
				})
				.catch(error => {
					console.error(error)
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit('createNotification',
						{ message: this.errorMsg.toUpperCase(), type: 'error' }
					)
					this.loading = false
					this.fetchingData = false
					this.error = true;
				})
		},
	},
}
</script>
