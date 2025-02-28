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
		
				<v-card-text class="ma-0 pa-0">
						<v-row class="ma-0 pa-0">
						<v-col class="ma-0 pa-0">
							<!-- Application Form -->
								<v-form ref="applicationForm" @submit.prevent>
									<!-- Application Name -->
									<v-row justify="center" align="center" class="ma-0 pa-0 px-8">
											<v-col cols="12" lg="6">
													<v-text-field
															v-model="applicationCopy.name"
															:readonly="!editFlag"
															dense
															@keydown.enter="nextStep"
															:rules="[this.fieldRules(applicationCopy.name, 'ge_lettersStrict', true)]"
															:label="$tc('section.applications.attribute.name')"
													/>
											</v-col>
											<!-- Redirect URIs -->
											<v-col cols="12" lg="6">
													<v-text-field
															v-model="applicationCopy.redirect_uris"
															:readonly="!editFlag"
															dense
															@keydown.enter="nextStep"
															:rules="[this.fieldRules(applicationCopy.redirect_uris, 'ge_endpoint', true)]"
															:label="$tc('section.applications.attribute.redirect_uris')"
															:hint="$t('section.applications.dialog.create.redirectUriPlaceholder')"
													/>
											</v-col>
											<!-- Client ID -->
											<v-col cols="8">
												<v-row no-gutters>
													<v-text-field
															v-model="applicationCopy.client_id"
															:readonly="!editFlag"
															dense
															@keydown.enter="nextStep"
															readonly
															:label="$tc('section.applications.attribute.client_id')"
													/>
													<v-tooltip bottom>
													<template v-slot:activator="{ on, attrs }">
															<v-btn small icon 
															@click="copyText(applicationCopy.client_id)"
															@click.stop
															class="ml-2"
															color="primary"
															v-bind="attrs"
															v-on="on"
															>
															<v-icon small>
																	mdi-content-copy
															</v-icon>
															</v-btn>
													</template>
													<span> {{ $t("section.applications.dialog.update.copyId") }} </span>
													</v-tooltip>
												</v-row>
											</v-col>
											<!-- Client Secret -->
											<v-col cols="8">
												<v-row no-gutters>
													<v-text-field
															v-model="applicationCopy.client_secret"
															:type="hideSecret ? 'password' : 'text'"
															:append-icon="hideSecret ? 'mdi-eye' : 'mdi-eye-off'"
															prepend-inner-icon="mdi-lock"
															@click:append="() => (hideSecret = !hideSecret)"
															readonly
															dense
															@keydown.enter="nextStep"
															:label="$tc('section.applications.attribute.client_secret')"
													/>
													<v-tooltip bottom>
													<template v-slot:activator="{ on, attrs }">
															<v-btn small icon 
															@click="copyText(applicationCopy.client_secret)"
															@click.stop
															class="ml-2"
															color="primary"
															v-bind="attrs"
															v-on="on"
															>
															<v-icon small>
																	mdi-content-copy
															</v-icon>
															</v-btn>
													</template>
													<span> {{ $t("section.applications.dialog.update.copySecret") }} </span>
													</v-tooltip>
												</v-row>
											</v-col>
									</v-row>
									<!-- Application State Toggle -->
									<v-row justify="center" align="center" no-gutters>
										<v-checkbox
												on-icon="mdi-checkbox-marked"
												color="primary"
												v-model="applicationCopy.enabled"
												:disabled="!editFlag"
												class="ma-0 pa-0 mx-2"
												:label="$t('words.enabled')"
												dense/>
									</v-row>
									<!-- Consent Options -->
									<v-row justify="center" align="center" no-gutters>
											<v-checkbox
													on-icon="mdi-checkbox-marked"
													color="primary"
													v-model="applicationCopy.require_consent"
													:disabled="!editFlag"
													class="ma-0 pa-0 mx-2"
													:label="$t('section.applications.attribute.require_consent')"
													dense/>
											<v-checkbox
													on-icon="mdi-checkbox-marked"
													color="primary"
													v-model="applicationCopy.reuse_consent"
													:disabled="!editFlag"
													class="ma-0 pa-0 mx-2"
													:label="$t('section.applications.attribute.reuse_consent')"
													dense/>
									</v-row>
									<!-- Scope Options -->
									<v-row justify="center" align="center" no-gutters>
										<v-card outlined class="pa-6" max-width="600" width="100%">
												<v-row align="center" justify="center" class="ma-0 pa-0">
														<v-col cols="4" class="ma-0 pa-0">
																<v-text-field
																		v-model="scopeToAdd"
																		dense
																		:disabled="!editFlag"
																		@keydown.enter="addScopeValue"
																		:rules="[this.fieldRules(scopeToAdd, 'ge_lettersStrict', false)]"
																		:label="$tc('section.applications.attribute.addScope')"
																/>
														</v-col>
														<v-col cols="auto" class="ma-0 pa-0">
																<v-btn
																		color="primary"
																		icon
																		@click="addScopeValue"
																		:disabled="addScopeIsEmpty() || !editFlag"
																>
																		<v-icon>mdi-plus</v-icon>
																</v-btn>
														</v-col>
												</v-row>
												<v-row>
														<v-col cols="12" class="ma-0 pa-0">
														<v-list dense outlined>
																<v-list-item dense v-for="scope in applicationCopy.scopes" :key="scope">
																		<v-list-item-content>
																				<v-list-item-title>{{ scope }}</v-list-item-title>
																		</v-list-item-content>
																		<v-list-item-action>
																				<v-btn
																						small
																						icon
																						@click="removeScopeValue(scope)"
																						:disabled="!editFlag"
																						color="error"
																				>
																						<v-icon>mdi-minus</v-icon>
																				</v-btn>
																		</v-list-item-action>
																</v-list-item>
														</v-list>
														</v-col>
												</v-row>
										</v-card>
									</v-row>
								</v-form>
						</v-col>
						</v-row>
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import RefreshButton from '@/components/RefreshButton.vue';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';

