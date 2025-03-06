<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!-------------------- File: UserAntilockoutWarning.vue ----------------------->
<template>
	<v-card>
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="pa-0 ma-0 ma-2">
					{{ $t('section.users.antiLockoutWarning').toUpperCase() }}
				</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
				<v-btn icon color="red" class="ma-2" rounded @click="closeDialog">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>

		<v-card-text class="pa-0 ma-0">
			<v-row class="pa-0 ma-8 mb-0 font-weight-medium text-uppercase" justify="center">
				<v-alert class="ma-0" color="primary">
					{{ $t('section.users.tryingToDisable') }}
					<span class="font-weight-bold" style="padding-left: 0.5ch;">
						{{
							userObject.givenName && userObject.sn ?
								`${userObject.givenName} ${userObject.sn} (${userObject.username})` :
								userObject.username
						}}
					</span>
				</v-alert>
			</v-row>
			<v-row class="pa-0 ma-8 mt-0 font-weight-bold text-uppercase" justify="center">
				<v-alert dense class="ma-0" type="error" color="red" text
					style="border-top-left-radius: 0 !important; border-top-right-radius: 0 !important;">
					{{ $t('section.users.disablingOwnUser') }}
				</v-alert>
			</v-row>
		</v-card-text>
		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
				<v-btn @click="closeDialog"
					class="ma-0 pa-0 pa-2 ma-1 bg-white bg-lig-25"
					rounded>
					<v-icon class="" color="primary">
						mdi-chevron-double-right
					</v-icon>
					<span class="ma-0">
						{{ $t("actions.back") }}
					</span>
					<v-icon class="" color="primary">
						mdi-chevron-double-left
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>

export default {
	name: "UserAntilockoutWarning",
	props: {
		userObject: Object,
		dialogKey: String
	},
	created() {
	},
	methods: {
		async closeDialog() {
			this.$emit('closeDialog', this.dialogKey);
		},
	}
}
</script>

<style>
.outlined {
	border: thin solid var(--border-d-base);
}

.card-title {
	border-radius: 4px;
	background: var(--v-white-d-base);
	position: sticky !important;
	top: 0 !important;
	z-index: 100;
	border-bottom: thin solid var(--border-d-base);
}

[theme=dark] .card-title {
	background: var(--v-gray-85-base);
}

.card-actions {
	border-radius: 4px;
	background: var(--v-white-d-base);
	position: sticky !important;
	bottom: 0 !important;
	z-index: 100;
	border-top: thin solid var(--border-d-base);
}

[theme=dark] .card-actions {
	background: var(--v-gray-85-base);
}
</style>