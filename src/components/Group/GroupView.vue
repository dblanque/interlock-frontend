<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------------- File: GroupView.vue ------------------------------>
<template>
	<div>
		<v-data-table
			:headers="this.tableData.headers"
			:items="this.tableData.items"
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
			<template v-slot:[`item.groupType`]="{ item }">
				<div class="pt-2">
					<v-chip
						:dark="getColorForGroupType(type)['dark']"
						:light="!getColorForGroupType(type)['dark']"
						:color="getColorForGroupType(type)['color']"
						class="mx-1 mb-2"
						v-for="type in item.groupType"
						:key="type">
						{{ $t('section.groups.types.' + type) }}
					</v-chip>
				</div>
			</template>


			<!-- GROUP POPULATION -->
			<template v-slot:[`item.hasMembers`]="{ item }">
				<!-- Group is Populated -->
				<v-tooltip color="primary" bottom v-if="item.hasMembers">
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
				<v-tooltip color="secondary" bottom v-else-if="!item.hasMembers">
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
			<template v-slot:[`item.enabled`]="{ item }" v-if="!isLDAPView">
				<!-- Disable Group Button -->
				<v-tooltip color="red" bottom v-if="item.enabled === true">
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
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
				<v-tooltip color="green" bottom v-else>
					<template v-slot:activator="{ on, attrs }">
						<v-btn icon
							rounded
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
				<v-row class="my-1">
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
		<v-dialog eager max-width="1200px" v-model="dialogs['groupDialog']">
			<GroupDialog :group="data.groupdata" :editFlag="this.editableForm" :dialogKey="'groupDialog'"
				ref="GroupDialog" :refreshLoading="loading" :fetchingData="fetchingData"
				@closeDialog="closeDialog" @save="groupSaved" @editToggle="setViewToEdit"
				@refreshGroup="refreshGroup" @fetchGroup="fetchGroup" />
		</v-dialog>

		<!-- GROUP DELETE CONFIRM DIALOG -->
		<v-dialog eager max-width="800px" v-model="dialogs['groupDelete']">
			<GroupDelete :groupObject="this.data.selectedGroup" :dialogKey="'groupDelete'"
				ref="GroupDelete"
				@closeDialog="closeDialog" @refresh="listGroupItems(false)" />
		</v-dialog>

		<!-- GROUP CREATE DIALOG -->
		<v-dialog eager max-width="1200px" v-model="dialogs['groupCreate']" v-if="isLDAPView">
			<GroupCreate :dialogKey="'groupCreate'" ref="GroupCreate" @closeDialog="closeDialog" />
		</v-dialog>

		<!-- APPLICATION GROUP CREATE DIALOG -->
		<v-dialog eager max-width="1200px" v-model="dialogs['applicationGroupCreate']" v-else>
			<ApplicationGroupCreate :dialogKey="'applicationGroupCreate'" ref="ApplicationGroupCreate"
				@closeDialog="closeDialog" @refresh="listGroupItems(false)" />
		</v-dialog>
	</div>
</template>

<script>
import { notificationBus } from '@/main.js'
import Group from '@/include/Group.js';
import ApplicationGroup from '@/include/ApplicationGroup.js';
import GroupDialog from '@/components/Group/GroupDialog.vue'
import GroupCreate from '@/components/Group/GroupCreate.vue'
import GroupDelete from '@/components/Group/GroupDelete.vue'
import RefreshButton from '@/components/RefreshButton.vue'
import validationMixin from '@/plugins/mixin/validationMixin.js'
import utilsMixin from '@/plugins/mixin/utilsMixin.js'
import ApplicationGroupCreate from './ApplicationGroupCreate.vue';

export default {
	name: 'GroupView',
	mixins: [validationMixin, utilsMixin],
	components: {
		GroupDialog,
		GroupCreate,
		GroupDelete,
		RefreshButton
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
				selectedGroup: {
					"cn": "",
					"distinguishedName": ""
				},
				groupdata: {},
			},

			// Dialog States
			dialogs: {
				groupDialog: false,
				groupDelete: false,
				groupCreate: false,
				applicationGroupCreate: false,
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
		isLDAPGroupCritical(item) {
			if ("groupType" in item && "cn" in item)
				return item.groupType.includes('GROUP_SYSTEM') || item.cn.startsWith('Domain ')
			return false
		},
		resetSearch() {
			this.searchString = ""
		},
		openDialog(key) {
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
						this.$refs.ApplicationGroupCreate.newGroup()
					break;
				default:
					break;
			}
		},
		async closeDialog(key, refresh = false) {
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
		// Reload Data Table Header Labels
		reloadDataTableHeaders() {
			this.tableData.headers.forEach(tableHeader => {
				if (tableHeader.value == "actions") {
					tableHeader.text = this.$t('actions.label')
				} else {
					tableHeader.text = this.$t('attribute.ldap.' + tableHeader.value)
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
			let translationParent
			switch (this.viewTitle) {
				case "application-groups":
					this.setLoading()
					this.groupClass = ApplicationGroup
					this.tableItemKey = "id"
					this.tableDefaultSortKey = "name"
					translationParent = "attribute.application.group."
					break;
				case "ldap-groups":
					this.setLoading()
					this.groupClass = Group
					this.tableItemKey = "distinguishedName"
					this.tableDefaultSortKey = "cn"
					translationParent = "attribute.ldap."
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
							case "hasMembers":
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
							default:
								break;
						}
						if (headerDict.text === undefined)
							headerDict.text = this.$t(translationParent + header)
						this.tableData.headers.push(headerDict)
					});
					headerDict = {}
					headerDict.text = this.$t('actions.label')
					headerDict.value = 'actions'
					headerDict.align = 'center'
					headerDict.sortable = false
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
			});
		},
		// Fetch individual Group
		async fetchGroup(item, isEditable = false, openedDialogLoading = false) {
			if (!openedDialogLoading)
				this.loading = true
			this.fetchingData = true
			this.data.selectedGroup.cn = item.cn
			this.data.selectedGroup.distinguishedName = item.distinguishedName
			this.data.groupdata = new Group({})
			await this.data.groupdata.fetch(this.data.selectedGroup.distinguishedName)
				.then(() => {
					this.openDialog('groupDialog')
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
		getColorForGroupType(groupType) {
			switch (groupType) {
				case 'GROUP_DISTRIBUTION':
					return {
						"color": 'orange',
						"dark": false // Uses black text
					}
				case 'GROUP_SYSTEM':
					return {
						"color": 'secondary-10',
						"dark": this.isThemeDark(this.$vuetify) ? false : true
					}
				case 'GROUP_GLOBAL':
					return {
						"color": 'secondary-10',
						"dark": this.isThemeDark(this.$vuetify) ? false : true // Uses white text
					}
				case 'GROUP_DOMAIN_LOCAL':
					return {
						"color": 'green',
						"dark": true
					}
				case 'GROUP_UNIVERSAL':
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
