<template>
	<!-- Consent Mode -->
	<!-- Prompt Mode -->
	<!-- @change OK without TOTP -->
	<!-- @change OK with TOTP -->
	<!-- @change cancel -->
	 <v-row>
		<v-col cols="12" class="ma-0 pa-0 mt-2">
			<p class="font-weight-medium mb-0">
				{{ $tc("classes.application", 1) }}
			</p>
		</v-col>
		<v-col cols="12" class="ma-0 pa-0 my-4">
			<h1>
				{{ applicationName }}
			</h1>
		</v-col>
		<v-col cols="12" class="ma-0 pa-0">
			<p class="ma-0 pa-0">{{ $t("section.login.oidcRequestedByApp") }}</p>
		</v-col>
	 </v-row>
</template>

<script>
export default {
	data() {
		return {
		}
	},
	props: {
		applicationName: String
	}
}
</script>