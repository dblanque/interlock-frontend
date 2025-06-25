<template>
	<v-list dense color="transparent" class="ma-0 pa-0">
		<v-list-item-group>
			<v-list-item two-line
				v-for="value, key in oidcValues"
				:key="key">
				<v-list-item-content>
					<v-list-item-title>
						{{ $t(`section.home.oidc.${key}`) }}
					</v-list-item-title>
					<v-list-item-subtitle>
						{{ value }}
					</v-list-item-subtitle>
				</v-list-item-content>

				<v-list-item-action>
					<v-tooltip bottom>
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								v-bind="attrs" v-on="on"
								class="ml-2"
								@click="copyValueToClipboard(value)"
								icon
								small>
								<v-icon small>
									mdi-content-copy
								</v-icon>
							</v-btn>
						</template>
						<span>{{ $t("actions.copy") }}</span>
					</v-tooltip>
				</v-list-item-action>
			</v-list-item>
		</v-list-item-group>
	</v-list>
</template>

<script>
import { notificationBus } from '@/main.js';
export default {
	props: {
		oidcValues: {
			type: Object,
			required: true,
		},
	},
	methods: {
		copyValueToClipboard(value) {
			navigator.clipboard.writeText(value)
			notificationBus.$emit("createNotification", {
				message: this.$t("actions.copiedToClipboard"),
				type: 'info',
				timeout: 1e3
			})
		},
	},
}
</script>