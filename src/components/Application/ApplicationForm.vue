<template>
	<v-row class="ma-0 pa-0">
		<v-col class="ma-0 pa-0">
			<!-- Application Form -->
			<v-form ref="ApplicationFormVForm" @submit.prevent>
				<!-- Application Name -->
				<v-row justify="center" align="center" class="ma-0 pa-0 px-8">
					<v-col cols="12" lg="6">
						<v-text-field
							v-model="localData.name"
							:readonly="!isBeingEdited && !isBeingCreated"
							dense
							@keydown.enter="nextStep"
							:rules="[this.fieldRules(localData.name, 'ge_app_name', true)]"
							:label="$tc('section.applications.attribute.name')" />
					</v-col>
					<!-- Redirect URIs -->
					<v-col cols="12" lg="6">
						<v-text-field
							v-model="localData.redirect_uris"
							:readonly="!isBeingEdited && !isBeingCreated"
							dense
							@keydown.enter="nextStep"
							:rules="[this.fieldRules(localData.redirect_uris, 'ge_endpoint', true)]"
							:label="$tc('section.applications.attribute.redirect_uris')"
							:hint="$t('section.applications.dialog.create.redirectUriPlaceholder')" />
					</v-col>
					<!-- Client ID -->
					<v-col cols="8" v-if="isBeingCreated !== true">
						<v-row no-gutters>
							<v-text-field
								v-model="localData.client_id"
								:readonly="!isBeingEdited && !isBeingCreated"
								dense
								@keydown.enter="nextStep"
								readonly
								:label="$tc('section.applications.attribute.client_id')" />
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn small icon
										@click="copyText(localData.client_id)"
										@click.stop
										class="ml-2"
										color="primary"
										v-bind="attrs"
										v-on="on">
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
					<v-col
						cols="8"
						v-if="isBeingCreated !== true">
						<v-row no-gutters>
							<v-text-field
								v-model="localData.client_secret"
								:type="hideSecret ? 'password' : 'text'"
								:append-icon="hideSecret ? 'mdi-eye' : 'mdi-eye-off'"
								prepend-inner-icon="mdi-lock"
								@click:append="() => (hideSecret = !hideSecret)"
								readonly
								dense
								@keydown.enter="nextStep"
								:label="$tc('section.applications.attribute.client_secret')" />
							<v-tooltip bottom>
								<template v-slot:activator="{ on, attrs }">
									<v-btn small icon
										@click="copyText(localData.client_secret)"
										@click.stop
										class="ml-2"
										color="primary"
										v-bind="attrs"
										v-on="on">
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
				<v-row
					justify="center"
					align="center"
					no-gutters>
					<v-checkbox
						on-icon="mdi-checkbox-marked"
						color="primary"
						v-model="localData.enabled"
						:disabled="!isBeingEdited && !isBeingCreated"
						class="ma-0 pa-0 mx-2"
						:label="$t('words.enabled')"
						dense />
				</v-row>
				<!-- Consent Options -->
				<v-row
					justify="center"
					align="center"
					no-gutters>
					<v-checkbox
						on-icon="mdi-checkbox-marked"
						color="primary"
						v-model="localData.require_consent"
						:disabled="!isBeingEdited && !isBeingCreated"
						class="ma-0 pa-0 mx-2"
						:label="$t('section.applications.attribute.require_consent')"
						dense />
					<v-checkbox
						on-icon="mdi-checkbox-marked"
						color="primary"
						v-model="localData.reuse_consent"
						:disabled="!isBeingEdited && !isBeingCreated"
						class="ma-0 pa-0 mx-2"
						:label="$t('section.applications.attribute.reuse_consent')"
						dense />
				</v-row>

				<!-- Scope + Response Type Options -->
				<v-row
					justify="center"
					align="stretch"
					class="ma-0 pa-0 px-12">
					<!-- Scope Options -->
					<v-col
						cols="12"
						md="5"
						class="ma-0 pa-0 ma-2">
						<v-card
							outlined
							class="pa-4"
							width="100%"
							height="100%">
							<v-card-title>
								<v-row
									no-gutters
									justify="center"
									align="center">
									Scopes
								</v-row>
							</v-card-title>
							<v-card-text>
								<v-row no-gutters>
									<v-col
										cols="12"
										class="ma-0 pa-0">
										<v-list
											flat
											dense
											outlined>
											<v-list-item-group>
												<v-list-item>
													<v-list-item-content>
														<v-text-field
															v-model="scopeToAdd"
															dense
															:disabled="!isBeingEdited && !isBeingCreated"
															@keydown.enter="addScopeValue"
															:rules="[this.fieldRules(scopeToAdd, 'ge_lettersStrict', false)]"
															:label="$tc('section.applications.attribute.addScope')" />
													</v-list-item-content>
													<v-list-item-action>
														<v-btn
															color="primary"
															icon
															class="mb-2"
															@click="addScopeValue"
															:disabled="addScopeIsEmpty() || (!isBeingEdited && !isBeingCreated)">
															<v-icon>mdi-plus</v-icon>
														</v-btn>
													</v-list-item-action>
												</v-list-item>
												<v-list-item
													dense
													v-for="scope in localData.scopes"
													:key="scope">
													<v-list-item-content>
														<v-list-item-title>{{ scope }}</v-list-item-title>
													</v-list-item-content>
													<v-list-item-action>
														<v-btn
															small
															icon
															@click="removeScopeValue(scope)"
															:disabled="!isBeingEdited && !isBeingCreated"
															color="error">
															<v-icon>mdi-minus</v-icon>
														</v-btn>
													</v-list-item-action>
												</v-list-item>
											</v-list-item-group>
										</v-list>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>
					<!-- Response Types -->
					<v-col
						cols="12"
						md="5"
						class="ma-0 pa-0 ma-2">
						<v-card
							outlined
							class="pa-4"
							width="100%"
							height="100%">
							<v-card-title>
								<v-row
									no-gutters
									justify="center"
									align="center">
									<v-icon
										color="primary"
										class="mr-2">mdi-key-chain-variant</v-icon>
									Response Types
								</v-row>
							</v-card-title>
							<v-card-text>
								<v-row no-gutters>
									<v-col
										cols="12"
										class="ma-0 pa-0">
										<v-list
											flat
											dense
											outlined>
											<v-list-item-group>
												<v-list-item
													:disabled="!isBeingEdited && !isBeingCreated"
													@click="toggleResponseType(key)"
													dense
													v-for="value, key in localData.response_types"
													:key="key">
													<v-list-item-content>
														<v-list-item-title>{{ key }}</v-list-item-title>
													</v-list-item-content>
													<v-list-item-action>
														<v-checkbox
															on-icon="mdi-checkbox-marked"
															color="primary"
															:disabled="!isBeingEdited && !isBeingCreated"
															dense
															readonly
															:input-value="value" />
													</v-list-item-action>
												</v-list-item>
											</v-list-item-group>
										</v-list>
									</v-col>
								</v-row>
							</v-card-text>
						</v-card>
					</v-col>
				</v-row>
			</v-form>
		</v-col>
	</v-row>
