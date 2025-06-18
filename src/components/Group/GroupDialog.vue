<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!------------------------- File: GroupDialog.vue ----------------------------->
<template>
	<v-card :loading="refreshLoading" class="pa-0 ma-0">
		<v-progress-linear :color="loadingColor" :indeterminate="refreshLoading || loading" />
		<v-expand-transition>
			<div v-show="!refreshLoading">
				<!-- Title Bar -->
				<v-card-title class="ma-0 pa-0 card-title">
					<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
						<h3 class="pa-0 ma-0 ma-2">
							{{
								`${$tc('classes.group', 1)}: ` + groupcopy.name
							}}
						</h3>
						<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
						<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
							<v-icon>
								mdi-close
							</v-icon>
						</v-btn>
					</v-row>
				</v-card-title>

				<v-expand-transition>
					<v-row v-show="editFlag && showAlert" justify="center" class="pa-0 ma-0">
						<v-alert class="pa-0 ma-1 pa-4 pb-3 mt-3" border="top" type="warning" :icon="false">
							<v-icon class="mdso mr-2">warning</v-icon>
							{{ $t('section.groups.editFlagWarning') }}
							<v-btn @click="viewGroup" small class="ma-0 pa-0 ml-2 pr-2 pl-1">
								<v-icon color="orange" class="">mdi-chevron-left</v-icon>
								{{ $t('actions.back') }}
							</v-btn>
						</v-alert>
					</v-row>
				</v-expand-transition>
				<!-- BODY -->
				<v-card-text class="ma-0 pa-0 py-4 pb-2">
					<v-form ref="groupForm" @submit.prevent>
						<v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4">
							<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
								<v-text-field
									dense
									id="name"
									:label="$t('attribute.name')"
									:readonly="editFlag != true && !loading"
									v-model="groupcopy.name"
									:rules="[this.fieldRules(groupcopy.name, 'ge_cn')]"></v-text-field>
							</v-col>
							<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
								<v-text-field
									dense
									id="email"
									:label="$t('attribute.email')"
									:readonly="editFlag != true"
									v-model="groupcopy.email"
									:rules="[this.fieldRules(groupcopy.email, 'ge_email')]"></v-text-field>
							</v-col>
						</v-row>

						<v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4">
							<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
								<v-text-field
									dense
									id="object_relative_id"
									:label="$t('attribute.object_relative_id')"
									readonly
									v-model="groupcopy.object_relative_id"></v-text-field>
							</v-col>
							<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
								<v-text-field
									dense
									id="object_security_id"
									:label="$t('attribute.object_security_id')"
									readonly
									v-model="groupcopy.object_security_id"></v-text-field>
							</v-col>
						</v-row>

						<v-row justify="center" class="ma-0 pa-0 mt-2">
							<v-col class="ma-0 pa-0 mx-2" cols="10" md="5">
								<v-text-field
									dense
									id="distinguished_name"
									:label="$t('attribute.distinguished_name')"
									readonly
									v-model="groupcopy.distinguished_name"></v-text-field>
							</v-col>
						</v-row>

						<v-row align-content="center" justify="center" class="ma-0 pa-0 mt-4 px-1">
							<v-col cols="8" class="ma-0 pa-0">
								<v-alert color="accent-75-s" type="info" text v-if="isBuiltIn()">
									{{ $t("section.groups.groupDialog.typeInBuiltinReadOnly") }}
								</v-alert>
							</v-col>
							<v-col cols="12" class="ma-0 pa-0">
								<GroupTypeRadioGroups :editFlag="editFlag && !isBuiltIn()"
									:group-types="groupcopy.group_types"
									:group-scopes="groupcopy.group_scopes"
									@update-type="(v) => groupcopy.group_types = v"
									@update-scope="(v) => groupcopy.group_scopes = v"/>
							</v-col>
						</v-row>

						<!-- MEMBER BUTTONS -->
						<v-row justify="center" class="ma-0 pa-0 my-4">
							<v-col cols="8" class="ma-0 pa-0">
								<v-btn @click="openDialog('addToGroup')"
									rounded text color="primary" outlined :disabled="!editFlag" class="pa-3">
									<v-icon small class="mr-1">mdi-plus</v-icon>
									{{ $t("actions.addN") + " " + $t("words.member") }}
								</v-btn>
							</v-col>
						</v-row>
						<v-row>
						</v-row>
						<!-- MEMBER EXPANSION PANEL -->
						<v-row v-if="showMemberTab" align-content="center" justify="center"
							class="ma-0 pa-0 my-4">
							<v-col cols="10" md="8" class="ma-0 pa-0">
								<v-expansion-panels v-model="memberPanelExpanded" flat
									:style="memberPanelExpanded == [0] ? 'border: 1px solid var(--v-primary-base);' : 'border: 1px solid var(--v-gray-80-base);'">
									<v-expansion-panel>
										<v-expansion-panel-header>
											{{ $t('section.groups.groupDialog.members') }}
										</v-expansion-panel-header>
										<v-expansion-panel-content>
											<v-list dense>
												<v-list-item v-for="member, key in this.groupcopy.members" :key="key"
													:class="key != 0 ? 'border-bottom' : 'border-block'">
													<v-list-item-icon class="">
														<v-icon v-if="isUserType(member.object_class)">
															mdi-account
														</v-icon>
														<v-icon v-else-if="member.object_class.includes('group')">
															mdi-google-circles-communities
														</v-icon>
														<v-icon v-else>
															mdi-group
														</v-icon>
													</v-list-item-icon>

													<v-list-item-content>
														<v-row v-if="isUserType(member.object_class)"
															align="center" justify="center">
															<v-col cols="12" class="pa-0 ma-0 px-1">
																<span class="ma-0 pa-0">
																	{{ `${$tc('classes.user', 1)}: ` }}
																	{{
																		((member.first_name && member.last_name) ?
																			`${member.first_name} ${member.last_name} (${member.username})`
																			:
																			member.username)
																	}}
																</span>
															</v-col>
														</v-row>
														<v-row v-else-if="member.object_class.includes('group')"
															align="center" justify="center">
															<v-col cols="12" class="pa-0 ma-0 px-1">
																<span class="ma-0 pa-0">
																	{{ `${$tc('classes.group', 1)}: ${member.name}` }}
																</span>
															</v-col>
														</v-row>
														<v-row v-else align="center" justify="center">
															<v-col cols="12" class="pa-0 ma-0 px-1">
																{{ member.distinguished_name }}
															</v-col>
														</v-row>
													</v-list-item-content>

													<v-list-item-action class="pa-0 ma-0">
														<v-tooltip bottom color="primary">
															<template v-slot:activator="{ on, attrs }">
																<v-btn small icon
																	color="primary"
																	v-bind="attrs"
																	v-on="on">
																	<v-icon small>
																		mdi-help-circle
																	</v-icon>
																</v-btn>
															</template>
															<span> {{ member.distinguished_name }} </span>
														</v-tooltip>
													</v-list-item-action>

													<v-list-item-action class="pa-0 ma-0">
														<v-tooltip bottom>
															<template v-slot:activator="{ on, attrs }">
																<v-btn small icon @click="copyText(member.distinguished_name)"
																	color="primary"
																	v-bind="attrs"
																	v-on="on">
																	<v-icon small>
																		mdi-content-copy
																	</v-icon>
																</v-btn>
															</template>
															<span> {{ $t("section.groups.groupDialog.copyDistinguishedName") }}
															</span>
														</v-tooltip>
													</v-list-item-action>

													<v-list-item-action class="pa-0 ma-0">
														<v-tooltip
															bottom
															color="red">
															<template v-slot:activator="{ on, attrs }">
																<v-btn small icon
																	@click="removeMember(member.distinguished_name, groupcopy.members)"
																	color="red"
																	:disabled="!editFlag"
																	v-bind="attrs"
																	v-on="on">
																	<v-icon small>
																		mdi-close
																	</v-icon>
																</v-btn>
															</template>
															<span> {{ $t("actions.remove") }} </span>
														</v-tooltip>
													</v-list-item-action>
												</v-list-item>
											</v-list>
										</v-expansion-panel-content>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-col>
						</v-row>
					</v-form>
				</v-card-text>
			</div>
		</v-expand-transition>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row
				class="ma-1 pa-0"
				align="center"
				align-content="center"
				:justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<!-- Edit Group Button -->
				<v-btn
					color="primary"
					class="ma-0 pa-0 pa-4 ma-1"
					rounded
					v-if="editFlag != true"
					@click="editGroup">
					<v-icon class="mr-1">
						mdi-pencil
					</v-icon>
					{{ $t("actions.edit") }}
				</v-btn>
				<!-- View Group Button -->
				<v-btn
					color="primary"
					class="ma-0 pa-0 pa-4 ma-1"
					rounded
					v-if="editFlag == true"
					@click="viewGroup">
					<v-icon class="mr-1">
						mdi-eye
					</v-icon>
					{{ $t("actions.view") }}
				</v-btn>
				<!-- Save Group Changes Button -->
				<v-btn
					@click="saveGroup"
					:class="(editFlag ? '' : '') + 'ma-0 pa-0 pa-4 ma-1'"
					rounded
					:dark="!isThemeDark($vuetify) && editFlag"
					:light="isThemeDark($vuetify) && editFlag"
					:disabled="!editFlag">
					<v-icon class="mr-1">
						mdi-content-save
					</v-icon>
					{{ $t("actions.save") }}
				</v-btn>
				<!-- Save Group Changes Button -->
				<v-btn
					@click="saveGroup(true)"
					:class="(editFlag ? '' : '') + 'ma-0 pa-0 pa-4 ma-1'"
					rounded
					:dark="!isThemeDark($vuetify) && editFlag"
					:light="isThemeDark($vuetify) && editFlag"
					:disabled="!editFlag">
					<v-icon class="mr-1">
						mdi-exit-to-app
					</v-icon>
					{{ $t("actions.saveClose") }}
				</v-btn>
				<!-- Refresh Group Button -->
				<refresh-button
					dense
					:fetching-data="fetchingData"
					:loading="refreshLoading"
					@refresh="refreshGroup" />
			</v-row>
		</v-card-actions>

		<!-- USER ADD TO GROUP DIALOG -->
		<v-dialog
			eager
			max-width="1200px"
			v-model="dialogs['addToGroup']">
			<CNObjectList
				:dialogKey="'addToGroup'"
				ref="AddToGroup"
				@addDNs="addMembers"
				:excludeDNs="excludeDNs"
				@closeDialog="closeInnerDialog" />
		</v-dialog>
	</v-card>
