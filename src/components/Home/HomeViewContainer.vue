<!----------------- INTERLOCK IS LICENSED UNDER GNU AGPLv3 -------------------->
<!---- ORIGINAL PROJECT CREATED BY DYLAN BLANQUÉ AND BR CONSULTING S.R.L. ----->
<!----------------------- File: HomeViewContainer.vue ------------------------->
<template>
	<div class="ma-0 pa-0">
		<v-card flat color="transparent">
			<v-row justify="center" class="py-3 px-6">
				<v-col cols="12">
					<v-card outlined color="gray-95">
						<v-progress-linear :color="getLoadingColor()" :indeterminate="loading">
						</v-progress-linear>
						<v-card-title class="mt-2">
							<v-row align="center" justify="center" no-gutters>
								<v-col class="ma-0 pa-0" cols="2">
								</v-col>
								<v-col class="ma-0 pa-0" cols="8">
									{{ $t("section.home.oidc.title") }}
								</v-col>
								<v-col class="ma-0 pa-0" cols="2">
									<v-row justify="end" no-gutters>
										<v-btn icon @click="showFullOidcData = !showFullOidcData">
											<v-icon>
												mdi-information
											</v-icon>
										</v-btn>
									</v-row>
								</v-col>
							</v-row>
						</v-card-title>
						<v-card-text>
							<v-expand-transition>
								<OidcInfoList
									v-if="loading !== true"
									:oidc-values="getOidcInfo(true)">
								</OidcInfoList>
							</v-expand-transition>
							<v-expand-transition>
								<OidcInfoList
									v-if="loading !== true && showFullOidcData == true"
									:oidc-values="getOidcInfo(false)">
								</OidcInfoList>
							</v-expand-transition>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					md="6">
					<v-card
						height="100%"
						outlined
						color="gray-95">
						<v-progress-linear
							:color="getLoadingColor()"
							:indeterminate="loading">
						</v-progress-linear>
						<v-card-title class="mt-2">
							<v-row justify="center">
								{{ $t("section.home.local.title") }}
							</v-row>
						</v-card-title>
						<v-card-text>
							<v-expand-transition>
								<v-list
									disabled
									dense
									color="transparent"
									v-if="loading !== true">
									<v-list-item-group>
										<v-list-item
											two-line
											v-for="key in userCountKeys"
											:key="key">
											<v-list-item-content>
												<v-list-item-title>
													{{ $t(`section.home.local.${key}`) }}
												</v-list-item-title>
												<v-list-item-subtitle>
													{{ data[key] }}
												</v-list-item-subtitle>
											</v-list-item-content>
										</v-list-item>
									</v-list-item-group>
								</v-list>
							</v-expand-transition>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col
					cols="12"
					md="6">
					<v-card
						height="100%"
						class="d-flex flex-column"
						outlined
						color="gray-95">
						<v-progress-linear
							:color="getLoadingColor()"
							:indeterminate="loading">
						</v-progress-linear>
						<v-card-title class="mt-2">
							<v-row justify="center">
								{{ $t("section.home.ldap.title") }}
							</v-row>
						</v-card-title>
						<v-card-text>
							<v-expand-transition>
								<v-list
									disabled
									dense
									color="transparent"
									v-if="loading !== true">
									<v-list-item-group>
										<v-list-item
											:two-line="isTwoLine(key)"
											v-for="key in ldapKeys"
											:key="key">
											<v-list-item-content>
												<v-list-item-title>
													{{ $t(`section.home.ldap.${key}`) }}
												</v-list-item-title>
												<v-list-item-subtitle v-if="isTwoLine(key)">
													{{ data[key] }}
												</v-list-item-subtitle>
											</v-list-item-content>
											<v-list-item-action>
												<div v-if="typeof data[key] === 'boolean'">
													<v-icon v-if="showBoolInactive(key)">
														mdi-checkbox-blank-circle-outline
													</v-icon>
													<v-icon
														v-else-if="data[key] === true"
														color="green">
														mdi-checkbox-marked-circle
													</v-icon>
													<v-icon
														v-else
														color="red">
														mdi-close-circle
													</v-icon>
												</div>
												<div v-else-if="!isTwoLine(key)">
													{{ data[key] }}
												</div>
											</v-list-item-action>
										</v-list-item>
									</v-list-item-group>
								</v-list>
							</v-expand-transition>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-card>
	</div>
</template>

<script>
import HomeInfo from '@/include/HomeInfo.js';
import OidcInfoList from '@/components/Home/OidcInfoList.vue';
import { notificationBus } from '@/main.js';

export default {
	name: 'HomeViewContainer',
	components: {
		OidcInfoList
	},
	props: {
		initLoad: Boolean,
		viewTitle: String,
		snackbarTimeout: Number,
	},
	data() {
		return {
			data: new HomeInfo({}),
			loading: false,
			error: false,
			errorMsg: "",
			showFullOidcData: false,
			displayedOidcData: [
				"issuer",
				"authorization_endpoint"
			],
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
			},
			userCountKeys: [
				"local_user_count",
				"ldap_user_count",
			],
			ldapKeys: [
				"ldap_enabled",
				"ldap_tls",
				"ldap_ssl",
				"ldap_ok",
				"ldap_active_server",
			],
		}
	},
	mounted() {
		this.fetchHomeInfo()
	},
	methods: {
		getOidcInfo(normallyDisplayed=true){
			if (!this.data?.oidc_well_known || this.data.oidc_well_known === undefined)
				return {}

			let result = {}
			for (const key in this.data.oidc_well_known) {
				const element = this.data.oidc_well_known[key];
				if (normallyDisplayed === true) {
					if (this.displayedOidcData.includes(key))
						result[key] = element
				}
				else if (!normallyDisplayed && !this.displayedOidcData.includes(key))
						result[key] = element
			}
			return result
		},
		getLoadingColor() {
			if (this.error)
				return "error"
			if (this.loading)
				return "primary"
			return "primary-80"
		},
		isTwoLine(key) {
			if (!(key in this.data))
				return false
			if (this.data[key] === null || this.data[key] === undefined)
				return false
			return key in this.data && this.data[key].length > 16
		},
		showBoolInactive(key) {
			if (["ldap_tls", "ldap_ssl", "ldap_ok"].includes(key) &&
				this.data.ldap_enabled !== true) {
				return true
			}
			return false
		},
		startLoading() {
			this.loading = true
			this.error = false
			this.errorMsg = ""
		},
		stopLoading(clearErrors = false) {
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
			this.$emit("done")
		}
	},
}
</script>