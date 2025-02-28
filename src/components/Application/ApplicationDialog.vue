<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
				<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
						<h3 class="ma-2">{{ $t('actions.edit') + " " + $tc("classes.application", 1) }}</h3>
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
						<v-form ref="applicationForm" @submit.prevent>
							<v-row justify="center" align="center" class="ma-0 pa-0">
									<v-col cols="12" lg="6">
											<v-text-field
													v-model="applicationCopy.name"
													dense
													@keydown.enter="nextStep"
													:rules="[this.fieldRules(applicationCopy.name, 'ge_lettersStrict', true)]"
													:label="$tc('section.applications.attribute.name')"
											/>
									</v-col>
									<v-col cols="12" lg="6">
											<v-text-field
													v-model="applicationCopy.redirect_uris"
													dense
													@keydown.enter="nextStep"
													:rules="[this.fieldRules(applicationCopy.redirect_uris, 'ge_endpoint', true)]"
													:label="$tc('section.applications.attribute.redirect_uris')"
													:hint="$t('section.applications.dialog.create.redirectUriPlaceholder')"
											/>
									</v-col>
							</v-row>
							<v-row justify="center" align="center" no-gutters>
									<v-checkbox
											on-icon="mdi-checkbox-marked"
											color="primary"
											v-model="applicationCopy.require_consent"
											class="ma-0 pa-0 mx-2"
											:label="$t('section.applications.attribute.require_consent')"
											dense/>
									<v-checkbox
											on-icon="mdi-checkbox-marked"
											color="primary"
											v-model="applicationCopy.reuse_consent"
											class="ma-0 pa-0 mx-2"
											:label="$t('section.applications.attribute.reuse_consent')"
											dense/>
							</v-row>
							<v-card outlined class="pa-6">
									<v-row align="center" justify="center" class="ma-0 pa-0">
											<v-col cols="4" class="ma-0 pa-0">
													<v-text-field
															v-model="scopeToAdd"
															dense
															@keydown.enter="addScopeValue"
															:rules="[this.fieldRules(scopeToAdd, 'ge_lettersStrict', false)]"
															:label="$tc('section.applications.attribute.addScope')"
													/>
											</v-col>
											<v-col cols="auto" class="ma-0 pa-0">
													<v-btn
															:color="addScopeIsEmpty() ? 'gray' : 'primary'"
															icon
															@click="addScopeValue"
															:disable="addScopeIsEmpty()"
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
						</v-form>
				</v-col>
				</v-row>
		</v-card-text>

		<!-- Actions -->
		<v-card-actions class="card-actions">
				<v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
						<!-- Back and Next buttons -->
						<div>
								<v-slide-x-reverse-transition>
										<v-progress-circular
											:indeterminate="loading == true"
											:value="submitted ? 100 : 0"
											:color="submitted ? (!error ? 'green' : 'red') : 'primary'"
											size="26"
											class="mx-3"
										>
										<v-fab-transition>
												<v-icon color="green" v-if="submitted && !error" >
														mdi-checkbox-marked-circle
												</v-icon>
												<v-icon color="red" v-else-if="submitted == true && error == true">
														mdi-close-circle
												</v-icon>
										</v-fab-transition>
										</v-progress-circular>
								</v-slide-x-reverse-transition>

								<v-slide-x-reverse-transition>
										<v-chip text-color="white" class="mr-2" v-if="submitted == true" :color="error == true ? 'red':'green'">
												{{ errorMsg == "" ? $t('section.application.'+ (updateFlag ? 'update' : 'create' ) +'Success') : errorMsg }}
										</v-chip>
								</v-slide-x-reverse-transition>

								<v-slide-x-reverse-transition>
										<v-btn elevation="0"
										@click="syncApplication"
										:disabled="editFlag"
										:dark="!isThemeDark($vuetify)"
										:light="isThemeDark($vuetify)"
										class="ma-0 pa-0 pa-2 ma-1 pr-4" 
										rounded>
												<v-icon class="ma-0 mr-1" color="primary">
														mdi-cached
												</v-icon>
												{{ $t("actions.reset" )}}
										</v-btn>
								</v-slide-x-reverse-transition>

								<v-slide-x-reverse-transition>
										<v-btn elevation="0" @click="saveApplication(true)"
										@keydown.enter="saveApplication(true)"
										:disabled="editFlag"
										:dark="!isThemeDark($vuetify)"
										:light="isThemeDark($vuetify)"
										class="ma-0 pa-0 pa-2 ma-1 pr-4" 
										rounded>
												<v-icon class="ma-0 mr-1" color="primary">
														mdi-checkbox-marked-circle-outline
												</v-icon>
												{{ $t("actions.done" )}}
										</v-btn>
								</v-slide-x-reverse-transition>
						</div>
				</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import Application from '@/include/Application.js';
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';

export default {
	name: "ApplicationDialog",
	mixins: [ validationMixin, utilsMixin ],
	data() {
		return {
			applicationCopy: {},
			scopeToAdd: "",
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

			const excludeKeys = ["objectRid", "objectSid"]
			const keysToCheck = ["cn","groupScope","groupType"]
			let data = Object.assign({}, this.applicationCopy)
			excludeKeys.forEach(k => {
				delete data[k]
			});

			if (this.$refs.applicationForm.validate()){
				await new Application({}).update({application: data})
				.then(() => {
					if (closeDialog == true)
						this.closeDialog();
					if(newDistinguishedName)
						data["distinguishedName"] = newDistinguishedName
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
			this.refreshGroup();
		},
	},
}
</script>