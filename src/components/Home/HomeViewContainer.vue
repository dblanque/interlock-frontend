<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: HomeViewContainer.vue ------------------------->
<template>
	<div class="ma-0 pa-0">
		<v-card flat color="secondary-80">
			<v-row>
				<v-col cols="12">
					<v-card flat>
					</v-card>
				</v-col>
			</v-row>
		</v-card>
	</div>
</template>

<script>
import HomeInfo from '@/include/HomeInfo.js';
import { notificationBus } from '@/main.js';

export default {
	name: 'HomeViewContainer',
	props: {
		viewTitle: String,
		snackbarTimeout: Number
	},
	data() {
		return {
			data: new HomeInfo({}),
			initLoad: true,
			loading: false,
			error: false,
			errorMsg: "",
			categories: {
				users: [
					"local_user_count",
					"ldap_user_count",
				],
				ldap: [
					"ldap_enabled",
					"ldap_tls",
					"ldap_ssl",
					"ldap_ok",
				],
				oidc: [
					"oidc_well_known"
				],
			}
		}
	},
	mounted() {
		this.fetchHomeInfo()
	},
	methods: {
		startLoading() {
			this.loading = false
			this.error = false
			this.errorMsg = ""
		},
		stopLoading(clearErrors = false) {
			if (this.initLoad === true)
				this.initLoad = false
			this.loading = false
			if (clearErrors === true) {
				this.error = false
				this.errorMsg = ""
			}
		},
		async fetchHomeInfo() {
			this.startLoading()
			await this.data.fetch()
				.then(() => {
					const message = this.initLoad ? this.$t("section.home.welcomeMessage") : `${this.$t("category.home")} ${this.$tc("words.loaded.m", 1)}`
					this.stopLoading()
					notificationBus.$emit("createNotification", {
						message: message,
						type: '',
						icon: '',
						color: 'secondary-20-s',
						text: 'white'
					})
				})
				.catch(error => {
					console.error(error)
				})
		}
	},
}
</script>