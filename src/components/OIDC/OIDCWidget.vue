<template>
	<v-row>
		<v-col cols="12" class="ma-0 pa-0 mt-2 mb-4">
			<h1>
				{{ applicationName }}
			</h1>
		</v-col>
		<v-col cols="12" class="ma-0 pa-0 mb-6">
			<p class="ma-0 pa-0">{{ $t("section.login.oidcRequestedByApp") }}</p>
		</v-col>

		<!-- CONSENT BUTTONS -->
		<v-row justify="center" class="pa-2 ma-0">
			<v-col class="ma-0 pa-0">
				<v-btn
					:loading="disableActions && acceptedConsent === true"
					:disabled="disableActions"
					@click="emitAccept"
					class="primary white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3">
					{{ $t("actions.accept") }}
				</v-btn>
			</v-col>
			<v-col class="ma-0 pa-0">
				<v-btn
					:loading="disableActions && acceptedConsent === false"
					:disabled="disableActions"
					@click="emitDecline"
					color="error-65"
					class="white--text elevation-0 pa-0 ma-0 px-3 py-2 ma-3">
					{{ $t("actions.decline") }}
				</v-btn>
			</v-col>
		</v-row>
	</v-row>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	props: {
		applicationName: String,
		disableActions: Boolean,
		acceptedConsent: Boolean,
	},
	methods: {
		emitAccept() {
			this.$emit("accept")
		},
		emitDecline() {
			this.$emit("decline")
		}
	}
}
</script>