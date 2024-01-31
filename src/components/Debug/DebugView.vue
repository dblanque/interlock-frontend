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
					v-if="!loading && data.ldapOperations.length >= 1"
				/>
			</v-expand-transition>
			<v-progress-circular size="24" :indeterminate="loading" color="primary">
			</v-progress-circular>
		</v-row>
		<v-divider class="mx-6"/>
		<v-row class="ma-0 pa-0 px-2 py-2" align="center">
			<v-col class="ma-0 pa-0 mx-2" cols="auto">
				<v-btn outlined class="ma-0 pa-0 px-2"
					small
					:disabled="disableRun"
					color="primary">
					<v-icon>
						mdi-play
					</v-icon>
					RUN
				</v-btn>
			</v-col>
			<v-col class="ma-0 pa-0 mx-2" cols="auto">
				<v-checkbox class="ma-0 pa-0"
					label="AsRoot"
					hide-details
					dense>
				</v-checkbox>
			</v-col>
			<v-col class="ma-0 pa-0 mx-2" cols="auto">
				<v-checkbox class="ma-0 pa-0"
					label="AsUser"
					hide-details
					dense>
				</v-checkbox>
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
			data:{
				selectedLdapOperation: "",
				ldapOperations: []
			}
		}
	},
	mixins: [ utilsMixin ],
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
		getSelectTitle(){
			return this.$tc("section.debug.ldapOperation", 2)
		},
		resetError(){
			this.error = false
			this.errorMsg = ""
		},
		async getLDAPOperations(){
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
				setTimeout(()=>{ this.loading = false }, 500)
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
		},
		refreshAction() {
			this.getLDAPOperations()
		}
	}
}
</script>