<template>
	<v-btn
		@click="emitClick" 
		:disabled="disabled"
		:dark="!isThemeDark($vuetify) && !disabled"
		:light="isThemeDark($vuetify) && !disabled"
		class="ma-0 pa-0 pa-2 pl-1 ma-1" 
		rounded>
	<v-icon class="mr-1" color="valid">
	</v-icon>
	<v-progress-circular :indeterminate="loading == true" :value="submitted ? 100 : 0" 
	:color="error ? 'error' : 'valid'"
	size="26" 
	class="ma-0 mr-1">
	<v-fab-transition>
		<span v-if="iconSide == 'left' || iconSide == 'start'">
			<v-icon :color="iconColor" v-if="!submitted" >
				{{ icon }}
			</v-icon>
			<v-icon :color="iconColor" v-else-if="submitted && !error" >
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
		<v-icon :color="iconColor" v-if="!submitted" >
			{{ icon }}
		</v-icon>
		<v-icon :color="iconColor" v-else-if="submitted && !error" >
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
	mixins: [ utilsMixin ],
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
		emitClick(){
			this.$emit("click")
		}
	}
}
</script>