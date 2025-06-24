<template>
	<v-btn
		@click="emitClick"
		:disabled="disabled"
		:dark="dark != undefined ? dark : !isThemeDark($vuetify) && !disabled"
		:light="light != undefined ? light : isThemeDark($vuetify) && !disabled"
		class="ma-0 pa-0 pa-2 pl-1 ma-1"
		:rounded="rounded">
		<v-icon class="mr-1" color="valid">
		</v-icon>
		<v-progress-circular :indeterminate="loading" :value="submitted ? 100 : 0"
			:color="iconColor"
			size="26"
			class="ma-0 mr-1">
			<v-fab-transition>
				<span v-if="iconSide == 'left' || iconSide == 'start'">
					<v-icon :color="iconColor" v-if="!submitted">
						{{ icon }}
					</v-icon>
					<v-icon :color="iconColor" v-else-if="submitted && !error">
						{{ iconSuccess }}
					</v-icon>
					<v-icon :color="iconColor" v-else-if="submitted == true && error == true">
						{{ iconError }}
					</v-icon>
				</span>
			</v-fab-transition>
		</v-progress-circular>
		<span class="pr-1">
			{{ label }}
		</span>
		<span v-if="iconSide == 'right' || iconSide == 'end'">
			<v-icon :color="iconColor" v-if="!submitted">
				{{ icon }}
			</v-icon>
			<v-icon :color="iconColor" v-else-if="submitted && !error">
				{{ iconSuccess }}
			</v-icon>
			<v-icon :color="iconColor" v-else-if="submitted == true && error == true">
				{{ iconError }}
			</v-icon>
		</span>
	</v-btn>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
export default {
	mixins: [utilsMixin],
	data() {
		return {
		}
	},
	props: {
		loading: Boolean,
		disabled: Boolean,
		submitted: {
			type: Boolean,
			default: false
		},
		rounded: {
			type: Boolean,
			default: true
		},
		dark: {
			type: Boolean,
			default: undefined
		},
		light: {
			type: Boolean,
			default: undefined
		},
		label: String,
		icon: {
			type: String,
			default: "mdi-dots-horizontal-circle-outline"
		},
		iconSuccess: {
			type: String,
			default: "mdi-check-circle"
		},
		iconError: {
			type: String,
			default: "mdi-close-circle"
		},
		iconColor: {
			type: String,
			default: "primary"
		},
		iconSide: {
			type: String,
			default: "left"
		},
		error: {
			type: Boolean,
			default: false
		}
	},
	created() {
	},
	methods: {
		emitClick() {
			this.$emit("click")
		}
	}
}
</script>