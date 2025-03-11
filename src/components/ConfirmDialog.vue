<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!--------------------- File: ConfirmDeleteDialog.vue ------------------------->
<template>
	<v-card>
		<v-card-title class="ma-0 pa-0 card-title">
			<v-row class="ma-0 pa-0 ma-1" align="center" justify="space-between">
				<h3 class="pa-0 ma-0 ma-2">
				{{ title }}
				</h3>
				<v-divider v-if="$vuetify.breakpoint.mdAndUp" class="mx-4"/>
				<v-btn icon color="red" class="ma-2" rounded @click="emit_no()">
					<v-icon>
						mdi-close
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-title>

		<v-card-text class="pa-0 ma-0">
			<v-row class="pa-0 ma-8 text-subtitle-1" justify="center">
				{{ message }}
				<span class="font-weight-medium" style="padding-left: 0.5ch;" v-if="subMessage.length > 0">
					{{ subMessage }}
				</span>
			</v-row>
		</v-card-text>
		<!-- Actions -->
		<v-card-actions class="card-actions">
			<v-row class="ma-1 pa-0" align="center" align-content="center" justify="center">
				<v-btn @keydown.enter="emit_yes()" 
				@click="emit_yes()"
				class="ma-0 pa-0 pa-2 ma-1"
				:dark="!isThemeDark($vuetify)"
				:light="isThemeDark($vuetify)"
				rounded>
					<v-icon class="mr-1" color="green">
						mdi-checkbox-marked-circle-outline
					</v-icon>
					<span class="pr-1">
						{{ $t("actions.yes" )}}
					</span>
				</v-btn>
				<v-btn @click="emit_no()"
				class="ma-0 pa-0 pa-2 ma-1"
				:dark="!isThemeDark($vuetify)"
				:light="isThemeDark($vuetify)"
				rounded>
					<span class="pl-1">
						{{ $t("actions.no" )}}
					</span>
					<v-icon class="ml-1" color="red">
						mdi-close-circle-outline
					</v-icon>
				</v-btn>
			</v-row>
		</v-card-actions>
	</v-card>
</template>

<script>
import utilsMixin from '@/plugins/mixin/utilsMixin.js'

export default {
	name: "ConfirmDialog",
	mixins: [ utilsMixin ],
	props: {
		title: String,
		message: String,
		subMessage: {
			type: String,
			default: ""
		},
		dialogKey: {
			type: String,
			required: true
		},
		value: Boolean,
	},
	watch: {
		value: {
			handler: function (v) {
				if (v === true)
					this.$emit("open")
				else
					this.$emit("close")
			}
		},
	},
	methods: {
		emit_yes() {
			this.$emit('yes', this.dialogKey);
		},
		emit_no() {
			this.$emit('no', this.dialogKey);
		},
	}
}
</script>
