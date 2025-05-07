<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: GroupView.vue ------------------------------>
<template>
	<div>
		<v-data-table
			:headers="tableData.headers"
			:items="tableData.items"
			:custom-sort="sortNullLast"
			:item-key="tableItemKey"
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
							@refresh="listGroupItems" />
						<v-btn class="pa-2 mx-2" :disabled="loading || readonly" color="primary"
							@click="isLDAPView ? openDialog('groupCreate') : openDialog('applicationGroupCreate')">
							<v-icon class="ma-0 pa-0">mdi-plus</v-icon>
							{{ $t('actions.addN') + ' ' + $tc('classes.group', 1) }}
						</v-btn>
					</v-row>
				</v-row>
			</template>

			<!-- GROUP TYPE -->
			<template v-slot:[`item.group_types`]="{ item }">
				<div class="pt-2" v-if="item.group_types && item.group_types.length > 0">
					<v-chip
						v-for="groupType in item.group_types"
						:key="groupType"
						class="mx-1 mb-2"
						:dark="getColorForGroupTypeOrScope(groupType).dark"
						:light="!getColorForGroupTypeOrScope(groupType).dark"
						:color="getColorForGroupTypeOrScope(groupType).color">
						{{ $t(`section.groups.types.GROUP_${groupType}`) }}
					</v-chip>
				</div>
			</template>

			<!-- GROUP SCOPE -->
			<template v-slot:[`item.group_scopes`]="{ item }">
				<div class="pt-2" v-if="item.group_scopes && item.group_scopes.length > 0">
					<v-chip
						v-for="groupScope in item.group_scopes"
						:key="groupScope"
						class="mx-1 mb-2"
						:dark="getColorForGroupTypeOrScope(groupScope).dark"
						:light="!getColorForGroupTypeOrScope(groupScope).dark"
						:color="getColorForGroupTypeOrScope(groupScope).color">
						{{ $t(`section.groups.scopes.GROUP_${groupScope}`) }}
					</v-chip>
				</div>
			</template>


			<!-- GROUP POPULATION -->
			<template v-slot:[`item.has_members`]="{ item }">
				<!-- Group is Populated -->
				<v-tooltip color="primary" bottom v-if="item.has_members">
					<template v-slot:activator="{ on, attrs }">
						<v-icon
							v-bind="attrs"
							v-on="on"
							color="primary">
							mdi-account-multiple
						</v-icon>
					</template>
					<span>{{ $t('section.groups.isPopulated') }}</span>
				</v-tooltip>

				<!-- Group is not populated -->
				<v-tooltip
					color="secondary"
					bottom
					v-else-if="!item.has_members">
					<template v-slot:activator="{ on, attrs }">
						<v-icon
							v-bind="attrs"
							v-on="on"
							style="opacity: 0.35;">
							mdi-account-multiple
						</v-icon>
					</template>
					<span>{{ $t('section.groups.isNotPopulated') }}</span>
				</v-tooltip>
			</template>

			<!-- APPLICATION GROUP IS ENABLED STATUS -->
			<template
				v-slot:[`item.enabled`]="{ item }"
				v-if="!isLDAPView">
				<!-- Disable Group Button -->
				<v-tooltip color="red" bottom v-if="item.enabled === true">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
							@click="openDialog('confirmASGStatusChange', item)"
							v-bind="attrs"
							v-on="on"
							:disabled="loading">
							<v-icon color="valid-40-s">
								mdi-check
							</v-icon>
						</v-btn>
					</template>
					<span>
						{{ `${$t('actions.clickTo')} ${$t('actions.disable').toLowerCase()} ${item.application}`
						}}
					</span>
				</v-tooltip>

				<!-- Enable Group Button -->
				<v-tooltip
					color="green"
					bottom
					v-else>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
							@click="openDialog('confirmASGStatusChange', item)"
							v-bind="attrs"
							v-on="on"
							:disabled="loading">
							<v-icon color="error-60-s">
								mdi-close
							</v-icon>
						</v-btn>
					</template>
					<span>
						{{ `${$t('actions.clickTo')} ${$t('actions.enable').toLowerCase()} ${item.application}`
						}}
					</span>
				</v-tooltip>
			</template>

			<!-- GROUP ACTIONS -->
			<template v-slot:[`item.actions`]="{ item }">
				<v-row class="my-1" justify="center">
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading || readonly"
								@click="fetchGroup(item, false)">
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
								:disabled="loading || readonly"
								@click="fetchGroup(item, true)">
								<v-icon small color="primary">
									mdi-pencil
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.edit') }}</span>
					</v-tooltip>

					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn icon
								v-show="!loading && !readonly && !isLDAPGroupCritical(item)"
								rounded
								v-bind="attrs"
								v-on="on"
								small
								:disabled="loading || readonly || isLDAPGroupCritical(item)"
								@click="openDeleteDialog(item)">
								<v-icon small color="red">
									mdi-delete
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t('actions.delete') }}</span>
					</v-tooltip>
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<span v-bind="attrs" v-on="on"
								v-show="loading || readonly || isLDAPGroupCritical(item)">
								<v-btn icon
									rounded
									small
									disabled>
									<v-icon small>
										mdi-delete
									</v-icon>
								</v-btn>
							</span>
						</template>
						<span>{{ $t('section.groups.groupBuiltinCannotDelete') }}</span>
					</v-tooltip>
				</v-row>
			</template>
		</v-data-table>

		<!-- GROUP VIEW/EDIT DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['groupDialog']"
			v-if="isLDAPView">
			<GroupDialog
				:group="data.groupdata"
				:editFlag="this.editableForm"
				:dialogKey="'groupDialog'"
				ref="GroupDialog"
				:refreshLoading="loading"
				:fetchingData="fetchingData"
				@closeDialog="closeDialog"
				@save="groupSaved"
				@editToggle="setViewToEdit"
				@refreshGroup="refreshGroup"
				@fetchGroup="fetchGroup" />
		</v-dialog>

		<!-- APPLICATION GROUP CREATE DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['applicationGroupUpdate']"
			v-else>
			<ApplicationGroupDialog
				:dialogKey="'applicationGroupUpdate'"
				ref="ApplicationGroupUpdate"
				@closeDialog="closeDialog"
				@refresh="listGroupItems(false)"
				:editFlag="this.editableForm"
				@refreshGroup="refreshGroup"
				:refreshLoading="loading"
				:fetchingData="fetchingData"
				@save="groupSaved"
				@editToggle="setViewToEdit"
				:value="data.groupdata" />
		</v-dialog>

		<!-- GROUP DELETE CONFIRM DIALOG -->
		<v-dialog
			eager
			max-width="800px"
			v-model="dialogs['groupDelete']">
			<GroupDelete
				:groupObject="data.selectedGroup"
				:dialogKey="'groupDelete'"
				ref="GroupDelete"
				:isLDAPGroup="isLDAPView"
				:groupClass="groupClass"
				@closeDialog="closeDialog"
				@refresh="listGroupItems(false)" />
		</v-dialog>

		<!-- GROUP CREATE DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['groupCreate']"
			v-if="isLDAPView">
			<GroupCreate
				:dialogKey="'groupCreate'"
				ref="GroupCreate"
				@closeDialog="closeDialog" />
		</v-dialog>

		<!-- APPLICATION GROUP CREATE DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['applicationGroupCreate']"
			v-else>
			<ApplicationGroupDialog
				:dialogKey="'applicationGroupCreate'"
				ref="ApplicationGroupCreate"
				@closeDialog="closeDialog"
				@refresh="listGroupItems(false)"
				createFlag />
		</v-dialog>

		<!-- CONFIRM APPLICATION GROUP STATUS CHANGE DIALOG -->
		<v-dialog
			eager
			max-width="800px"
			v-if="!isLDAPView"
			v-model="dialogs['confirmASGStatusChange']">
			<ConfirmDialog
				:title="getTitle"
				:message="getMessage"
				:sub-message="'application' in data.selectedGroup ? data.selectedGroup.application : ''"
				:dialogKey="'confirmASGStatusChange'"
				ref="ConfirmASGStatusChange"
				:value="dialogs['confirmASGStatusChange']"
				@yes="setApplicationGroupStatus()"
				@no="closeDialog" />
		</v-dialog>
	</div>
