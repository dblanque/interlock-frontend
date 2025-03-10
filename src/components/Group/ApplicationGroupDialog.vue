<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-progress-linear :loading="loading"></v-progress-linear>
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">
					{{ createFlag ?
						$t("section.applicationGroups.dialog.create.header") :
						$tc("classes.application-group", 1)
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

		<v-card-text>
			<ApplicationGroupForm
				ref="ApplicationGroupForm"
				v-model="requestData"
				:application_choices="data.application_choices"
				:user_choices="data.user_choices"
				:createFlag="createFlag"
				:editFlag="editFlag" />
		</v-card-text>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center"
				:justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<!-- Create Group Button -->
				<v-btn elevation="0" @click="createGroup()" @keydown.enter="createGroup()"
					class="ma-0 pa-0 pa-2 ma-1 pr-4" :dark="!isThemeDark($vuetify)"
					v-if="createFlag"
					:light="isThemeDark($vuetify)" rounded>
					<v-icon class="ma-0 mr-1" color="primary">
						mdi-checkbox-marked-circle-outline
					</v-icon>
					{{ $t("actions.create") }}
				</v-btn>
				<!-- Edit Group Button -->
				<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="!editFlag && !createFlag"
					@click="editGroup">
					<v-icon class="mr-1">
						mdi-pencil
					</v-icon>
					{{ $t("actions.edit") }}
				</v-btn>
				<!-- View Group Button -->
				<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag && !createFlag"
					@click="viewGroup">
					<v-icon class="mr-1">
						mdi-eye
					</v-icon>
					{{ $t("actions.view") }}
				</v-btn>
				<!-- Save Group Changes Button -->
				<v-btn @click="saveGroup" :class="(editFlag ? '' : '') + 'ma-0 pa-0 pa-4 ma-1'" rounded
					:dark="!isThemeDark($vuetify) && editFlag" :light="isThemeDark($vuetify) && editFlag"
					:disabled="!editFlag" v-if="!createFlag">
					<v-icon class="mr-1">
						mdi-content-save
					</v-icon>
					{{ $t("actions.save") }}
				</v-btn>
				<!-- Save Group Changes Button -->
				<v-btn @click="saveGroup(true)" :class="(editFlag ? '' : '') + 'ma-0 pa-0 pa-4 ma-1'"
					rounded v-if="!createFlag"
					:dark="!isThemeDark($vuetify) && editFlag" :light="isThemeDark($vuetify) && editFlag"
					:disabled="!editFlag">
					<v-icon class="mr-1">
						mdi-exit-to-app
					</v-icon>
					{{ $t("actions.saveClose") }}
				</v-btn>
				<!-- Refresh Group Button -->
				<refresh-button dense :fetching-data="fetchingData" :loading="refreshLoading"
					@refresh="refreshGroup" />
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import { notificationBus } from '@/main.js';
import ApplicationGroup from '@/include/ApplicationGroup.js';
import ApplicationGroupForm from '@/components/Group/ApplicationGroupForm.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: 'ApplicationGroupCreate',
	props: {
		dialogKey: String,
		value: Object,
		createFlag: Boolean,
		editFlag: Boolean,
		fetchingData: Boolean,
		refreshLoading: Boolean,
	},
	components: {
		ApplicationGroupForm
	},
	data() {
		return {
			logRequestData: false,
			data: {
				application: "",
				application_choices: [],
				user_choices: [],
			},
			requestData: {
				users: [],
				ldap_objects: []
			},
			validApplications: [],
			success: false,
			loading: true,
			error: false,
			valid: false,
			errorMsg: "",
			dialogs: {
				addLDAPGroup: false
			}
		}
	},
	mixins: [validationMixin, utilsMixin],
	methods: {
		refreshGroup() {
			this.$emit('refreshGroup', this.value)
		},
		editGroup() {
			this.$emit('editToggle', true)
		},
		viewGroup() {
			this.$emit('editToggle', false)
		},
		closeDialog() {
			this.$emit('closeDialog', this.dialogKey);
			this.$emit('refresh');
		},
		clearData() {
			this.validApplications = []
			if (this.createFlag) {
				this.requestData = {
					users: [],
					ldap_objects: []
				}
			} else {
				this.requestData = this.value
			}
			this.data = {
				application: "",
				application_choices: [],
				user_choices: [],
			}
		},
		async syncApplicationGroup() {
			this.clearData()
			await new ApplicationGroup({}).create_info()
				.then(response => {
					this.loading = false
					this.data.application_choices = response.data.applications
					this.data.user_choices = response.data.users
					this.$refs.ApplicationGroupForm.init()
				})
				.catch(error => {
					console.error(error)
					this.error = true;
					this.loading = false;
					this.errorMsg = this.getMessageForCode(error)
					notificationBus.$emit("createNotification",
						{
							message: this.errorMsg.toUpperCase(),
							type: 'error'
						})
				})
		},
		async saveGroup(closeDialog = false) {
			this.loading = true
			this.error = false
			this.errorMsg = ""
			let finalData = Object.assign({}, this.requestData)
			finalData.application = this.requestData.application.id
			if (this.$refs.ApplicationGroupForm.validate()) {
				await new ApplicationGroup({}).update(finalData)
					.then(() => {
						this.loading = false
						if (closeDialog == true)
							this.closeDialog();
						this.$emit('save', this.requestData, closeDialog == true);
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
			}
		},
		async createGroup() {
			this.loading = true
			this.error = false
			this.errorMsg = ""
			if (this.$refs.ApplicationGroupForm.validate()) {
				await new ApplicationGroup({}).insert(this.requestData)
					.then(response => {
						this.loading = false
						this.closeDialog();
						notificationBus.$emit("createNotification",
							{
								message: `${this.$tc("classes.applicationGroup", 1)} ${this.$t("words.created.m", 1)}`.toUpperCase(),
								type: 'success'
							})
					})
					.catch(error => {
						console.error(error)
						this.error = true;
						this.loading = false;
						this.errorMsg = this.getMessageForCode(error)
						notificationBus.$emit("createNotification",
							{
								message: this.errorMsg.toUpperCase(),
								type: 'error'
							})
					})
			}
		}
	},
}
</script>
