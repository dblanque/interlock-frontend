<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-progress-linear :loading="loading"></v-progress-linear>
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">{{ $t("section.applicationGroups.dialog.create.header") }}</h3>
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
				:create-flag="true" />
		</v-card-text>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0"
				:justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<div>
					<v-btn elevation="0" @click="createGroup()" @keydown.enter="createGroup()"
						class="ma-0 pa-0 pa-2 ma-1 pr-4" :dark="!isThemeDark($vuetify)"
						:light="isThemeDark($vuetify)" rounded>
						<v-icon class="ma-0 mr-1" color="primary">
							mdi-checkbox-marked-circle-outline
						</v-icon>
						{{ $t("actions.create") }}
					</v-btn>
				</div>
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
		dialogKey: String
	},
	components: {
		ApplicationGroupForm
	},
	watch: {
		requestData: {
			deep: true,
			handler: function (val, oldVal) {
				if (this.logRequestData) {
					console.log(JSON.stringify(val))
				}
			}
		},
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
		closeDialog() {
			this.$emit('closeDialog', this.dialogKey);
			this.$emit('refresh');
		},
		clearData() {
			this.validApplications = []
			this.data = {
				application: "",
				application_choices: [],
				user_choices: [],
			}
			this.requestData = {
				users: [],
				ldap_objects: []
			}
		},
		async newGroup() {
			this.$refs.ApplicationGroupForm.init()
			this.clearData()
			await new ApplicationGroup({}).create_info()
				.then(response => {
					this.loading = false
					this.data.application_choices = response.data.applications
					this.data.user_choices = response.data.users
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
		async createGroup() {
			this.loading = true
			this.error = false
			this.errorMsg = ""
			if (this.$refs.ApplicationGroupForm.validate()) {
				await new ApplicationGroup({}).insert(this.requestData)
				.then(response => {
					this.loading = false
					console.log(response)
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
			// notificationBus.$emit("createNotification",
			// 			{
			// 				message: `${this.$tc("classes.applicationGroup", 1)} ${this.$tc("words.saved.m", 1)}`.toUpperCase(),
			// 				type: 'success'
			// 			})
		}
	},
}
</script>
