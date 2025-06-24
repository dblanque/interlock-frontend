<template>
	<div>
		<v-card flat outlined>
			<v-row justify="space-between" class="ma-0 pa-2" align="center">
				<v-col class="ma-0 pa-0" cols="auto">
					<v-btn small color="primary" :disabled="loading" @click="refreshAction">
						<v-icon> mdi-refresh </v-icon> {{ $t('actions.refresh') }}
					</v-btn>
				</v-col>
				<v-expand-transition>
					<v-select
						filled
						:placeholder="getSelectTitle()"
						clearable
						class="ma-0 pa-0 mx-4"
						hide-details
						dense
						:items="data.ldapOperations"
						v-model="data.selectedLdapOperation"
						v-if="!loading && data.ldapOperations.length >= 1" />
				</v-expand-transition>
				<v-progress-circular size="24" :indeterminate="loading" color="primary">
				</v-progress-circular>
			</v-row>
			<v-divider class="mx-6" />
			<v-row class="ma-0 pa-0 px-2 py-2" align="center">
				<v-col class="ma-0 pa-0 mx-2" cols="auto">
					<v-btn outlined class="ma-0 pa-0 px-2"
						small
						@click="runLDAPOperation()"
						:disabled="disableRun"
						color="primary">
						<v-icon>
							mdi-play
						</v-icon>
						{{ $t("actions.runExecute") }}
					</v-btn>
				</v-col>
				<v-col class="ma-0 pa-0 mx-2" cols="auto">
					<v-switch class="ma-0 pa-0"
						:label="data.useAdmin ? $t('section.debug.asAdmin') : $t('section.debug.asUser')"
						v-model="data.useAdmin"
						hide-details
						dense>
					</v-switch>
				</v-col>
			</v-row>
		</v-card>
	</div>
</template>

<script>
import Debug from '@/include/Debug.js';
import utilsMixin from '@/plugins/mixin/utilsMixin.js';
import { notificationBus } from '@/main.js';
export default {
	data() {
		return {
			loading: false,
			error: false,
			errorMsg: "",
			data: {
				useAdmin: true,
				selectedLdapOperation: "",
				ldapOperations: []
			}
		}
	},
	mixins: [utilsMixin],
	computed: {
		disableRun() {
			if ((!this.data.selectedLdapOperation || this.data.selectedLdapOperation.length < 1)
				&& this.data.ldapOperations.length < 1)
				return true
			if (!this.data.ldapOperations.includes(this.data.selectedLdapOperation)) return true
			return false
		},
	},
	mounted() {
		this.refreshAction()
	},
	methods: {
		getSelectTitle() {
			return this.$tc("section.debug.ldapOperation", 2)
		},
		resetError() {
			this.error = false
			this.errorMsg = ""
		},
		async runLDAPOperation() {
			let opExec = await new Debug({})
			await opExec.action({
				operation: this.data.selectedLdapOperation,
				use_admin: this.data.useAdmin,
				extra_args: {}
			})
				.then(response => {
					console.log(response)
				})
				.catch(e => {
					console.error(e)
				})
		},
		async getLDAPOperations() {
			this.loading = true
			let operationList = await new Debug({})
			await operationList.list()
				.then(response => {
					this.data.ldapOperations = response.data
					this.resetError()
					notificationBus.$emit('createNotification',
						{
							message: (this.$tc("section.debug.ldapOperation", this.data.ldapOperations.length) + " " + this.$tc("words.loaded.f", this.data.ldapOperations.length)).toUpperCase(),
							type: 'success'
						}
					);
					setTimeout(() => { this.loading = false }, 500)
				})
				.catch(e => {
					console.error(e)
					this.loading = false
					this.error = true
					this.errorMsg = this.getMessageForCode(e)
					notificationBus.$emit('createNotification',
						{
							message: this.errorMsg,
							type: 'error'
						}
					);
				})
			this.$emit('done')
		},
		refreshAction() {
			this.getLDAPOperations()
		}
	}
}
</script>