</template>

<script>
import { notificationBus } from '@/main.js'
import Group from '@/include/Group.js';
import ApplicationGroup from '@/include/ApplicationGroup.js';
import ApplicationGroupDialog from '@/components/Group/ApplicationGroupDialog.vue';
import {
	GROUP_TYPE_DISTRIBUTION,
	GROUP_TYPE_SECURITY,
	GROUP_TYPE_SYSTEM,
	GROUP_SCOPE_GLOBAL,
	GROUP_SCOPE_DOMAIN_LOCAL,
	GROUP_SCOPE_UNIVERSAL,
} from '@/include/constants/LDAPGroup.js';
import GroupDialog from '@/components/Group/GroupDialog.vue'
import GroupCreate from '@/components/Group/GroupCreate.vue'
import GroupDelete from '@/components/Group/GroupDelete.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
	name: 'GroupView',
	mixins: [validationMixin, utilsMixin],
	components: {
		ConfirmDialog,
		GroupDialog,
		GroupCreate,
		GroupDelete,
		RefreshButton,
		ApplicationGroupDialog
	},
	data() {
		return {
			groupClass: undefined,
			tableItemKey: undefined,
			tableDefaultSortKey: undefined,
			readonly: false,
			fetchingData: false,
			expandedRows: [],
			tableData: {
				headers: [],
				items: []
			},
			searchString: "",
			loading: false,
			error: false,
			editableForm: false,

			// Group Data
			data: {
				selectedGroup: {},
				groupdata: {},
			},

			// Dialog States
			dialogs: {
				groupDialog: false,
				groupDelete: false,
				groupCreate: false,
				applicationGroupCreate: false,
				applicationGroupUpdate: false,
				confirmASGStatusChange: false,
			}
		}
	},
	created() {
		this.listGroupItems();
	},
	watch: {
		'computedDialogs': {
			handler: function (v, v_old) {
				for (const d in v) {
					const ref_key = d[0].toUpperCase() + d.slice(1);
					// On Close do exit method
					if (v_old[d] === true) {
						if (this.$refs[ref_key] !== undefined && this.$refs[ref_key].exit !== undefined) {
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
		getTitle() {
			return this.$t('section.applicationGroups.dialog.statusChange.question', {
				action: this.data.selectedGroup.enabled == true ?
					this.$t('actions.disable') : this.$t('actions.enable')
			})
		},
		getMessage() {
			if (this.data.selectedGroup === undefined ||
				this.data.selectedGroup === null ||
				this.data.selectedGroup === {})
				return ""
			if (this.data.selectedGroup.enabled)
				return this.$t('section.applicationGroups.dialog.statusChange.disable_warning')
			else
				return this.$t('section.applicationGroups.dialog.statusChange.enable_warning')
		},
		computedDialogs() {
			return Object.assign({}, this.dialogs)
		},
		isLDAPView() {
			return this.viewTitle == "ldap-groups"
		}
	},
	props: {
		viewTitle: String,
		snackbarTimeout: Number,
	},
	methods: {
		async setApplicationGroupStatus() {
			let itemId = this.data.selectedGroup.id
			let enabled = !this.data.selectedGroup.enabled
			if (this.isLDAPView)
				throw new Error("Group View must be an Application Group.");
			await new this.groupClass({}).change_status({ id: itemId, enabled: enabled })
				.then(() => {
					let action = enabled === true ? "words.enabled" : "words.disabled"
					this.closeDialog('confirmASGStatusChange')
					this.listGroupItems(false)
					notificationBus.$emit("createNotification",
						{
							message: `${this.$tc("classes.group", 1)} ${this.$tc(action, 1)}`.toUpperCase(),
							type: enabled === true ? 'success' : 'info'
						})
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					notificationBus.$emit("createNotification",
						{
							message: this.getMessageForCode(error),
							type: 'error'
						})
				})
		},
		isLDAPGroupCritical(item) {
			let _r = item.group_types.includes(GROUP_TYPE_SYSTEM) ||
				item.name.toLowerCase().startsWith('domain ')
			if ("group_types" in item && "name" in item)
				return _r
			return false
		},
		resetSearch() {
			this.searchString = ""
		},
		openDialog(key, item = undefined) {
			this.dialogs[key] = true;
			switch (key) {
				case 'groupDialog':
					if (this.$refs.GroupDialog != undefined)
						this.$refs.GroupDialog.syncGroup()
					this.$refs.GroupDialog.setupExclude()
					break;
				case 'groupCreate':
					if (this.$refs.GroupCreate != undefined)
						this.$refs.GroupCreate.newGroup()
					break;
				case 'applicationGroupCreate':
					if (this.$refs.ApplicationGroupCreate != undefined)
						this.$refs.ApplicationGroupCreate.syncApplicationGroup()
					break;
				case 'applicationGroupUpdate':
					if (this.$refs.ApplicationGroupUpdate != undefined)
						this.$refs.ApplicationGroupUpdate.syncApplicationGroup()
					break;
				case 'confirmASGStatusChange':
					if (item === undefined)
						throw new Error("Item cannot be undefined.");
					this.data.selectedGroup = item
					break;
				default:
					break;
			}
		},
		async closeDialog(key = undefined, refresh = false) {
			if (key === undefined)
				for (const key in this.dialogs) {
					this.dialogs[key] = false
				}
			this.dialogs[key] = false;
			if (refresh)
				this.listGroupItems()
		},
		groupSaved(groupToFetch, closeDialog) {
			if (!closeDialog)
				this.refreshGroup(groupToFetch)
			this.listGroupItems(false)
			notificationBus.$emit("createNotification",
				{
					message: `${this.$tc("classes.group", 1)} ${this.$tc("words.saved.m", 1)}`.toUpperCase(),
					type: 'success'
				})
		},
		setViewToEdit(value) {
			this.editableForm = value;
		},
		getTranslationParent() {
			switch (this.viewTitle) {
				case "application-groups":
					return "attribute.application.group."
				case "ldap-groups":
				default:
					return "attribute."
			}
		},
		// Reload Data Table Header Labels
		reloadDataTableHeaders() {
			this.tableData.headers.forEach(tableHeader => {
				if (tableHeader.value == "actions") {
					tableHeader.text = this.$t('actions.label')
				} else {
					tableHeader.text = this.$tc(
						this.getTranslationParent() + tableHeader.value, 1)
				}
			});
		},
		setLoading() {
			this.loading = true
			this.error = false
		},
		// Reset Data Table variables
		resetDataTable() {
			this.tableData.headers = []
			this.tableData.items = []
		},
		// Group Actions
		async listGroupItems(emitNotif = true) {
			this.resetDataTable()
			let translationParent = this.getTranslationParent()
			switch (this.viewTitle) {
				case "application-groups":
					this.setLoading()
					this.groupClass = ApplicationGroup
					this.tableItemKey = "id"
					this.tableDefaultSortKey = "name"
					break;
				case "ldap-groups":
					this.setLoading()
					this.groupClass = Group
					this.tableItemKey = "distinguished_name"
					this.tableDefaultSortKey = "name"
					break;
				default:
					return
			}
			await new this.groupClass({}).list()
				.then(response => {
					let groups
					if (this.isLDAPView)
						groups = response.groups
					else
						groups = response.application_groups
					let headerDict = {}
					response.headers.forEach(header => {
						headerDict = {}
						headerDict.value = header
						headerDict.text = undefined
						switch (header) {
							case "has_members":
								headerDict.sortable = false
								headerDict.align = 'center'
								break;
							case "application":
								headerDict.text = this.$tc(`classes.application`, 1)
								break;
							case "users":
								headerDict.text = this.$tc(`classes.user`, 2)
								break;
							case "enabled":
								headerDict.text = this.$t(`words.${header}`)
								break;
							case "group_types":
							case "group_scopes":
								headerDict.text = this.$tc(`${translationParent}${header}`, 2)
								break;
							default:
								break;
						}
						if (headerDict.text === undefined)
							headerDict.text = this.$tc(translationParent + header, 1)
						this.tableData.headers.push(headerDict)
					});
					headerDict = {
						text: this.$t('actions.label'),
						value: 'actions',
						align: 'center',
						sortable: false
					}
					this.tableData.headers.push(headerDict)
					this.tableData.items = groups
					this.loading = false
					this.error = false
					if (emitNotif == true && groups?.length !== undefined)
						notificationBus.$emit("createNotification",
							{
								message: `${this.$tc("classes.group", groups.length)} ${this.$tc("words.loaded.m", groups.length)}`.toUpperCase(),
								type: 'success'
							})
				})
				.catch(error => {
					console.error(error)
					this.loading = false
					this.error = true
					notificationBus.$emit("createNotification",
						{
							message: this.getMessageForCode(error), type: 'error'
						})
				})
		},
		openDeleteDialog(groupObject) {
			this.data.selectedGroup = {}
			this.data.selectedGroup = groupObject
			this.openDialog('groupDelete')
		},
		async refreshGroup(item) {
			await this.fetchGroup(item, this.editableForm, true).then(() => {
				if (this.$refs.GroupDialog != undefined)
					this.$refs.GroupDialog.syncGroup()
				if (this.$refs.ApplicationGroupUpdate != undefined)
					this.$refs.ApplicationGroupUpdate.syncApplicationGroup()
			});
		},
		// Fetch individual Group
		async fetchGroup(item, isEditable = false, openedDialogLoading = false) {
			if (!openedDialogLoading)
				this.loading = true
			this.fetchingData = true
			this.setLoading()
			this.data.selectedGroup[this.tableDefaultSortKey] = item[this.tableDefaultSortKey]
			this.data.selectedGroup[this.tableItemKey] = item[this.tableItemKey]
			this.data.groupdata = new this.groupClass({})
			await this.data.groupdata.fetch(this.data.selectedGroup[this.tableItemKey])
				.then(() => {
					if (this.isLDAPView)
						this.openDialog('groupDialog')
					else
						this.openDialog('applicationGroupUpdate')
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
					this.loading = false
					this.fetchingData = false
					this.error = true
				})
		},
		getColorForGroupTypeOrScope(v) {
			switch (v) {
				case GROUP_TYPE_DISTRIBUTION:
					return {
						"color": 'orange',
						"dark": false // Uses black text
					}
				case GROUP_TYPE_SYSTEM:
					return {
						"color": 'secondary-10',
						"dark": this.isThemeDark(this.$vuetify) ? false : true
					}
				case GROUP_SCOPE_GLOBAL:
					return {
						"color": 'secondary-10',
						"dark": this.isThemeDark(this.$vuetify) ? false : true // Uses white text
					}
				case GROUP_SCOPE_DOMAIN_LOCAL:
					return {
						"color": 'green',
						"dark": true
					}
				case GROUP_SCOPE_UNIVERSAL:
					return {
						"color": 'blue-grey',
						"dark": true
					}
				default:
					return {
						"color": 'primary',
						"dark": true
					}
			}
		},
	},
}
</script>
