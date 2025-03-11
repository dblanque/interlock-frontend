<template>
	<v-card class="pa-0 ma-0">
		<v-progress-linear :color="loadingColor" :indeterminate="refreshLoading || loading"/>
		<v-expand-transition>
			<div v-show="!refreshLoading">
				<!-- Title Bar -->
				<v-card-title class="ma-0 pa-0 card-title">
						<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
								<h3 class="ma-2">{{
									`${editFlag ? $t('actions.edit') : $t('actions.view')} ${$tc("classes.application", 1)}`
									}}</h3>
								<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
								<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
										<v-icon>
												mdi-close
										</v-icon>
								</v-btn>
						</v-row>
				</v-card-title>

				<v-card-text class="ma-0 pa-0 pt-4">
					<ApplicationForm
						ref="ApplicationForm"
						:applicationObject="applicationObject"
						:isBeingEdited="editFlag"
						@update="updateApplicationData"
					/>
				</v-card-text>

				<!-- Actions -->
				<v-card-actions class="card-actions">
						<v-row class="ma-1 pa-0" 
								align="center" 
								align-content="center" 
								:justify="this.$vuetify.breakpoint.mdAndDown ? 'center' : 'space-between'">
								<v-row align="center"
										:justify="this.$vuetify.breakpoint.smAndDown ? 'center' : 'end'"
										class="ma-0 pa-0">
								<!-- Edit User Button -->
								<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag !== true" @click="editApplication">
										<v-icon class="mr-1">
												mdi-pencil
										</v-icon>
										{{ $t("actions.edit") }}
								</v-btn>
								<!-- View User Button -->
								<v-btn color="primary" class="ma-0 pa-0 pa-4 ma-1" rounded v-if="editFlag === true" @click="viewApplication">
										<v-icon class="mr-1">
												mdi-eye
										</v-icon>
										{{ $t("actions.view") }}
								</v-btn>
								<!-- Save User Changes Button -->
								<v-btn @click="saveApplication" 
								:dark="!isThemeDark($vuetify) && editFlag && !loading"
								:light="isThemeDark($vuetify) && editFlag && !loading"
								class="ma-0 pa-0 pa-4 ma-1"
								rounded 
								:disabled="!editFlag || loading">
										<v-icon class="mr-1">
												mdi-content-save
										</v-icon>
										{{ $t("actions.save") }}
								</v-btn>
								<!-- Save User Changes Button -->
								<v-btn @click="saveApplication(true)" 
								:dark="!isThemeDark($vuetify) && editFlag && !loading"
								:light="isThemeDark($vuetify) && editFlag && !loading"
								class='ma-0 pa-0 pa-4 ma-1'
								rounded 
								:disabled="!editFlag || loading">
										<v-icon class="mr-1">
												mdi-exit-to-app
										</v-icon>
										{{ $t("actions.saveClose") }}
								</v-btn>
								<!-- Refresh User Button -->
								<refresh-button dense
										:fetching-data="fetchingData"
										:loading="refreshLoading"
										@refresh="refreshApplication"/>
								</v-row>
						</v-row>
				</v-card-actions>
			</div>
		</v-expand-transition>
	</v-card>
</template>

<script>
import Application from '@/include/Application.js';
import ApplicationForm from '@/components/Application/ApplicationForm.vue';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import RefreshButton from '@/components/RefreshButton.vue';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';

export default {
	name: "ApplicationDialog",
	mixins: [ validationMixin, utilsMixin ],
	components: {
		RefreshButton,
		ApplicationForm
	},
	data() {
		return {
			hideSecret: true,
			applicationCopy: {},
			scopeToAdd: "",
			loading: false,
			loadingColor: "primary",
			error: false,
			errorMsg: "",
			submitted: false
		}
	},
	props: {
		dialogKey: String,
		editFlag: Boolean,
		applicationObject: Object,
		fetchingData: Boolean,
		refreshLoading: Boolean
	},
	created() {
		this.syncApplication();
	},
	methods: {
		logData(){
			console.log(this.applicationCopy)
			console.log(this.applicationObject)
		},
		resetLoadingStatus(){
			this.loading = false
			this.error = false
			this.errorMsg = ""
			this.submitted = false
		},
		resetApplication() {
		this.resetLoadingStatus()
			if (this.$refs.ApplicationForm != undefined)
			this.$refs.ApplicationForm.resetValidation()
			this.applicationCopy = {}
		},
		updateApplicationData(newData) {
			this.applicationCopy = newData
		},
		syncApplication() {
			this.resetApplication()
			this.$nextTick(() => {
				// Do deep copy of object for reset
				if (this.applicationObject != undefined && this.applicationObject != null) {
					this.applicationCopy = Object.assign({}, this.applicationObject)
					this.$refs.ApplicationForm.sync()
				}
			})
		},
		// Tells the parent view to refresh/fetch the group again
		async refreshApplication(){
			this.loading = true
			this.$emit('refreshApplication', this.applicationCopy);
			this.loading = false
			this.loadingColor = 'primary'
		},
		closeDialog() {
				this.$emit('closeDialog', this.dialogKey);
		},
		async saveApplication(closeDialog=false){
			this.loading = true
			this.loadingColor = 'primary'

			const excludeKeys = [
				"client_id",
				"client_secret",
			]
			let data = Object.assign({}, this.applicationCopy)
			excludeKeys.forEach(k => {
				delete data[k]
			});

			if (this.$refs.ApplicationForm.validate()){
				await new Application({}).update(data)
				.then(() => {
					if (closeDialog == true)
						this.closeDialog();
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
		editApplication(){
			this.$emit('editToggle', true);
		},
		viewApplication(){
			this.$emit('editToggle', false);
			this.refreshApplication();
		},
	},
}
</script>