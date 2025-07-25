<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: ApplicationCreate.vue --------------------------->
<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">{{ $t("section.applications.dialog.create.header") }}</h3>
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
						<v-stepper-step :complete="createStage > 1" step="1">
							{{
								$vuetify.breakpoint.mdAndUp ?
									$t('section.applications.dialog.create.step1') : ''
							}}
						</v-stepper-step>
						<v-divider class="mx-3"
							:style="createStage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
						<v-stepper-step :complete="createStage > 2" step="2">
							{{
								$vuetify.breakpoint.mdAndUp ?
									$t('section.applications.dialog.create.step2') : ''
							}}
						</v-stepper-step>
						<v-divider class="mx-3"
							:style="createStage > 2 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
						<v-stepper-step :complete="!loading && success" step="3">
							{{
								$vuetify.breakpoint.mdAndUp ?
									$t('section.applications.dialog.create.step3') : ''
							}}
						</v-stepper-step>
					</v-stepper-header>

					<!-- Steps Content -->
					<v-stepper-items>
						<!-- Basics -->
						<v-stepper-content step="1" class="ma-0 pa-0 pa-4">
							<ApplicationForm
								class="mt-4"
								ref="ApplicationForm"
								:applicationObject="applicationObject"
								:isBeingEdited="true"
								:isBeingCreated="true"
								@update="updateApplicationData"
								@nextStep="nextStep" />
						</v-stepper-content>

						<!-- Loader -->
						<v-stepper-content step="2">
							<v-row class="pa-12 ma-12" justify="center" align-content="center" align="center">
								<v-col cols="12">
									<v-fab-transition>
										<v-progress-circular value="100"
											:color="(this.error === false) ? (loading ? 'primary' : 'green') : 'red'"
											:indeterminate="loading"
											size="100"
											width="10">
											<v-fab-transition>
												<div v-show="loading == false">
													<v-icon v-if="error == true" size="82" color="red">
														mdi-close-circle
													</v-icon>
													<v-icon v-else size="82" color="green">
														mdi-check-circle
													</v-icon>
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
													$t('section.applications.dialog.create.success') }}
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

		<v-snackbar text color="red" timeout="1500" v-if="$vuetify.breakpoint.smAndDown"
			v-model="showSnackbar" centered>
			<v-row justify="center">
				{{ this.errorMsg }}
			</v-row>
		</v-snackbar>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0"
				:justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<!-- Back and Next buttons -->
				<div>
					<v-slide-x-reverse-transition>
						<v-chip class="mx-2" color="red" v-if="this.error && $vuetify.breakpoint.mdAndUp"
							text-color="white">
							{{ this.errorMsg }}
						</v-chip>
					</v-slide-x-reverse-transition>

					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="newApplication" v-if="this.createStage < 2"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pr-4"
							rounded>
							<v-icon class="ma-0 mr-1" color="primary">
								mdi-cached
							</v-icon>
							{{ $t("actions.reset") }}
						</v-btn>
					</v-slide-x-reverse-transition>

					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="prevStep" v-if="createStage > 1 && createStage < 3"
							@keydown.enter="prevStep"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 pr-4 ma-1"
							rounded>
							<v-icon class="ma-0" color="primary">
								mdi-chevron-double-left
							</v-icon>
							{{ $t("actions.back_short") }}
						</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="nextStep" v-if="this.createStage < 2"
							@keydown.enter="nextStep"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pl-4"
							rounded>
							{{ $t("actions.create") }}
							<v-icon class="ma-0" color="primary">
								mdi-chevron-double-right
							</v-icon>
						</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="closeDialog(true)"
							v-if="this.createStage >= 2 && this.error === false"
							@keydown.enter="closeDialog(true)"
							:dark="!isThemeDark($vuetify)"
							:light="isThemeDark($vuetify)"
							class="ma-0 pa-0 pa-2 ma-1 pr-4"
							rounded>
							<v-icon class="ma-0 mr-1" color="primary">
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import Application from '@/include/Application.js';
import { notificationBus } from '@/main.js';

export default {
	name: 'ApplicationCreate',
	components: {
	},
	data() {
		return {
			createStage: 1,
			applicationObject: new Application({}),
			scopeToAdd: "",
			success: false,
			loading: true,
			error: false,
			errorMsg: "",
			valid: false,
			allowRefresh: true,
			showSnackbar: false,
			createStage: 1,
			addObjectClass: "",
		}
	},
	mixins: [
		validationMixin,
		utilsMixin
	],
	props: {
		dialogKey: String
	},
	created() {
		this.newApplication()
	},
	methods: {
		updateApplicationData(newData) {
			this.applicationObject = Object.assign({}, newData)
		},
		async newApplication() {
			this.applicationObject = new Application({})
			await this.applicationObject.oidc_well_known()
				.then(response => {
					this.$refs.ApplicationForm.resetValidation()
					this.applicationObject.name = ""
					this.applicationObject.redirect_uris = ""
					this.applicationObject.scopes = ["openid", "profile", "email", "groups"]
					this.applicationObject.response_types = {}
					Object.values(response.response_types_supported).forEach(rt => {
						this.applicationObject.response_types[rt] = false
					});
					this.createStage = 1;
					this.success = false
					this.errorMsg = ""
					this.error = false
					this.$nextTick(() => {
						// Do deep copy of object for reset
						if (this.applicationObject != undefined && this.applicationObject != null) {
							this.applicationCopy = Object.assign({}, this.applicationObject)
							this.$refs.ApplicationForm.sync()
						}
					})
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
		},
		prevStep() {
			switch (this.createStage) {
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
					if (this.$refs.ApplicationForm.validate()) {
						this.error = false
						this.errorMsg = ""
						this.createApplication()
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
		closeDialog(refresh = false) {
			this.$emit('closeDialog', this.dialogKey, refresh);
		},
		async createApplication() {
			this.loading = true
			this.error = false
			this.errorMsg = ""
			this.createStage += 1
			await new Application({}).insert(this.applicationObject)
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
