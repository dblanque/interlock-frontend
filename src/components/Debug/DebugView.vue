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
					class="ma-0 pa-0 mx-4"
					hide-details
					dense
					:items="data.ldapOperations"
					v-if="!loading && data.ldapOperations.length >= 1"
				/>
			</v-expand-transition>
			<v-progress-circular size="24" :indeterminate="loading" color="primary">
			</v-progress-circular>
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
      		this.data.ldapOperations = await new Debug({})
			await this.data.ldapOperations.list()
			.then(response => {
				this.data.ldapOperations = response.data
				this.resetError()
                notificationBus.$emit('createNotification', 
                    {
                        message: (this.$tc("section.debug.ldapOperation", this.data.ldapOperations.length) + " " + this.$t("words.loaded.single.n")).toUpperCase(), 
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