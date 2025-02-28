<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: ApplicationCreate.vue --------------------------->
<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">{{$t("section.applications.dialog.create.header")}}</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
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
					{{ $vuetify.breakpoint.mdAndUp ? $t('section.applications.dialog.create.step1') : '' }}
				</v-stepper-step>
				<v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
				<v-stepper-step :complete="createStage > 2" step="2">
					{{ $vuetify.breakpoint.mdAndUp ? $t('section.applications.dialog.create.step2') : '' }}
				</v-stepper-step>
				<v-divider class="mx-3" :style="createStage > 1 ? 'border-color: var(--v-primary-base) !important' : ''"></v-divider>
				<v-stepper-step :complete="!loading && success" step="3">
					{{ $vuetify.breakpoint.mdAndUp ? $t('section.applications.dialog.create.step3') : '' }}
				</v-stepper-step>
			</v-stepper-header>

			<!-- Steps Content -->
			<v-stepper-items>
				<!-- Basics -->
				<v-stepper-content step="1" class="ma-0 pa-0 pa-4">
					<v-form ref="appCreateForm" @submit.prevent>
						<v-row justify="center" align="center" class="ma-0 pa-0">
							<v-col cols="12" lg="6">
								<v-text-field
									v-model="appToCreate.name"
									dense
									@keydown.enter="nextStep"
									:rules="[this.fieldRules(appToCreate.name, 'ge_lettersStrict', true)]"
									:label="$tc('section.applications.attribute.name')"
								/>
							</v-col>
							<v-col cols="12" lg="6">
								<v-text-field
									v-model="appToCreate.redirect_uris"
									dense
									@keydown.enter="nextStep"
									:rules="[this.fieldRules(appToCreate.redirect_uris, 'ge_endpoint', true)]"
									:label="$tc('section.applications.attribute.redirect_uris')"
									:hint="$t('section.applications.dialog.create.redirectUriPlaceholder')"
								/>
							</v-col>
						</v-row>
						<v-row justify="center" align="center" no-gutters>
							<v-checkbox
								on-icon="mdi-checkbox-marked"
								color="primary"
								v-model="appToCreate.require_consent"
								class="ma-0 pa-0 mx-2"
								:label="$t('section.applications.attribute.require_consent')"
								dense/>
							<v-checkbox
								on-icon="mdi-checkbox-marked"
								color="primary"
								v-model="appToCreate.reuse_consent"
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
										color="primary"
										icon
										@click="addScopeValue"
										:disabled="addScopeIsEmpty()"
									>
										<v-icon>mdi-plus</v-icon>
									</v-btn>
								</v-col>
							</v-row>
							<v-row>
								<v-col cols="12" class="ma-0 pa-0">
								<v-list dense outlined>
									<v-list-item dense v-for="scope in appToCreate.scopes" :key="scope">
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
				</v-stepper-content>
				
				<!-- Check if user exists - loader -->
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
											<v-icon v-if="error == true" size="82" color="red">mdi-close-circle</v-icon>
											<v-icon v-else size="82" color="green">mdi-check-circle</v-icon>
										</div>
									</v-fab-transition>
								</v-progress-circular>
							</v-fab-transition>
						</v-col>
						
						<v-col cols="12">
							<v-slide-y-transition>
								<v-col v-if="!this.loading && this.loading == false">
									<h3>
										{{ this.error ? this.errorMsg : $t('section.applications.dialog.create.success') }}
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

		<v-snackbar text color="red" timeout="1500" v-if="$vuetify.breakpoint.smAndDown" v-model="showSnackbar" centered>
		<v-row justify="center">
			{{ this.errorMsg }}
		</v-row>
		</v-snackbar>

		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" :justify="this.$vuetify.breakpoint.smAndDown ? 'space-around' : 'end'">
				<!-- Back and Next buttons -->
				<div>
					<v-slide-x-reverse-transition>
						<v-chip class="mx-2" color="red" v-if="this.error && $vuetify.breakpoint.mdAndUp" text-color="white">
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
							{{ $t("actions.reset" )}}
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
						{{ $t("actions.back_short" )}}
					</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="nextStep" v-if="this.createStage < 2"
						@keydown.enter="nextStep"
						:dark="!isThemeDark($vuetify)"
						:light="isThemeDark($vuetify)"
						class="ma-0 pa-0 pa-2 ma-1 pl-4" 
						rounded>
							{{ $t("actions.create" )}}
							<v-icon class="ma-0" color="primary">
								mdi-chevron-double-right
							</v-icon>
						</v-btn>
					</v-slide-x-reverse-transition>
					<v-slide-x-reverse-transition>
						<v-btn elevation="0" @click="closeDialog(true)" v-if="this.createStage >= 2 && this.error === false"
						@keydown.enter="closeDialog(true)"
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
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import Application from '@/include/Application.js';

export default {
	name: 'ApplicationCreate',
	components: {
	},
	data () {
		return {
		createStage: 1,
		appToCreate: {},
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
		viewKey: String
	},
	created(){
		this.newApplication
	},
	computed:{
	},
	methods: {
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
		newApplication(){
			this.appToCreate = new Application({})
			this.$refs.appCreateForm.resetValidation()
			this.appToCreate.name = "Proxmox VE"
			this.appToCreate.redirect_uris = "https://proxmox.brconsulting.info:8006/oidc/callback"
			this.appToCreate.scopes = ["openid","profile","email","groups"]
			this.createStage = 1;
			this.success = false
			this.errorMsg = ""
			this.error = false
		},
		prevStep(){
			switch (this.createStage) {
				default:
					this.createStage -= 1
					break;
			}
			this.error = false
			this.errorMsg = ""
		},
		nextStep(){
			switch (this.createStage) {
				case 1:
					if (this.$refs.appCreateForm.validate()){
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
		closeDialog(refresh=false){
			this.$emit('closeDialog', this.viewKey, refresh);
		},
		async createApplication(){
			this.loading = true
			this.error = false
			this.errorMsg = ""
			this.createStage += 1
			await this.appToCreate.insert(this.appToCreate)
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