export default {
	name: "ApplicationDialog",
	mixins: [ validationMixin, utilsMixin ],
	components: {
		RefreshButton
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
			submitted: false,
		}
	},
	props: {
		viewKey: String,
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
		addScopeIsEmpty() {
				return (
						this.scopeToAdd.length === 0 ||
						this.scopeToAdd === undefined ||
						this.scopeToAdd === null
				)
		},
		addScopeValue(){
				if (this.addScopeIsEmpty())
						return
				if (!this.appToCreate.scopes.includes(this.scopeToAdd))
						this.appToCreate.scopes.push(this.scopeToAdd)
				this.scopeToAdd = ""
		},
		removeScopeValue(v){
				const index = this.appToCreate.scopes.indexOf(v);
				if (index >= 0) {
						this.appToCreate.scopes.splice(index, 1)
				}
		},
		resetLoadingStatus(){
			this.loading = false
			this.error = false
			this.errorMsg = ""
			this.submitted = false
		},
		resetApplication() {
		this.resetLoadingStatus()
			if (this.$refs.applicationForm != undefined)
			this.$refs.applicationForm.resetValidation()
			this.applicationCopy = {}
		},
		syncApplication() {
			this.resetApplication()
			this.$nextTick(() => {
				// Do deep copy of object for reset
				if (this.applicationObject != undefined && this.applicationObject != null) {
					this.applicationCopy = Object.assign({}, this.applicationObject)
				}
			})
		},
		copyText(textString) {
				navigator.clipboard.writeText(textString);
		},
		// Tells the parent view to refresh/fetch the group again
		async refreshApplication(){
			this.loading = true
			this.$emit('refreshApplication', this.applicationCopy);
			this.loading = false
			this.loadingColor = 'primary'
		},
		closeDialog() {
				this.$emit('closeDialog', this.viewKey);
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

			if (this.$refs.applicationForm.validate()){
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