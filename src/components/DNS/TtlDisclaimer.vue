<template>
	<v-card class="pa-0 ma-0">
		<!-- Title Bar -->
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="ma-2">{{ $t("section.dns.ttlDisclaimer.title") }}</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4" />
				<v-btn icon color="red" class="ma-2" rounded @click="closeDialog()">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>
		<v-card-text class="py-6">
			<v-row no-gutters>
				<v-col class="ma-0 pa-0 px-2 my-2" cols="12">
					<p class="ma-0 pa-0 font-weight-bold">
						{{ $t("section.dns.ttlDisclaimer.messageTtl") }}.
					</p>
				</v-col>
				<v-col cols="12">
					<v-divider></v-divider>
				</v-col>
				<v-col class="ma-0 pa-0 px-2 my-4" cols="12">
					<p class="ma-0 pa-0 font-weight-bold">
						{{ $t("section.dns.ttlDisclaimer.messageLegacyDns") }}.
					</p>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script>
const disclaimer_stor_key = "misc.dns.disclaimer_closed";

export default {
	methods: {
		closeDialog(){
			localStorage.setItem(disclaimer_stor_key, true)
			this.$emit("closeDialog", "ttlDisclaimer")
		}
	},
}
</script>