</template>

<script>
import Group from '@/include/Group.js';
import RefreshButton from '@/components/RefreshButton.vue';
import CNObjectList from '@/components/CNObjectList.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';
import {
	GROUP_SCOPE_DEFAULT,
	GROUP_TYPE_DEFAULT,
	GROUP_TYPE_DISTRIBUTION,
	GROUP_TYPE_SECURITY,
	GROUP_TYPE_SYSTEM,
	GROUP_SCOPE_GLOBAL,
	GROUP_SCOPE_DOMAIN_LOCAL,
	GROUP_SCOPE_UNIVERSAL,
} from '@/include/constants/LDAPGroup.js';
import { LDAPUserClasses } from '@/include/constants/LDAPUser.js';
import GroupTypeRadioGroups from '@/components/Group/GroupTypeRadioGroups.vue'

export default {
	name: 'GroupDialog',
	components: {
		CNObjectList,
		RefreshButton,
		GroupTypeRadioGroups,
	},
	data() {
		return {
			userClasses: LDAPUserClasses,
			loading: false,
			loadingColor: 'accent',
			error: false,
			errorMsg: "",
			domain: "",
			realm: "",
			basedn: "",
			showMemberTab: false,
			showAlert: false,
			groupcopy: {},
			excludeDNs: [],
			memberPanelExpanded: 0,
			members_to_add: [],
			members_to_remove: [],
			// Dialog States
			dialogs: {
				addToGroup: false
			},
		}
	},
	mixins: [validationMixin, utilsMixin],
	created() {
		this.alertDelay = 0.5e3;
		this.syncGroup();
	},
	watch: {
		dialogs: {
			handler: function (newValue) {
				if (!newValue['addToGroup'] || newValue['addToGroup'] == false)
					this.$refs.AddToGroup.clearList();
			},
			deep: true
		}
	},
	props: {
		dialogKey: String,
		editFlag: Boolean,
		group: Object,
		fetchingData: Boolean,
		refreshLoading: Boolean,
		groupClass: Function,
		parentTitle: String,
	},
	methods: {
		isBuiltIn() {
			if (!this.groupcopy?.distinguished_name || this.groupcopy?.distinguished_name.length < 1)
				return false
			return this.groupcopy.distinguished_name
							.toLowerCase()
							.includes("cn=builtin");
		},
		exit() {
			this.showAlert = false
		},
		copyText(textString) {
			navigator.clipboard.writeText(textString);
		},
		getMembersLength() {
			if (this.groupcopy.members != undefined) {
				if (this.groupcopy.members.length == 0 || !this.groupcopy.members)
					this.showMemberTab = false
				else
					this.showMemberTab = true
			}
		},
		setupExclude() {
			this.excludeDNs = []
			if (!this.excludeDNs.includes(this.groupcopy.distinguished_name))
				this.excludeDNs.push(this.groupcopy.distinguished_name)
			if (this.groupcopy.members != undefined && this.groupcopy.members.length > 0) {
				this.groupcopy.members.forEach(member => {
					this.excludeDNs.push(member.distinguished_name)
				});
			}
			if (this.members_to_add != undefined && this.members_to_add.length > 0) {
				this.members_to_add.forEach(member => {
					if (!this.excludeDNs.includes(member))
						this.excludeDNs.push(member)
				});
			}
			// this.logGroups()
		},
		openDialog(key) {
			this.dialogs[key] = true;
			switch (key) {
				case 'addToGroup':
					this.setupExclude()
					this.$refs.AddToGroup.fetchLists(this.excludeDNs)
					break;
				default:
					break;
			}
		},
		closeDialog() {
			this.$emit('closeDialog', this.dialogKey);
		},
		closeInnerDialog(key) {
			this.dialogs[key] = false;
		},
		addMembers(members) {
			this.members_to_add = members.map(e => e.distinguished_name)
			if (!this.groupcopy.members)
				this.groupcopy.members = []
			members.forEach(g => {
				if (this.groupcopy.members.filter(e => e.distinguished_name == g.distinguished_name).length == 0)
					this.groupcopy.members.push(g)

				if (this.members_to_remove != undefined) {
					// console.log("MTR Includes this member, removing. " + g.distinguished_name)
					this.members_to_remove = this.members_to_remove.filter(e => e != g.distinguished_name)
				}
			});
			this.closeInnerDialog('addToGroup')
			// this.logGroups()
			this.showMemberTab = true
			this.setupExclude()
			this.$forceUpdate
		},
		removeMember(memberDn) {
			if (!this.members_to_remove != undefined && !this.members_to_remove.includes(memberDn))
				this.members_to_remove.push(memberDn)

			if (this.members_to_add != undefined && this.members_to_add.includes(memberDn))
				this.members_to_add = this.members_to_add.filter(e => e != memberDn)

			if (this.excludeDNs != undefined && this.excludeDNs.includes(memberDn))
				this.excludeDNs = this.excludeDNs.filter(e => e != memberDn)

			this.groupcopy.members = this.groupcopy.members.filter(e => e.distinguished_name != memberDn)
			// this.logGroups()
			if (this.groupcopy.members == undefined || this.groupcopy.members.length == 0)
				this.showMemberTab = false
			this.setupExclude()
			this.$forceUpdate
		},
		logGroups() {
			console.log("Member Array")
			console.log(this.groupcopy.members)
			console.log("Members to Add")
			console.log(this.members_to_add)
			console.log("Members to Remove")
			console.log(this.members_to_remove)
			console.log("Exclude DNs")
			console.log(this.excludeDNs)
		},
		checkIfGroupBuiltIn() {
			if (this.group.group_types.includes('TYPE_SYSTEM'))
				return true
			return false
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
		// Sync the groupcopy object to the parent view group object on the
		// next tick to avoid mutation errors
		syncGroup() {
			this.groupcopy = new Group({})
			this.members_to_remove = []
			this.members_to_add = []
			this.excludeDNs = []
			this.showMemberTab = false
			this.showAlert = false
			this.$nextTick(() => {
				this.groupcopy = Object.assign({}, this.group)
				this.getMembersLength()
				this.setupExclude()
				this.loading = false
				this.loadingColor = 'primary'
				if (Object.keys(this.group).length != 0)
					setTimeout(() => {
						this.showAlert = true
					}, this.alertDelay)
			})
		},
		isUserType(itemObjectClasses) {
			var isUser = false
			itemObjectClasses.forEach(v => {
				if (this.userClasses.includes(v))
					isUser = true
			})
			return isUser
		},
		// Tells the parent view to refresh/fetch the group again
		async refreshGroup() {
			this.loading = true
			this.$emit('refreshGroup', this.group);
			this.setupExclude()
			this.loading = false
			this.loadingColor = 'primary'
		},
		async saveGroup(closeDialog = false) {
			this.loading = true
			this.loadingColor = 'primary'

			// Set members
			// Members to Add
			if (this.members_to_add.length > 0)
				this.groupcopy.members_to_add = this.members_to_add
			else
				delete this.groupcopy.members_to_add
			// Members to Remove
			if (this.members_to_remove.length > 0)
				this.groupcopy.members_to_remove = this.members_to_remove
			else
				delete this.groupcopy.members_to_remove

			// Deep copy data and modify for delivery
			const excludeKeys = [
				"object_relative_id",
				"object_security_id",
				"members",
				"type"
			]
			let scopes_and_types = ["group_scopes", "group_types"]
			const keysToCheck = ["name", "email"]
			let newDistinguishedName
			let data = Object.assign({}, this.groupcopy)

			excludeKeys.forEach(k => {
				delete data[k]
			});
			// Remove unchanged keys or do something on change
			keysToCheck.forEach(k => {
				let _origVal = this.group[k]
				let _val = data[k]
				if (_origVal === _val) {
					delete data[k]
				}
				else {
					switch (k) {
						case "name":
							const v = _val
							newDistinguishedName = data["distinguished_name"].split(",")
							// Remove relative distinguished name to get superior ldap path.
							newDistinguishedName.shift()
							newDistinguishedName = newDistinguishedName.join(",")
							// Add new relative distinguished name
							newDistinguishedName = `CN=${v},${newDistinguishedName}`
							break;
						default:
							break;
					}
				}
			});

			if (this.$refs.groupForm.validate()) {
				await new Group({}).update({ group: data })
					.then(() => {
						if (closeDialog == true)
							this.closeDialog();
						if (newDistinguishedName)
							data["distinguished_name"] = newDistinguishedName
						this.$emit('save', data, closeDialog == true);
						this.loading = false
						this.loadingColor = 'primary'
					})
					.catch(error => {
						console.error(error)
						this.errorMsg = this.getMessageForCode(error)
						notificationBus.$emit('createNotification',
							{
								message: this.errorMsg,
								type: 'error'
							}
						);
						this.loading = false
						this.loadingColor = 'error'
						this.error = true;
					})
			} else {
				this.loading = false
				this.loadingColor = 'error'
				this.error = true;
			}
		},
		editGroup() {
			this.$emit('editToggle', true);
		},
		viewGroup() {
			this.$emit('editToggle', false);
			this.refreshGroup();
		},
	},
}
</script>

<style>
.border-top {
	border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.border-bottom {
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.border-block {
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	border-top: 1px solid rgba(0, 0, 0, 0.1);
}

[theme=dark] .border-top,
[theme=dark] .border-bottom,
[theme=dark] .border-block {
	border-color: rgba(255, 255, 255, 0.1)
}
</style>