</template>

<script>
import validationMixin from '@/plugins/mixin/validationMixin.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';

export default {
	name: "ApplicationForm",
	mixins: [utilsMixin, validationMixin],
	data() {
		return {
			hideSecret: true,
			localData: {},
			scopeToAdd: "",
			loading: false,
			loadingColor: "primary",
			error: false,
			errorMsg: "",
			submitted: false
		}
	},
	props: {
		applicationObject: Object,
		isBeingCreated: {
			type: Boolean,
			default: false
		},
		isBeingEdited: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		localData: {
			deep: true,
			handler: function (v) {
				this.update()
			},
		}
	},
	methods: {
		validate() {
			return this.$refs.ApplicationFormVForm.validate();
		},
		resetValidation() {
			return this.$refs.ApplicationFormVForm.resetValidation();
		},
		toggleResponseType(key) {
			this.localData.response_types[key] = !this.localData.response_types[key]
			this.update()
			this.$forceUpdate()
		},
		copyText(textString) {
			navigator.clipboard.writeText(textString);
		},
		sync() {
			this.localData = Object.assign({}, this.applicationObject)
		},
		update() {
			this.$emit("update", this.localData)
		},
		nextStep() {
			this.$emit("nextStep")
		},
		addScopeIsEmpty() {
			return (
				this.scopeToAdd.length === 0 ||
				this.scopeToAdd === undefined ||
				this.scopeToAdd === null
			)
		},
		addScopeValue() {
			if (this.addScopeIsEmpty())
				return
			if (!this.localData.scopes.includes(this.scopeToAdd))
				this.localData.scopes.push(this.scopeToAdd)
			this.scopeToAdd = ""
			this.update()
		},
		removeScopeValue(v) {
			const index = this.localData.scopes.indexOf(v);
			if (index >= 0) {
				this.localData.scopes.splice(index, 1)
			}
			this.update()
		},
	},
}
</script>